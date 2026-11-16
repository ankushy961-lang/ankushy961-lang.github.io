/* Time-zone globe for the #world section. Needs window.THREE (three.js r128, loaded by app.js).
   A realistic Earth drawn entirely in the browser: no image files, no network.
   - Land, sea, vegetation, deserts, ice and clouds come from three prebuilt images (see studio/tools/build_earth.mjs).
     They are a believable rendering, not satellite data: desert and ice bands follow latitude, clouds are noise.
   - Three things on it are exact: India's position, the meridian of the visitor's time zone
     (from the device clock: 4 minutes = 1 degree), and the day/night line from the real sun position. */
(async function () {
  'use strict';
  const version = ((document.currentScript || {}).src || '').includes('?') ? '?' + document.currentScript.src.split('?')[1] : '';
  const THREE = window.THREE, cv = document.getElementById('globe'), sec = document.getElementById('world');
  if (!THREE || !cv || !sec) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch (e) { return; }
  // setting the planet up costs a moment once; the page is told so it does not mistake that for a slow device
  const grace = () => document.dispatchEvent(new Event('perf:grace'));
  grace();

  /* The surface, the clouds and the land mask are three small images built ahead of time by
     studio/tools/build_earth.mjs (coastline rings, latitude bands and noise). The browser only loads them and does the
     lighting each frame, so nothing heavy runs on the visitor's device. If an image fails to load there is no globe;
     the time panel beside it still shows. */
  const picture = (name) => new Promise((resolve) => {
    const im = new Image();
    im.onload = () => { const tx = new THREE.Texture(im); tx.wrapS = THREE.RepeatWrapping; tx.minFilter = THREE.LinearFilter; tx.magFilter = THREE.LinearFilter; tx.generateMipmaps = false; tx.needsUpdate = true; resolve(tx); };
    im.onerror = () => resolve(null);
    im.src = name + version;
  });
  const [albedo, clouds, landMap, nightMap] = await Promise.all([picture('earth-surface.webp'), picture('earth-clouds.webp'), picture('earth-land.webp'), picture('earth-night.webp')]);
  if (!albedo || !clouds || !landMap) return;

  /* ---------- scene ---------- */
  const D = Math.PI / 180;
  const at = (lon, lat, r) => { const c = Math.cos(lat * D); return new THREE.Vector3(r * c * Math.sin(lon * D), r * Math.sin(lat * D), r * c * Math.cos(lon * D)); };
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, .1, 20); cam.position.set(0, 0, 4.1);
  const tilt = new THREE.Group(), spin = new THREE.Group(); tilt.add(spin); scene.add(tilt); tilt.rotation.x = .3;
  const uSun = { value: new THREE.Vector3(0, 0, 1) }, uT = { value: 0 };
  grace();

  // the planet: one sphere; per pixel it reads the two images and lights them
  spin.add(new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.ShaderMaterial({
    uniforms: { uAlbedo: { value: albedo }, uCloud: { value: clouds }, uLand: { value: landMap }, uNight: { value: nightMap }, uSun, uT },
    vertexShader: `uniform vec3 uSun; varying vec3 vP; varying vec3 vN; varying vec3 vV; varying vec3 vL;
      void main(){ vP = normalize(position); vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vL = normalize(normalMatrix * uSun); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform sampler2D uAlbedo; uniform sampler2D uCloud; uniform sampler2D uLand; uniform sampler2D uNight; uniform vec3 uSun; uniform float uT; varying vec3 vP; varying vec3 vN; varying vec3 vV; varying vec3 vL;
      vec2 ll(vec3 p){ return vec2(atan(p.x, p.z) / 6.2831853 + 0.5, asin(clamp(p.y, -1.0, 1.0)) / 3.1415927 + 0.5); }
      void main(){
        vec3 P = normalize(vP), N = normalize(vN), V = normalize(vV), L = normalize(vL);
        vec2 uv = ll(P); vec3 surf = texture2D(uAlbedo, uv).rgb; float land = texture2D(uLand, uv).r;
        // clouds drift slowly eastward; their shadow falls on the side away from the sun
        float drift = uT * 0.0016;
        vec2 cu = ll(P), su = ll(normalize(P + uSun * 0.035));
        float cloud = texture2D(uCloud, vec2(cu.x - drift, cu.y)).r, shade = texture2D(uCloud, vec2(su.x - drift, su.y)).r;
        // break the soft cloud masses into fields and wisps with two finer samples of the same image
        float wisp = texture2D(uCloud, vec2(cu.x * 4.0 - drift * 2.0, cu.y * 4.0 + 0.23)).r, fine = texture2D(uCloud, vec2(cu.x * 9.0 + 0.37, cu.y * 9.0 + 0.11)).r;
        cloud = smoothstep(0.03, 0.42, cloud * (0.25 + 1.15 * wisp) * (0.50 + 0.95 * fine)); shade *= 0.55;
        // sunlight: a soft terminator with a warm twilight band
        float ndl = dot(N, L), day = smoothstep(-0.12, 0.28, ndl);
        surf *= 1.0 - 0.32 * shade * day;
        vec3 night = surf * vec3(0.20, 0.24, 0.34) + vec3(0.010, 0.020, 0.050);   // dim, blue-shifted, still readable
        night += vec3(1.0, 0.76, 0.42) * texture2D(uNight, uv).r * 1.7 * (1.0 - 0.8 * cloud);   // city lights, hidden under cloud
        vec3 col = mix(night, surf * (0.90 + 0.30 * max(ndl, 0.0)), day);
        float glint = pow(max(dot(N, normalize(L + V)), 0.0), 150.0) * (1.0 - land) * (1.0 - cloud) * day;
        col += vec3(1.0, 0.95, 0.85) * glint * 0.8;
        col = mix(col, mix(vec3(0.15, 0.18, 0.27), vec3(1.0), day), cloud * 0.86);
        float dusk = smoothstep(-0.2, 0.05, ndl) * (1.0 - smoothstep(0.05, 0.35, ndl));
        col += vec3(0.9, 0.42, 0.18) * dusk * 0.10;
        // air: the limb turns blue, more so on the sunlit side
        float rim = pow(1.0 - max(dot(N, V), 0.0), 3.2);
        col += vec3(0.30, 0.56, 1.0) * rim * (0.22 + 0.9 * day);
        gl_FragColor = vec4(pow(col, vec3(0.92)), 1.0);
      }`,
  })));

  // the atmosphere seen past the edge of the planet: a slightly larger shell, drawn from the inside, fading outward
  spin.add(new THREE.Mesh(new THREE.SphereGeometry(1.075, 64, 48), new THREE.ShaderMaterial({
    uniforms: { uSun }, side: THREE.BackSide, transparent: true, depthWrite: false,
    vertexShader: `uniform vec3 uSun; varying vec3 vN; varying vec3 vL; void main(){ vN = normalize(normalMatrix * normal); vL = normalize(normalMatrix * uSun); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 vN; varying vec3 vL; void main(){ float edge = pow(smoothstep(0.0, 0.38, -vN.z), 2.2); float lit = 0.20 + 0.62 * smoothstep(-0.35, 0.5, dot(normalize(vN), normalize(vL))); gl_FragColor = vec4(0.36, 0.62, 1.0, edge * lit); }`,
  })));

  /* ---------- the time-zone marks: thin luminous lines that read over ocean, land and cloud ---------- */
  function tube(points, color, radius, opacity) {
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 96, radius, 6, false), new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }));
  }
  function meridian(lon, color, radius) { const p = []; for (let lat = -88; lat <= 88; lat += 4) p.push(at(lon, lat, 1.012)); return tube(p, color, radius, .95); }
  const VIOLET = 0xB9A2FF, MINT = 0x34D399, IST_LON = 82.5, INDIA = [78.96, 20.59];
  const offMin = -new Date().getTimezoneOffset();               // minutes east of UTC, from the visitor's device
  const youLon = ((offMin / 4 + 540) % 360) - 180;              // 4 minutes of time = 1 degree of longitude
  const same = Math.abs(offMin - 330) < 1;
  spin.add(meridian(IST_LON, MINT, .0065));
  if (!same) spin.add(meridian(youLon, VIOLET, .008));
  // India: a marker at its real position, with a ring that pulses gently
  const india = new THREE.Mesh(new THREE.SphereGeometry(.026, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); india.position.copy(at(INDIA[0], INDIA[1], 1.016)); spin.add(india);
  const halo = new THREE.Mesh(new THREE.RingGeometry(.04, .054, 40), new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: .85, side: THREE.DoubleSide }));
  halo.position.copy(at(INDIA[0], INDIA[1], 1.018)); halo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), at(INDIA[0], INDIA[1], 1)); spin.add(halo); // lies flat on the surface
  // the gap: an arc above the equator from the visitor's meridian to India's, the short way round
  const delta = ((IST_LON - youLon + 540) % 360) - 180;
  if (!same) {
    const p = [], steps = Math.max(8, Math.round(Math.abs(delta) / 4));
    for (let i = 0; i <= steps; i++) p.push(at(youLon + delta * i / steps, 0, 1.06));
    spin.add(tube(p, VIOLET, .0055, .9));
    [youLon, IST_LON].forEach((lon, k) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.02, 12, 10), new THREE.MeshBasicMaterial({ color: k ? MINT : VIOLET })); m.position.copy(at(lon, 0, 1.06)); spin.add(m); });
  }
  // start with both meridians in view where the gap allows it
  spin.rotation.y = -(IST_LON - Math.max(-65, Math.min(65, delta / 2))) * D;

  /* ---------- the sun: where it is overhead at this minute ---------- */
  function placeSun() {
    const now = new Date(), day = Math.floor((now - Date.UTC(now.getUTCFullYear(), 0, 0)) / 864e5);
    const B = 2 * Math.PI * (day - 81) / 364, eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // equation of time, minutes
    const decl = -23.44 * Math.cos(2 * Math.PI * (day + 10) / 365);
    const utc = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
    uSun.value.copy(at(((-15 * (utc - 12 + eot / 60) + 540) % 360) - 180, decl, 1));
  }
  placeSun();

  /* ---------- drawing, sizing, pausing ---------- */
  let visible = false, raf = 0, vel = 0, dragging = false, lastX = 0, lastY = 0, modal = false, idleAt = 0, skip = false, lost = false, prev = 0;
  function size() {
    const w = cv.clientWidth, dpr = Math.min(window.devicePixelRatio || 1, root.classList.contains('lite') ? 1 : 1.5);
    if (!w) return;
    renderer.setPixelRatio(dpr); renderer.setSize(w, w, false);
  }
  const draw = () => { if (!lost) renderer.render(scene, cam); };
  function tick(now) {
    raf = 0;
    if (!visible || document.hidden || modal || lost) return;
    const dt = Math.min(.1, (now - (prev || now)) / 1000); prev = now;
    const auto = !reduced && !root.classList.contains('still') && !dragging && now - idleAt > 2600;
    if (!dragging) { spin.rotation.y += vel; vel *= .93; if (Math.abs(vel) < 1e-4) vel = 0; }
    if (auto) { spin.rotation.y += .0016; uT.value += dt; const s = 1 + .35 * (.5 + .5 * Math.sin(now / 520)); halo.scale.set(s, s, s); halo.material.opacity = .85 - .5 * (s - 1) / .35; }
    // slow idle drift is drawn every second frame; anything the visitor is driving is drawn every frame
    if (dragging || vel || !(skip = !skip)) draw();
    if (auto || dragging || vel) raf = requestAnimationFrame(tick); else prev = 0;
  }
  const wake = () => { if (!raf && visible && !document.hidden && !modal && !lost) raf = requestAnimationFrame(tick); };

  cv.addEventListener('pointerdown', (e) => { dragging = true; vel = 0; lastX = e.clientX; lastY = e.clientY; try { cv.setPointerCapture(e.pointerId); } catch (err) {} wake(); });
  cv.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
    spin.rotation.y += dx * .0062; vel = dx * .0031;
    tilt.rotation.x = Math.max(-.45, Math.min(.95, tilt.rotation.x + dy * .004));
  });
  const release = () => { if (!dragging) return; dragging = false; idleAt = performance.now(); wake(); setTimeout(wake, 2700); };
  cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', release);
  cv.addEventListener('keydown', (e) => {
    const k = { ArrowLeft: [-.26, 0], ArrowRight: [.26, 0], ArrowUp: [0, -.12], ArrowDown: [0, .12] }[e.key];
    if (!k) return;
    e.preventDefault(); spin.rotation.y += k[0]; tilt.rotation.x = Math.max(-.45, Math.min(.95, tilt.rotation.x + k[1])); idleAt = performance.now(); draw(); setTimeout(wake, 2700);
  });
  cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; sec.classList.remove('live'); });
  document.addEventListener('sx:toggle', (e) => { modal = !!e.detail; wake(); });
  document.addEventListener('visibilitychange', wake);
  addEventListener('resize', () => { size(); draw(); });
  new MutationObserver(() => { size(); draw(); wake(); }).observe(root, { attributes: true, attributeFilter: ['class'] }); // pause button and low-power mode
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; wake(); }, { rootMargin: '80px 0px' }).observe(cv);
  else visible = true;
  setInterval(() => { placeSun(); if (!raf) draw(); }, 60000);

  sec.classList.add('live'); // the globe column appears only once there is a globe to show
  size(); draw(); grace(); wake();
})();
