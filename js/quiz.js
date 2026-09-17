/* =====================================================================
   EXPERIÊNCIA NFC · MAESTRO — Quizzes
   Dois quizzes entram como os dois últimos botões da tela "Os 16 módulos",
   no lugar de Administração e Dashboards / BI (que continuam acessíveis
   pela tag, pela faixa da tela inicial e como recomendação nos resultados).

   Para editar: mude os textos em QUIZZES abaixo.
   Links diretos: ?q=maturidade  ·  ?q=conexao
   Para conferir um resultado sem responder: ?q=maturidade&respostas=1,2,2,3,2,3
   ===================================================================== */
(() => {
  'use strict';

  const CFG = (window.MAESTRO && window.MAESTRO.config) || {};
  const MODS = (window.MAESTRO && window.MAESTRO.modulos) || [];
  const BY_ID = Object.fromEntries(MODS.map(m => [m.id, m]));

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  // Módulos que saem da grade para dar lugar aos quizzes
  const FORA_DA_GRADE = ['administracao', 'dashboards-bi'];

  /* =====================================================================
     CONTEÚDO
     ===================================================================== */
  const QUIZZES = [
    {
      id: 'maturidade',
      nome: 'Termômetro da Operação',
      chamada: 'Qual o nível de maturidade da sua operação?',
      tipo: 'pontuacao',
      icone: svg('<path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v6.5"/>'),
      perguntas: [
        {
          titulo: 'Como as tarefas do dia a dia chegam até a equipe?',
          opcoes: [
            { texto: 'No papel, por telefone ou WhatsApp', pontos: 1 },
            { texto: 'Por planilhas compartilhadas', pontos: 2 },
            { texto: 'Por sistema, mas cada área usa o seu', pontos: 3 },
            { texto: 'Por um sistema único, com checklist e prazo', pontos: 4 }
          ]
        },
        {
          titulo: 'Quando algo sai do combinado, como vocês descobrem?',
          opcoes: [
            { texto: 'Pela reclamação do cliente', pontos: 1 },
            { texto: 'Quando alguém comenta informalmente', pontos: 2 },
            { texto: 'No relatório do fim do dia ou da semana', pontos: 3 },
            { texto: 'Na hora, por alerta automático', pontos: 4 }
          ]
        },
        {
          titulo: 'Como vocês comprovam o serviço executado?',
          opcoes: [
            { texto: 'Pela palavra de quem executou', pontos: 1 },
            { texto: 'Fotos soltas no celular da equipe', pontos: 2 },
            { texto: 'Relatório montado à mão depois', pontos: 3 },
            { texto: 'Registro com foto, hora e localização', pontos: 4 }
          ]
        },
        {
          titulo: 'Onde ficam exames, treinamentos e entrega de EPI?',
          opcoes: [
            { texto: 'Em pastas físicas', pontos: 1 },
            { texto: 'Em arquivos no computador', pontos: 2 },
            { texto: 'Em planilha com controle de prazo', pontos: 3 },
            { texto: 'No sistema, com aviso antes de vencer', pontos: 4 }
          ]
        },
        {
          titulo: 'Com que frequência vocês olham indicadores da operação?',
          opcoes: [
            { texto: 'Quase nunca, falta dado confiável', pontos: 1 },
            { texto: 'Uma vez por mês, montando planilha', pontos: 2 },
            { texto: 'Toda semana, com relatório consolidado', pontos: 3 },
            { texto: 'Todo dia, em painel atualizado sozinho', pontos: 4 }
          ]
        },
        {
          titulo: 'Como a equipe de campo se comunica com a gestão?',
          opcoes: [
            { texto: 'Ligação e mensagem, sem registro', pontos: 1 },
            { texto: 'Mensagem e depois alguém digita', pontos: 2 },
            { texto: 'Sistema no escritório, papel no campo', pontos: 3 },
            { texto: 'App no celular, direto na plataforma', pontos: 4 }
          ]
        }
      ],
      resultados: [
        {
          max: 10, nivel: 1, titulo: 'Operação no improviso',
          texto: 'A operação anda pela experiência das pessoas. Funciona, mas depende de quem está de plantão, e cada problema vira uma correria.',
          proximos: ['Centralizar as ordens de serviço em um só lugar', 'Registrar evidência de execução com foto, hora e local', 'Criar checklists para as atividades críticas'],
          modulos: ['gestor', 'atendimento-interno', 'documentos']
        },
        {
          max: 15, nivel: 2, titulo: 'Operação organizada',
          texto: 'Já existe método e registro, mas a informação mora em planilhas e sistemas separados. Consolidar dá trabalho e o dado chega atrasado.',
          proximos: ['Unificar planejamento, execução e medição', 'Controlar exames, treinamentos e EPIs com prazo', 'Padronizar a abertura e o acompanhamento de chamados'],
          modulos: ['gestor', 'projetos', 'colaboradores']
        },
        {
          max: 20, nivel: 3, titulo: 'Operação sob controle',
          texto: 'A execução é acompanhada e há indicadores. O próximo salto é usar esses dados para antecipar problemas em vez de reagir a eles.',
          proximos: ['Consolidar contratos e KPIs em painéis únicos', 'Cruzar previsto e realizado por equipe e contrato', 'Levar a operação para o campo pelo aplicativo'],
          modulos: ['analitico', 'dashboards-bi', 'colaboradores']
        },
        {
          max: 24, nivel: 4, titulo: 'Operação orquestrada',
          texto: 'Processo, evidência e indicador conversam entre si. Agora o ganho está em automatizar acionamentos e engajar quem executa.',
          proximos: ['Transformar dados de sensores em acionamentos automáticos', 'Reconhecer e engajar as equipes com base na própria operação', 'Abrir visões controladas para clientes e parceiros'],
          modulos: ['sensores', 'loyalty', 'clientes']
        }
      ]
    },

    {
      id: 'conexao',
      nome: 'Maestro sob Medida',
      chamada: 'Quais módulos conversam com a sua operação?',
      tipo: 'modulos',
      icone: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="4"/><path d="M6.3 6.3l2.6 2.6M15.1 15.1l2.6 2.6M17.7 6.3l-2.6 2.6M8.9 15.1l-2.6 2.6"/>'),
      perguntas: [
        {
          titulo: 'O que mais tira o seu sono na operação?',
          opcoes: [
            { texto: 'Prazo e execução das atividades', modulos: { gestor: 3, projetos: 2 } },
            { texto: 'Contratar, treinar e manter a equipe', modulos: { 'recrutamento-selecao': 3, treinamentos: 2, colaboradores: 2 } },
            { texto: 'Conformidade e documentação', modulos: { documentos: 3, colaboradores: 2 } },
            { texto: 'Falta de informação para decidir', modulos: { 'dashboards-bi': 3, analitico: 3 } }
          ]
        },
        {
          titulo: 'Como o cliente ou contratante fala com vocês?',
          opcoes: [
            { texto: 'Liga ou manda mensagem para alguém do time', modulos: { 'atendimento-interno': 3 } },
            { texto: 'Abre chamado em um canal próprio', modulos: { 'atendimento-interno': 2, clientes: 2 } },
            { texto: 'Cobra relatórios e evidências periódicas', modulos: { clientes: 3, analitico: 2 } },
            { texto: 'Quase não fala, só aparece quando dá problema', modulos: { pesquisas: 3, clientes: 2 } }
          ]
        },
        {
          titulo: 'Onde a sua equipe passa o dia?',
          opcoes: [
            { texto: 'Espalhada em campo, mudando de lugar', modulos: { analitico: 3, colaboradores: 2 } },
            { texto: 'Em postos fixos, com escala definida', modulos: { colaboradores: 3, gestor: 2 } },
            { texto: 'Em projetos com começo, meio e fim', modulos: { projetos: 3, gestor: 2 } },
            { texto: 'Em instalações com máquinas e equipamentos', modulos: { sensores: 3, suprimentos: 2 } }
          ]
        },
        {
          titulo: 'O que você automatizaria primeiro?',
          opcoes: [
            { texto: 'Abertura e triagem de chamados', modulos: { 'atendimento-interno': 3 } },
            { texto: 'Ordens de serviço e checklists', modulos: { gestor: 3 } },
            { texto: 'Treinamentos e certificados', modulos: { treinamentos: 3 } },
            { texto: 'Estoque, EPI e uniforme', modulos: { suprimentos: 3, colaboradores: 1 } }
          ]
        },
        {
          titulo: 'Como está o engajamento das equipes?',
          opcoes: [
            { texto: 'Alta rotatividade, difícil segurar gente', modulos: { loyalty: 2, 'recrutamento-selecao': 2, oportunidades: 1 } },
            { texto: 'Equipe estável, mas desmotivada', modulos: { loyalty: 3, pesquisas: 2 } },
            { texto: 'Boa, mas sem reconhecimento estruturado', modulos: { loyalty: 2, treinamentos: 2 } },
            { texto: 'Não sei dizer, falta escutar o time', modulos: { pesquisas: 3, loyalty: 1 } }
          ]
        },
        {
          titulo: 'Se pudesse enxergar uma coisa em tempo real, seria…',
          opcoes: [
            { texto: 'Onde estão as equipes e os veículos', modulos: { analitico: 3, sensores: 1 } },
            { texto: 'O andamento de cada atividade', modulos: { gestor: 2, 'dashboards-bi': 2 } },
            { texto: 'Indicadores por contrato', modulos: { 'dashboards-bi': 3, analitico: 1 } },
            { texto: 'Consumo de materiais e custos', modulos: { suprimentos: 3, 'dashboards-bi': 1 } }
          ]
        }
      ],
      resultado: {
        titulo: 'O seu Maestro começa por aqui',
        texto: 'Pelas suas respostas, estes são os módulos que mais conversam com a sua operação. Toque em um deles para conhecer.'
      }
    }
  ];

  const BY_QUIZ = Object.fromEntries(QUIZZES.map(q => [q.id, q]));

  // O app usa estes dois pontos para vincular tags NFC aos quizzes (valor "quiz:<id>")
  window.MAESTRO_QUIZZES = QUIZZES.map(q => ({ id: q.id, nome: q.nome }));
  window.MAESTRO_ABRIR_QUIZ = id => abrirQuiz(id);

  /* =====================================================================
     ESTADO
     ===================================================================== */
  const S = { quiz: null, passo: 0, respostas: [], idleT: null };

  const PARAMS = new URLSearchParams(location.search);
  const LINK_Q = PARAMS.get('q');
  const INSTALADO = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
  const VISITANTE = !!(LINK_Q && BY_QUIZ[LINK_Q]) && !INSTALADO && PARAMS.get('modo') !== 'totem';

  /* =====================================================================
     BOTÕES NA TELA DOS MÓDULOS
     ===================================================================== */
  function montarBotoes() {
    const grade = $('#gridList');
    if (!grade) return;
    FORA_DA_GRADE.forEach(id => {
      const c = grade.querySelector(`[data-open="${id}"]`);
      if (c) c.classList.add('fora-da-grade');
    });
    QUIZZES.forEach((q, i) => {
      const b = document.createElement('button');
      b.className = 'card card-quiz';
      b.type = 'button';
      b.dataset.quiz = q.id;
      b.style.setProperty('--i', MODS.length + i);
      b.innerHTML = `
        <span class="card-top"><span class="card-n">Quiz</span>${q.icone}</span>
        <span class="card-name">${q.nome}</span>
        <span class="card-sub">${q.chamada}</span>`;
      grade.appendChild(b);
    });
  }

  /* =====================================================================
     NAVEGAÇÃO
     ===================================================================== */
  function abrirQuiz(id) {
    const q = BY_QUIZ[id];
    if (!q) return;
    S.quiz = q; S.passo = 0; S.respostas = [];
    $$('.overlay').forEach(o => o.classList.remove('is-open'));
    mostrarView();
    render();
    try { history.replaceState(null, '', `?q=${id}`); } catch { /* file:// */ }
  }

  function mostrarView() {
    $$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'quiz'));
    document.body.dataset.view = 'quiz';
    document.body.classList.toggle('is-visitor', VISITANTE);
    reiniciarInatividade();
  }

  function voltarAoInicio() {
    clearTimeout(S.idleT);
    S.quiz = null;
    try { history.replaceState(null, '', location.pathname); } catch { /* file:// */ }
    // o app cuida da tela inicial (mesmo caminho da tecla Esc)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  }

  function reiniciarInatividade() {
    clearTimeout(S.idleT);
    const barra = $('#quizIdleBar');
    if (VISITANTE || document.body.dataset.view !== 'quiz') return;
    const seg = (CFG.tempos && CFG.tempos.voltarInicio) || 90;
    if (barra) {
      barra.style.transition = 'none'; barra.style.transform = 'scaleX(1)';
      void barra.offsetWidth;
      barra.style.transition = `transform ${seg}s linear`; barra.style.transform = 'scaleX(0)';
    }
    S.idleT = setTimeout(voltarAoInicio, seg * 1000);
  }

  /* =====================================================================
     TELAS
     ===================================================================== */
  function render() {
    const q = S.quiz;
    if (!q) return;
    const total = q.perguntas.length;
    const naPergunta = S.passo < total;

    $('#quizSteps').innerHTML = q.perguntas
      .map((_, i) => `<i class="${i < S.passo ? 'feito' : i === S.passo ? 'atual' : ''}"></i>`).join('');
    $('#quizStep').textContent = naPergunta ? pad(S.passo + 1) : pad(total);
    $('#quizTotal').textContent = pad(total);
    $('#btnQuizBack').hidden = S.passo === 0;

    $('#quizStage').innerHTML = naPergunta ? telaPergunta(q, S.passo) : telaResultado(q);
    const palco = $('#quizStage');
    palco.classList.remove('enter'); void palco.offsetWidth; palco.classList.add('enter');
  }

  function telaPergunta(q, i) {
    const p = q.perguntas[i];
    const letras = ['A', 'B', 'C', 'D', 'E'];
    return `
      <div class="q-head anim" style="--i:0">
        <p class="eyebrow">${q.nome} · Pergunta ${pad(i + 1)} de ${pad(q.perguntas.length)}</p>
        <h2 class="q-title">${p.titulo}</h2>
      </div>
      <div class="q-options">
        ${p.opcoes.map((o, k) => `
          <button class="q-opt anim" style="--i:${k + 1}" data-opcao="${k}" type="button">
            <span class="q-letter">${letras[k]}</span>
            <span class="q-text">${o.texto}</span>
          </button>`).join('')}
      </div>`;
  }

  function iconeDoModulo(id) {
    const original = $(`#gridList [data-open="${id}"] svg`);
    return original ? original.outerHTML : '';
  }

  function cartoesDeModulos(ids) {
    return ids.map((id, k) => {
      const m = BY_ID[id];
      if (!m) return '';
      return `
        <button class="res-mod anim" style="--i:${k + 3}" data-open="${id}" type="button">
          <span class="res-mod-top">${iconeDoModulo(id)}<span class="res-mod-n">${m.nome}</span></span>
          <span class="res-mod-h">${m.headline}</span>
          <span class="res-mod-cta">Conhecer o módulo →</span>
        </button>`;
    }).join('');
  }

  function telaResultado(q) {
    return q.tipo === 'pontuacao' ? resultadoMaturidade(q) : resultadoConexao(q);
  }

  function resultadoMaturidade(q) {
    const pontos = S.respostas.reduce((soma, r, i) => soma + (q.perguntas[i].opcoes[r].pontos || 0), 0);
    const faixa = q.resultados.find(r => pontos <= r.max) || q.resultados[q.resultados.length - 1];
    return `
      <div class="res">
        <div class="res-left">
          <p class="eyebrow anim" style="--i:0">Resultado · ${pontos} de ${q.perguntas.length * 4} pontos</p>
          <h2 class="res-title anim" style="--i:1">${faixa.titulo}</h2>
          <div class="res-gauge anim" style="--i:2">
            ${q.resultados.map((r, i) => `<i class="${i < faixa.nivel ? 'on' : ''}"></i>`).join('')}
            <span>Nível ${faixa.nivel} de ${q.resultados.length}</span>
          </div>
          <p class="res-text anim" style="--i:2">${faixa.texto}</p>
          <div class="res-next anim" style="--i:3">
            <h3>Próximos passos</h3>
            <ul>${faixa.proximos.map(p => `<li><i class="sq"></i>${p}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="res-right">
          <p class="eyebrow anim" style="--i:2">Módulos que ajudam nesse salto</p>
          <div class="res-mods">${cartoesDeModulos(faixa.modulos)}</div>
          <div class="res-actions anim" style="--i:6">
            <button class="btn-ghost" data-quiz-refazer type="button"><i class="sq"></i> Refazer</button>
            <button class="btn-link" data-quiz-modulos type="button">Ver todos os módulos</button>
          </div>
        </div>
      </div>`;
  }

  function resultadoConexao(q) {
    const placar = {};
    S.respostas.forEach((r, i) => {
      const pesos = q.perguntas[i].opcoes[r].modulos || {};
      Object.entries(pesos).forEach(([id, peso]) => { placar[id] = (placar[id] || 0) + peso; });
    });
    const top = Object.entries(placar).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
    return `
      <div class="res res-conexao">
        <div class="res-left">
          <p class="eyebrow anim" style="--i:0">Resultado</p>
          <h2 class="res-title anim" style="--i:1">${q.resultado.titulo}</h2>
          <p class="res-text anim" style="--i:2">${q.resultado.texto}</p>
          <div class="res-actions anim" style="--i:3">
            <button class="btn-ghost" data-quiz-refazer type="button"><i class="sq"></i> Refazer</button>
            <button class="btn-link" data-quiz-modulos type="button">Ver todos os módulos</button>
          </div>
        </div>
        <div class="res-right"><div class="res-mods res-mods-3">${cartoesDeModulos(top)}</div></div>
      </div>`;
  }

  /* =====================================================================
     INTERAÇÃO
     ===================================================================== */
  function responder(k) {
    S.respostas[S.passo] = k;
    S.passo++;
    render();
  }

  function ligarEventos() {
    document.addEventListener('click', e => {
      const botaoQuiz = e.target.closest('[data-quiz]');
      if (botaoQuiz) { abrirQuiz(botaoQuiz.dataset.quiz); return; }
      if (document.body.dataset.view !== 'quiz') return;

      const opcao = e.target.closest('[data-opcao]');
      if (opcao) {
        opcao.classList.add('escolhida');
        setTimeout(() => responder(+opcao.dataset.opcao), 220);
        return;
      }
      if (e.target.closest('[data-quiz-refazer]')) { S.passo = 0; S.respostas = []; render(); return; }
      if (e.target.closest('[data-quiz-modulos]')) { voltarAoInicio(); setTimeout(() => $('#btnExplorar').click(), 700); return; }
    });

    document.addEventListener('pointerdown', () => { if (document.body.dataset.view === 'quiz') reiniciarInatividade(); }, { passive: true });

    document.addEventListener('keydown', e => {
      if (document.body.dataset.view !== 'quiz' || S.passo >= (S.quiz ? S.quiz.perguntas.length : 0)) return;
      const k = 'abcd'.indexOf(e.key.toLowerCase());
      if (k >= 0 && k < S.quiz.perguntas[S.passo].opcoes.length) responder(k);
    });

    $('#btnQuizClose').addEventListener('click', voltarAoInicio);
    $('#btnLogoQuiz').addEventListener('click', voltarAoInicio);
    $('#btnQuizBack').addEventListener('click', () => { if (S.passo > 0) { S.passo--; render(); } });
  }

  /* =====================================================================
     INÍCIO
     ===================================================================== */
  function init() {
    if (!$('#quiz')) return;
    montarBotoes();
    ligarEventos();

    if (LINK_Q && BY_QUIZ[LINK_Q]) {
      setTimeout(() => {
        abrirQuiz(LINK_Q);
        // conferência rápida de um resultado: ?q=<id>&respostas=1,2,2,3,2,3
        const r = PARAMS.get('respostas');
        if (r) {
          S.respostas = r.split(',').map(n => Math.max(0, Math.min(3, parseInt(n, 10) - 1 || 0)));
          S.passo = BY_QUIZ[LINK_Q].perguntas.length;
          render();
        }
      }, 300);
    }
  }

  init();
})();
