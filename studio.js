/* Ankush Yadav · studio site. Small on purpose: contact address, project viewer on demand, quiet arrival motion. */
if (window.top !== window.self) { try { window.top.location = window.location; } catch (e) { document.documentElement.hidden = true; } }
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fonts = document.getElementById('fonts'); if (fonts) fonts.media = 'all';   // the font stylesheet is linked as print so it never blocks the first paint

  /* ---------- contact address, assembled here so the page source never carries it whole ---------- */
  $$('[data-u][data-d]').forEach((el) => {
    const addr = el.dataset.u + '@' + el.dataset.d;
    if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + addr + (el.dataset.subject ? '?subject=' + encodeURIComponent(el.dataset.subject) : ''));
    if (el.hasAttribute('data-show')) el.textContent = addr;
  });
  const copyBtn = $('#copyMail'), mail = $('#mailText');
  if (copyBtn && mail) copyBtn.addEventListener('click', async () => {
    const label = copyBtn.textContent;
    try { await navigator.clipboard.writeText(mail.textContent.trim()); copyBtn.textContent = 'Copied'; }
    catch (e) { const sel = getSelection(), rg = document.createRange(); rg.selectNodeContents(mail); sel.removeAllRanges(); sel.addRange(rg); copyBtn.textContent = 'Selected'; }
    setTimeout(() => { copyBtn.textContent = label; }, 1600);
  });

  /* ---------- top bar gains its hairline once the page has moved ---------- */
  const nav = $('#nav');
  if (nav) { const on = () => nav.classList.toggle('stuck', scrollY > 8); addEventListener('scroll', on, { passive: true }); on(); }

  /* ---------- phone menu: close after a choice, and on Escape ---------- */
  const menu = $('.menu');
  if (menu) {
    menu.addEventListener('click', (e) => { if (e.target.closest('nav a')) menu.removeAttribute('open'); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.open) { menu.removeAttribute('open'); $('summary', menu).focus(); } });
  }

  /* ---------- projects: nothing about a project loads until someone opens it ---------- */
  const v = (($('script[src*="studio.js"]') || {}).src || '').split('?')[1] || '';
  const q = v ? '?' + v : '';
  let loading = null;
  function loadShowcase() {
    if (window.SX) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((res, rej) => {
      ['devices.css', 'showcase.css'].forEach((f) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = f + q; document.head.appendChild(l); });
      const s = document.createElement('script'); s.src = 'showcase.js' + q; s.onload = () => res(); s.onerror = () => { loading = null; rej(new Error('showcase failed to load')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  async function openProject(key, btn) {
    const label = btn ? btn.innerHTML : '';
    if (btn) { btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Opening…'; }
    try { await loadShowcase(); window.SX.open(key); }
    catch (e) { console.error(e); if (btn) { btn.textContent = 'Could not open. Try again'; await new Promise((r) => setTimeout(r, 1800)); } }
    finally { if (btn) { btn.removeAttribute('aria-busy'); btn.innerHTML = label; } }
  }
  $$('[data-explore]').forEach((b) => b.addEventListener('click', () => openProject(b.dataset.explore, b)));
  /* a link straight to a project (…/#strikedeck, or the short links /desk, /docs…) opens it */
  const byId = {}; $$('.tile[id]').forEach((t) => { const b = $('[data-explore]', t); if (b) byId[t.id] = b.dataset.explore; });
  const fromHash = () => { const key = byId[location.hash.slice(1)]; if (key) openProject(key); };
  addEventListener('hashchange', fromHash);
  if (document.readyState === 'complete') fromHash(); else addEventListener('load', fromHash, { once: true });

  /* ---------- showroom light: on a mouse, each project tile is lit from where the pointer is ---------- */
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const grid = $('.show .work'); let ev = null, queued = false;
    const paint = () => { queued = false; if (!ev) return; $$('.tile', grid).forEach((t) => { const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); t.style.setProperty('--my', (ev.clientY - r.top) + 'px'); }); };
    if (grid) grid.addEventListener('pointermove', (e) => { ev = e; if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
  }

  /* ---------- process story: the step crossing the reading line sets what the phone shows ---------- */
  const pr = $('.pr');
  if (pr && 'IntersectionObserver' in window) {
    const items = $$('.pr-steps li', pr);
    const set = (i) => { pr.dataset.step = String(i + 1); items.forEach((li, k) => li.classList.toggle('on', k === i)); };
    pr.classList.add('js'); set(0);
    const narrow = window.matchMedia('(max-width: 820px)').matches;
    const line = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) set(items.indexOf(en.target)); }), { rootMargin: narrow ? '-64% 0px -28% 0px' : '-46% 0px -46% 0px' });
    items.forEach((li) => line.observe(li));
  }

  /* ---------- v4 sections ---------- */
  { // ai
    /* ---------- AI section: the agent diagram rests while it is off screen, and can be paused by hand ---------- */
    {
      const aiFlow = $('.ai-flow'), aiPause = $('.ai-pause');
      if (aiFlow && !reduced) {
        if ('IntersectionObserver' in window) {
          new IntersectionObserver((es) => { es.forEach((e) => aiFlow.classList.toggle('ai-idle', !e.isIntersecting)); }, { rootMargin: '120px 0px' }).observe(aiFlow);
        }
        if (aiPause) {
          aiPause.hidden = false;
          aiPause.addEventListener('click', () => {
            const off = aiFlow.classList.toggle('ai-stop');
            aiPause.classList.toggle('ai-off', off);
            aiPause.textContent = off ? 'Play animation' : 'Pause animation';
          });
        }
      }
    }
  }
  { // enquiry
    /* ---------- project enquiry: composes a plain-text email and hands it to the visitor's own email app.
         Nothing is sent from this page and nothing is stored. The address is assembled from two attributes. ---------- */
      const enqForm = $('#enq-form');
      if (enqForm) {
        const to = enqForm.dataset.u + '@' + enqForm.dataset.d;
        const fields = $$('.enq-input', enqForm);
        const status = $('#enq-status'), result = $('#enq-result'), out = $('#enq-out');
        const copy = $('#enq-copy'), copyText = $('#enq-copy-t'), copyNote = $('#enq-copy-note');
        const val = (name) => enqForm.elements[name].value.trim();
        let copyTimer = 0;

        /* native constraints first, then the two checks they miss (spaces only, and a short text after trimming) */
        const problem = (el) => {
          const v = el.value.trim();
          if (el.required && !v) return el.dataset.missing || el.validationMessage;
          if (el.validity.typeMismatch) return el.dataset.invalid || el.validationMessage;
          if (el.minLength > 0 && v.length < el.minLength) return el.dataset.short || el.validationMessage;
          return el.validity.valid ? '' : el.validationMessage;
        };
        const mark = (el) => {
          const msg = problem(el), err = $('#' + el.id + '-err');
          if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
          if (err) { err.textContent = msg; err.hidden = !msg; }
          return !msg;
        };
        const say = (text, bad) => { status.textContent = text; status.classList.toggle('enq-bad', !!bad); };

        enqForm.noValidate = true; /* errors are shown inline, next to each field, instead of in browser bubbles */
        fields.forEach((el) => {
          el.addEventListener('blur', () => { if (el.value.trim() || el.hasAttribute('aria-invalid')) mark(el); });
          el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid')) mark(el); });
        });

        const compose = () => [
          'Project enquiry',
          '',
          'Name: ' + val('name'),
          'Email: ' + val('email'),
          'Project category: ' + (val('category') || 'Not specified'),
          'Budget: ' + (val('budget') || 'Not specified'),
          'Timeline: ' + (val('timeline') || 'Not specified'),
          'Reference links: ' + (val('links') || 'None'),
          '',
          'What I want to build:',
          val('brief').replace(/\r\n?/g, '\n')
        ].join('\n');

        enqForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const bad = fields.filter((el) => !mark(el));
          if (bad.length) {
            say(bad.length === 1 ? 'One field needs attention. See the message next to it.' : bad.length + ' fields need attention. See the message next to each one.', true);
            bad[0].focus();
            return;
          }
          const text = compose();
          const subject = 'Project enquiry from ' + val('name') + (val('category') ? ' (' + val('category') + ')' : '');
          const head = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=';
          let href = head + encodeURIComponent(text.replace(/\n/g, '\r\n'));
          /* some email apps refuse a very long link, so a long enquiry travels by Copy and paste instead */
          const tooLong = href.length > 1900;
          if (tooLong) href = head + encodeURIComponent('Project enquiry\r\n\r\nName: ' + val('name') + '\r\nEmail: ' + val('email') + '\r\n\r\n(Paste the copied enquiry here.)');

          const byEmail = (lead) => {
            out.value = text;
            result.hidden = false;
            clearTimeout(copyTimer); copy.classList.remove('enq-done'); copyText.textContent = 'Copy enquiry'; copyNote.textContent = '';
            say((lead || '') + (tooLong
              ? 'Your email app should open, addressed to ' + to + '. The enquiry is too long to fill in for you, so press Copy enquiry and paste it into the email.'
              : 'Your email app should open with the enquiry filled in. Press send there to reach us. If it does not open, press Copy enquiry and email the text to ' + to + '.'));
            result.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
            location.href = href;
          };
          /* direct send: used only when the form carries a form-service key (data-key). The key is a public form id, not a secret.
             Turning it on also needs the service's address in the page's connect-src policy and the privacy page updated first.
             Any failure falls back to the visitor's own email app, so an enquiry is never lost. */
          const key = enqForm.dataset.key;
          if (!key) { byEmail(); return; }
          const btn = enqForm.querySelector('[type="submit"]'), who = val('name'), reply = val('email');
          btn.disabled = true; say('Sending your enquiry…');
          fetch('https://api.web3forms.com/submit', {
            method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ access_key: key, subject, from_name: who, name: who, email: reply, message: text }),
          }).then((r) => r.json().then((j) => { if (!r.ok || !j.success) throw new Error('refused'); }))
            .then(() => { enqForm.reset(); result.hidden = true; say('Sent. Thank you, ' + who + '. We reply within a day, to ' + reply + '.'); })
            .catch(() => byEmail('We could not send it from this page, so we are using your email app instead. '))
            .then(() => { btn.disabled = false; });
        });

        copy.addEventListener('click', async () => {
          let ok = false;
          try { await navigator.clipboard.writeText(out.value); ok = true; }
          catch (err) { out.focus(); out.select(); out.setSelectionRange(0, out.value.length); }
          clearTimeout(copyTimer);
          copy.classList.toggle('enq-done', ok);
          copyText.textContent = ok ? 'Copied' : 'Copy enquiry';
          copyNote.textContent = ok ? 'The enquiry is on your clipboard. Paste it into an email to ' + to + '.' : 'Copying is blocked in this browser. The text is selected, so you can copy it by hand.';
          if (ok) copyTimer = setTimeout(() => { copy.classList.remove('enq-done'); copyText.textContent = 'Copy enquiry'; }, 2400);
        });
      }
  }
  /* ---------- end v4 sections ---------- */

  /* ---------- hero field: a grid of dots lit by the pointer, with a slow wave of light when nobody is pointing ---------- */
  const cv = $('.bp .dots'), hero = $('.hero');
  if (cv && hero && !reduced && cv.getContext) {
    const ctx = cv.getContext('2d'); let w = 0, h = 0, pts = [], mx = -1e4, my = -1e4, raf = 0, seen = true, last = 0;
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width; h = r.height; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; const g = w < 700 ? 26 : 30;
      for (let y = g / 2; y < h; y += g) for (let x = g / 2; x < w; x += g) pts.push(x, y);
    };
    /* the resting dots are a CSS background painted once; each frame only the dots near the pointer or the wave are drawn */
    const draw = (now) => {
      raf = 0; if (seen) raf = requestAnimationFrame(draw);
      if (now - last < 32) return; last = now;
      ctx.clearRect(0, 0, w, h);
      const wave = (now / 5200 % 1) * (w + h + 500) - 250;
      for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i], y = pts[i + 1], dw = Math.abs(x + y - wave), dx = x - mx, dy = y - my;
        if (dw > 130 && (dx > 170 || dx < -170 || dy > 170 || dy < -170)) continue;
        const k = Math.max(Math.max(0, 1 - Math.hypot(dx, dy) / 170), Math.max(0, 1 - dw / 130) * .5);
        if (k < .02) continue;
        ctx.fillStyle = 'rgba(' + Math.round(74 - 43 * k) + ',' + Math.round(39 + 104 * k) + ',' + Math.round(184 + 12 * k) + ',' + (.18 + k * .72).toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(x, y, 1 + k * 2.3, 0, 6.2832); ctx.fill();
      }
    };
    const go = () => { if (!raf && seen && w) raf = requestAnimationFrame(draw); };
    const idle = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 2000 }) : (f) => setTimeout(f, 400);
    const begin = () => idle(() => { size(); go(); });
    if (document.readyState === 'complete') begin(); else addEventListener('load', begin, { once: true });
    addEventListener('resize', () => { size(); go(); });
    hero.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
    hero.addEventListener('pointerleave', () => { mx = my = -1e4; });
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { seen = en[0].isIntersecting; go(); }).observe(hero);
  }

  /* ---------- headline: the last words turn through the things we build ---------- */
  const swap = $('.hero .swap');
  if (swap && !reduced && swap.animate) {
    const words = swap.dataset.words.split('|'); let n = 0;
    setInterval(() => {
      if (document.hidden) return;
      const out = swap.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-70%)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' });
      out.onfinish = () => {
        n = (n + 1) % words.length; swap.textContent = words[n]; out.cancel();
        swap.animate([{ transform: 'translateY(70%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
      };
    }, 2600);
  }

  /* ---------- arrival: only what starts below the fold eases in, and a timer guarantees nothing stays hidden ---------- */
  if (!reduced && 'IntersectionObserver' in window) {
    const els = $$('.sec .in > *, .contact > *').filter((el) => el.getBoundingClientRect().top > innerHeight);
    els.forEach((el) => el.classList.add('rv'));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    addEventListener('beforeprint', () => els.forEach((el) => el.classList.add('in')));
    setTimeout(() => els.forEach((el) => { io.unobserve(el); el.classList.add('in'); }), 2500);
  }
})();
