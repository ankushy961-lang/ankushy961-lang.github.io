/* Ankush Yadav portfolio engine: synaptic light field, interaction layer, five app demos. */
if (window.top !== window.self) { try { window.top.location = window.location; } catch (e) { document.documentElement.hidden = true; } }
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- contact address, assembled at runtime so the source never carries it whole ---------- */
  $$('[data-u][data-d]').forEach((el) => {
    const addr = el.dataset.u + '@' + el.dataset.d;
    if (el.tagName === 'A') {
      const q = [];
      if (el.dataset.subject) q.push('subject=' + encodeURIComponent(el.dataset.subject));
      if (el.dataset.body) q.push('body=' + el.dataset.body.split('%0A').map(encodeURIComponent).join('%0A'));
      el.setAttribute('href', 'mailto:' + addr + (q.length ? '?' + q.join('&') : ''));
    }
    if (el.hasAttribute('data-show')) el.textContent = addr;
  });

  const jpFont = $('#jpfont');
  if (jpFont) { if (jpFont.sheet) jpFont.media = 'all'; else jpFont.addEventListener('load', () => { jpFont.media = 'all'; }); }

  /* ---------- motion: a visible pause control for everything that moves on its own (WCAG 2.2.2) ---------- */
  const motionBtn = $('#motionBtn');
  let still = false;
  try { still = localStorage.getItem('ay-still') === '1'; } catch (e) {}
  const motionListeners = [];
  function applyMotion() {
    root.classList.toggle('still', still);
    if (motionBtn) { motionBtn.setAttribute('aria-pressed', String(still)); motionBtn.setAttribute('aria-label', still ? 'Play motion' : 'Pause motion'); }
    motionListeners.forEach((f) => f(still));
  }
  if (motionBtn) motionBtn.addEventListener('click', () => { still = !still; try { localStorage.setItem('ay-still', still ? '1' : '0'); } catch (e) {} applyMotion(); });
  root.classList.toggle('still', still);

  /* ---------- theme ---------- */
  const themeBtn = $('#themeBtn');
  function currentTheme() {
    const t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  try { const s = localStorage.getItem('ay-theme'); if (s) root.setAttribute('data-theme', s); } catch (e) {}
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ay-theme', next); } catch (e) {}
    field.retheme();
  });

  /* ---------- boot ---------- */
  const boot = $('#boot');
  (async function runBoot() {
    let seen = false;
    try { seen = sessionStorage.getItem('ay-booted') === '1'; } catch (e) {}
    if (reduced || seen) { boot.classList.add('off'); return; }
    const t = $('#bootText');
    const lines = ['EPISODE 01', 'ANKUSH YADAV', 'FROM ZERO', 'START'];
    for (let i = 0; i < lines.length; i++) { t.textContent = lines[i]; await wait(i === lines.length - 1 ? 160 : 220); }
    boot.classList.add('off');
    try { sessionStorage.setItem('ay-booted', '1'); } catch (e) {}
  })();
  setTimeout(() => boot.classList.add('off'), 4000); // never trap the user

  /* ---------- cursor ---------- */
  const cursor = $('#cursor');
  if (finePointer && !reduced) {
    document.body.classList.add('has-cursor');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    addEventListener('pointerover', (e) => { cursor.classList.toggle('hot', !!(e.target.closest && e.target.closest('a,button,.vitrine,.phone,.laptop'))); });
    let cRaf = 0;
    function loop() { cx = lerp(cx, tx, .22); cy = lerp(cy, ty, .22); cursor.style.transform = `translate(${cx}px,${cy}px)`; cRaf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .3) ? requestAnimationFrame(loop) : 0; }
    addEventListener('pointermove', () => { if (!cRaf) cRaf = requestAnimationFrame(loop); }, { passive: true });
  }

  /* ---------- scroll progress ---------- */
  const progress = $('#progress');
  const dockLinks = $$('.dock-links a');
  const sections = $$('.exhibit');
  function onScroll() {
    const p = root.scrollTop / Math.max(1, root.scrollHeight - root.clientHeight);
    progress.style.transform = `scaleX(${p})`;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- the room: the exhibit crossing the line 45% down the viewport lights the dock, cursor, progress and field ---------- */
  let room = null;
  const inView = new Set();
  function setRoom() {
    let cur = null;
    for (const s of sections) if (inView.has(s)) cur = s;
    const id = cur ? cur.id : null;
    if (id === room) return;
    room = id;
    dockLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
    const c = cur ? cur.style.getPropertyValue('--app').trim() : '';
    if (c) root.style.setProperty('--room', c); else root.style.removeProperty('--room');
    field.room(c);
  }
  function watchRooms() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) inView.add(en.target); else inView.delete(en.target); }); setRoom(); }, { rootMargin: '-45% 0px -54% 0px', threshold: 0 });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- pointer light on glass + prism angle ---------- */
  let glassRaf = 0, glassEv = null;
  addEventListener('pointermove', (e) => {
    glassEv = e;
    if (glassRaf) return;
    glassRaf = requestAnimationFrame(() => {
      glassRaf = 0;
      const g = glassEv.target.closest && glassEv.target.closest('.glass');
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', ((glassEv.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      g.style.setProperty('--my', ((glassEv.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      g.style.setProperty('--ang', Math.round(Math.atan2(glassEv.clientY - (r.top + r.height / 2), glassEv.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90));
    });
  }, { passive: true });

  /* ---------- tilt (pointer + gyroscope) ---------- */
  const tilts = $$('.tilt');
  tilts.forEach((el) => {
    const max = el.classList.contains('contact-card') ? 4 : 9;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || reduced) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.classList.remove('settle');
      el.style.setProperty('--ry', (x * max * 2).toFixed(2));
      el.style.setProperty('--rx', (-y * max * 2).toFixed(2));
    });
    el.addEventListener('pointerleave', () => { el.classList.add('settle'); el.style.setProperty('--rx', 0); el.style.setProperty('--ry', 0); });
  });
  if (!finePointer && !reduced && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    let gyroRaf = 0, g = null;
    addEventListener('deviceorientation', (e) => {
      g = e; if (gyroRaf) return;
      gyroRaf = requestAnimationFrame(() => {
        gyroRaf = 0; if (g.gamma == null) return;
        const ry = clamp(g.gamma, -30, 30) / 30 * 10, rx = clamp((g.beta || 45) - 45, -30, 30) / 30 * -8;
        tilts.forEach((el) => { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; el.classList.remove('settle'); el.style.setProperty('--ry', ry.toFixed(2)); el.style.setProperty('--rx', rx.toFixed(2)); });
      });
    }, { passive: true });
  }

  /* ---------- ring: auto spin + drag with inertia + a lit front card ---------- */
  const vitrine = $('#vitrine'), ring = $('#ring');
  (function ringLoop() {
    let ry = 0, vel = 0, dragging = false, moved = 0, lastX = 0, lastT = 0, front = -1;
    const cards = $$('.ring-card', ring), n = cards.length || 1;
    let auto = (reduced || still) ? 0 : .08, onscreen = true, focused = false, raf = 0;
    motionListeners.push((s) => { auto = (reduced || s) ? 0 : .08; wake(); });
    cards.forEach((c, i) => {
      c.addEventListener('focus', () => { focused = true; vel = 0; const want = -i * (360 / n); ry = want + 360 * Math.round((ry - want) / 360); render(); });
      c.addEventListener('blur', () => { focused = false; wake(); });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { onscreen = es[0].isIntersecting; wake(); }).observe(vitrine);
    function wake() { if (!raf && !reduced) raf = requestAnimationFrame(tick); }
    function render() {
      ring.style.setProperty('--ry', ry.toFixed(2));
      const f = ((Math.round(-ry / (360 / n)) % n) + n) % n;
      if (f !== front) { front = f; cards.forEach((c, i) => c.classList.toggle('front', i === f)); }
    }
    vitrine.addEventListener('pointerdown', (e) => { wake(); dragging = true; moved = 0; vitrine.classList.add('drag'); lastX = e.clientX; lastT = performance.now(); vel = 0; try { vitrine.setPointerCapture(e.pointerId); } catch (err) {} });
    vitrine.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
      moved += Math.abs(dx); ry += dx * .45; vel = clamp(dx / dt * 8, -14, 14); lastX = e.clientX; lastT = now; render();
    });
    const up = () => { dragging = false; vitrine.classList.remove('drag'); };
    vitrine.addEventListener('pointerup', up); vitrine.addEventListener('pointercancel', up);
    vitrine.addEventListener('click', (e) => { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
    if (reduced) { render(); return; }
    function tick() {
      raf = 0;
      if (!onscreen) return;
      const spin = focused ? 0 : auto;
      if (!dragging) { ry += vel + spin; vel *= .94; if (Math.abs(vel) < .01) vel = 0; render(); }
      if (dragging || vel || spin) raf = requestAnimationFrame(tick);
    }
    wake();
  })();

  /* ---------- reveals ---------- */
  const revealEls = $$('.exhibit .stage, .exhibit .panel, .contact-card, .strip');
  if (!reduced && 'IntersectionObserver' in window) {
    revealEls.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealEls.forEach((el) => io.observe(el));
    setTimeout(() => revealEls.forEach((el) => el.classList.add('in')), 2500);
  }

  /* ---------- buttons: ripple, magnetism, states ---------- */
  $$('.btn').forEach((b) => {
    b.addEventListener('pointerdown', (e) => {
      if (reduced) return;
      const r = b.getBoundingClientRect(), i = document.createElement('i');
      i.className = 'ripple'; i.style.left = (e.clientX - r.left) + 'px'; i.style.top = (e.clientY - r.top) + 'px';
      b.appendChild(i); setTimeout(() => i.remove(), 700);
    });
    if (finePointer && !reduced && b.classList.contains('primary')) {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 10}px,${((e.clientY - r.top) / r.height - .5) * 8}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    }
  });
  function setLabel(b, text) { const l = $('.lbl', b); if (l) l.textContent = text; else b.textContent = text; }

  /* ---------- copy email ---------- */
  const copyBtn = $('#copyMail');
  copyBtn.addEventListener('click', async () => {
    const txt = $('#mailText').textContent.trim();
    try { await navigator.clipboard.writeText(txt); setLabel(copyBtn, 'Copied'); }
    catch (e) { const sel = window.getSelection(), rg = document.createRange(); rg.selectNodeContents($('#mailText')); sel.removeAllRanges(); sel.addRange(rg); setLabel(copyBtn, 'Selected'); }
    copyBtn.classList.add('done');
    setTimeout(() => { setLabel(copyBtn, 'Copy'); copyBtn.classList.remove('done'); }, 1600);
  });

  /* ---------- WebGL synaptic field ---------- */
  const telemetry = $('#telemetry');
  const field = (function () {
    const canvas = $('#field');
    const off = () => { canvas.remove(); if (telemetry) telemetry.textContent = 'STATIC MODE'; return { retheme() {}, room() {} }; };
    if (!window.THREE || reduced) return off();
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { return off(); }
    const small = innerWidth < 760;
    const DPR_STEPS = [Math.min(devicePixelRatio || 1, small ? 1 : 1.25), 1, .8, .66];
    let quality = 0;
    renderer.setPixelRatio(DPR_STEPS[0]);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, .1, 100); camera.position.z = 9;
    const pointer = new THREE.Vector2(0, 0), target = new THREE.Vector2(0, 0);
    const palette = () => currentTheme() === 'dark'
      ? [new THREE.Color('#B9A2FF'), new THREE.Color('#E8DCC4'), new THREE.Color('#5FCB8A')]
      : [new THREE.Color('#6D3FE0'), new THREE.Color('#1F3D2B'), new THREE.Color('#2E7D4F')];

    /* room tint: the whole field leans toward the colour of the exhibit in view */
    const tintCol = new THREE.Color('#8B5CF6'), tintTarget = new THREE.Color('#8B5CF6');
    let tintAmt = 0, tintWant = 0;
    const uTint = { value: tintCol }, uTintAmt = { value: 0 };

    /* dust: drifting particles that part around the pointer */
    const N = small ? 1400 : 2600;
    const pos = new Float32Array(N * 3), seed = new Float32Array(N), mix = new Float32Array(N);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 26; pos[i * 3 + 1] = (Math.random() - .5) * 16; pos[i * 3 + 2] = (Math.random() - .5) * 10 - 2; seed[i] = Math.random() * 6.28; mix[i] = Math.random(); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('mix', new THREE.BufferAttribute(mix, 1));
    const uni = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uScroll: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() }, uPx: { value: renderer.getPixelRatio() }, uAlpha: { value: 1 }, uTint, uTintAmt };
    const dustMat = new THREE.ShaderMaterial({
      uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float seed; attribute float mix; uniform float uTime; uniform vec2 uPointer; uniform float uScroll; uniform float uPx; varying float vMix; varying float vGlow;
        void main(){ vec3 p = position; float t = uTime*.25 + seed;
          p.x += sin(t*.9 + p.y*.35)*.45; p.y += cos(t*.7 + p.x*.3)*.35 + sin(uTime*.1+seed)*.2; p.y += uScroll * 3.0;
          vec2 d = p.xy - uPointer; float dist = length(d); float push = smoothstep(3.2, 0.0, dist);
          p.xy += normalize(d + 1e-4) * push * 1.6; vGlow = push;
          vec4 mv = modelViewMatrix * vec4(p,1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + mix*2.4 + push*3.0) * uPx * (14.0 / -mv.z); vMix = mix; }`,
      fragmentShader: `precision mediump float; uniform vec3 uA,uB,uC; uniform float uAlpha; uniform vec3 uTint; uniform float uTintAmt; varying float vMix; varying float vGlow;
        void main(){ vec2 c = gl_PointCoord - .5; float r = length(c); if(r>.5) discard; float a = smoothstep(.5,.05,r);
          vec3 col = vMix < .5 ? mix(uA,uB,vMix*2.0) : mix(uB,uC,(vMix-.5)*2.0); col = mix(col, uTint, uTintAmt); col = mix(col, vec3(1.0), vGlow*.6);
          gl_FragColor = vec4(col, a * (.5 + vGlow*.5) * uAlpha); }`
    });
    const dust = new THREE.Points(geo, dustMat); scene.add(dust);

    /* synapses: a neural lattice with pulses travelling along its edges */
    const NN = small ? 90 : 150;
    const nodes = [];
    for (let i = 0; i < NN; i++) {
      const a = Math.random() * 6.283, r = Math.pow(Math.random(), .6);
      nodes.push(new THREE.Vector3(Math.cos(a) * r * 9.5, Math.sin(a) * r * 5.2 + (Math.random() - .5) * 1.5, -2 - Math.random() * 3));
    }
    const edges = new Set();
    nodes.forEach((n, i) => {
      const near = nodes.map((m, j) => [n.distanceTo(m), j]).filter((x) => x[1] !== i).sort((a, b) => a[0] - b[0]).slice(0, 3);
      near.forEach((x) => { const k = i < x[1] ? `${i}-${x[1]}` : `${x[1]}-${i}`; edges.add(k); });
    });
    const E = edges.size, ePos = new Float32Array(E * 6), eT = new Float32Array(E * 2), eOff = new Float32Array(E * 2), eSpd = new Float32Array(E * 2);
    let k = 0;
    edges.forEach((key) => {
      const [a, b] = key.split('-').map(Number), off = Math.random(), spd = .25 + Math.random() * .45;
      ePos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6);
      eT[k * 2] = 0; eT[k * 2 + 1] = 1; eOff[k * 2] = off; eOff[k * 2 + 1] = off; eSpd[k * 2] = spd; eSpd[k * 2 + 1] = spd; k++;
    });
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    eGeo.setAttribute('t', new THREE.BufferAttribute(eT, 1));
    eGeo.setAttribute('off', new THREE.BufferAttribute(eOff, 1));
    eGeo.setAttribute('spd', new THREE.BufferAttribute(eSpd, 1));
    const synUni = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uColor: { value: new THREE.Color() }, uColor2: { value: new THREE.Color() }, uAlpha: { value: 1 }, uScroll: { value: 0 }, uTint, uTintAmt };
    const synMat = new THREE.ShaderMaterial({
      uniforms: synUni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float t; attribute float off; attribute float spd; uniform float uScroll; uniform vec2 uPointer; varying float vT; varying float vOff; varying float vSpd; varying float vNear;
        void main(){ vec3 p = position; p.y += uScroll * 2.0; vT = t; vOff = off; vSpd = spd; vNear = smoothstep(4.5, 0.0, length(p.xy - uPointer));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
      fragmentShader: `precision mediump float; uniform float uTime; uniform vec3 uColor; uniform vec3 uColor2; uniform float uAlpha; uniform vec3 uTint; uniform float uTintAmt; varying float vT; varying float vOff; varying float vSpd; varying float vNear;
        void main(){ float ph = fract(uTime * vSpd + vOff); float pulse = smoothstep(.16, 0.0, abs(ph - vT)) ; float base = .05 + vNear * .18;
          vec3 col = mix(mix(uColor, uColor2, vNear), uTint, uTintAmt); gl_FragColor = vec4(col, (base + pulse * (.55 + vNear * .45)) * uAlpha); }`
    });
    scene.add(new THREE.LineSegments(eGeo, synMat));
    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])), 3));
    nGeo.setAttribute('seed', new THREE.BufferAttribute(new Float32Array(nodes.map(() => Math.random() * 6.28)), 1));
    const nodeUni = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uColor: { value: new THREE.Color() }, uPx: { value: renderer.getPixelRatio() }, uAlpha: { value: 1 }, uScroll: { value: 0 }, uTint, uTintAmt };
    const nodeMat = new THREE.ShaderMaterial({
      uniforms: nodeUni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float seed; uniform float uTime; uniform vec2 uPointer; uniform float uPx; uniform float uScroll; varying float vA;
        void main(){ vec3 p = position; p.y += uScroll * 2.0; float near = smoothstep(4.5, 0.0, length(p.xy - uPointer)); float tw = .6 + .4 * sin(uTime * 1.3 + seed);
          vA = tw * (.45 + near); vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = (2.2 + near * 4.0) * uPx * (14.0 / -mv.z); }`,
      fragmentShader: `precision mediump float; uniform vec3 uColor; uniform float uAlpha; uniform vec3 uTint; uniform float uTintAmt; varying float vA;
        void main(){ float r = length(gl_PointCoord - .5); if (r > .5) discard; float a = smoothstep(.5, .1, r); gl_FragColor = vec4(mix(mix(uColor, uTint, uTintAmt), vec3(1.0), .35), a * vA * uAlpha); }`
    });
    scene.add(new THREE.Points(nGeo, nodeMat));

    /* holographic shards */
    const shardMat = (c) => new THREE.ShaderMaterial({
      uniforms: { uColor: { value: c }, uAlpha: { value: 1 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `precision mediump float; uniform vec3 uColor; uniform float uAlpha; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2); gl_FragColor = vec4(uColor * (0.25 + f), (0.05 + f*0.5) * uAlpha); }`
    });
    const shards = [];
    const cols = palette();
    for (let i = 0; i < (small ? 4 : 7); i++) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.5 + Math.random() * .9, 0), shardMat(cols[i % 3].clone()));
      m.position.set((Math.random() - .5) * 18, (Math.random() - .5) * 10, (Math.random() - .5) * 4 - 1);
      m.userData = { r: Math.random() * .4 + .1, ph: Math.random() * 6.28, y0: m.position.y };
      scene.add(m); shards.push(m);
    }
    function retheme() {
      const c = palette(), dark = currentTheme() === 'dark', a = dark ? 1 : .6;
      uni.uA.value.copy(c[0]); uni.uB.value.copy(c[1]); uni.uC.value.copy(c[2]); uni.uAlpha.value = a;
      synUni.uColor.value.copy(c[1]); synUni.uColor2.value.copy(c[0]); synUni.uAlpha.value = dark ? 1 : .8;
      nodeUni.uColor.value.copy(c[0]); nodeUni.uAlpha.value = a;
      shards.forEach((s, i) => { s.material.uniforms.uColor.value.copy(c[i % 3]); s.material.uniforms.uAlpha.value = dark ? 1 : .5; });
      if (tintWant) tintWant = dark ? .45 : .3;
    }
    retheme();
    function room(hex) {
      if (hex) { tintTarget.set(hex); tintWant = currentTheme() === 'dark' ? .45 : .3; } else tintWant = 0;
    }

    function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    addEventListener('resize', resize); resize();
    addEventListener('pointermove', (e) => { target.set((e.clientX / innerWidth - .5) * 2, -(e.clientY / innerHeight - .5) * 2); }, { passive: true });
    addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) target.set((t.clientX / innerWidth - .5) * 2, -(t.clientY / innerHeight - .5) * 2); }, { passive: true });

    /* adaptive quality: step down resolution and load whenever frames drop; never flicker back up */
    let slowSeconds = 0;
    function stepDown() {
      if (quality >= DPR_STEPS.length - 1) return;
      quality++;
      renderer.setPixelRatio(DPR_STEPS[quality]); uni.uPx.value = DPR_STEPS[quality]; nodeUni.uPx.value = DPR_STEPS[quality]; resize();
      if (quality >= 2) { geo.setDrawRange(0, Math.floor(N * .55)); shards.forEach((s, i) => { s.visible = i < 3; }); }
      if (quality >= 3) { geo.setDrawRange(0, Math.floor(N * .35)); }
    }
    let visible = true, lost = false, paused = still, last = performance.now(), frames = 0, fpsT = last, fps = 60;
    motionListeners.push((s) => { paused = s; last = performance.now(); });
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; canvas.classList.remove('on'); if (telemetry) telemetry.textContent = 'STATIC MODE'; });
    canvas.addEventListener('webglcontextrestored', () => { lost = false; canvas.classList.add('on'); });
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || lost || paused) { last = now; return; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      frames++;
      if (now - fpsT > 1000) {
        fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now;
        if (fps < 45 && fps >= 8) { if (++slowSeconds >= 2) { slowSeconds = 0; stepDown(); } } else if (fps >= 45) slowSeconds = 0;
        if (telemetry) telemetry.textContent = `NODES ${NN} · SYNAPSES ${E} · ${fps >= 30 ? fps + ' FPS' : 'LOW POWER'}${quality ? ' · Q' + (DPR_STEPS.length - quality) : ''}`;
      }
      pointer.lerp(target, .06);
      const vis = camera.position.z * Math.tan(camera.fov * Math.PI / 360);
      const px = pointer.x * vis * camera.aspect, py = pointer.y * vis;
      uni.uPointer.value.set(px, py); synUni.uPointer.value.set(px, py); nodeUni.uPointer.value.set(px, py);
      uni.uTime.value += dt; synUni.uTime.value = uni.uTime.value; nodeUni.uTime.value = uni.uTime.value;
      const sc = root.scrollTop / Math.max(1, root.scrollHeight - innerHeight);
      uni.uScroll.value = sc; synUni.uScroll.value = sc; nodeUni.uScroll.value = sc;
      tintAmt = lerp(tintAmt, tintWant, .03); uTintAmt.value = tintAmt; tintCol.lerp(tintTarget, .04);
      camera.position.x = lerp(camera.position.x, pointer.x * .6, .05);
      camera.position.y = lerp(camera.position.y, pointer.y * .4 - sc * 1.2, .05);
      camera.lookAt(0, -sc * 1.2, 0);
      shards.forEach((s) => { s.rotation.x += s.userData.r * dt; s.rotation.y += s.userData.r * .7 * dt; s.position.y = s.userData.y0 + Math.sin(uni.uTime.value * .5 + s.userData.ph) * .5 + sc * 3; });
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
    canvas.classList.add('on');
    return { retheme, room };
  })();
  watchRooms();
  applyMotion();

  /* ---------- demo runner ---------- */
  function Runner(stepsEl) {
    let token = 0;
    const steps = stepsEl ? $$('li', stepsEl) : [];
    return {
      start() { token++; steps.forEach((s) => s.classList.remove('on', 'done')); return token; },
      alive(t) { return t === token; },
      step(i) { steps.forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('done', k < i); }); },
      finish() { steps.forEach((s) => { s.classList.remove('on'); s.classList.add('done'); }); }
    };
  }
  const demos = {};
  const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  /* ===== Strikedeck ===== */
  demos.sd = (function () {
    const run = Runner($('#steps-sd')), screen = $('.sd'), live = $('.sd-live'), feed = $('#sd-feed'), spot = $('#sd-spot'), ce = $('#sd-ce'), pe = $('#sd-pe');
    const rows = $$('#sd-rows tr'), gauge = $('#sd-gauge'), pcrv = $('#sd-pcrv'), votes = $$('#sd-votes li'), signal = $('#sd-signal'), modes = $$('#sd-modes i'), trades = $('#sd-trades'), win = $('#sd-win'), toast = $('#sd-toast'), kill = $('#sd-kill');
    let price = 24154.4, pcr = .84, nTrades = 0, wins = 0, halted = false, haltTimer = 0;
    function say(msg, bad) { toast.textContent = msg; toast.classList.toggle('bad', !!bad); toast.hidden = false; }
    function reset() { halted = false; screen.classList.remove('halt'); live.classList.remove('on'); feed.textContent = 'KITE · CONNECTING'; votes.forEach((v) => v.classList.remove('yes')); signal.textContent = 'WAITING'; signal.classList.remove('go'); toast.hidden = true; }
    async function go() {
      clearTimeout(haltTimer);
      const t = run.start(); reset();
      run.step(0); await wait(600); if (!run.alive(t)) return;
      live.classList.add('on'); feed.textContent = 'KITE · LIVE'; run.step(1);
      for (let i = 0; i < 7; i++) {
        await wait(260); if (!run.alive(t) || halted) return;
        const d = (Math.random() - .42) * 14; price += d; spot.textContent = fmt(price); spot.className = d >= 0 ? 'up' : 'dn';
        pcr = clamp(pcr + (Math.random() - .45) * .08, .5, 1.4); gauge.style.setProperty('--p', ((pcr - .5) / .9 * 100).toFixed(0) + '%'); pcrv.textContent = pcr.toFixed(2);
        ce.textContent = fmt(1748.7 + i * 3.1 + Math.random() * 2) + 'L'; pe.textContent = fmt(1475.4 + i * 4.4 + Math.random() * 2) + 'L';
        rows.forEach((r) => $$('i', r).forEach((b) => b.style.setProperty('--w', clamp(parseFloat(b.style.getPropertyValue('--w')) + (Math.random() - .5) * 12, 15, 98).toFixed(0) + '%')));
      }
      run.step(2);
      for (let i = 0; i < votes.length; i++) { await wait(420); if (!run.alive(t) || halted) return; votes[i].classList.add('yes'); signal.textContent = `${i + 1} / 3 ALIGNED`; }
      await wait(300); if (!run.alive(t) || halted) return;
      signal.textContent = 'BUY CE 24,150 · 71%'; signal.classList.add('go'); run.step(3);
      await wait(700); if (!run.alive(t) || halted) return;
      say('Gate: PAPER · 3/3 aligned · daily loss 0% of 10% · wouldExecute: true'); run.step(4);
      await wait(900); if (!run.alive(t) || halted) return;
      nTrades++; if (Math.random() < .62) wins++;
      trades.textContent = `Trades ${nTrades} / 50`; win.textContent = `Win ${Math.round(wins / nTrades * 100)}% / 45%`;
      say(`Paper fill · NIFTY 24150 CE @ ₹142.5 · ledger #${1000 + nTrades}`);
      if (nTrades >= 3) { modes[0].classList.remove('on'); modes[1].classList.add('on'); say('Demo gate reached: PAPER → LIMITED LIVE. Operator token still required.'); }
      run.finish();
    }
    kill.addEventListener('click', () => {
      halted = true; screen.classList.add('halt'); live.classList.remove('on'); feed.textContent = 'EMERGENCY STOP'; signal.textContent = 'ENGINE STOPPED'; signal.classList.remove('go');
      say('Kill switch → SAFE_MODE. Pending signals cancelled. Exit needs operator token.', true); run.finish();
      clearTimeout(haltTimer); haltTimer = setTimeout(() => { if (halted) { reset(); say('Safe mode exited by operator. Engine idle.'); } }, 4200);
    });
    return go;
  })();

  /* ===== Mikazuki ===== */
  demos.mz = (function () {
    const run = Runner($('#steps-mz')), phone = $('#mz-phone'), screen = $('.mz'), cap = $('#mz-cap'), stream = $('#mz-stream'), crewName = $('#mz-crewname');
    const CREWS = [['RONIN', '#39FF14', 'Blade Dojo'], ['TAIYO', '#FF2D2D', 'Sun Engine'], ['KUSA', '#4ADE80', 'Life Pulse'], ['SHIORI', '#7A5CFF', 'Void Library'], ['ARASHI', '#00C2FF', 'Storm Matrix'], ['HONOO', '#FFB347', 'Velvet Flame'], ['YUME', '#FF00FF', 'Dream Forge'], ['KIKAI', '#00D9FF', 'Steel Reactor'], ['UMI', '#5DADE2', 'Ocean Core'], ['YAMI', '#7C3AED', 'Ascension Void']];
    const orbit = $('#mz-orbit'), crews = $('#mz-crews');
    CREWS.forEach((c, k) => {
      const i = document.createElement('i'); i.style.setProperty('--k', k); i.style.setProperty('--c', c[1]); orbit.appendChild(i);
      const b = document.createElement('button'); b.type = 'button'; const dot = document.createElement('i'); dot.style.setProperty('--c', c[1]); b.appendChild(dot); b.appendChild(document.createTextNode(c[0])); b.title = c[2];
      if (k === 0) b.classList.add('on'); b.addEventListener('click', () => pick(k)); crews.appendChild(b);
    });
    function pick(k) { phone.style.setProperty('--world', CREWS[k][1]); crewName.textContent = CREWS[k][0]; $$('button', crews).forEach((b, i) => b.classList.toggle('on', i === k)); cap.textContent = `${CREWS[k][2]} loaded.`; }
    const LINES = [['intent → reminder.create', 0], ['brain: KAZE · 412 ms', 0], ['memory.recall("mandi") → 3 facts', 1], ['plan: set alarm 18:00', 1], ['enma.execute → AlarmClock ✓', 2], ['memory.remember(routine)', 2], ['tts → 24 kHz · 1.8 s', 3]];
    function push(text, ok) { const li = document.createElement('li'); li.textContent = text; if (ok) li.classList.add('ok'); stream.appendChild(li); while (stream.children.length > 5) stream.removeChild(stream.firstChild); }
    let busy = false;
    async function go() {
      if (busy) return; busy = true;
      try {
        const t = run.start(); stream.textContent = ''; screen.className = 'screen mz listening'; run.step(0);
        cap.textContent = '"Remind me to call the mandi at six."'; await wait(1500); if (!run.alive(t)) return;
        screen.className = 'screen mz thinking'; cap.textContent = 'Thinking…'; run.step(1);
        for (const [text, s] of LINES) { await wait(380); if (!run.alive(t)) return; run.step(1 + s); push(text, text.includes('✓')); }
        await wait(300); if (!run.alive(t)) return;
        screen.className = 'screen mz speaking'; run.step(4); cap.textContent = '"Done. 6 pm. You usually call them evenings, so I\'ll remember that."';
        await wait(2200); if (!run.alive(t)) return;
        screen.className = 'screen mz'; run.finish(); cap.textContent = 'Tap the crescent';
      } finally { busy = false; }
    }
    $('#mz-core').addEventListener('click', go);
    return go;
  })();

  /* ===== Sri Hari Docs ===== */
  demos.sh = (function () {
    const run = Runner($('#steps-sh')), screen = $('.sh'), tabs = $$('#sh-tabs button'), views = $$('.sh-view', screen), fields = $('#sh-fields'), match = $('#sh-match'), save = $('#sh-save'), rc = $('#sh-rc');
    const v1 = $('#sh-v1'), v1n = $('#sh-v1n'), v1bar = $('#sh-v1bar'), docs = $('#sh-docs'), complete = $('#sh-complete');
    let count = 4;
    function show(name) { tabs.forEach((tb) => tb.classList.toggle('on', tb.dataset.v === name)); views.forEach((v) => v.classList.toggle('on', v.dataset.view === name)); }
    tabs.forEach((tb) => tb.addEventListener('click', () => show(tb.dataset.v)));
    const F = [['Type', 'Weighbridge slip'], ['Date', '08 May 2026'], ['Gross', '42,670 kg'], ['Tare', '12,540 kg'], ['Net', '30,130 kg'], ['Driver', 'RAJU'], ['Transporter', 'BASTI JANTA'], ['Confidence', 'high']];
    async function go() {
      const t = run.start(); show('upload'); fields.textContent = ''; match.hidden = true; save.hidden = true; screen.classList.add('scanning'); run.step(0);
      await wait(1100); if (!run.alive(t)) return; run.step(1);
      for (const [k, v] of F) {
        await wait(230); if (!run.alive(t)) return;
        const li = document.createElement('li'), s = document.createElement('span'), b = document.createElement('b'); s.textContent = k; b.textContent = v; li.appendChild(s); li.appendChild(b);
        if (k === 'Net') li.classList.add('hi'); fields.appendChild(li); while (fields.children.length > 5) fields.removeChild(fields.firstChild);
      }
      screen.classList.remove('scanning'); run.step(2); await wait(400); if (!run.alive(t)) return;
      match.hidden = false; await wait(900); if (!run.alive(t)) return;
      run.step(3); save.hidden = false; rc.hidden = false; await wait(900); if (!run.alive(t)) return;
      saveDoc(); run.step(4); await wait(900); if (!run.alive(t)) return; run.finish();
    }
    function saveDoc() {
      if (count < 7) { count++; v1n.textContent = `${count} / 7`; v1bar.style.setProperty('--w', Math.round(count / 7 * 100) + '%'); docs.textContent = String(parseInt(docs.textContent, 10) + 1); }
      if (count === 7) { v1.classList.add('done'); v1n.textContent = '7 / 7 ✓'; complete.textContent = '2'; }
      rc.hidden = true; save.hidden = true; show('dash'); v1.classList.add('flash'); setTimeout(() => v1.classList.remove('flash'), 1400);
    }
    save.addEventListener('click', saveDoc);
    return go;
  })();

  /* ===== ShopConnect ===== */
  demos.sc = (function () {
    const run = Runner($('#steps-sc')), screen = $('.sc'), views = $$('.sc-view', screen), tabs = $$('#sc-tabs button'), tl = $$('#sc-timeline li');
    const incoming = $('#sc-incoming'), task = $('#sc-task'), orderBtn = $('#sc-order'), acceptBtn = $('#sc-accept'), deliverBtn = $('#sc-deliver');
    function show(role) { views.forEach((v) => v.classList.toggle('on', v.dataset.view === role)); tabs.forEach((tb) => tb.classList.toggle('on', tb.dataset.role === role)); }
    function setStage(n) { tl.forEach((li, i) => { li.classList.toggle('done', i < n); li.classList.toggle('on', i === n); }); }
    function resetOrder() { setStage(-1); incoming.hidden = true; task.hidden = true; tl[4].textContent = 'Delivered'; acceptBtn.textContent = 'Accept'; acceptBtn.disabled = false; deliverBtn.disabled = false; orderBtn.textContent = 'Order 2 items · ₹294'; orderBtn.disabled = false; }
    $$('#sc-roles button').forEach((b) => b.addEventListener('click', () => { show(b.dataset.role); run.step(0); }));
    tabs.forEach((tb) => tb.addEventListener('click', () => show(tb.dataset.role)));
    orderBtn.addEventListener('click', () => { resetOrder(); setStage(0); incoming.hidden = false; orderBtn.textContent = 'Placed ✓'; orderBtn.disabled = true; run.step(1); });
    acceptBtn.addEventListener('click', () => { setStage(1); acceptBtn.textContent = 'Packing…'; acceptBtn.disabled = true; run.step(2); setTimeout(() => { setStage(2); acceptBtn.textContent = 'Packed ✓'; task.hidden = false; }, 700); });
    deliverBtn.addEventListener('click', () => { setStage(3); deliverBtn.disabled = true; deliverBtn.textContent = 'On the way…'; setTimeout(() => { setStage(4); tl[4].textContent = 'Delivered (sim)'; deliverBtn.textContent = 'Delivered ✓'; run.step(4); }, 700); });
    async function go() {
      const t = run.start(); resetOrder();
      show('roles'); run.step(0); await wait(900); if (!run.alive(t)) return;
      show('customer'); await wait(900); if (!run.alive(t)) return; orderBtn.click(); await wait(900); if (!run.alive(t)) return;
      show('shop'); await wait(800); if (!run.alive(t)) return; acceptBtn.click(); await wait(1300); if (!run.alive(t)) return;
      show('delivery'); run.step(3); await wait(800); if (!run.alive(t)) return; deliverBtn.click(); await wait(1300); if (!run.alive(t)) return;
      show('admin'); run.step(4); await wait(900); if (!run.alive(t)) return; run.finish();
    }
    return go;
  })();

  /* ===== Toolkit ===== */
  demos.tk = (function () {
    const run = Runner($('#steps-tk')), term = $('#tk-term'), gate = $$('#tk-gate li');
    const LINES = [['tracking files 9/9', 'ok', 2], ['claims: 2 checkers each · 0 refuted', 'ok', 1], ['skills 14/14 valid', 'ok', 2], ['tests 14/14 passing', 'ok', 2], ['budget ₹0 · no paid services', 'ok', 2], ['report: CHECKPOINT-1.pdf · 12 pages', 'dim', 3], ['CHECKPOINT 1 · awaiting owner · 9 decisions', 'warn', 4]];
    async function go() {
      const t = run.start(); term.textContent = '$ npm run validate'; run.step(0); await wait(500); if (!run.alive(t)) return;
      for (const [text, cls, s] of LINES) { await wait(380); if (!run.alive(t)) return; run.step(s); const span = document.createElement('span'); span.className = cls; span.textContent = `\n${cls === 'ok' ? '✓' : cls === 'warn' ? '●' : '→'} ${text}`; term.appendChild(span); }
      gate[1].classList.add('pulse'); setTimeout(() => gate[1].classList.remove('pulse'), 3200);
      await wait(900); if (!run.alive(t)) return; run.finish();
    }
    return go;
  })();

  /* ---------- x-ray: show the build (layers outlined, components tagged) ---------- */
  $$('[data-xray]').forEach((b) => {
    const sec = b.closest('.exhibit, .board');
    b.addEventListener('click', () => {
      const on = !sec.classList.contains('xray');
      sec.classList.toggle('xray', on);
      b.setAttribute('aria-pressed', String(on));
      setLabel(b, on ? 'Hide the build' : 'Show the build');
    });
  });

  /* ---------- wire run buttons with visible states + autoplay on first view ---------- */
  const running = new Set();
  async function runDemo(key, btn) {
    if (running.has(key)) return;
    running.add(key);
    const label = btn ? $('.lbl', btn).textContent : '';
    if (btn) { btn.classList.add('running'); setLabel(btn, 'Running'); }
    try { await demos[key](); } catch (e) { console.error(e); }
    running.delete(key);
    if (btn) { btn.classList.remove('running'); btn.classList.add('done'); setLabel(btn, 'Done'); setTimeout(() => { btn.classList.remove('done'); setLabel(btn, label.replace(/^Run (a|an) /, 'Run another ').replace('Say something', 'Say it again').replace('Upload a slip', 'Upload another')); }, 1200); }
  }
  $$('[data-run]').forEach((b) => b.addEventListener('click', () => runDemo(b.dataset.run, b)));
  if (!reduced && 'IntersectionObserver' in window) {
    const played = new Set();
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting && !played.has(en.target.id)) { played.add(en.target.id); setTimeout(() => runDemo(en.target.dataset.demo, $('[data-run]', en.target)), 700); io.unobserve(en.target); } }), { threshold: .45 });
    sections.forEach((s) => io.observe(s));
  }
})();
