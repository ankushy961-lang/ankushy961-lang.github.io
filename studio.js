/* Ankush Yadav · studio site. Small on purpose: contact address, project viewer on demand, quiet arrival motion. */
if (window.top !== window.self) { try { window.top.location = window.location; } catch (e) { document.documentElement.hidden = true; } }
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
