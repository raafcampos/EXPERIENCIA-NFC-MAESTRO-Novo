/* =====================================================================
   EXPERIÊNCIA NFC · MAESTRO — Captura de contato e registro das sessões
   - Lê o QR do crachá pela câmera (leitor nativo do Chrome ou jsQR como reserva)
   - Permite digitar os dados quando o QR não é lido
   - Guarda tudo no próprio tablet (localStorage) e exporta em CSV pelo painel
   - Se config.quiz.endpoint estiver preenchido, também envia para lá e reenvia o que ficou pendente
   ===================================================================== */
(() => {
  'use strict';

  const RAIZ = window.MAESTRO || {};
  const CQ = (RAIZ.config || {}).quiz || {};
  const CHAVE = 'maestro-sessoes';
  const LIMITE_GUARDADO = 800;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Armazenamento ---------- */
  const lerTudo = () => {
    try { return JSON.parse(localStorage.getItem(CHAVE) || '[]'); } catch { return []; }
  };
  const salvarTudo = lista => {
    try { localStorage.setItem(CHAVE, JSON.stringify(lista.slice(-LIMITE_GUARDADO))); } catch { /* cota cheia */ }
  };

  function gravar(sessao) {
    if (!sessao || !sessao.id) return;
    const lista = lerTudo();
    const i = lista.findIndex(s => s.id === sessao.id);
    const registro = { ...sessao, atualizado: new Date().toISOString() };
    if (i >= 0) lista[i] = { ...lista[i], ...registro }; else lista.push(registro);
    salvarTudo(lista);
    enviarPendentes();
  }

  /* ---------- Envio opcional para planilha/webhook ---------- */
  async function enviarPendentes() {
    if (!CQ.endpoint || !navigator.onLine) return;
    const lista = lerTudo();
    const pendentes = lista.filter(s => s.concluiu && !s.enviado);
    for (const s of pendentes) {
      try {
        await fetch(CQ.endpoint, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(s)
        });
        s.enviado = true;
      } catch { break; }
    }
    salvarTudo(lista);
  }
  window.addEventListener('online', enviarPendentes);

  /* ---------- Benchmark do próprio estande ---------- */
  function benchmark(quizId) {
    const minimo = CQ.minimoBenchmark || 20;
    const sessoes = lerTudo().filter(s => s.quiz === quizId && s.concluiu && !s.teste);
    const n = sessoes.length;
    return {
      n,
      frasePara(eixoId) {
        if (n < minimo) return '';
        const fracos = sessoes.filter(s => (s.percentual_por_eixo || {})[eixoId] <= 33).length;
        const pct = Math.round(fracos / n * 100);
        if (!pct) return '';
        return `${pct}% de quem respondeu neste estande está no mesmo ponto.`;
      }
    };
  }

  /* ---------- Tela de captura ---------- */
  let sessaoAtual = null, aoConcluir = null, stream = null, lendo = false, jsqrCarregado = null;

  function abrir(sessao, callback) {
    sessaoAtual = sessao; aoConcluir = callback || null;
    $$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'captura'));
    document.body.dataset.view = 'captura';
    mostrarEtapa('leitura');
    iniciarCamera();
  }

  function fechar(irParaInicio = true) {
    pararCamera();
    if (irParaInicio) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  }

  function mostrarEtapa(etapa) {
    $$('#captura [data-etapa]').forEach(el => { el.hidden = el.dataset.etapa !== etapa; });
    if (etapa === 'obrigado') {
      clearTimeout(mostrarEtapa._t);
      mostrarEtapa._t = setTimeout(() => fechar(true), 6000);
    }
  }

  /* ---------- Câmera e leitura do QR ---------- */
  async function carregarJsQR() {
    if (window.jsQR) return true;
    if (jsqrCarregado) return jsqrCarregado;
    jsqrCarregado = new Promise(resolve => {
      const s = document.createElement('script');
      s.src = 'assets/vendor/jsqr.js';
      s.onload = () => resolve(!!window.jsQR);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
    return jsqrCarregado;
  }

  async function iniciarCamera() {
    const video = $('#capVideo');
    const aviso = $('#capAviso');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      aviso.textContent = 'Este aparelho não libera a câmera para a página. Use a opção de digitar os dados.';
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      video.srcObject = stream;
      await video.play();
      aviso.textContent = '';
      lendo = true;
      lerQuadro();
    } catch (err) {
      aviso.textContent = err && err.name === 'NotAllowedError'
        ? 'Permissão de câmera negada. Você pode digitar os dados ao lado.'
        : 'Não foi possível abrir a câmera. Você pode digitar os dados ao lado.';
    }
  }

  function pararCamera() {
    lendo = false;
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    const video = $('#capVideo');
    if (video) video.srcObject = null;
  }

  let detector = null;
  async function lerQuadro() {
    if (!lendo) return;
    const video = $('#capVideo');
    try {
      if ('BarcodeDetector' in window) {
        detector = detector || new window.BarcodeDetector({ formats: ['qr_code'] });
        const codigos = await detector.detect(video);
        if (codigos && codigos.length) return achouQR(codigos[0].rawValue);
      } else if (await carregarJsQR()) {
        const canvas = $('#capCanvas');
        const l = video.videoWidth, a = video.videoHeight;
        if (l && a) {
          canvas.width = l; canvas.height = a;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(video, 0, 0, l, a);
          const dados = ctx.getImageData(0, 0, l, a);
          const achado = window.jsQR(dados.data, l, a, { inversionAttempts: 'dontInvert' });
          if (achado && achado.data) return achouQR(achado.data);
        }
      } else {
        $('#capAviso').textContent = 'Leitor de QR indisponível neste navegador. Use a opção de digitar os dados.';
        lendo = false;
        return;
      }
    } catch { /* quadro ruim, tenta o próximo */ }
    requestAnimationFrame(lerQuadro);
  }

  function achouQR(valor) {
    if (!valor) return;
    lendo = false;
    pararCamera();
    if (sessaoAtual) {
      sessaoAtual.qr = String(valor).slice(0, 500);
      sessaoAtual.capturou_contato = true;
      gravar(sessaoAtual);
      if (aoConcluir) aoConcluir();
    }
    $('#capQrLido').textContent = String(valor).slice(0, 120);
    mostrarEtapa('obrigado');
  }

  /* ---------- Formulário ---------- */
  function enviarFormulario(e) {
    e.preventDefault();
    const form = e.target;
    const dados = Object.fromEntries(new FormData(form).entries());
    const email = (dados.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      $('#capErro').textContent = 'Confira o e-mail digitado.';
      return;
    }
    $('#capErro').textContent = '';
    if (sessaoAtual) {
      sessaoAtual.contato = {
        nome: (dados.nome || '').trim(), empresa: (dados.empresa || '').trim(),
        cargo: (dados.cargo || '').trim(), email, whatsapp: (dados.whatsapp || '').trim()
      };
      sessaoAtual.capturou_contato = true;
      gravar(sessaoAtual);
      if (aoConcluir) aoConcluir();
    }
    form.reset();
    pararCamera();
    mostrarEtapa('obrigado');
  }

  /* ---------- Exportação CSV ---------- */
  const COLUNAS = ['id', 'quiz', 'evento', 'dispositivo', 'inicio', 'fim', 'concluiu', 'teste',
    'perfil', 'pontuacao_total', 'nivel', 'gargalos', 'percentual_por_eixo', 'respostas', 'respostas_texto',
    'vertical', 'porte_operacao', 'distribuicao_equipe', 'indice_aderencia', 'configuracao', 'fatores', 'dores',
    'modulos', 'plano_sugerido', 'capturou_contato', 'qr',
    'contato_nome', 'contato_empresa', 'contato_cargo', 'contato_email', 'contato_whatsapp'];

  function valorDaColuna(s, c) {
    if (c.startsWith('contato_')) return ((s.contato || {})[c.slice(8)] || '');
    const v = s[c];
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(' | ');
    if (typeof v === 'object') return Object.entries(v).map(([k, x]) => `${k}=${x}`).join(' | ');
    return String(v);
  }

  function exportarCSV() {
    const lista = lerTudo();
    if (!lista.length) { alert('Ainda não há respostas guardadas neste aparelho.'); return; }
    const escapa = t => `"${String(t).replace(/"/g, '""')}"`;
    const linhas = [COLUNAS.join(';')].concat(lista.map(s => COLUNAS.map(c => escapa(valorDaColuna(s, c))).join(';')));
    const blob = new Blob(['﻿' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `maestro-respostas-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------- Caixa no painel de configuração ---------- */
  function montarCaixaNoPainel() {
    const lado = $('.adm-side');
    if (!lado || $('#admRespostas')) return;
    const box = document.createElement('div');
    box.className = 'adm-box';
    box.id = 'admRespostas';
    box.innerHTML = `
      <h3>Respostas dos quizzes</h3>
      <p id="admContagem">Nenhuma resposta ainda.</p>
      <button class="btn-sm primary" data-exportar type="button">Exportar CSV</button>
      <button class="btn-sm" data-limpar type="button">Apagar respostas</button>`;
    lado.appendChild(box);
    box.addEventListener('click', e => {
      if (e.target.closest('[data-exportar]')) exportarCSV();
      if (e.target.closest('[data-limpar]')) {
        if (confirm('Apagar todas as respostas guardadas neste aparelho?')) { salvarTudo([]); atualizarContagem(); }
      }
    });
    atualizarContagem();
  }

  function atualizarContagem() {
    const el = $('#admContagem');
    if (!el) return;
    const lista = lerTudo();
    const completas = lista.filter(s => s.concluiu).length;
    const contatos = lista.filter(s => s.capturou_contato).length;
    el.innerHTML = lista.length
      ? `<b>${lista.length}</b> sessões · ${completas} concluídas · ${contatos} com contato`
      : 'Nenhuma resposta ainda.';
  }

  /* ---------- Início ---------- */
  function init() {
    if (!$('#captura')) return;
    $('#capForm').addEventListener('submit', enviarFormulario);
    $('#btnCapDigitar').addEventListener('click', () => mostrarEtapa('formulario'));
    $('#btnCapCamera').addEventListener('click', () => { mostrarEtapa('leitura'); iniciarCamera(); });
    $$('#captura [data-pular]').forEach(b => b.addEventListener('click', () => { pararCamera(); fechar(true); }));
    $('#capConsentimento').textContent = CQ.consentimento || '';

    // painel de configuração: caixa de respostas aparece quando o painel abre
    document.addEventListener('click', e => {
      if (e.target.closest('#logoHome') || e.target.closest('[data-act]')) setTimeout(montarCaixaNoPainel, 200);
    });
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') setTimeout(montarCaixaNoPainel, 200);
    });
    enviarPendentes();
  }

  window.MAESTRO_CAPTURA = { abrir, gravar, benchmark, exportarCSV, montarCaixaNoPainel };
  init();
})();
