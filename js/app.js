/* =====================================================================
   EXPERIÊNCIA NFC · MAESTRO — lógica
   - Leitor NFC USB em modo teclado (HID): o código da tag chega como digitação + Enter
   - NFC do próprio tablet (Web NFC, Chrome Android): opcional, pelo painel
   - Teste sem leitor: digite o número do módulo (1–16) e Enter, ou use as setas
   ===================================================================== */
(() => {
  'use strict';

  const { config: CFG, familias: FAM, modulos: MODS } = window.MAESTRO;
  MODS.forEach((m, i) => { m.n = i + 1; });
  const BY_ID = Object.fromEntries(MODS.map(m => [m.id, m]));

  /* ---------- Modo visitante ----------
     Página aberta pelo link gravado na tag (?m=<id>) em um navegador comum, por exemplo o celular do visitante:
     não volta sozinha ao início, não avança cenas e não pede tela cheia.
     O tablet do estande roda como app instalado (sem ?m=) e segue no modo totem. Forçar o totem: ?m=<id>&modo=totem */
  const PARAMS = new URLSearchParams(location.search);
  const LINK_ID = PARAMS.get('m') || PARAMS.get('modulo');
  const INSTALLED = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
  const VISITOR = !!(LINK_ID && BY_ID[LINK_ID]) && !INSTALLED && PARAMS.get('modo') !== 'totem';

  const URL_BASE = (CFG.urlBase || location.origin + location.pathname.replace(/index\.html$/, '')).replace(/\/+$/, '');
  const linkFor = id => `${URL_BASE}/?m=${id}`;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const reflow = el => void el.offsetWidth;

  /* ---------- Ícones ---------- */
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICONS = {
    'administracao': svg('<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>'),
    'gestor': svg('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9.5l1.8 1.8L12 8M7 15.5l1.8 1.8L12 14M15 10h3M15 16h3"/>'),
    'projetos': svg('<path d="M4 4v16h16"/><rect x="7" y="6" width="7" height="3" rx="1"/><rect x="10" y="11" width="9" height="3" rx="1"/><rect x="8" y="16" width="5" height="2.5" rx="1"/>'),
    'documentos': svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
    'atendimento-interno': svg('<path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L4 20.5l1-4.4A8.5 8.5 0 1 1 21 12z"/><path d="M9 10.5h6M9 13.5h4"/>'),
    'clientes': svg('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 10.5s1.8-3 5-3 5 3 5 3-1.8 3-5 3-5-3-5-3z"/><circle cx="12" cy="10.5" r="1.2"/>'),
    'colaboradores': svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.2c2.6.3 4.5 2.6 4.5 5.8"/>'),
    'dashboards-bi': svg('<rect x="3" y="3" width="8" height="10" rx="2"/><rect x="13" y="3" width="8" height="6" rx="2"/><rect x="13" y="11" width="8" height="10" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/>'),
    'analitico': svg('<path d="M3 20h18"/><path d="M5 16l4-5 4 3 5.5-7"/><circle cx="18.5" cy="7" r="1.6"/>'),
    'sensores': svg('<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>'),
    'recrutamento-selecao': svg('<circle cx="10" cy="10" r="6.5"/><path d="M15 15l5.5 5.5"/><circle cx="10" cy="8.6" r="2"/><path d="M6.7 13.6a4 4 0 0 1 6.6 0"/>'),
    'oportunidades': svg('<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18"/>'),
    'pesquisas': svg('<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 12.5v-2M12 12.5V8M15.5 12.5v-3"/>'),
    'treinamentos': svg('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6"/>'),
    'loyalty': svg('<circle cx="12" cy="9" r="6"/><path d="M12 6.2l.95 1.95 2.15.3-1.55 1.5.37 2.13L12 11.1l-1.92 1 .37-2.13-1.55-1.5 2.15-.3z"/><path d="M8.6 14l-1.4 7 4.8-2.4 4.8 2.4-1.4-7"/>'),
    'suprimentos': svg('<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>')
  };
  const iconOf = id => ICONS[id] || ICONS['gestor'];

  /* ---------- Armazenamento local (tolerante a falhas) ---------- */
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } }
  };
  const TAGS_KEY = 'maestro-nfc-tags';
  const normalize = s => String(s).toUpperCase().replace(/[^0-9A-Z]/g, '');
  const fixedTags = () => Object.fromEntries(Object.entries(CFG.tags || {}).map(([k, v]) => [normalize(k), v]));
  const localTags = () => store.get(TAGS_KEY, {});
  const allTags = () => ({ ...fixedTags(), ...localTags() });

  /* ---------- Estado ---------- */
  const S = {
    view: 'home', mod: null, scene: 0,
    busy: false, queued: null,
    last: { id: null, t: 0 },
    learn: null,
    idleT: null, sceneT: null,
    token: 0
  };

  /* =====================================================================
     FUNDO
     ===================================================================== */
  function buildBackground() {
    const palette = ['#EAFF06', '#8AB4F8', '#FFC24D', '#EDEDE4'];
    // [largura, altura, x, y, cor, opacidade] — em % da tela, composição inspirada no fundo de tela da Sete
    const blocks = [
      [24, 20, 66, -6, 3, .035], [14, 18, 86, -8, 1, .12], [9, 16, 92, 20, 1, .09],
      [20, 18, 58, 88, 0, .04], [17, 16, 83, 62, 2, .09], [8, 14, 90, 82, 2, .08],
      [6, 9, 95, 44, 0, .12]
    ];
    $('#bg').innerHTML = blocks.map(([w, h, x, y, c, o], i) =>
      `<i class="blk" style="width:${w}vw;height:${h}vh;left:${x}vw;top:${y}vh;--r:${Math.min(w, h) * .09}vw;--c:${palette[c]};--o:${o};--dur:${16 + (i * 7) % 18}s;--delay:-${i * 2.3}s;--dx:${(i % 2 ? -1 : 1) * (1.5 + i % 3)}vw;--dy:${(i % 3 ? 1 : -1) * (2 + i % 4)}vh"></i>`
    ).join('');
  }

  function buildMarquee() {
    const items = MODS.map(m =>
      `<button class="marquee-item" data-open="${m.id}" style="--c:${FAM[m.familia].cor}"><span>${m.nome}</span><i class="sq"></i></button>`
    ).join('');
    $('#marquee').innerHTML = items + items;
  }

  /* =====================================================================
     NAVEGAÇÃO
     ===================================================================== */
  function showView(name) {
    S.view = name;
    document.body.dataset.view = name;
    $$('.view').forEach(v => {
      const on = v.id === name;
      if (on) { v.classList.remove('is-active'); reflow(v); }
      v.classList.toggle('is-active', on);
    });
    if (name !== 'module') pauseVideos();
  }

  function openModule(id, source = 'toque') {
    const m = BY_ID[id];
    if (!m) return;
    const now = Date.now();

    if (S.view === 'module' && S.mod && S.mod.id === id) {
      if (source !== 'toque' && now - S.last.t < CFG.tempos.bloqueioReleitura * 1000) return;
      S.last = { id, t: now };
      const el = $('#module'); el.classList.remove('bump'); reflow(el); el.classList.add('bump');
      setScene(0);
      resetIdle();
      return;
    }
    S.last = { id, t: now };
    if (S.busy) { S.queued = id; return; }

    closeOverlay('grid');
    S.busy = true;
    playTransition(m,
      () => { renderModule(m); showView('module'); setScene(0, true); resetIdle(); },
      () => {
        S.busy = false;
        if (S.queued && S.queued !== S.mod.id) { const q = S.queued; S.queued = null; openModule(q, 'fila'); }
        S.queued = null;
      });
    setHash(id);
  }

  function goHome() {
    clearTimeout(S.idleT); clearTimeout(S.sceneT);
    closeOverlay('grid');
    if (S.view === 'home') return;
    S.mod = null;
    showView('home');
    document.body.style.removeProperty('--accent');
    setHash('');
  }

  function setHash(id) {
    try { history.replaceState(null, '', id ? `#/${id}` : location.pathname + location.search.replace(/[?&]m(odulo)?=[^&]*/g, '')); } catch { /* file:// em alguns navegadores */ }
  }

  function playTransition(m, onCover, onDone) {
    const tr = $('#transition');
    const fam = FAM[m.familia];
    tr.style.setProperty('--accent', fam.cor);
    $('#trNum').textContent = `${pad(m.n)} · ${fam.nome}`;
    $('#trName').textContent = m.nome;
    $('.tr-name', tr).classList.toggle('long', m.nome.length > 13);
    tr.classList.remove('in', 'out'); reflow(tr);
    tr.classList.add('in');
    setTimeout(() => { onCover(); tr.classList.add('out'); }, 1050);
    setTimeout(() => { tr.classList.remove('in', 'out'); onDone(); }, 1900);
  }

  /* =====================================================================
     PÁGINA DO MÓDULO
     ===================================================================== */
  function renderModule(m) {
    S.mod = m;
    const token = ++S.token;
    const fam = FAM[m.familia];
    document.body.style.setProperty('--accent', fam.cor);
    $('#module').style.setProperty('--accent', fam.cor);
    $('#modNum').textContent = pad(m.n);
    $('#modTotal').textContent = pad(MODS.length);

    const len = m.nome.length;
    const nameCls = len > 18 ? 'xlong' : len > 11 ? 'long' : '';

    $('#sceneOverview').innerHTML = `
      <div class="ov-copy">
        <div class="ov-meta anim" style="--i:0"><span class="icon-chip">${iconOf(m.id)}</span><p class="eyebrow">Módulo ${pad(m.n)} · ${fam.nome}</p></div>
        <h2 class="mod-name ${nameCls} anim" style="--i:1">${m.nome}<i class="dot"></i></h2>
        <p class="mod-headline anim" style="--i:2">${m.headline}</p>
        <p class="mod-resumo anim" style="--i:3">${m.resumo}</p>
      </div>
      <div class="media ov-media anim" style="--i:2" id="mediaCapa"></div>`;

    $('#sceneValue').innerHTML = `
      <div class="anim" style="--i:0">
        <p class="eyebrow">${m.nome} · Como agrega valor</p>
        <h3 class="scene-title">O que muda na <span class="accent">sua operação</span></h3>
      </div>
      <div class="val-cards">
        ${m.valor.map((v, i) => `
          <div class="val-card anim" style="--i:${i + 1}">
            <div class="val-top"><span class="val-num">${pad(i + 1)}</span><span class="val-mark"><i></i><i></i></span></div>
            <div class="val-bar"></div>
            <h4>${v.titulo}</h4>
            <p>${v.texto}</p>
          </div>`).join('')}
      </div>`;

    $('#sceneFeatures').innerHTML = `
      <div class="ft-copy">
        <p class="eyebrow anim" style="--i:0">${m.nome} · O que dá pra fazer</p>
        <h3 class="scene-title anim" style="--i:1">Funcionalidades</h3>
        <ul class="ft-list">
          ${m.funcionalidades.map((f, i) => `<li class="anim" style="--i:${i + 2}"><i class="sq"></i>${f}</li>`).join('')}
        </ul>
      </div>
      <div class="media ft-media anim" style="--i:3" id="mediaGaleria"></div>`;

    loadMedia(m, token);
  }

  function setScene(i, instant = false) {
    const scenes = $$('.scene');
    i = Math.max(0, Math.min(scenes.length - 1, i));
    S.scene = i;

    const track = $('#scenesTrack');
    if (instant) { track.style.transition = 'none'; }
    track.style.transform = `translateX(${-i * 100}%)`;
    if (instant) { reflow(track); track.style.transition = ''; }

    const target = scenes[i];
    target.classList.remove('enter'); reflow(target); target.classList.add('enter');
    if (instant) scenes.forEach(s => s.classList.add('enter'));

    $$('#sceneTabs button').forEach((b, k) => b.classList.toggle('is-on', k === i));
    moveTabIndicator();

    scenes.forEach((s, k) => $$('video', s).forEach(v => { k === i ? v.play().catch(() => {}) : v.pause(); }));

    clearTimeout(S.sceneT);
    const sec = CFG.tempos.avancoCena;
    if (sec > 0 && !VISITOR && i < scenes.length - 1) S.sceneT = setTimeout(() => setScene(S.scene + 1), sec * 1000);
  }

  function moveTabIndicator() {
    const btn = $$('#sceneTabs button')[S.scene];
    const ind = $('#tabInd');
    if (!btn || !ind) return;
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.transform = `translateX(${btn.offsetLeft}px)`;
  }

  /* ---------- Mídias: busca por convenção de nomes em assets/modulos/<id>/ ---------- */
  const probeCache = new Map();
  function probeImage(src) {
    if (probeCache.has(src)) return probeCache.get(src);
    const p = new Promise(res => { const im = new Image(); im.onload = () => res(src); im.onerror = () => res(null); im.src = src; });
    probeCache.set(src, p);
    return p;
  }
  function probeVideo(src) {
    if (probeCache.has(src)) return probeCache.get(src);
    const p = new Promise(res => {
      const v = document.createElement('video');
      v.preload = 'metadata'; v.muted = true;
      v.onloadedmetadata = () => res(src); v.onerror = () => res(null);
      v.src = src;
    });
    probeCache.set(src, p);
    return p;
  }
  async function firstOf(list, probe) { for (const s of list) { if (await probe(s)) return s; } return null; }
  const exts = name => ['jpg', 'png', 'webp'].map(e => `${name}.${e}`);

  async function loadMedia(m, token) {
    const base = `assets/modulos/${m.id}`;
    const midia = m.midia || {};

    const capaEl = $('#mediaCapa');
    const capa = midia.capa ? midia.capa : await firstOf(exts(`${base}/capa`), probeImage);
    if (token !== S.token) return;
    capaEl.innerHTML = capa ? `<img class="kenburns" src="${capa}" alt="">` : placeholder(m, 'imagem de capa', `${base}/capa.jpg`);
    if (capa) {
      // telas largas do sistema ganham um quadro 16:10 para ocupar melhor o espaço
      const im = $('img', capaEl);
      const mark = () => capaEl.classList.toggle('wide', im.naturalWidth / im.naturalHeight > 1.6);
      if (im.complete) mark(); else im.addEventListener('load', mark, { once: true });
    }

    const galEl = $('#mediaGaleria');
    const video = midia.video ? midia.video : await probeVideo(`${base}/video.mp4`);
    if (token !== S.token) return;
    if (video) {
      galEl.innerHTML = `<video src="${video}" muted loop playsinline autoplay preload="auto"></video>`;
      if (S.scene !== 2) $('video', galEl).pause();
      return;
    }
    let slides = midia.galeria;
    if (!slides) {
      const found = await Promise.all([1, 2, 3, 4].map(n => firstOf(exts(`${base}/tela-${n}`), probeImage)));
      slides = found.filter(Boolean);
    }
    if (token !== S.token) return;
    if (!slides.length) { galEl.innerHTML = placeholder(m, 'vídeo ou telas do módulo', `${base}/video.mp4  ·  tela-1.jpg`); return; }
    galEl.innerHTML = slides.map((s, i) => `<img class="slide kenburns ${i === 0 ? 'on' : ''}" src="${s}" alt="">`).join('');
    if (slides.length > 1) {
      let k = 0;
      const timer = setInterval(() => {
        if (token !== S.token) return clearInterval(timer);
        const imgs = $$('.slide', galEl);
        imgs[k].classList.remove('on'); k = (k + 1) % imgs.length; imgs[k].classList.add('on');
      }, 4500);
    }
  }

  function placeholder(m, label, path) {
    const cap = CFG.mostrarCaminhoDasImagens ? `<code>${path}</code>` : '';
    return `<div class="ph"><div class="ph-blocks"><span></span><span></span><span></span></div>
      <div class="ph-icon">${iconOf(m.id)}</div>
      <div class="ph-cap"><b>Espaço para ${label}</b>${cap}</div></div>`;
  }

  function pauseVideos() { $$('#module video').forEach(v => v.pause()); }

  /* ---------- Inatividade ---------- */
  function resetIdle() {
    clearTimeout(S.idleT);
    const bar = $('#idleBar');
    if (S.view !== 'module' || VISITOR) return;
    const sec = CFG.tempos.voltarInicio;
    bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; reflow(bar);
    bar.style.transition = `transform ${sec}s linear`; bar.style.transform = 'scaleX(0)';
    S.idleT = setTimeout(goHome, sec * 1000);
  }

  function onInteraction() {
    if (S.view === 'module') {
      resetIdle();
      // adia o avanço automático enquanto a pessoa está mexendo
      clearTimeout(S.sceneT);
      const sec = CFG.tempos.avancoCena;
      if (sec > 0 && !VISITOR && S.scene < 2) S.sceneT = setTimeout(() => setScene(S.scene + 1), sec * 1000);
    }
  }

  /* =====================================================================
     OVERLAYS
     ===================================================================== */
  function buildGrid() {
    $('#gridCount').textContent = MODS.length;
    $('#gridList').innerHTML = MODS.map((m, i) => `
      <button class="card" data-open="${m.id}" style="--c:${FAM[m.familia].cor};--i:${i}" type="button">
        <span class="card-top"><span class="card-n">${pad(m.n)}</span>${iconOf(m.id)}</span>
        <span class="card-name">${m.nome}</span>
      </button>`).join('');
  }

  function openOverlay(id) { $(`#${id}`).classList.add('is-open'); if (id === 'admin') renderAdmin(); }
  function closeOverlay(id) {
    const el = $(`#${id}`);
    if (!el) return;
    el.classList.remove('is-open');
    if (id === 'admin') { S.learn = null; }
  }

  /* ---------- Painel de configuração ---------- */
  function renderAdmin() {
    const fixed = fixedTags(), local = localTags();
    $('#admList').innerHTML = MODS.map(m => {
      const codes = [
        ...Object.keys(fixed).filter(k => fixed[k] === m.id && !(k in local)).map(k => `<code class="fixa" title="fixa em modulos.js">${k}</code>`),
        ...Object.keys(local).filter(k => local[k] === m.id).map(k => `<code>${k}</code>`)
      ].join('') || 'sem tag';
      return `<div class="adm-row ${S.learn === m.id ? 'is-learning' : ''}" data-id="${m.id}">
        <span class="n">${pad(m.n)}</span>
        <span class="nm">${m.nome}<code class="link">${linkFor(m.id).replace(/^https?:\/\//, '')}</code></span>
        <span class="tags">${S.learn === m.id ? 'Aproxime a tag…' : codes}</span>
        <span class="acts">
          <button class="btn-sm ${S.learn === m.id ? 'primary' : ''}" data-act="learn" type="button">${S.learn === m.id ? 'Cancelar' : 'Vincular'}</button>
          <button class="btn-sm" data-act="clear" type="button">Limpar</button>
          <button class="btn-sm" data-act="link" type="button">Copiar link</button>
          <button class="btn-sm" data-act="open" type="button">Abrir</button>
        </span>
      </div>`;
    }).join('');
    $('#admExport').value = JSON.stringify(allTags(), null, 2);

    const info = $('#webNfcInfo'), btn = $('#btnWebNfc');
    if ('NDEFReader' in window) {
      info.textContent = webNfcOn ? 'NFC do tablet ativo. Aproxime as tags da parte de trás do tablet.' : 'Este tablet suporta NFC pelo navegador. Ative para ler as tags sem leitor USB.';
      btn.hidden = webNfcOn;
    } else {
      info.textContent = 'Indisponível neste navegador. Use o leitor USB (modo teclado) ou o Chrome no Android com NFC via HTTPS.';
      btn.hidden = true;
    }
  }

  function saveTag(code, id) {
    const local = localTags();
    local[code] = id;
    store.set(TAGS_KEY, local);
  }
  function clearTags(id) {
    const local = localTags();
    Object.keys(local).forEach(k => { if (local[k] === id) delete local[k]; });
    store.set(TAGS_KEY, local);
  }

  /* =====================================================================
     LEITURA NFC
     ===================================================================== */
  // Variações comuns do mesmo UID entre leitores (ordem dos bytes invertida, decimal)
  function codeVariants(code) {
    const v = new Set([code]);
    const reverseBytes = hex => (hex.match(/../g) || []).reverse().join('');
    if (/^[0-9A-F]+$/.test(code) && code.length % 2 === 0) v.add(reverseBytes(code));
    if (/^\d{8,20}$/.test(code)) {
      try {
        let hex = BigInt(code).toString(16).toUpperCase();
        if (hex.length % 2) hex = '0' + hex;
        v.add(hex); v.add(reverseBytes(hex));
      } catch { /* ignora */ }
    }
    return [...v];
  }

  function handleCode(raw, source = 'leitor') {
    const code = normalize(raw);
    if (!code) return;
    $('#lastRead').textContent = code;

    if (S.learn) {
      const mod = BY_ID[S.learn];
      saveTag(code, S.learn);
      S.learn = null;
      renderAdmin();
      toast(`Tag vinculada a <b>${mod.nome}</b>`, code);
      return;
    }

    // Modo teste: número do módulo
    if (/^\d{1,2}$/.test(code)) {
      const m = MODS[+code - 1];
      if (m) { closeOverlay('admin'); openModule(m.id, 'teste'); }
      return;
    }
    // Texto gravado na tag com o id do módulo
    const byName = MODS.find(m => normalize(m.id) === code);
    if (byName) { closeOverlay('admin'); openModule(byName.id, source); return; }

    const tags = allTags();
    const hit = codeVariants(code).find(c => tags[c]);
    if (hit && BY_ID[tags[hit]]) { closeOverlay('admin'); openModule(tags[hit], source); return; }

    if (code.length >= CFG.leitor.tamanhoMinimo) toast('Tag não cadastrada. Segure o logo Maestro para vincular.', code);
  }

  // Leitor USB em modo teclado
  let buf = '', bufT = 0, silentT = null;
  function onKey(e) {
    if (e.target.closest && e.target.closest('input, textarea')) return;

    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); $('#admin').classList.contains('is-open') ? closeOverlay('admin') : openOverlay('admin'); return; }

    const now = performance.now();
    if (now - bufT > 1500) buf = '';
    clearTimeout(silentT);

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const c = buf; buf = '';
      if (c) handleCode(c);
      return;
    }
    if (e.key.length === 1 && /[0-9a-zA-Z:\- ]/.test(e.key)) {
      buf += e.key; bufT = now;
      // leitores que não enviam Enter: processa após um breve silêncio
      silentT = setTimeout(() => {
        if (normalize(buf).length >= CFG.leitor.tamanhoMinimo) { const c = buf; buf = ''; handleCode(c); }
      }, CFG.leitor.intervaloSemEnter);
      return;
    }
    if (!buf) {
      if (e.key === 'ArrowRight') { S.view === 'module' ? setScene(S.scene + 1) : openModule(MODS[0].id); onInteraction(); }
      else if (e.key === 'ArrowLeft' && S.view === 'module') { setScene(S.scene - 1); onInteraction(); }
      else if (e.key === 'ArrowDown' && S.view === 'module') { openModule(MODS[S.mod.n % MODS.length].id); }
      else if (e.key === 'ArrowUp' && S.view === 'module') { openModule(MODS[(S.mod.n - 2 + MODS.length) % MODS.length].id); }
      else if (e.key === 'Escape') { closeOverlay('admin'); goHome(); }
    }
  }

  // NFC do próprio tablet (Chrome Android + HTTPS)
  let webNfcOn = false;
  async function startWebNfc(silent = false) {
    if (!('NDEFReader' in window) || webNfcOn) return;
    try {
      const reader = new NDEFReader();
      await reader.scan();
      webNfcOn = true;
      reader.onreading = ev => {
        let id = null;
        for (const rec of ev.message.records) {
          try {
            const text = new TextDecoder(rec.encoding || 'utf-8').decode(rec.data);
            if (rec.recordType === 'url') {
              const hit = text.match(/[?&]m(?:odulo)?=([\w-]+)/) || text.match(/#\/([\w-]+)/);
              if (hit) id = hit[1];
            } else if (rec.recordType === 'text') {
              id = text.trim();
            }
          } catch { /* registro não textual */ }
        }
        if (id && BY_ID[id] && !S.learn) { closeOverlay('admin'); openModule(id, 'nfc'); }
        else handleCode(ev.serialNumber || '', 'nfc');
      };
      if (!silent) toast('NFC do tablet ativado');
      if ($('#admin').classList.contains('is-open')) renderAdmin();
    } catch (err) {
      if (!silent) toast('Não foi possível ativar o NFC do tablet', err && err.name);
    }
  }

  /* =====================================================================
     UTILITÁRIOS
     ===================================================================== */
  let toastT = null;
  function toast(html, code) {
    const t = $('#toast');
    t.innerHTML = `<i class="sq"></i><span>${html}</span>${code ? `<code>${code}</code>` : ''}`;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 3200);
  }

  let wakeLock = null;
  async function keepAwake() {
    if (!CFG.manterTelaLigada || VISITOR || !('wakeLock' in navigator) || wakeLock) return;
    try { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } catch { /* sem permissão */ }
  }

  function firstTouch() {
    if (CFG.telaCheiaAoTocar && !VISITOR && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    keepAwake();
  }

  async function prepareOffline() {
    const btn = $('#btnOffline');
    const urls = [];
    MODS.forEach(m => {
      const base = `assets/modulos/${m.id}`;
      urls.push(...exts(`${base}/capa`), `${base}/video.mp4`, ...[1, 2, 3, 4].flatMap(n => exts(`${base}/tela-${n}`)));
    });
    let ok = 0, done = 0;
    btn.disabled = true;
    await Promise.all(urls.map(u => fetch(u).then(r => { if (r.ok) ok++; }).catch(() => {}).finally(() => {
      done++; btn.textContent = `Baixando… ${Math.round(done / urls.length * 100)}%`;
    })));
    btn.disabled = false;
    btn.textContent = 'Preparar para offline';
    const swOn = navigator.serviceWorker && navigator.serviceWorker.controller;
    toast(swOn ? `${ok} mídias salvas para uso offline` : 'Offline só funciona com a página publicada em HTTPS ou em localhost');
  }

  /* =====================================================================
     EVENTOS
     ===================================================================== */
  function bind() {
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onInteraction, { passive: true });
    document.addEventListener('pointerdown', firstTouch, { once: true });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') keepAwake(); });
    window.addEventListener('resize', moveTabIndicator);

    document.addEventListener('click', e => {
      const open = e.target.closest('[data-open]');
      if (open) { openModule(open.dataset.open); return; }
      const close = e.target.closest('[data-close]');
      if (close) { closeOverlay(close.closest('.overlay').id); return; }
      const tab = e.target.closest('#sceneTabs button');
      if (tab) { setScene(+tab.dataset.scene); return; }
    });

    $('#btnExplorar').addEventListener('click', () => openOverlay('grid'));
    $('#btnGridModule').addEventListener('click', () => openOverlay('grid'));
    $('#btnClose').addEventListener('click', goHome);
    $('#btnLogoModule').addEventListener('click', goHome);

    // Painel: segurar o logo por 2 segundos
    let holdT = null;
    const logo = $('#logoHome');
    logo.addEventListener('pointerdown', () => { holdT = setTimeout(() => openOverlay('admin'), 2000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => logo.addEventListener(ev, () => clearTimeout(holdT)));
    logo.addEventListener('contextmenu', e => e.preventDefault());

    $('#admList').addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const id = b.closest('.adm-row').dataset.id;
      if (b.dataset.act === 'learn') { S.learn = S.learn === id ? null : id; renderAdmin(); }
      if (b.dataset.act === 'clear') { clearTags(id); renderAdmin(); }
      if (b.dataset.act === 'open') { closeOverlay('admin'); openModule(id); }
      if (b.dataset.act === 'link') {
        const url = linkFor(id);
        navigator.clipboard.writeText(url).then(() => toast('Link copiado', url)).catch(() => toast('Copie o link', url));
      }
    });
    $('#btnWebNfc').addEventListener('click', () => startWebNfc());
    $('#btnCopy').addEventListener('click', async () => {
      const txt = $('#admExport').value;
      try { await navigator.clipboard.writeText(txt); toast('Vínculos copiados'); }
      catch { $('#admExport').select(); toast('Selecione e copie o texto'); }
    });
    $('#btnOffline').addEventListener('click', prepareOffline);

    // Deslizar entre cenas
    let sx = null, sy = null;
    const scenes = $('#scenes');
    scenes.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
    scenes.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) setScene(S.scene + (dx < 0 ? 1 : -1));
    });
  }

  /* =====================================================================
     INÍCIO
     ===================================================================== */
  function init() {
    buildBackground();
    buildMarquee();
    buildGrid();
    bind();

    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    if ('NDEFReader' in window && navigator.permissions) {
      navigator.permissions.query({ name: 'nfc' }).then(p => { if (p.state === 'granted') startWebNfc(true); }).catch(() => {});
    }

    // Link direto para um módulo: index.html#/gestor ou index.html?m=gestor
    document.body.classList.toggle('is-visitor', VISITOR);
    const fromHash = (location.hash.match(/^#\/([\w-]+)/) || [])[1];
    const start = LINK_ID || fromHash;
    if (start && BY_ID[start]) setTimeout(() => openModule(start, 'link'), 300);
  }

  init();
})();
