/* Product showcase controller + five product mockups.
   Everything here runs on local, fictional sample data. Nothing connects to any client system,
   broker, payment provider, GPS or API, and no network request is made. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
  const SB = (dark) => `<div class="ax-sb"><b>9:41</b><i class="ax-isl"></i><span class="ax-ic" aria-hidden="true"><i></i><i></i><i></i></span></div>`;
  const HOME = '<i class="ax-home" aria-hidden="true"></i>';
  const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  /* =================================================================
     01 · SRI HARI DOCS
     ================================================================= */
  const SH = {
    key: 'sh', ep: '01', name: 'Sri Hari Docs', device: 'phone', status: 'Delivered to client',
    lede: 'Truck paperwork for an agri-trading company that moves steam rice by truck. Staff photograph each document; the app reads it, scores it against open trucks and files it.',
    fine: 'Sample yard with fictional trucks, drivers and transporters. The real app shipped in May 2026 for an agri-trading client; client data never appears here.',
    screens: [
      ['trucks', 'Trucks', 'Every open truck with its paper count out of 7.', 'The yard at a glance: three open trucks, how many of their seven required documents each has, and what came in most recently. Tap a truck to open its record.'],
      ['record', 'Truck record', 'One truck, its 7 required documents.', 'Which documents a truck already has and which are still missing, visible on the day the driver is still in the yard.'],
      ['capture', 'Capture', 'One action: point the camera, press once.', 'The app detects the document type before the photo is taken. Press the shutter to capture the sample weighbridge slip.'],
      ['extract', 'Extract and verify', 'Fields read with a confidence level.', 'Printed weights read with high confidence; the handwritten driver name reads low and asks for a second look. Confirm it to continue.'],
      ['match', 'Match by score', 'The right truck chosen by agreement, with reasons.', 'Every open truck is scored against the slip: same driver +3, same transporter +2, same date +3. The reasons are shown so a clerk can overrule.'],
      ['filed', 'Filed', 'Attached to the truck, count updated.', 'The slip is filed against the chosen truck and its record moves from 4 / 7 to 5 / 7.'],
      ['review', 'Review queue', 'Duplicates wait for a person.', 'A gate pass photographed twice does not file itself. Keep both, replace or discard; routine paper never reaches this screen.'],
    ],
    html() {
      const tabs = (cur) => `<nav class="sh-tabs" aria-label="Sri Hari Docs">
        <button type="button" data-go="trucks" ${cur === 'trucks' ? 'aria-current="page"' : ''}>${icon('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>')}<span data-en="Trucks" data-hi="ट्रक">Trucks</span></button>
        <button type="button" data-go="capture" ${cur === 'capture' ? 'aria-current="page"' : ''}>${icon('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="4"/>')}<span data-en="Capture" data-hi="फ़ोटो">Capture</span></button>
        <button type="button" data-go="review" ${cur === 'review' ? 'aria-current="page"' : ''}>${icon('<path d="M4 5h16v14H4zM8 10h8M8 14h5"/>')}<span data-en="Review" data-hi="जाँच">Review</span><span class="ax-badge sh-rc">1</span></button>
      </nav>`;
      const bar = (title, back, lang) => `<div class="sh-bar">${back ? `<button class="sh-back" type="button" data-go="${back}" aria-label="Back">‹</button>` : ''}<h3>${title}</h3>${lang ? `<div class="sh-lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="hi" aria-pressed="false">हिं</button></div><span class="sh-av" aria-hidden="true">RK</span>` : ''}</div>`;
      return `<div class="ax ax-sh">${SB()}
      <section class="ax-scr" data-s="trucks" aria-label="Trucks">${bar('Sri Hari Docs', '', true)}
        <div class="sh-body">
          <div class="sh-stats"><div><b>3</b><small data-en="Open trucks" data-hi="खुले ट्रक">Open trucks</small></div><div><b class="sh-docs">13</b><small data-en="Documents" data-hi="दस्तावेज़">Documents</small></div><div><b>1</b><small data-en="Complete" data-hi="पूरे">Complete</small></div></div>
          <div class="sh-sec"><h4 data-en="Today · 14 Nov" data-hi="आज · 14 नवं">Today · 14 Nov</h4><small>Steam rice</small></div>
          <button class="sh-truck" type="button" data-go="record"><span class="row"><span class="sh-plate">UP 53 AB 1234</span><span class="sh-count"><span class="sh-n">4</span> / 7</span></span><span class="sh-bar2"><i class="sh-fill" style="--w:57%"></i></span><small>Nautanwa → factory · Mahesh P.</small></button>
          <div class="sh-truck done"><span class="row"><span class="sh-plate">UP 56 CD 5678</span><span class="sh-count">7 / 7 ✓</span></span><span class="sh-bar2"><i style="--w:100%"></i></span><small data-en="Complete · every paper filed" data-hi="पूरा · सभी कागज़ जमा">Complete · every paper filed</small></div>
          <div class="sh-truck"><span class="row"><span class="sh-plate">UP 32 EF 9012</span><span class="sh-count">2 / 7</span></span><span class="sh-bar2"><i style="--w:29%"></i></span><small>Gate pass, bilty · Ganga Roadways</small></div>
          <div class="sh-sec"><h4 data-en="Recent" data-hi="हाल ही में">Recent</h4></div>
          <div class="sh-feed"><p><i>B</i><span>Bilty<em>UP 53 AB 1234</em></span><time>2 min</time></p><p><i>G</i><span>Gate pass<em>UP 32 EF 9012</em></span><time>18 min</time></p><p><i>W</i><span>Weighbridge slip · तौल पर्ची<em>UP 56 CD 5678</em></span><time>1 h</time></p></div>
        </div>${tabs('trucks')}</section>

      <section class="ax-scr" data-s="record" aria-label="Truck record">${bar('UP 53 AB 1234', 'trucks')}
        <div class="sh-body">
          <div class="sh-hero"><div class="row"><span class="sh-plate">UP 53 AB 1234</span><span class="sh-count"><span class="sh-n">4</span> / 7</span></div><span class="sh-bar2"><i class="sh-fill" style="--w:57%"></i></span>
            <div class="sh-meta"><div><small>Load</small>Steam rice</div><div><small>Route</small>Nautanwa → factory</div><div><small>Driver</small>Mahesh P.</div><div><small>Transporter</small>Ganga Roadways</div></div></div>
          <div class="sh-sec"><h4>Required documents</h4><small><span class="sh-n">4</span> of 7</small></div>
          <div class="sh-slots">
            <div class="sh-slot ok"><i>✓</i><span>Bilty</span><em>2 min ago</em></div>
            <div class="sh-slot ok"><i>✓</i><span>Gate pass</span><em>Today 08:40</em></div>
            <div class="sh-slot sh-ws"><i>·</i><span>Weighbridge slip</span><em class="sh-wst">Missing</em></div>
            <div class="sh-slot ok"><i>2</i><span>Other required documents</span><em>2 of 4 filed</em></div>
          </div>
          <p class="sh-note">The company requires seven document types per truck; three are named here, the other four are grouped.</p>
          <button class="sh-cta" type="button" data-go="capture">Photograph the missing slip</button>
        </div></section>

      <section class="ax-scr" data-s="capture" aria-label="Capture"><div class="sh-cam">
          <div class="sh-paper" aria-hidden="true"><h5>DHARAM KANTA · WEIGHBRIDGE</h5><div class="hi">तौल पर्ची · Slip no. 4471 (sample)</div>
            <p><span>Date</span><span>08-05-2026</span></p><p><span>Vehicle</span><span>UP53AB1234</span></p><p><span>Gross</span><span>42,670 kg</span></p><p><span>Tare</span><span>14,210 kg</span></p><p><span>Net</span><span>28,460 kg</span></p><p><span>Driver</span><span class="hand">Mahesh P.</span></p><p><span>Transporter</span><span>Ganga Roadways</span></p><span class="stamp">SAMPLE<br>STAMP</span></div>
          <div class="sh-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="sh-scan" aria-hidden="true"></div>
          <p class="sh-detect" role="status">Detected: <b>Weighbridge slip</b> · 1 of 7 types</p></div>
        <div class="sh-shoot"><span>Tap to capture</span><button class="sh-shutter" type="button" data-act="shoot" aria-label="Capture document"></button><span style="text-align:right">Auto type</span></div></section>

      <section class="ax-scr" data-s="extract" aria-label="Extract and verify">${bar('Read the slip', 'capture')}
        <div class="sh-body">
          <div class="sh-thumb"><div class="mini" aria-hidden="true"></div><div><b>Weighbridge slip</b><small>Photo just now · 7 fields</small><span class="sh-type">तौल पर्ची</span></div></div>
          <div class="sh-sec"><h4>Extracted fields</h4><small class="sh-xprog">Reading…</small></div>
          <div class="sh-fields">
            <div class="sh-field pending"><small>Date</small><b>08 May 2026</b><span class="conf h">High</span></div>
            <div class="sh-field pending"><small>Gross weight</small><b>42,670 kg</b><span class="conf h">High</span></div>
            <div class="sh-field pending"><small>Tare weight</small><b>14,210 kg</b><span class="conf h">High</span></div>
            <div class="sh-field pending"><small>Net weight</small><b>28,460 kg</b><span class="conf h">High</span></div>
            <div class="sh-field pending"><small>Transporter</small><b>Ganga Roadways</b><span class="conf m">Medium</span></div>
            <div class="sh-field pending low sh-lowf"><small>Driver · handwritten</small><b class="sh-drv">Mahesh P.</b><span class="conf l sh-lowc">Low</span>
              <div class="fix"><button class="yes" type="button" data-act="confirm">Looks right</button><button type="button" data-act="edit">Edit</button></div></div>
          </div>
          <button class="sh-cta sh-tomatch" type="button" data-go="match" disabled>Confirm 1 low-confidence field first</button>
        </div></section>

      <section class="ax-scr" data-s="match" aria-label="Match by score">${bar('Which truck?', 'extract')}
        <div class="sh-body">
          <p class="sh-note">Scored against every open truck. Same driver +3 · same transporter +2 · same date +3.</p>
          <div class="sh-cands" role="radiogroup" aria-label="Candidate trucks">
            <button class="sh-cand" type="button" role="radio" aria-checked="true" data-pick="UP 53 AB 1234"><span class="radio"></span><span class="sh-plate">UP 53 AB 1234</span><span class="score">8</span><span class="why"><span class="y">driver +3</span><span class="y">transporter +2</span><span class="y">date +3</span></span></button>
            <button class="sh-cand" type="button" role="radio" aria-checked="false" data-pick="UP 32 EF 9012"><span class="radio"></span><span class="sh-plate">UP 32 EF 9012</span><span class="score">2</span><span class="why"><span>driver 0</span><span class="y">transporter +2</span><span>date 0</span></span></button>
            <button class="sh-cand" type="button" role="radio" aria-checked="false" data-pick="UP 56 CD 5678" disabled><span class="radio"></span><span class="sh-plate">UP 56 CD 5678</span><span class="score">–</span><span class="why"><span>complete · not open</span></span></button>
          </div>
          <button class="sh-cta" type="button" data-act="attach">Attach to <span class="sh-pickd">UP 53 AB 1234</span></button>
        </div></section>

      <section class="ax-scr" data-s="filed" aria-label="Filed">${bar('Filed', '')}
        <div class="sh-body">
          <div class="sh-done"><span class="sh-tick" aria-hidden="true">✓</span><h4>Filed to <span class="sh-pickd">UP 53 AB 1234</span></h4><p class="sh-filedline">Weighbridge slip · record now 5 / 7</p></div>
          <div class="sh-steps" aria-label="Completed steps"><span>Captured</span><span>Extracted</span><span>Reviewed</span><span>Matched</span><span>Filed</span></div>
          <div class="sh-slots"><div class="sh-slot ok new"><i>✓</i><span>Weighbridge slip</span><em>Just now</em></div></div>
          <button class="sh-cta" type="button" data-go="trucks">Back to trucks</button>
          <button class="sh-cta ghost" type="button" data-go="review">Open review queue</button>
        </div></section>

      <section class="ax-scr" data-s="review" aria-label="Review queue">${bar('Review', '')}
        <div class="sh-body">
          <div class="sh-dup"><div class="sh-row"><b>Possible duplicate</b></div><p class="sh-note">Gate pass for UP 32 EF 9012 looks like a copy of one filed 18 min ago. It was not filed automatically.</p>
            <div class="pair" aria-hidden="true"><div><span>Filed 18 min ago</span></div><div><span>New photo</span></div></div>
            <div class="acts"><button type="button" data-act="dup" data-v="Kept both">Keep both</button><button type="button" class="pri" data-act="dup" data-v="Replaced">Replace</button><button type="button" data-act="dup" data-v="Discarded">Discard</button></div></div>
          <div class="sh-empty" hidden><i>✓</i><b>Nothing to review</b><span class="sh-dupres"></span><span>Routine paper files itself; only odd cases wait here.</span></div>
        </div>${tabs('review')}</section>
      ${HOME}</div>`;
    },
    init(app, api) {
      const S = { n: 4, conf: false, pick: 'UP 53 AB 1234', filed: false, dup: false };
      const setN = (n) => { $$('.sh-n', app).forEach((e) => { e.textContent = n; }); $$('.sh-fill', app).forEach((e) => e.style.setProperty('--w', Math.round(n / 7 * 100) + '%')); };
      app.addEventListener('click', async (e) => {
        const lang = e.target.closest('[data-lang]');
        if (lang) { const hi = lang.dataset.lang === 'hi'; $$('[data-lang]', app).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang.dataset.lang))); $$('[data-en]', app).forEach((el) => { el.textContent = hi ? el.dataset.hi : el.dataset.en; }); api.say(hi ? 'Interface switched to Hindi' : 'Interface switched to English'); return; }
        const pick = e.target.closest('[data-pick]');
        if (pick && !pick.disabled) { $$('[data-pick]', app).forEach((b) => b.setAttribute('aria-checked', String(b === pick))); S.pick = pick.dataset.pick; $$('.sh-pickd', app).forEach((x) => { x.textContent = S.pick; }); return; }
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'shoot') {
          const cam = $('.sh-cam', app); cam.classList.add('busy'); a.disabled = true; api.say('Capturing and reading the slip');
          await wait(1100); cam.classList.remove('busy'); a.disabled = false; api.go('extract');
        } else if (act === 'confirm' || act === 'edit') {
          if (act === 'edit') { $('.sh-drv', app).textContent = 'Mahesh Prasad'; }
          const f = $('.sh-lowf', app); f.classList.remove('low'); $('.sh-lowc', app).className = 'conf h sh-lowc'; $('.sh-lowc', app).textContent = act === 'edit' ? 'Edited' : 'Confirmed'; $('.fix', f).remove();
          S.conf = true; const b = $('.sh-tomatch', app); b.disabled = false; b.textContent = 'Find the truck'; api.say('Driver name confirmed. Ready to match.');
        } else if (act === 'attach') {
          if (S.pick === 'UP 53 AB 1234' && !S.filed) { S.filed = true; S.n = 5; setN(5); const ws = $('.sh-ws', app); ws.classList.add('ok'); $('i', ws).textContent = '✓'; $('.sh-wst', ws).textContent = 'Just now'; $('.sh-docs', app).textContent = '14'; }
          $('.sh-filedline', app).textContent = S.pick === 'UP 53 AB 1234' ? 'Weighbridge slip · record now 5 / 7' : 'Weighbridge slip · attached by clerk choice';
          api.go('filed');
        } else if (act === 'dup') {
          $('.sh-dup', app).hidden = true; const em = $('.sh-empty', app); em.hidden = false; $('.sh-dupres', app).textContent = `${a.dataset.v}: gate pass, UP 32 EF 9012.`;
          $$('.sh-rc', app).forEach((x) => x.remove()); api.say(`${a.dataset.v}. Review queue is empty.`);
        }
      });
    },
    enter(id, app) {
      if (id === 'extract') {
        const fs = $$('.sh-field.pending', app); if (!fs.length) return;
        (async () => { for (const f of fs) { await wait(170); f.classList.remove('pending'); } const p = $('.sh-xprog', app); if (p) p.textContent = '7 fields · 1 needs a look'; })();
      }
    },
  };

  /* =================================================================
     02 · MIKAZUKI
     ================================================================= */
  const WORLDS = [['RONIN', '#39FF14', 'Blade Dojo'], ['TAIYO', '#FF4D4D', 'Sun Engine'], ['KUSA', '#4ADE80', 'Life Pulse'], ['SHIORI', '#8B7CFF', 'Void Library'], ['ARASHI', '#38BDF8', 'Storm Matrix'], ['HONOO', '#FFB347', 'Velvet Flame'], ['YUME', '#F472F6', 'Dream Forge'], ['KIKAI', '#22D3EE', 'Steel Reactor'], ['UMI', '#5DADE2', 'Ocean Core'], ['YAMI', '#A78BFA', 'Ascension Void']];
  const MEMS = [
    ['Usual weekday alarm is 6:00', 'Routine · saved 3 Oct', ['alarm', 'usual', 'wake', 'morning']],
    ['Weekend alarm: 7:30, no snooze', 'Routine · saved 3 Oct', ['alarm', 'weekend']],
    ['Call the mandi before 6 pm on market days', 'Work · saved 21 Oct', ['mandi', 'call', 'market']],
    ['Mountain getaway planned for 12–15 Dec, book the bus by 1 Dec', 'Plans · saved 2 Nov', ['trip', 'travel', 'holiday', 'bus', 'getaway']],
    ['Prefers replies in Hindi after 9 pm', 'Preference · saved 9 Sep', ['hindi', 'language', 'night']],
    ['Gym on Tuesday and Thursday evenings', 'Routine · saved 14 Sep', ['gym', 'evening']],
    ['Brother Rohit\'s birthday is 22 Nov', 'People · saved 30 Aug', ['birthday', 'rohit', 'brother']],
    ['Keep the phone silent during prayers at 7 pm', 'Preference · saved 5 Oct', ['silent', 'prayer', 'quiet']],
  ];
  const NEAR = { 'set the usual alarm': [0.91, 0.74, 0.12, 0.08, 0.10, 0.31, 0.05, 0.22], 'what did I say about the trip': [0.06, 0.09, 0.14, 0.88, 0.05, 0.07, 0.18, 0.04], 'remind me about the market call': [0.18, 0.05, 0.86, 0.11, 0.09, 0.13, 0.07, 0.10] };
  const MZ = {
    key: 'mz', ep: '02', name: 'Mikazuki', device: 'phone', status: 'Delivered to client',
    lede: 'A voice operating system for one person on Android: wake word on the phone, a planner with three brains, long-term vector memory, and actions carried out on the phone itself.',
    fine: 'Sample memories and actions are fictional. In the real app memory lives in SQLite with sqlite-vec on the device; here, recall scores are illustrative.',
    screens: [
      ['talk', 'Talk', 'Wake → listen → understand → recall → plan → act.', 'Tap the crescent to simulate the wake word. Watch each stage: what was heard, the memories recalled, the brain chosen, and the steps the accessibility service performs.'],
      ['memory', 'Memory', 'Recall by meaning, not keywords.', 'Pick an example question. The nearest memories light up by meaning, even when the words differ, the way the vector memory recalls on the phone.'],
      ['brains', 'Brains', 'Cloud or on-device, picked per request.', 'Three brains: two in the cloud, one on the device. In Auto the planner picks, so a simple request never leaves the phone.'],
      ['actions', 'Actions', 'What was done, on which app, by which brain.', 'A visible history of every action the assistant performed on the phone, so the user can check what was done.'],
      ['worlds', 'Worlds and voice', 'Personal theme, voice and wake settings.', 'Crew worlds re-colour the whole OS. Voice output runs at 24 kHz; wake-word sensitivity and spoken replies are adjustable.'],
    ],
    html() {
      const tabs = (cur) => `<nav class="mz-tabs" aria-label="Mikazuki">${[['talk', 'Talk'], ['memory', 'Memory'], ['brains', 'Brains'], ['actions', 'Actions'], ['worlds', 'Worlds']].map(([k, l]) => `<button type="button" data-go="${k}" ${cur === k ? 'aria-current="page"' : ''}><i></i>${l}</button>`).join('')}</nav>`;
      const head = (sub) => `<div class="mz-head"><b>三日月</b><span>${sub}</span></div>`;
      const mems = MEMS.map((m, i) => `<div class="mz-mitem" data-i="${i}"><p>${m[0]}</p><small>${m[1]}</small><span class="s"></span></div>`).join('');
      return `<div class="ax ax-mz">${SB()}
      <section class="ax-scr" data-s="talk" aria-label="Talk">${head('<span class="mz-world">RONIN</span> · ON DEVICE')}
        <div class="mz-body">
          <div class="mz-core"><span class="mz-ring" aria-hidden="true"></span><span class="mz-ring r2" aria-hidden="true"></span><button class="mz-moon" type="button" data-act="wake" aria-label="Simulate the wake word"></button></div>
          <p class="mz-state" role="status">Tap the crescent</p>
          <div class="mz-wave" aria-hidden="true">${'<i></i>'.repeat(17)}</div>
          <p class="mz-say"><em>Say “Mikazuki”, then your request.</em></p>
          <ol class="mz-pipe" aria-label="Stages">
            <li data-p="0"><i></i><span>Wake word heard on device</span><code></code></li>
            <li data-p="1"><i></i><span>Listening</span><code></code></li>
            <li data-p="2"><i></i><span>Understanding</span><code></code></li>
            <li data-p="3"><i></i><span>Recalling memory</span><code></code></li>
            <li data-p="4"><i></i><span>Planning the action</span><code></code></li>
            <li data-p="5"><i></i><span>Acting on the phone</span><code></code></li>
            <li data-p="6"><i></i><span>Done, replied in voice</span><code></code></li>
          </ol>
          <div class="mz-card mz-recall" hidden><h5>Recalled · nearest by meaning</h5>
            <div class="mz-mem"><span>Usual weekday alarm is 6:00</span><b>0.91</b><span class="mz-bar"><i style="--s:91%"></i></span></div>
            <div class="mz-mem"><span>Weekend alarm: 7:30, no snooze</span><b>0.74</b><span class="mz-bar"><i style="--s:74%"></i></span></div></div>
          <div class="mz-card mz-steps" hidden><h5>Accessibility service · on this phone</h5><ol class="mz-pipe mz-exec"></ol></div>
        </div>${tabs('talk')}</section>

      <section class="ax-scr" data-s="memory" aria-label="Memory">${head('MEMORY · 128')}
        <div class="mz-body">
          <label class="mz-search"><span aria-hidden="true">⌕</span><span class="ax-sr">Search memory</span><input type="search" class="mz-q" placeholder="Ask your memory…" autocomplete="off"></label>
          <div class="mz-chips" role="group" aria-label="Example questions"><button type="button" data-q="set the usual alarm" aria-pressed="false">set the usual alarm</button><button type="button" data-q="what did I say about the trip" aria-pressed="false">what did I say about the trip</button><button type="button" data-q="remind me about the market call" aria-pressed="false">remind me about the market call</button></div>
          <p class="mz-hint" style="margin:0;font-size:12.5px;color:var(--mz-mut)">Showing 8 of 128 sample memories. Stored on the phone, never on a server.</p>
          <div class="mz-mlist">${mems}</div>
        </div>${tabs('memory')}</section>

      <section class="ax-scr" data-s="brains" aria-label="Brains">${head('PLANNER')}
        <div class="mz-body">
          <div class="mz-chips" role="radiogroup" aria-label="Brain mode"><button type="button" role="radio" data-mode="auto" aria-checked="true" aria-pressed="true">Auto · planner picks</button><button type="button" role="radio" data-mode="device" aria-checked="false" aria-pressed="false">Prefer on-device</button><button type="button" role="radio" data-mode="cloud" aria-checked="false" aria-pressed="false">Prefer cloud</button></div>
          <div role="radiogroup" aria-label="Active brain" style="display:grid;gap:8px">
            <button class="mz-brain" type="button" role="radio" aria-checked="true" data-b="device"><span class="ico" aria-hidden="true">◐</span><b>On-device brain</b><small>No network needed · simple requests</small><span class="tag">ACTIVE</span></button>
            <button class="mz-brain" type="button" role="radio" aria-checked="false" data-b="c1"><span class="ico" aria-hidden="true">☁</span><b>Cloud brain 1</b><small>Needs a connection · longer plans</small><span class="tag">STANDBY</span></button>
            <button class="mz-brain" type="button" role="radio" aria-checked="false" data-b="c2"><span class="ico" aria-hidden="true">☁</span><b>Cloud brain 2</b><small>Needs a connection · fallback</small><span class="tag">STANDBY</span></button>
          </div>
          <div class="mz-card"><h5>Why this brain</h5><p class="mz-why" style="margin:0;font-size:13.5px">“Set the usual alarm” is a short, known action. The on-device brain plans it without leaving the phone.</p></div>
        </div>${tabs('brains')}</section>

      <section class="ax-scr" data-s="actions" aria-label="Actions">${head('ACTION HISTORY')}
        <div class="mz-body mz-alist">
          <div class="mz-act"><i aria-hidden="true">✆</i><p>Called “Mandi office”</p><small>Phone · cloud brain 1</small><time>Yesterday 17:42</time></div>
          <div class="mz-act"><i aria-hidden="true">✉</i><p>Sent “Running 10 min late” to Rohit</p><small>Messages · on-device</small><time>Yesterday 09:15</time></div>
          <div class="mz-act"><i aria-hidden="true">🔕</i><p>Silent mode on for 30 min</p><small>Settings · on-device</small><time>Tue 19:00</time></div>
          <div class="mz-act"><i aria-hidden="true">★</i><p>Saved “Mountain getaway 12–15 Dec”</p><small>Memory · cloud brain 2</small><time>2 Nov</time></div>
        </div>${tabs('actions')}</section>

      <section class="ax-scr" data-s="worlds" aria-label="Worlds and voice">${head('PERSONALISE')}
        <div class="mz-body">
          <div class="mz-worlds" role="radiogroup" aria-label="Crew world">${WORLDS.map((w, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-w="${i}" style="--c:${w[1]}"><i></i><span>${w[0]}<small>${w[2]}</small></span></button>`).join('')}</div>
          <div class="mz-set"><label for="mz-sens">Wake-word sensitivity</label><b class="mz-sv" style="font-family:var(--font-m);font-size:12px;color:var(--w)">Medium</b><input id="mz-sens" type="range" min="1" max="3" value="2"><small>Higher hears you from further away, with more false wakes.</small></div>
          <div class="mz-set"><p id="mz-spk">Speak replies</p><button class="mz-sw" type="button" role="switch" aria-checked="true" aria-labelledby="mz-spk"></button><small>Voice output at 24 kHz.</small></div>
        </div>${tabs('worlds')}</section>
      ${HOME}</div>`;
    },
    init(app, api) {
      let busy = false;
      const pipe = $$('.mz-talk-none', app);
      const setP = (i, code) => { $$('.mz-pipe:not(.mz-exec) li', app).forEach((li) => { const k = +li.dataset.p; li.className = k < i ? 'ok' : k === i ? 'now' : ''; }); if (code) { const c = $(`.mz-pipe:not(.mz-exec) li[data-p="${i}"] code`, app); if (c) c.textContent = code; } };
      async function run() {
        if (busy) return; busy = true;
        const st = $('.mz-state', app), say = $('.mz-say', app); $('.mz-recall', app).hidden = true; $('.mz-steps', app).hidden = true; $('.mz-exec', app).innerHTML = '';
        $$('.mz-pipe code', app).forEach((c) => { c.textContent = ''; });
        app.classList.add('live'); setP(0, 'on device'); st.textContent = 'Wake word'; say.innerHTML = '<em>“Mikazuki”</em>'; await wait(700);
        app.classList.add('listening'); setP(1); st.textContent = 'Listening'; const txt = 'Set the usual alarm.'; say.textContent = '';
        for (let i = 1; i <= txt.length; i++) { say.textContent = '“' + txt.slice(0, i) + (i === txt.length ? '”' : ''); await wait(45); }
        app.classList.remove('listening'); setP(2, 'alarm.set'); st.textContent = 'Understanding'; await wait(600);
        setP(3, '2 of 128'); st.textContent = 'Recalling'; $('.mz-recall', app).hidden = false; await wait(800);
        setP(4, 'on-device brain'); st.textContent = 'Planning'; await wait(700);
        setP(5); st.textContent = 'Acting'; const ex = $('.mz-exec', app); $('.mz-steps', app).hidden = false;
        for (const s of ['Open Clock', 'Tap “Add alarm”', 'Set 06:00', 'Repeat Mon–Fri', 'Save']) { const li = document.createElement('li'); li.className = 'now'; li.innerHTML = '<i></i><span></span><code></code>'; li.querySelector('span').textContent = s; ex.appendChild(li); await wait(380); li.className = 'ok'; }
        setP(7); $$('.mz-pipe:not(.mz-exec) li', app).forEach((li) => { li.className = 'ok'; }); $('.mz-pipe li[data-p="6"] code', app).textContent = '24 kHz';
        st.textContent = 'Done'; say.innerHTML = 'Done. Weekday alarm set for 6:00.'; app.classList.remove('live'); api.say('Done. Weekday alarm set for 6:00.');
        const list = $('.mz-alist', app); if (list && !$('.mz-act.new', list)) { const a = document.createElement('div'); a.className = 'mz-act new'; a.innerHTML = '<i aria-hidden="true">⏰</i><p>Set weekday alarm 06:00</p><small>Clock · on-device</small><time>Just now</time>'; list.prepend(a); }
        busy = false;
      }
      function query(q) {
        const sc = NEAR[q]; const items = $$('.mz-mitem', app);
        if (!sc) { const words = q.toLowerCase().split(/\W+/).filter(Boolean); items.forEach((it, i) => { const hit = words.some((w) => MEMS[i][2].some((k) => k.startsWith(w)) || MEMS[i][0].toLowerCase().includes(w)); it.className = 'mz-mitem' + (q ? (hit ? ' near' : ' far') : ''); $('.s', it).textContent = ''; }); return; }
        const order = sc.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]); const list = $('.mz-mlist', app);
        order.forEach(([s, i]) => { const it = items[i]; it.className = 'mz-mitem' + (s > .6 ? ' near' : s < .2 ? ' far' : ''); $('.s', it).textContent = s.toFixed(2); list.appendChild(it); });
        api.say(`Nearest memory: ${MEMS[order[0][1]][0]}`);
      }
      app.addEventListener('click', (e) => {
        const t = e.target;
        if (t.closest('[data-act="wake"]')) { run(); return; }
        const q = t.closest('[data-q]'); if (q) { $$('[data-q]', app).forEach((b) => b.setAttribute('aria-pressed', String(b === q))); $('.mz-q', app).value = q.dataset.q; query(q.dataset.q); return; }
        const m = t.closest('[data-mode]'); if (m) { $$('[data-mode]', app).forEach((b) => { b.setAttribute('aria-checked', String(b === m)); b.setAttribute('aria-pressed', String(b === m)); }); const pickB = m.dataset.mode === 'cloud' ? 'c1' : 'device'; $$('.mz-brain', app).forEach((b) => { const on = b.dataset.b === pickB; b.setAttribute('aria-checked', String(on)); $('.tag', b).textContent = on ? 'ACTIVE' : 'STANDBY'; }); $('.mz-why', app).textContent = m.dataset.mode === 'cloud' ? 'Preferring the cloud: longer, multi-step plans go to cloud brain 1, with brain 2 as fallback. Needs a connection.' : m.dataset.mode === 'device' ? 'Preferring the device: requests stay on the phone and work without a network.' : '“Set the usual alarm” is a short, known action. The on-device brain plans it without leaving the phone.'; return; }
        const b = t.closest('.mz-brain'); if (b) { $$('.mz-brain', app).forEach((x) => { const on = x === b; x.setAttribute('aria-checked', String(on)); $('.tag', x).textContent = on ? 'ACTIVE' : 'STANDBY'; }); return; }
        const w = t.closest('[data-w]'); if (w) { const W = WORLDS[+w.dataset.w]; $$('[data-w]', app).forEach((x) => x.setAttribute('aria-checked', String(x === w))); app.style.setProperty('--w', W[1]); $$('.mz-world', app).forEach((x) => { x.textContent = W[0]; }); api.say(`${W[2]} loaded`); return; }
        const sw = t.closest('.mz-sw'); if (sw) { sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true')); }
      });
      const qi = $('.mz-q', app); qi.addEventListener('input', () => { $$('[data-q]', app).forEach((b) => b.setAttribute('aria-pressed', 'false')); const v = qi.value.trim(); if (NEAR[v]) query(v); else query(v); });
      const sens = $('#mz-sens', app); sens.addEventListener('input', () => { $('.mz-sv', app).textContent = ['Low', 'Medium', 'High'][sens.value - 1]; });
      void pipe;
    },
  };

  /* =================================================================
     03 · STRIKEDECK  (paper trading only; illustrative sample data)
     ================================================================= */
  const CHAIN = [[23900, 412.0, 31.4, 38, 72], [24000, 268.5, 58.2, 55, 88], [24100, 171.2, 84.6, 70, 69], [24150, 142.5, 96.8, 78, 64], [24200, 112.4, 121.9, 92, 51], [24300, 71.2, 176.0, 81, 41], [24400, 29.9, 290.3, 66, 27]];
  const SD = {
    key: 'sd', ep: '03', name: 'Strikedeck', device: 'laptop', status: 'Delivered to client · trades live',
    lede: 'An options trading desk for Indian index options, delivered to a client and trading live. Three engines must agree before a signal exists, and every order passes a safety gate. This website demo is simulated.',
    fine: 'Website demo only: simulated data, no broker connection, no orders sent. The delivered desk trades live for its client; nothing here is investment advice, a performance claim or an offer of any service.',
    screens: [
      ['desk', 'Desk', 'Watchlist, chain stats, gate and consensus.', 'The overview an operator keeps open: an illustrative watchlist, PCR and max pain, the mode ladder and the current consensus.'],
      ['chain', 'Option chain', 'Strikes with OI bars; pick a contract.', 'Call and put open interest around the at-the-money strike. Pick a CE or PE price to load it into a paper order ticket.'],
      ['engines', 'Engines', 'Voter, trap filter, regime must agree.', 'The three documented engines judge the same market state. A signal exists only when they agree; disagreement shows WAITING.'],
      ['order', 'Order ticket', 'Entry, stop, target, gate checks.', 'An order ticket: entry, stop-loss and target in points, plus every safety-gate check. In this demo the fill is simulated and nothing is sent.'],
      ['positions', 'Positions', 'Open and closed demo trades.', 'Simulated positions and illustrative sample rows, in points. Not a record of returns or performance.'],
      ['gate', 'Safety gate', 'Promotion ladder, loss cap, kill switch.', 'PAPER → LIMITED LIVE → LIVE had to be earned before real money. Try the kill switch: one tap enters SAFE_MODE; leaving it needs an operator token.'],
      ['log', 'Audit log', 'Every signal, check and fill, timestamped.', 'An append-only record of what the desk did and why, including your actions in this demo.'],
    ],
    html() {
      const nav = [['desk', 'Desk'], ['chain', 'Option chain'], ['engines', 'Engines'], ['order', 'Order ticket'], ['positions', 'Positions'], ['gate', 'Safety gate'], ['log', 'Audit log']];
      const rows = CHAIN.map(([k, ce, pe, coi, poi]) => `<tr class="${k === 24150 ? 'atm' : ''}"><td><span class="sd-oi ce"><i style="--w:${coi}%"></i></span></td><td><button class="sd-pick" type="button" data-pick="${k} CE" data-px="${ce}" aria-pressed="false">${ce.toFixed(1)}</button></td><td class="k">${k.toLocaleString('en-IN')}</td><td><button class="sd-pick" type="button" data-pick="${k} PE" data-px="${pe}" aria-pressed="false">${pe.toFixed(1)}</button></td><td><span class="sd-oi pe"><i style="--w:${poi}%"></i></span></td></tr>`).join('');
      return `<div class="ax ax-sd">
        <div class="sd-paper" role="note">WEBSITE DEMO — SIMULATED DATA — NO ORDERS ARE SENT</div>
        <div class="sd-top"><span class="sd-logo">SD</span><span class="sd-name">Strikedeck</span>
          <div class="sd-syms" role="group" aria-label="Symbol">${['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'SENSEX'].map((s, i) => `<button type="button" data-sym="${s}" aria-pressed="${i === 0}">${s}</button>`).join('')}</div>
          <span class="sd-mode">MODE <b class="sd-modev">LIVE</b></span></div>
        <div class="sd-wrap"><nav class="sd-side" aria-label="Strikedeck">${nav.map(([k, l], i) => `<button type="button" data-go="${k}"><i></i>${l}</button>${i === 4 ? '<span class="sep"></span>' : ''}`).join('')}<button class="kill" type="button" data-act="kill">Kill switch</button></nav>
        <div class="sd-main">

        <section class="ax-scr" data-s="desk" aria-label="Desk">
          <div class="sd-safe-note">SAFE_MODE: pending signals cancelled, no new paper orders. Exit needs an operator token.</div>
          <div class="sd-h"><h4><span class="sd-symn">NIFTY</span> desk</h4><small>Illustrative snapshot · 14 Nov · 11:42 IST</small></div>
          <div class="sd-grid sd-g4">
            <div class="sd-card"><small>Spot</small><div class="v sd-spot">24,154.40</div><small class="sd-up" style="text-transform:none;letter-spacing:0">▲ 101.6 · 0.42%</small></div>
            <div class="sd-card"><small>PCR</small><div class="v">0.84</div><div class="sd-meter"><i style="--w:46%"></i></div></div>
            <div class="sd-card"><small>Max pain</small><div class="v">24,200</div><small style="text-transform:none;letter-spacing:0">46 pts above spot</small></div>
            <div class="sd-card"><small>Consensus</small><div class="v sd-consv sd-c">WAITING</div><small style="text-transform:none;letter-spacing:0" class="sd-conss">Engines not yet agreed</small></div>
          </div>
          <div class="sd-grid sd-g2">
            <div class="sd-card"><small>Intraday · illustrative</small><svg class="sd-spark" viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sdg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00F5D4" stop-opacity=".35"/><stop offset="1" stop-color="#00F5D4" stop-opacity="0"/></linearGradient></defs><path d="M0 84 L30 80 L60 86 L90 70 L120 74 L150 60 L180 66 L210 50 L240 56 L270 40 L300 46 L330 30 L360 36 L400 22 L400 110 L0 110Z" fill="url(#sdg)"/><path d="M0 84 L30 80 L60 86 L90 70 L120 74 L150 60 L180 66 L210 50 L240 56 L270 40 L300 46 L330 30 L360 36 L400 22" fill="none" stroke="#00F5D4" stroke-width="2"/></svg></div>
            <div class="sd-card"><small>Safety gate</small><div class="v"><span class="sd-mode2">LIVE</span></div><div style="margin-top:6px;font-family:var(--font-m);font-size:12px">Promoted after <b>50 / 50</b> paper trades at ≥45% win rate</div><div class="sd-meter"><i style="--w:100%;--c:#34D399"></i></div><div style="margin-top:8px;font-family:var(--font-m);font-size:12px">Daily loss cap used <b class="sd-capv">36%</b></div><div class="sd-meter"><i class="sd-capbar" style="--w:36%;--c:#F87171"></i></div></div>
          </div>
          <div class="sd-card sd-hide-s"><small>Watchlist · illustrative</small><table class="sd-t"><thead><tr><th>Symbol</th><th>Last</th><th>Change</th><th>PCR</th></tr></thead><tbody>
            <tr><td>NIFTY</td><td>24,154.40</td><td class="sd-up">+0.42%</td><td>0.84</td></tr><tr><td>BANKNIFTY</td><td>51,836.25</td><td class="sd-dn">−0.18%</td><td>0.97</td></tr><tr><td>FINNIFTY</td><td>23,402.10</td><td class="sd-up">+0.21%</td><td>0.91</td></tr><tr><td>SENSEX</td><td>79,512.66</td><td class="sd-up">+0.37%</td><td>0.88</td></tr></tbody></table></div>
        </section>

        <section class="ax-scr" data-s="chain" aria-label="Option chain">
          <div class="sd-h"><h4>Option chain · NIFTY · weekly</h4><small>Illustrative · ATM 24,150 highlighted</small></div>
          <div class="sd-card" style="padding:4px 6px"><table class="sd-t"><thead><tr><th>CE OI</th><th>CE LTP</th><th style="text-align:center">Strike</th><th>PE LTP</th><th>PE OI</th></tr></thead><tbody>${rows}</tbody></table></div>
          <div class="sd-h"><small class="sd-picked">Pick a CE or PE price to load a paper ticket.</small><button class="sd-btn pri sd-toorder" type="button" data-go="order" disabled>Open paper ticket</button></div>
        </section>

        <section class="ax-scr" data-s="engines" aria-label="Engines">
          <div class="sd-h"><h4>Engines</h4><small>Three engines, one market state</small></div>
          <div class="sd-grid sd-g3">
            <div class="sd-card sd-eng"><div class="head"><b>Voter</b><span class="sd-verdict e1">—</span></div><p>Weighs the setup on the current chain and price.</p></div>
            <div class="sd-card sd-eng"><div class="head"><b>Trap filter</b><span class="sd-verdict e2">—</span></div><p>Looks for setups likely to reverse.</p></div>
            <div class="sd-card sd-eng"><div class="head"><b>Regime</b><span class="sd-verdict e3">—</span></div><p>Judges what kind of market the day is.</p></div>
          </div>
          <div class="sd-cons"><div><small class="sd-ill">CONSENSUS</small><br><b class="sd-consb wait">WAITING</b></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="sd-btn" type="button" data-act="eval" data-v="agree">Evaluate sample setup</button><button class="sd-btn" type="button" data-act="eval" data-v="trap">Show a disagreement</button></div></div>
          <p class="sd-ill">Only a consensus signal moves on to the safety gate. Disagreement is a result, not an error.</p>
        </section>

        <section class="ax-scr" data-s="order" aria-label="Paper order">
          <div class="sd-safe-note">SAFE_MODE is on. The gate rejects new paper orders.</div>
          <div class="sd-h"><h4>Order ticket</h4><small>Website demo · simulated fill · nothing is sent</small></div>
          <div class="sd-ticket">
            <div class="sd-card"><div class="sd-fields">
              <label>Contract<output class="sd-ct">NIFTY 24,150 CE</output></label><label>Side<output>BUY</output></label>
              <label>Lots<span class="sd-lots"><button type="button" data-act="lots" data-d="-1" aria-label="Fewer lots">−</button><span class="sd-lotv">1</span><button type="button" data-act="lots" data-d="1" aria-label="More lots">+</button></span></label><label>Entry<output class="sd-en">142.50</output></label>
              <label>Stop-loss<output class="sd-sl">128.00</output></label><label>Target<output class="sd-tg">171.00</output></label>
              <label>Risk to stop<output class="sd-rk">14.50 pts</output></label><label>Reward : risk<output class="sd-rr">1.97 : 1</output></label>
            </div></div>
            <div class="sd-card" style="display:grid;gap:8px;align-content:start"><small>Safety gate checks</small>
              <ul class="sd-checks"><li class="ok sd-c1"><span>Engines in consensus</span><b>PASS</b></li><li class="ok"><span>Mode allows orders</span><b>PASS</b></li><li class="ok sd-c3"><span>Daily loss cap headroom</span><b>PASS</b></li><li class="ok sd-c4"><span>Kill switch off</span><b>PASS</b></li></ul>
              <button class="sd-btn pri sd-place" type="button" data-act="place">Place order (demo)</button>
              <div class="sd-status" role="status">Not placed yet.</div></div>
          </div>
        </section>

        <section class="ax-scr" data-s="positions" aria-label="Paper positions">
          <div class="sd-h"><h4>Positions</h4><small>Website demo · simulated · points</small></div>
          <div class="sd-card"><small>Open</small><table class="sd-t"><thead><tr><th>Contract</th><th>Lots</th><th>Entry</th><th>LTP</th><th>P&amp;L (pts)</th></tr></thead><tbody class="sd-open"><tr class="sd-none"><td colspan="5" style="text-align:left;color:var(--sd-mut)">No open demo positions. Place one from the ticket.</td></tr></tbody></table></div>
          <div class="sd-card"><small>Closed · illustrative sample</small><table class="sd-t"><thead><tr><th>Contract</th><th>Exit</th><th>P&amp;L (pts)</th></tr></thead><tbody>
            <tr><td>NIFTY 24,100 CE</td><td>Target</td><td class="sd-up">+18.4</td></tr><tr><td>NIFTY 24,200 PE</td><td>Stop</td><td class="sd-dn">−11.0</td></tr><tr><td>BANKNIFTY 51,800 CE</td><td>Target</td><td class="sd-up">+42.5</td></tr><tr><td>NIFTY 24,050 PE</td><td>Time exit</td><td class="sd-dn">−3.2</td></tr></tbody></table></div>
          <p class="sd-ill">Illustrative sample rows. Not a record of returns or performance.</p>
        </section>

        <section class="ax-scr" data-s="gate" aria-label="Safety gate">
          <div class="sd-safe-note">SAFE_MODE: pending signals cancelled. Exit needs an operator token.</div>
          <div class="sd-h"><h4>Safety gate</h4><small>One checkpoint for every order</small></div>
          <div class="sd-ladder">
            <div class="sd-rung"><b>PAPER ✓</b><p>Signals sized and filled against prices; no order sent. Earned: 50 trades at ≥45% win rate.</p></div>
            <div class="sd-rung"><b>LIMITED LIVE ✓</b><p>The first mode in which real orders leave the desk.</p></div>
            <div class="sd-rung now"><b>LIVE</b><p>Unlocked with an operator token on top of the record. The client's desk runs here.</p></div>
          </div>
          <div class="sd-grid sd-g2">
            <div class="sd-card"><small>Daily loss cap</small><div class="v"><span class="sd-capv">36%</span> used</div><div class="sd-meter"><i class="sd-capbar" style="--w:36%;--c:#F87171"></i></div><p class="sd-ill" style="margin:8px 0 0">At 100% the desk stops taking new positions for the session, in every mode.</p></div>
            <div class="sd-card" style="display:grid;gap:10px"><small>Kill switch</small><button class="sd-kill-big" type="button" data-act="kill">ENGAGE KILL SWITCH</button><div class="sd-status sd-safest" role="status">Desk running (demo).</div><button class="sd-btn" type="button" data-act="exitsafe" disabled title="Operator token required">Exit SAFE_MODE · operator token required</button><button class="sd-btn" type="button" data-act="reset">Reset demo</button></div>
          </div>
        </section>

        <section class="ax-scr" data-s="log" aria-label="Audit log">
          <div class="sd-h"><h4>Audit log</h4><small>Append-only · this session</small></div>
          <ol class="sd-log">
            <li><time>11:40:02</time><b class="sig">STREAM</b><span>NIFTY chain refreshed (illustrative)</span></li>
            <li><time>11:41:17</time><b class="gate">GATE</b><span>Loss cap check · 36% used · pass</span></li>
            <li><time>11:41:50</time><b class="sig">ENGINES</b><span>Voter BUY CE · trap filter flag · consensus WAITING</span></li>
          </ol>
        </section>

        </div></div></div>`;
    },
    init(app, api) {
      const S = { ct: 'NIFTY 24,150 CE', px: 142.5, lots: 1, consensus: false, safe: false, placed: 0 };
      const log = (cls, tag, txt) => { const ol = $('.sd-log', app); const li = document.createElement('li'); const d = new Date(); li.innerHTML = `<time>${d.toTimeString().slice(0, 8)}</time><b class="${cls}">${tag}</b><span></span>`; li.querySelector('span').textContent = txt; ol.appendChild(li); };
      const fmt = (n) => n.toFixed(2);
      function ticket() { const sl = +(S.px * 0.898).toFixed(2), tg = +(S.px * 1.2).toFixed(2); $('.sd-ct', app).textContent = S.ct; $('.sd-en', app).textContent = fmt(S.px); $('.sd-sl', app).textContent = fmt(sl); $('.sd-tg', app).textContent = fmt(tg); $('.sd-rk', app).textContent = fmt(S.px - sl) + ' pts × ' + S.lots + ' lot' + (S.lots > 1 ? 's' : ''); $('.sd-rr', app).textContent = ((tg - S.px) / (S.px - sl)).toFixed(2) + ' : 1'; checks(); }
      function checks() {
        const c1 = $('.sd-c1', app); c1.className = S.consensus ? 'ok sd-c1' : 'no sd-c1'; c1.lastElementChild.textContent = S.consensus ? 'PASS' : 'WAIT';
        const c4 = $('.sd-c4', app); c4.className = S.safe ? 'no sd-c4' : 'ok sd-c4'; c4.lastElementChild.textContent = S.safe ? 'BLOCK' : 'PASS';
        $('.sd-place', app).disabled = S.safe;
      }
      function setCons(on, trap) {
        S.consensus = on; $('.e1', app).textContent = 'BUY CE'; $('.e1', app).className = 'sd-verdict y e1';
        $('.e2', app).textContent = trap ? 'TRAP RISK' : 'NO TRAP'; $('.e2', app).className = 'sd-verdict ' + (trap ? 'n' : 'y') + ' e2';
        $('.e3', app).textContent = 'TRENDING'; $('.e3', app).className = 'sd-verdict y e3';
        const b = $('.sd-consb', app); b.textContent = on ? 'AGREE · BUY 24,150 CE' : 'WAITING'; b.className = 'sd-consb ' + (on ? 'go' : 'wait');
        $('.sd-consv', app).textContent = on ? 'AGREE' : 'WAITING'; $('.sd-conss', app).textContent = on ? 'BUY 24,150 CE' : 'Trap filter disagrees';
        log('sig', 'ENGINES', on ? 'Voter BUY CE · no trap · trending · consensus AGREE' : 'Voter BUY CE · trap filter flag · consensus WAITING'); checks();
        api.say(on ? 'Consensus reached: buy 24,150 CE' : 'No consensus: trap filter disagrees');
      }
      function setSafe(on) {
        S.safe = on; app.classList.toggle('safe', on); $$('.sd-modev, .sd-mode2', app).forEach((x) => { x.textContent = on ? 'SAFE_MODE' : 'LIVE'; });
        $('.sd-safest', app).textContent = on ? 'SAFE_MODE engaged. Pending signals cancelled.' : 'Desk running (demo).';
        $$('[data-act="kill"]', app).forEach((b) => { b.disabled = on; });
        if (on) { log('safe', 'KILL', 'Kill switch → SAFE_MODE · pending signals cancelled'); api.say('Kill switch engaged. Safe mode on.'); }
        checks();
      }
      app.addEventListener('click', async (e) => {
        const t = e.target;
        const sym = t.closest('[data-sym]'); if (sym) { $$('[data-sym]', app).forEach((b) => b.setAttribute('aria-pressed', String(b === sym))); $('.sd-symn', app).textContent = sym.dataset.sym; api.say(`${sym.dataset.sym} selected. Snapshot values stay illustrative.`); return; }
        const pk = t.closest('[data-pick]'); if (pk) { $$('[data-pick]', app).forEach((b) => b.setAttribute('aria-pressed', String(b === pk))); S.ct = 'NIFTY ' + pk.dataset.pick.replace(/(\d+)/, (m) => (+m).toLocaleString('en-IN')); S.px = +pk.dataset.px; $('.sd-picked', app).textContent = `Selected ${S.ct} at ${fmt(S.px)} (illustrative).`; $('.sd-toorder', app).disabled = false; ticket(); return; }
        const a = t.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'eval') setCons(a.dataset.v === 'agree', a.dataset.v === 'trap');
        else if (act === 'lots') { S.lots = Math.max(1, Math.min(4, S.lots + +a.dataset.d)); $('.sd-lotv', app).textContent = S.lots; ticket(); }
        else if (act === 'place') {
          const st = $('.sd-status', app);
          if (!S.consensus) { st.className = 'sd-status no'; st.textContent = 'Rejected by the gate: engines not in consensus. Evaluate on the Engines screen.'; log('gate', 'GATE', `Rejected ${S.ct}: no consensus`); api.say('Rejected: no consensus'); return; }
          a.disabled = true; st.className = 'sd-status'; st.textContent = 'Gate checks…'; await wait(500);
          st.className = 'sd-status ok'; st.textContent = `Demo fill: ${S.ct} × ${S.lots} at ${fmt(S.px)}. Simulated; nothing was sent.`;
          log('fill', 'DEMO FILL', `${S.ct} × ${S.lots} @ ${fmt(S.px)} (simulated)`); S.placed++;
          const tb = $('.sd-open', app); const none = $('.sd-none', tb); if (none) none.remove();
          const tr = document.createElement('tr'); const ltp = S.px + 3.4; tr.innerHTML = '<td></td><td></td><td></td><td></td><td class="sd-up"></td>'; [S.ct, S.lots, fmt(S.px), fmt(ltp), '+' + (3.4 * S.lots).toFixed(1)].forEach((v, i) => { tr.children[i].textContent = v; }); tb.appendChild(tr);
          a.disabled = S.safe; api.say('Demo order filled. Simulated; nothing was sent.');
        } else if (act === 'kill') setSafe(true);
        else if (act === 'reset') { setSafe(false); log('gate', 'DEMO', 'Demo reset by visitor (the real exit needs an operator token)'); }
      });
      ticket(); checks();
    },
  };

  /* =================================================================
     04 · SHOPCONNECT  (four roles, one shared sample order)
     ================================================================= */
  const STEPS = ['Placed', 'Accepted', 'Packed', 'Out for delivery', 'Delivered'];
  const SC = {
    key: 'sc', ep: '04', name: 'ShopConnect', device: 'phone', status: 'Delivered to client',
    lede: 'An offline-first Android retail app with four roles in one: customer, shop, rider and admin. One order moves through all four, with no backend and data kept on the device.',
    fine: 'Fictional shops, people and prices. No real payment, no live GPS, no network calls: the mockup keeps everything in this page, like the app keeps it on the device.',
    screens: [
      ['shops', 'Customer · Shops', 'Nearby shops, search and categories.', 'The customer view. Shops near you with their item counts. Open Karol Bagh Mart to start an order.'],
      ['store', 'Customer · Store', 'Products with add-to-basket.', 'Add atta and milk to the basket. Restricted items are locked by the app\'s compliance rules.'],
      ['basket', 'Customer · Basket', 'Review and place the order.', 'Pay on delivery; no real payment exists in this mockup. Placing the order sends it to the shop role.'],
      ['track', 'Customer · Tracking', 'The order\'s journey, step by step.', 'The same order seen by the customer, updating as the shop and rider act on it.'],
      ['incoming', 'Shop · Orders', 'Incoming orders to accept.', 'The shop owner sees the new order and accepts it.'],
      ['inventory', 'Shop · Inventory', 'Stock levels and restricted items.', 'Stock counts update when an order is packed. Restricted items stay locked.'],
      ['prepare', 'Shop · Prepare', 'Packing checklist, hand to rider.', 'Tick each item as packed, then hand the order to a rider.'],
      ['tasks', 'Rider · Tasks', 'Assigned pickups and drops.', 'The rider sees the assignment once the shop hands it over.'],
      ['deliver', 'Rider · Delivery', 'Route sketch and delivery states.', 'Pickup, then drop. The route is a sketch, not live GPS. Mark delivered to close the loop.'],
      ['admin', 'Admin · Overview', 'Shops, people, orders and compliance.', 'Totals across the system and the compliance gates that keep the demo honest.'],
    ],
    html() {
      const roles = (cur) => `<nav class="sc-roles" aria-label="Role">${[['customer', 'Customer', 'shops'], ['shop', 'Shop', 'incoming'], ['rider', 'Rider', 'tasks'], ['admin', 'Admin', 'admin']].map(([k, l, s]) => `<button type="button" data-go="${s}" data-role="${k}" ${cur === k ? 'aria-current="true"' : ''}>${l}${k !== 'customer' && k !== 'admin' ? `<span class="ax-badge sc-b-${k}" hidden>1</span>` : ''}</button>`).join('')}</nav>`;
      const off = '<div class="sc-off" aria-hidden="true"><span>● OFFLINE-FIRST · DATA ON THIS DEVICE</span><span>SAMPLE DATA</span></div>';
      const head = (t, who, back) => `<div class="sc-head">${back ? `<button class="sc-back" type="button" data-go="${back}" aria-label="Back">‹</button>` : ''}<h3>${t}</h3><span class="who">${who}</span></div>`;
      const tl = '<ol class="sc-tl">' + STEPS.map((s) => `<li>${s}<small></small></li>`).join('') + '</ol>';
      return `<div class="ax ax-sc">${SB()}${off}
      <section class="ax-scr" data-s="shops" aria-label="Customer: shops">${head('Nearby', 'Aarav · Customer')}
        <div class="sc-body"><div class="sc-search" aria-hidden="true">⌕ Search atta, milk, dal…</div><div class="sc-cats" aria-hidden="true"><span class="on">All</span><span>Staples</span><span>Dairy</span><span>Snacks</span></div>
          <button class="sc-shop" type="button" data-go="store"><span class="logo" style="--c:#0F766E">KB</span><b>Karol Bagh Mart</b><small>Central Delhi · 12 items</small><span class="go" aria-hidden="true">›</span></button>
          <div class="sc-shop"><span class="logo" style="--c:#7C3AED">LD</span><b>Lajpat Daily</b><small>South Delhi · 9 items</small><span class="go" aria-hidden="true"></span></div>
          <div class="sc-shop"><span class="logo" style="--c:#B45309">DC</span><b>Dwarka Corner</b><small>West Delhi · 7 items</small><span class="go" aria-hidden="true"></span></div>
        </div>${roles('customer')}</section>

      <section class="ax-scr" data-s="store" aria-label="Customer: store">${head('Karol Bagh Mart', 'Open · Meera', 'shops')}
        <div class="sc-body">
          <div class="sc-prod"><span class="ph" style="--bgp:#FEF3C7" aria-hidden="true">🌾</span><b>Atta 5 kg</b><small>₹240 · 18 in stock</small><button class="add" type="button" data-add="atta" aria-pressed="false">Add</button></div>
          <div class="sc-prod"><span class="ph" style="--bgp:#E0F2FE" aria-hidden="true">🥛</span><b>Toned milk 1 L</b><small>₹54 · 32 in stock</small><button class="add" type="button" data-add="milk" aria-pressed="false">Add</button></div>
          <div class="sc-prod"><span class="ph" style="--bgp:#FCE7F3" aria-hidden="true">🫘</span><b>Toor dal 1 kg</b><small>₹168 · 11 in stock</small><button class="add" type="button" data-add="dal" aria-pressed="false">Add</button></div>
          <div class="sc-prod lock"><span class="ph" style="--bgp:#F3F4F6" aria-hidden="true">🔒</span><b>Cigarettes</b><small>Restricted · locked by compliance</small><button class="add" type="button" disabled>Locked</button></div>
          <button class="sc-btn sc-tobasket" type="button" data-go="basket" disabled>Basket is empty</button>
        </div>${roles('customer')}</section>

      <section class="ax-scr" data-s="basket" aria-label="Customer: basket">${head('Basket', 'Karol Bagh Mart', 'store')}
        <div class="sc-body"><div class="sc-card sc-sum sc-lines"></div>
          <div class="sc-card"><b>Pay on delivery</b><small>No real payment exists in this demo.</small></div>
          <button class="sc-btn sc-place" type="button" data-act="place">Place order</button>
        </div>${roles('customer')}</section>

      <section class="ax-scr" data-s="track" aria-label="Customer: tracking">${head('Order #1042', 'Aarav')}
        <div class="sc-body"><div class="sc-card hi"><div class="sc-row"><b class="sc-tot">₹294</b><span class="sc-pill t sc-stpill">—</span></div><small class="sc-items">Atta 5 kg · Toned milk 1 L</small></div>${tl}
          <div class="sc-empty sc-noorder"><b>No order yet</b><span>Place one from the basket.</span></div>
          <button class="sc-btn ghost" type="button" data-go="incoming">See the shop's side →</button>
        </div>${roles('customer')}</section>

      <section class="ax-scr" data-s="incoming" aria-label="Shop: orders">${head('Orders', 'Meera · Karol Bagh Mart')}
        <div class="sc-body"><div class="sc-empty sc-inempty"><b>No incoming orders</b><span>Orders placed by customers appear here.</span></div>
          <div class="sc-card hi sc-incard" hidden><div class="sc-row"><b>Order #1042</b><span class="sc-pill w sc-inpill">New</span></div><small>Aarav · <span class="sc-items">Atta 5 kg · Toned milk 1 L</span> · <span class="sc-tot">₹294</span></small><button class="sc-btn sc-accept" type="button" data-act="accept">Accept order</button></div>
          <button class="sc-btn ghost" type="button" data-go="inventory">Inventory</button>
        </div>${roles('shop')}</section>

      <section class="ax-scr" data-s="inventory" aria-label="Shop: inventory">${head('Inventory', 'Karol Bagh Mart', 'incoming')}
        <div class="sc-body">
          <div class="sc-card"><div class="sc-row"><b>Atta 5 kg</b><span class="sc-pill t"><span class="sc-stk-atta">18</span> in stock</span></div><small>₹240</small></div>
          <div class="sc-card"><div class="sc-row"><b>Toned milk 1 L</b><span class="sc-pill t"><span class="sc-stk-milk">32</span> in stock</span></div><small>₹54</small></div>
          <div class="sc-card"><div class="sc-row"><b>Toor dal 1 kg</b><span class="sc-pill t"><span class="sc-stk-dal">11</span> in stock</span></div><small>₹168</small></div>
          <div class="sc-card"><div class="sc-row"><b>Cigarettes</b><span class="sc-pill r">Locked</span></div><small>Restricted item · compliance gate</small></div>
        </div>${roles('shop')}</section>

      <section class="ax-scr" data-s="prepare" aria-label="Shop: prepare">${head('Pack #1042', 'Meera', 'incoming')}
        <div class="sc-body"><div class="sc-packs"></div><button class="sc-btn sc-hand" type="button" data-act="hand" disabled>Tick every item to hand over</button></div>${roles('shop')}</section>

      <section class="ax-scr" data-s="tasks" aria-label="Rider: tasks">${head('Tasks', 'Vikram · Rider')}
        <div class="sc-body"><div class="sc-empty sc-taskempty"><b>No assignments</b><span>The shop hands orders to riders after packing.</span></div>
          <div class="sc-card hi sc-taskcard" hidden><div class="sc-row"><b>Order #1042</b><span class="sc-pill w sc-taskpill">Ready for pickup</span></div><small>Karol Bagh Mart → Aarav</small><button class="sc-btn" type="button" data-go="deliver">Start delivery</button></div>
        </div>${roles('rider')}</section>

      <section class="ax-scr" data-s="deliver" aria-label="Rider: delivery">${head('Delivery #1042', 'Vikram', 'tasks')}
        <div class="sc-body"><div class="sc-map"><svg viewBox="0 0 340 230" aria-hidden="true"><path d="M40 50 C 120 50, 140 120, 200 120 S 280 190, 300 190" fill="none" stroke="#0F766E" stroke-width="4" stroke-dasharray="8 7"/><circle cx="40" cy="50" r="9" fill="#0F766E" stroke="#fff" stroke-width="3"/><circle class="sc-dot" cx="40" cy="50" r="6" fill="#B54708"/><circle cx="300" cy="190" r="9" fill="#B54708" stroke="#fff" stroke-width="3"/></svg><span class="lbl" style="left:56px;top:30px">Pickup · Karol Bagh Mart</span><span class="lbl" style="right:12px;bottom:40px">Drop · Aarav</span><span class="note">Route sketch · not live GPS</span></div>
          <div class="sc-card"><div class="sc-row"><b class="sc-dstate">Heading to pickup</b><span class="sc-pill t">2 items · ₹294</span></div><small>Collect cash on delivery (simulated)</small></div>
          <button class="sc-btn sc-dbtn" type="button" data-act="pickup">Picked up</button>
        </div>${roles('rider')}</section>

      <section class="ax-scr" data-s="admin" aria-label="Admin: overview">${head('Overview', 'Admin')}
        <div class="sc-body"><div class="sc-kpis"><div><b>3</b><small>Shops</small></div><div><b>1</b><small>Customers</small></div><div><b>1</b><small>Riders</small></div><div><b class="sc-orders">0</b><small>Orders</small></div></div>
          <div class="sc-card"><div class="sc-row"><b>Order #1042</b><span class="sc-pill sc-adpill">None yet</span></div><small>Karol Bagh Mart → Aarav · Vikram</small></div>
          <div class="sc-gate"><span>mode</span><b>SIMULATION_ONLY</b></div><div class="sc-gate"><span>realCheckout</span><b>false 🔒</b></div><div class="sc-gate"><span>realPayment</span><b>false 🔒</b></div><div class="sc-gate"><span>restricted items</span><b>locked 🔒</b></div>
        </div>${roles('admin')}</section>
      ${HOME}</div>`;
    },
    init(app, api) {
      const ITEMS = { atta: ['Atta 5 kg', 240], milk: ['Toned milk 1 L', 54], dal: ['Toor dal 1 kg', 168] };
      const STOCK = { atta: 18, milk: 32, dal: 11 };
      const S = { cart: new Set(), step: -1, packed: new Set() };
      const total = () => [...S.cart].reduce((s, k) => s + ITEMS[k][1], 0);
      const names = () => [...S.cart].map((k) => ITEMS[k][0]).join(' · ');
      function render() {
        const b = $('.sc-tobasket', app); b.disabled = !S.cart.size || S.step >= 0; b.textContent = S.step >= 0 ? 'Order placed' : S.cart.size ? `Basket · ${S.cart.size} item${S.cart.size > 1 ? 's' : ''} · ₹${total()}` : 'Basket is empty';
        $('.sc-lines', app).innerHTML = [...S.cart].map((k) => `<p><span>${ITEMS[k][0]}</span><b>₹${ITEMS[k][1]}</b></p>`).join('') + `<p class="tot"><span>Total</span><b>₹${total()}</b></p>`;
        $$('.sc-tot', app).forEach((x) => { x.textContent = '₹' + total(); }); $$('.sc-items', app).forEach((x) => { x.textContent = names(); });
        const placed = S.step >= 0; $('.sc-place', app).disabled = placed || !S.cart.size; if (placed) $('.sc-place', app).textContent = 'Order placed';
        $$('.sc-tl li', app).forEach((li, i) => { li.className = i < S.step ? 'done' : i === S.step ? 'now' : ''; }); $('.sc-noorder', app).hidden = placed; $('.sc-tl', app).hidden = !placed;
        $('.sc-stpill', app).textContent = placed ? STEPS[S.step] : '—';
        $('.sc-inempty', app).hidden = placed; $('.sc-incard', app).hidden = !placed; $('.sc-inpill', app).textContent = S.step === 0 ? 'New' : STEPS[S.step];
        $('.sc-accept', app).hidden = S.step !== 0; $$('.sc-b-shop', app).forEach((x) => { x.hidden = S.step !== 0; });
        $('.sc-taskempty', app).hidden = S.step < 2; $('.sc-taskcard', app).hidden = S.step < 2; $$('.sc-b-rider', app).forEach((x) => { x.hidden = S.step !== 2; }); $('.sc-taskpill', app).textContent = S.step === 2 ? 'Ready for pickup' : STEPS[S.step] || '';
        $('.sc-orders', app).textContent = placed ? '1' : '0'; $('.sc-adpill', app).textContent = placed ? STEPS[S.step] : 'None yet'; $('.sc-adpill', app).className = 'sc-pill ' + (S.step === 4 ? 't' : placed ? 'w' : '') + ' sc-adpill';
        Object.keys(STOCK).forEach((k) => { $('.sc-stk-' + k, app).textContent = STOCK[k]; });
      }
      function packs(build) { if (build) $('.sc-packs', app).innerHTML = [...S.cart].map((k) => `<button class="sc-check" type="button" role="checkbox" aria-checked="${S.packed.has(k)}" data-pack="${k}"><i>✓</i>${ITEMS[k][0]}</button>`).join(''); $$('[data-pack]', app).forEach((b) => b.setAttribute('aria-checked', String(S.packed.has(b.dataset.pack)))); const h = $('.sc-hand', app); const all = S.cart.size && [...S.cart].every((k) => S.packed.has(k)); h.disabled = !all || S.step !== 1; h.textContent = S.step > 1 ? 'Handed to rider' : all ? 'Hand to rider' : 'Tick every item to hand over'; }
      app.addEventListener('click', async (e) => {
        const t = e.target;
        const add = t.closest('[data-add]'); if (add) { if (S.step >= 0) return; const k = add.dataset.add; if (S.cart.has(k)) S.cart.delete(k); else S.cart.add(k); add.setAttribute('aria-pressed', String(S.cart.has(k))); add.textContent = S.cart.has(k) ? 'Added' : 'Add'; render(); return; }
        const pk = t.closest('[data-pack]'); if (pk) { const k = pk.dataset.pack; if (S.packed.has(k)) S.packed.delete(k); else S.packed.add(k); packs(); return; }
        const a = t.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'place') { if (!S.cart.size) return; S.step = 0; render(); api.say('Order 1042 placed. The shop role now has a new order.'); api.go('track'); }
        else if (act === 'accept') { S.step = 1; render(); packs(true); api.say('Order accepted. Pack it next.'); api.go('prepare'); }
        else if (act === 'hand') { S.step = 2; S.cart.forEach((k) => { STOCK[k] -= 1; }); render(); packs(); api.say('Packed and handed to the rider.'); api.go('tasks'); }
        else if (act === 'pickup') { S.step = 3; render(); $('.sc-dstate', app).textContent = 'Heading to drop'; a.dataset.act = 'drop'; a.textContent = 'Delivered'; const d = $('.sc-dot', app); d.setAttribute('cx', '200'); d.setAttribute('cy', '120'); api.say('Picked up. Out for delivery.'); }
        else if (act === 'drop') { S.step = 4; render(); $('.sc-dstate', app).textContent = 'Delivered'; a.disabled = true; a.textContent = 'Delivered ✓'; const d = $('.sc-dot', app); d.setAttribute('cx', '300'); d.setAttribute('cy', '190'); api.say('Delivered. Every role now shows the order as delivered.'); }
      });
      render();
    },
    enter(id, app) { if (id === 'prepare') { const ev = new Event('noop'); void ev; } },
  };

  /* =================================================================
     05 · TOOLKIT  (fictional sample research; real product name withheld)
     ================================================================= */
  const CLAIMS = [
    ['Office workers near the sample market eat lunch at their desks most weekdays.', 'Interview notes (sample) · 12 people', ['Interview notes', 'Footfall count'], ['y', 'y']],
    ['Comparable tiffins sell for ₹90–₹130 per meal in the area.', 'Public menus (sample) · 6 listings', ['Menu listings', 'Delivery app prices'], ['y', 'y']],
    ['A home kitchen can make 40 meals a day with one helper.', 'Owner estimate (sample)', ['Owner estimate'], ['y', 'n']],
    ['Delivery within 2 km can be done on foot or bicycle at ₹0 cost.', 'Route check (sample)', ['Route check', 'Map distance'], ['y', 'y']],
    ['No licence is needed for a home kitchen of this size.', 'Unverified claim (sample)', ['Forum post'], ['n', 'n']],
  ];
  const TESTS = ['Tracking files present', 'Every claim has two checkers', 'Refuted claims removed', 'Budget is ₹0', 'No paid services used', 'Skills valid', 'Brief has an owner', 'Sources listed per claim', 'Report pages render', 'Decisions listed for owner', 'Phase gate is locked', 'No private names in output', 'Checkpoint file written', 'Repository validator self-test'];
  const TK = {
    key: 'tk', ep: '05', name: 'Toolkit', device: 'laptop', status: 'Delivered to client',
    lede: 'A zero-budget business research workspace: research, two-checker fact-checking, a 14-test validator, a checkpoint report and an owner approval gate before anything is built.',
    fine: 'The product\'s real name is withheld. The research brief, sources and decisions here are fictional examples, not client work.',
    screens: [
      ['brief', 'Research brief', 'Question, scope, constraints, owner.', 'A fictional brief: is there room for a home tiffin service near a sample market? Budget ₹0, owner approval required.'],
      ['evidence', 'Evidence', 'Every claim with its sources.', 'Each claim the research makes, with the sources behind it. Weak sourcing is visible before fact-checking starts.'],
      ['facts', 'Fact-check', 'Two independent checkers per claim.', 'A claim survives only when both checkers agree. Resolve the split claim and remove the refuted one.'],
      ['validate', 'Validator', '14 tests before a checkpoint.', 'Run the 14-test validator. It refuses to pass while a refuted claim is still in the report.'],
      ['report', 'Checkpoint report', 'The PDF the owner reads.', 'The checkpoint report summarises findings and lists the decisions the owner must make.'],
      ['gate', 'Owner approval', 'Nothing ships unapproved.', 'Approve or decline each decision. Approving the checkpoint unlocks the next phase; nothing is built before that.'],
    ],
    html() {
      const nav = [['brief', 'Research brief'], ['evidence', 'Evidence'], ['facts', 'Fact-check'], ['validate', 'Validator'], ['report', 'Checkpoint report'], ['gate', 'Owner approval']];
      const claims = CLAIMS.map((c, i) => `<div class="tk-claim" data-c="${i}"><p>${c[0]}</p><span class="tk-tag tk-ctag">${c[2].length > 1 ? c[2].length + ' sources' : '1 source'}</span><small>${c[1]}</small><div class="tk-src">${c[2].map((s) => `<span>${s} (sample)</span>`).join('')}</div></div>`).join('');
      const facts = CLAIMS.map((c, i) => `<div class="tk-claim tk-f" data-f="${i}"><p>${c[0]}</p><span class="tk-tag tk-fv">—</span><div class="tk-checkers"><div class="p tk-k1"><span>Checker 1</span><b>pending</b></div><div class="p tk-k2"><span>Checker 2</span><b>pending</b></div></div><div class="fix" hidden></div></div>`).join('');
      const tests = TESTS.map((t, i) => `<div class="tk-test" data-t="${i}"><i>${String(i + 1).padStart(2, '0')}</i><span>${t}</span><b>—</b></div>`).join('');
      const DEC = ['Proceed with the tiffin idea to Phase 1', 'Price point: ₹110 per meal', 'Start with 20 meals a day', 'Delivery radius: 2 km', 'Drop the unverified licence claim', 'Use free tools only', 'Weekly owner check-in', 'Name shortlist: keep 3 for testing', 'Logo direction: concept B'];
      return `<div class="ax ax-tk">
        <div class="tk-top"><b>TOOLKIT</b><small>name withheld</small><span class="sp"></span><span class="tk-who">Owner review · sample project</span></div>
        <div class="tk-wrap"><nav class="tk-side" aria-label="Toolkit"><h5>Checkpoint 1</h5>${nav.map(([k, l], i) => `<button type="button" data-go="${k}" class="tk-n-${k}"><i>${i + 1}</i>${l}</button>`).join('')}
          <div class="tk-phases" aria-label="Phases"><p class="ok"><span>Phase 0 · Research</span><b>DONE</b></p><p class="now tk-cp"><span>Checkpoint 1</span><b>OWNER</b></p><p class="lock tk-p1"><span>Phase 1 · Extensions</span><b>LOCKED</b></p><p class="lock"><span>Phase 2 · Business OS</span><b>LOCKED</b></p></div></nav>
        <div class="tk-main">

        <section class="ax-scr" data-s="brief" aria-label="Research brief">
          <div class="tk-h"><div><small>Sample project · fictional</small><h4>Home tiffin service near a sample market</h4></div><button class="tk-btn pri" type="button" data-go="evidence">Open evidence →</button></div>
          <div class="tk-2"><div class="tk-card"><h5>Question</h5><p>Is there enough weekday lunch demand within 2 km to sustain a one-kitchen tiffin service, without spending money to find out?</p><h5 style="margin-top:12px">Scope</h5><ul><li>Demand and price range</li><li>Kitchen capacity</li><li>Delivery on foot or bicycle</li><li>Licensing questions to flag</li></ul></div>
            <div class="tk-card"><h5>Constraints</h5><dl class="tk-kv"><dt>Budget</dt><dd>₹0</dd><dt>Paid services</dt><dd>None</dd><dt>Owner</dt><dd>Sample owner</dd><dt>Gate</dt><dd>Checkpoint 1 before building</dd><dt>Checks</dt><dd>2 checkers per claim</dd></dl></div></div>
          <div class="tk-3"><div class="tk-card"><h5>Claims</h5><p style="font-size:24px;font-weight:700;margin:0">5</p></div><div class="tk-card"><h5>Sources</h5><p style="font-size:24px;font-weight:700;margin:0">9</p></div><div class="tk-card"><h5>Decisions</h5><p style="font-size:24px;font-weight:700;margin:0">9</p></div></div>
        </section>

        <section class="ax-scr" data-s="evidence" aria-label="Evidence">
          <div class="tk-h"><div><small>Phase 0 · research output</small><h4>Evidence</h4></div><button class="tk-btn pri" type="button" data-go="facts">Fact-check claims →</button></div>
          <div style="display:grid;gap:8px">${claims}</div>
        </section>

        <section class="ax-scr" data-s="facts" aria-label="Fact-check">
          <div class="tk-h"><div><small>Two independent checkers</small><h4>Fact-check</h4></div><button class="tk-btn gold tk-runfc" type="button" data-act="fc">Run both checkers</button></div>
          <div style="display:grid;gap:8px">${facts}</div>
        </section>

        <section class="ax-scr" data-s="validate" aria-label="Validator">
          <div class="tk-h"><div><small>Repository validator</small><h4>14 tests</h4></div><button class="tk-btn gold tk-runv" type="button" data-act="validate">Run validator</button></div>
          <div class="tk-prog" aria-hidden="true"><i class="tk-pbar" style="--w:0%"></i></div>
          <div class="tk-tests">${tests}</div>
          <pre class="tk-term" aria-live="polite">$ npm run validate</pre>
        </section>

        <section class="ax-scr" data-s="report" aria-label="Checkpoint report">
          <div class="tk-h"><div><small>Generated after validation</small><h4>CHECKPOINT-1.pdf</h4></div><button class="tk-btn pri" type="button" data-go="gate">Go to owner approval →</button></div>
          <div class="tk-pdf"><div class="tk-page" aria-hidden="true"><b>Checkpoint 1</b><span>Home tiffin service · sample</span><i></i><i></i><i class="s"></i><i></i><i></i><i class="s"></i><i></i><i class="s"></i></div>
            <div class="tk-card"><h5>Summary · 12 pages</h5><ul><li>Demand: workers eat at desks most weekdays (2 checkers ✓)</li><li>Price range: ₹90–₹130 per meal (2 checkers ✓)</li><li>Capacity: 40 meals a day is uncertain (checkers split; marked as estimate)</li><li>Delivery: ₹0 within 2 km (2 checkers ✓)</li><li>Licensing: removed as unverified; flagged for the owner</li></ul><h5 style="margin-top:12px">Status</h5><p class="tk-rstat">Waiting for the validator to pass.</p></div></div>
        </section>

        <section class="ax-scr" data-s="gate" aria-label="Owner approval">
          <div class="tk-banner wait tk-gban"><span>Checkpoint 1 · 9 decisions awaiting the owner</span><span class="tk-gcount">0 / 9 decided</span></div>
          <div style="display:grid;gap:6px">${DEC.map((d, i) => `<div class="tk-dec" data-d="${i}"><p>${d}</p><small>Sample decision</small><div class="tk-sw" role="group" aria-label="Decision ${i + 1}"><button type="button" class="y" data-dv="y" aria-pressed="false">Approve</button><button type="button" class="n" data-dv="n" aria-pressed="false">Decline</button></div></div>`).join('')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="tk-btn pri tk-approve" type="button" data-act="approve" disabled>Approve checkpoint</button><button class="tk-btn" type="button" data-act="changes">Request changes</button></div>
        </section>

        </div></div></div>`;
    },
    init(app, api) {
      const S = { fc: false, resolved: new Set(), removed: false, valid: false, dec: {} };
      const term = () => $('.tk-term', app);
      const line = (txt, cls) => { const s = document.createElement('span'); if (cls) s.className = cls; s.textContent = '\n' + txt; term().appendChild(s); };
      app.addEventListener('click', async (e) => {
        const t = e.target;
        const dv = t.closest('[data-dv]'); if (dv) { const row = dv.closest('[data-d]'); $$('[data-dv]', row).forEach((b) => b.setAttribute('aria-pressed', String(b === dv))); S.dec[row.dataset.d] = dv.dataset.dv; const n = Object.keys(S.dec).length; $('.tk-gcount', app).textContent = `${n} / 9 decided`; $('.tk-approve', app).disabled = n < 9 || !S.valid; if (n === 9 && !S.valid) $('.tk-gcount', app).textContent = '9 / 9 decided · run the validator first'; return; }
        const a = t.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'fc') {
          a.disabled = true; const rows = $$('.tk-f', app);
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i], [, , , v] = CLAIMS[i]; await wait(260);
            const k1 = $('.tk-k1', r), k2 = $('.tk-k2', r); k1.className = v[0] + ' tk-k1'; k1.lastElementChild.textContent = v[0] === 'y' ? 'confirms' : 'refutes'; await wait(160); k2.className = v[1] + ' tk-k2'; k2.lastElementChild.textContent = v[1] === 'y' ? 'confirms' : 'refutes';
            const tag = $('.tk-fv', r);
            if (v[0] === 'y' && v[1] === 'y') { tag.className = 'tk-tag ok tk-fv'; tag.textContent = 'Confirmed'; }
            else if (v[0] === 'n' && v[1] === 'n') { tag.className = 'tk-tag no tk-fv'; tag.textContent = 'Refuted'; const f = $('.fix', r); f.hidden = false; f.innerHTML = '<button class="tk-btn" type="button" data-act="remove">Remove from report</button>'; }
            else { tag.className = 'tk-tag warn tk-fv'; tag.textContent = 'Checkers split'; const f = $('.fix', r); f.hidden = false; f.innerHTML = '<button class="tk-btn" type="button" data-act="estimate">Keep, marked as estimate</button><button class="tk-btn" type="button" data-act="drop">Drop claim</button>'; }
          }
          S.fc = true; $('.tk-n-facts', app).classList.add('ok'); $('.tk-n-evidence', app).classList.add('ok'); $('.tk-n-brief', app).classList.add('ok'); api.say('Fact-check done: 3 confirmed, 1 split, 1 refuted.');
        } else if (act === 'remove' || act === 'estimate' || act === 'drop') {
          const r = a.closest('.tk-f'); const tag = $('.tk-fv', r);
          if (act === 'remove' || act === 'drop') { tag.className = 'tk-tag off tk-fv'; tag.textContent = act === 'remove' ? 'Removed' : 'Dropped'; if (act === 'remove') S.removed = true; }
          else { tag.className = 'tk-tag warn tk-fv'; tag.textContent = 'Estimate'; }
          S.resolved.add(r.dataset.f); $('.fix', r).hidden = true; api.say(tag.textContent);
        } else if (act === 'validate') {
          a.disabled = true; term().textContent = '$ npm run validate'; const rows = $$('.tk-test', app); $$('.tk-test', app).forEach((x) => { x.className = 'tk-test'; x.lastElementChild.textContent = '—'; });
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i]; r.className = 'tk-test run'; await wait(150);
            const blocked = (i === 1 && !S.fc) || (i === 2 && !(S.removed && S.resolved.size >= 2));
            if (blocked) { r.className = 'tk-test'; r.lastElementChild.textContent = 'FAIL'; line(`✗ ${TESTS[i]}`, 'warn'); line(i === 1 ? 'Run the fact-check first.' : 'Resolve the split claim and remove the refuted one on the Fact-check screen.', 'warn'); $('.tk-pbar', app).style.setProperty('--w', Math.round(i / 14 * 100) + '%'); a.disabled = false; api.say(`Validator stopped at test ${i + 1}: ${TESTS[i]}`); return; }
            r.className = 'tk-test pass'; r.lastElementChild.textContent = 'PASS'; line(`✓ ${TESTS[i]}`, 'ok'); $('.tk-pbar', app).style.setProperty('--w', Math.round((i + 1) / 14 * 100) + '%');
          }
          line('tests 14/14 passing', 'ok'); line('report: CHECKPOINT-1.pdf · 12 pages'); line('● CHECKPOINT 1 · awaiting owner · 9 decisions', 'warn');
          S.valid = true; a.disabled = false; $('.tk-n-validate', app).classList.add('ok'); $('.tk-n-report', app).classList.add('ok'); $('.tk-rstat', app).textContent = 'Validator passed 14 / 14. Ready for the owner.';
          $('.tk-approve', app).disabled = Object.keys(S.dec).length < 9; api.say('Validator passed 14 of 14.');
        } else if (act === 'approve') {
          const anyNo = Object.values(S.dec).includes('n'); const b = $('.tk-gban', app);
          b.className = 'tk-banner ok tk-gban'; b.firstElementChild.textContent = anyNo ? 'Checkpoint approved with declined items noted' : 'Checkpoint 1 approved by the owner'; $('.tk-gcount', app).textContent = 'Phase 1 unlocked';
          const p = $('.tk-p1', app); p.className = 'now tk-p1'; p.lastElementChild.textContent = 'UNLOCKED'; const cp = $('.tk-cp', app); cp.className = 'ok tk-cp'; cp.lastElementChild.textContent = 'APPROVED';
          $('.tk-n-gate', app).classList.add('ok'); a.disabled = true; api.say('Checkpoint approved. Phase 1 unlocked.');
        } else if (act === 'changes') { const b = $('.tk-gban', app); b.className = 'tk-banner no tk-gban'; b.firstElementChild.textContent = 'Changes requested · Phase 1 stays locked'; api.say('Changes requested. Phase 1 stays locked.'); }
      });
    },
  };

  const PRODUCTS = { sh: SH, mz: MZ, sd: SD, sc: SC, tk: TK };
  const ORDER = ['sh', 'mz', 'sd', 'sc', 'tk'];

  /* =================================================================
     Controller: dialog, device, screen navigation, sizing, a11y
     ================================================================= */
  let dlg, P, idx = 0, appEl, fitEl, built = {};
  function shell() {
    dlg = document.createElement('dialog'); dlg.className = 'sx'; dlg.setAttribute('aria-labelledby', 'sx-title');
    dlg.innerHTML = `<header class="sx-top"><button class="sx-back" type="button" data-x="close"><span aria-hidden="true">←</span><span class="lbl">Portfolio</span><span class="ax-sr">Back to portfolio</span></button>
      <div class="sx-id"><span class="sx-ep"></span><h2 class="sx-title" id="sx-title"></h2></div>
      <div class="sx-chips"><span class="sx-chip ok sx-status"></span><span class="sx-chip sim">Sample data · simulated</span></div>
      <div class="sx-nav"><button class="sx-icon prod" type="button" data-x="pp" aria-label="Previous product">‹</button><button class="sx-icon prod" type="button" data-x="np" aria-label="Next product">›</button><button class="sx-icon" type="button" data-x="close" aria-label="Close">✕</button></div></header>
      <div class="sx-body"><div class="sx-stage"><div class="sx-fit"></div></div>
      <aside class="sx-side"><p class="sx-lede"></p><h3 class="sx-h">Screens</h3><ol class="sx-list"></ol>
        <div class="sx-now"><h3 class="sx-h sx-nowh"></h3><p class="sx-nowp"></p></div>
        <div class="sx-steps"><button class="sx-step" type="button" data-x="ps">← Previous</button><button class="sx-step primary" type="button" data-x="ns">Next screen →</button></div>
        <p class="sx-keys">Keys: ← → change screen · Esc closes</p>
        <p class="sx-fine"></p></aside></div><p class="sx-live" aria-live="polite"></p>`;
    document.body.appendChild(dlg);
    fitEl = $('.sx-fit', dlg);
    dlg.addEventListener('click', (e) => {
      const x = e.target.closest('[data-x]'); if (!x) return;
      const v = x.dataset.x;
      if (v === 'close') close();
      else if (v === 'ps') go(idx - 1); else if (v === 'ns') go(idx + 1);
      else if (v === 'pp' || v === 'np') { const k = ORDER[(ORDER.indexOf(P.key) + (v === 'np' ? 1 : ORDER.length - 1)) % ORDER.length]; load(k); }
    });
    $('.sx-list', dlg).addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) go(+b.dataset.i); });
    // Esc closes with the same short exit as the button; the arrow keys step through the screens
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('keydown', (e) => {
      if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target.closest('input, textarea, select, [contenteditable], [role="slider"]')) return;
      const n = idx + (e.key === 'ArrowRight' ? 1 : -1); if (n < 0 || n >= P.screens.length) return;
      e.preventDefault(); go(n);
    });
    // the browser's Back button closes the viewer instead of leaving the page
    addEventListener('popstate', () => { if (dlg.open) { pushed = false; close(); } });
    dlg.addEventListener('close', () => { const r = document.documentElement; r.style.overflow = ''; if (pushed) { pushed = false; history.back(); } document.dispatchEvent(new CustomEvent('sx:toggle', { detail: false })); });
    addEventListener('resize', fit);
  }
  const api = {
    go: (id) => { const i = P.screens.findIndex((s) => s[0] === id); if (i >= 0) go(i); },
    say: (t) => { const l = $('.sx-live', dlg); l.textContent = ''; setTimeout(() => { l.textContent = t; }, 30); },
  };
  function load(key) {
    P = PRODUCTS[key]; idx = 0;
    $('.sx-ep', dlg).textContent = 'EP.' + P.ep; $('.sx-title', dlg).textContent = P.name; $('.sx-status', dlg).textContent = '● ' + P.status;
    $('.sx-lede', dlg).textContent = P.lede; $('.sx-fine', dlg).textContent = P.fine;
    $('.sx-list', dlg).innerHTML = P.screens.map((s, i) => `<li><button type="button" data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b><span>${s[1]}</span><small>${s[2]}</small></button></li>`).join('');
    // each product is built once per page view and keeps its sample state
    if (!built[key]) {
      const wrap = document.createElement('div'); wrap.innerHTML = P.html().trim(); const a = wrap.firstElementChild;
      const dev = document.createElement('div');
      // device shell: everything around the screen is decorative hardware, hidden from assistive tech (styles in devices.css)
      if (P.device === 'phone') {
        dev.className = 'sx-phone';
        dev.insertAdjacentHTML('beforeend', '<span class="sx-hw" aria-hidden="true"><i class="sx-key k-act"></i><i class="sx-key k-up"></i><i class="sx-key k-dn"></i><i class="sx-key k-pw"></i></span>');
        dev.appendChild(a); dev.insertAdjacentHTML('beforeend', '<i class="sx-glare" aria-hidden="true"></i>');
      } else {
        dev.className = 'sx-laptop'; const lid = document.createElement('div'); lid.className = 'sx-lid'; lid.appendChild(a); dev.appendChild(lid);
        // keyboard rows by key width: 1 = one unit, a = 1.25, b = 1.5, c = 1.75, d = 2.25, s = space bar
        const rows = ['b1111111111111', '1111111111111b', 'b1111111111111', 'c11111111111c', 'd1111111111d', '111asa1111'].map((r) => '<span class="dv-kr">' + [...r].map((c) => (c === '1' ? '<i></i>' : '<i class="k' + c + '"></i>')).join('') + '</span>').join('');
        dev.insertAdjacentHTML('beforeend', '<i class="dv-hinge" aria-hidden="true"></i><div class="dv-deck" aria-hidden="true"><div class="dv-kb">' + rows + '</div><i class="dv-pad"></i></div>');
      }
      dev.addEventListener('click', (e) => { const g = e.target.closest('[data-go]'); if (g && !g.disabled) api.go(g.dataset.go); });
      built[key] = { dev, app: a, ready: false };
    }
    fitEl.replaceChildren(built[key].dev); appEl = built[key].app;
    if (!built[key].ready) { P.init(appEl, api); built[key].ready = true; }
    dlg.classList.toggle('flow', isFlow());
    go(0, true); fit();
  }
  function go(i, quiet) {
    idx = Math.max(0, Math.min(P.screens.length - 1, i)); const [id, name, , now] = P.screens[idx];
    $$('.ax-scr', appEl).forEach((s) => s.classList.toggle('on', s.dataset.s === id));
    $$('[data-go]', appEl).forEach((b) => { if (b.closest('.sh-tabs, .mz-tabs, .sd-side, .tk-side')) { if (b.dataset.go === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); } });
    $$('.sc-roles button', appEl).forEach(() => {});
    $$('.sx-list button', dlg).forEach((b, k) => { if (k === idx) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    const cur = $(`.sx-list button[data-i="${idx}"]`, dlg); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    $('.sx-nowh', dlg).textContent = `On screen ${String(idx + 1).padStart(2, '0')} · ${name}`; $('.sx-nowp', dlg).textContent = now;
    $('[data-x="ps"]', dlg).disabled = idx === 0; const nx = $('[data-x="ns"]', dlg); nx.disabled = idx === P.screens.length - 1;
    if (P.enter) P.enter(id, appEl);
    if (!quiet) api.say(`Screen ${idx + 1} of ${P.screens.length}: ${name}`);
  }
  const isFlow = () => (P.device === 'laptop' && innerWidth < 900) || innerWidth < 600;
  function fit() {
    if (!dlg || !dlg.open || !P) return;
    const flow = isFlow(); dlg.classList.toggle('flow', flow);
    const dev = fitEl.firstElementChild; if (!dev) return;
    if (flow) { fitEl.style.transform = 'none'; fitEl.style.width = '100%'; const sh = $('.sx-stage', dlg).clientHeight - 24; fitEl.style.height = P.device === 'phone' ? Math.max(420, sh) + 'px' : ''; return; }
    fitEl.style.height = '';
    fitEl.style.width = ''; const st = $('.sx-stage', dlg).getBoundingClientRect();
    const w = dev.offsetWidth, h = dev.offsetHeight; const s = Math.min((st.width - 32) / w, (st.height - 40) / h, 1.05);
    fitEl.style.transform = `translate(-50%, -50%) scale(${Math.max(.3, s).toFixed(3)})`;
  }
  let pushed = false, closing = 0;
  function close() {
    if (!dlg.open || closing) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { dlg.close(); return; }
    dlg.classList.add('out'); closing = setTimeout(() => { closing = 0; dlg.classList.remove('out'); dlg.close(); }, 170);
  }
  function open(key) {
    if (!dlg) shell();
    if (!dlg.open) { try { history.pushState({ sx: 1 }, ''); pushed = true; } catch (e) { pushed = false; } }
    load(key); const r = document.documentElement; r.style.overflow = 'hidden'; document.dispatchEvent(new CustomEvent('sx:toggle', { detail: true }));
    dlg.showModal(); fit(); requestAnimationFrame(fit);
    const first = $('.sx-list button', dlg); if (first) first.focus({ preventScroll: true });
  }
  window.SX = { open };
})();
