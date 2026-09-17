/* =====================================================================
   EXPERIÊNCIA NFC · MAESTRO — Quizzes do SegSummit 2026
   1) Diagnóstico da Operação (?q=diagnostico) — perfil + 6 perguntas, 4 eixos, 4 níveis
   2) Maestro sob Medida     (?q=recomendador) — 10 perguntas, índice de aderência + top 3

   Os dois entram como os dois últimos botões da tela "Os 16 módulos", em amarelo,
   no lugar de Administração e Dashboards / BI (que seguem acessíveis por tag e link).

   Textos, pontuação e matriz de módulos ficam neste arquivo.
   A tela de captura (QR do crachá, e-mail) e o registro das sessões ficam em js/captura.js.
   ===================================================================== */
(() => {
  'use strict';

  const RAIZ = window.MAESTRO || {};
  const CFG = RAIZ.config || {};
  const CQ = CFG.quiz || {};
  const MODS = RAIZ.modulos || [];
  const BY_ID = Object.fromEntries(MODS.map(m => [m.id, m]));

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  const FORA_DA_GRADE = ['administracao', 'dashboards-bi'];

  /* =====================================================================
     1) DIAGNÓSTICO
     ===================================================================== */
  const EIXOS = {
    comprovacao:   { nome: 'Comprovação',      max: 3, perguntas: [0] },
    efetivo:       { nome: 'Efetivo e escala', max: 6, perguntas: [1, 2] },
    dado:          { nome: 'Dado e medição',   max: 6, perguntas: [3, 4] },
    transparencia: { nome: 'Transparência',    max: 3, perguntas: [5] }
  };
  const PRIORIDADE_EIXO = ['comprovacao', 'dado', 'efetivo', 'transparencia'];
  const PERFIS = {
    presta:   { rotulo: 'Presto o serviço',   leitura: 'presta' },
    contrata: { rotulo: 'Contrato o serviço', leitura: 'contrata' },
    ambos:    { rotulo: 'Os dois',            leitura: 'presta' }
  };

  const DIAGNOSTICO = {
    id: 'diagnostico',
    nome: 'Diagnóstico da Operação',
    chamada: 'Em 90 segundos, descubra o nível da gestão da sua operação em campo',
    tipo: 'diagnostico',
    icone: svg('<path d="M3 12h3.5l2-6 3.5 12 2.5-8 1.5 4H21"/>'),
    perfil: {
      titulo: 'No SegSummit, você está de que lado do contrato?',
      opcoes: [
        { id: 'presta',   texto: 'Presto o serviço',   apoio: 'Minha empresa executa a operação em campo' },
        { id: 'contrata', texto: 'Contrato o serviço', apoio: 'Eu fiscalizo quem executa' },
        { id: 'ambos',    texto: 'Os dois',            apoio: 'Executo e também subcontrato parte da operação' }
      ]
    },
    perguntas: [
      {
        eixo: 'comprovacao',
        titulo: 'O contratante liga perguntando se o serviço da madrugada foi executado ontem. Em quanto tempo você responde com prova?',
        opcoes: [
          { texto: 'No mesmo dia, depois de alguém conferir', pontos: 2, frase: 'Provar um serviço depende de alguém conferir antes.' },
          { texto: 'Na hora, com registro e localização', pontos: 3, frase: 'Você prova o serviço na hora, com registro e localização.' },
          { texto: 'Só ligando para o supervisor do turno', pontos: 1, frase: 'Você depende de ligar para o supervisor para provar um serviço.' },
          { texto: 'A gente confia no relato de quem estava lá', pontos: 0, frase: 'A prova do serviço é o relato de quem estava lá.' }
        ]
      },
      {
        eixo: 'efetivo',
        titulo: 'Um turno não é assumido às 5h da manhã. Como você fica sabendo?',
        opcoes: [
          { texto: 'O supervisor manda no grupo de WhatsApp', pontos: 1, frase: 'A falta de efetivo circula por WhatsApp, sem registro.' },
          { texto: 'O sistema acusa a ausência e já aciona a cobertura', pontos: 3, frase: 'O sistema acusa a ausência e aciona a cobertura sozinho.' },
          { texto: 'O sistema avisa, mas a cobertura é resolvida no telefone', pontos: 2, frase: 'A cobertura de uma falta ainda é resolvida no telefone.' },
          { texto: 'Quando o contratante reclama', pontos: 0, frase: 'Você descobre a falta de efetivo pelo contratante.' }
        ]
      },
      {
        eixo: 'efetivo',
        titulo: 'Onde está a escala do mês?',
        opcoes: [
          { texto: 'Em sistema, com o ponto conferido à parte', pontos: 2, frase: 'A escala está em sistema, mas o ponto é conferido à parte.' },
          { texto: 'Numa planilha que alguém atualiza', pontos: 1, frase: 'A escala do mês vive numa planilha que alguém atualiza.' },
          { texto: 'Em sistema, integrada ao ponto', pontos: 3, frase: 'A escala está em sistema e integrada ao ponto.' },
          { texto: 'Cada supervisor tem a sua', pontos: 0, frase: 'Cada supervisor mantém a própria escala.' }
        ]
      },
      {
        eixo: 'dado',
        titulo: 'Quanto tempo leva para fechar a medição de um contrato?',
        opcoes: [
          { texto: 'Alguns dias de conferência', pontos: 2, frase: 'O fechamento da medição consome dias de conferência.' },
          { texto: 'Sai automática nos primeiros dias do mês', pontos: 3, frase: 'A medição sai automática nos primeiros dias do mês.' },
          { texto: 'Uma semana ou mais, com muito retrabalho', pontos: 1, frase: 'Fechar a medição leva uma semana ou mais, com retrabalho.' },
          { texto: 'Sempre acaba em glosa e discussão', pontos: 0, frase: 'A medição sempre termina em glosa e discussão.' }
        ]
      },
      {
        eixo: 'dado',
        titulo: 'Sem consultar ninguém agora: quanto do que estava programado para a sua equipe no mês passado foi de fato executado no prazo?',
        opcoes: [
          { texto: 'Precisaria juntar relatórios de fontes diferentes', pontos: 1, frase: 'Saber o que foi executado no prazo exige juntar relatórios de fontes diferentes.' },
          { texto: 'Tenho a estimativa e confirmo em minutos', pontos: 2, frase: 'Você tem a estimativa, mas confirmar o número ainda leva tempo.' },
          { texto: 'Sei o número agora, está num painel', pontos: 3, frase: 'O número do executado no prazo está num painel, ao alcance.' },
          { texto: 'Não acompanhamos esse número', pontos: 0, frase: 'O quanto foi executado no prazo não é acompanhado.' }
        ]
      },
      {
        eixo: 'transparencia',
        titulo: 'O que o contratante enxerga da operação sem precisar pedir?',
        opcoes: [
          { texto: 'Painel próprio, em tempo real', pontos: 3, frase: 'O contratante tem painel próprio, em tempo real.' },
          { texto: 'Um PDF no fim do mês', pontos: 1, frase: 'O contratante enxerga a operação num PDF no fim do mês.' },
          { texto: 'Relatório automático toda semana', pontos: 2, frase: 'O contratante recebe relatório automático toda semana.' },
          { texto: 'Só quando pede', pontos: 0, frase: 'O contratante só enxerga a operação quando pede.' }
        ]
      }
    ],
    niveis: [
      {
        max: 4, ordem: 1, nomes: { sobria: 'Reativo', musical: 'Desafinado' },
        presta: 'A operação existe na cabeça das pessoas. Qualquer falha vira crise, e a prova do serviço depende de confiança.',
        contrata: 'Você está pagando por um serviço que não consegue verificar. A palavra do prestador é o seu único indicador.',
        degrau: 'No próximo degrau, o que foi feito deixa de depender de quem lembra: passa a existir registro.'
      },
      {
        max: 9, ordem: 2, nomes: { sobria: 'Controlado', musical: 'Ensaiando' },
        presta: 'Há processo e planilha, mas o dado chega tarde demais para evitar o problema. Só para explicá-lo depois.',
        contrata: 'Você recebe relatório, sempre depois do fato. Cobrar o que não foi cumprido exige garimpo.',
        degrau: 'No próximo degrau, o dado chega a tempo de evitar o problema, não só de explicá-lo.'
      },
      {
        max: 14, ordem: 3, nomes: { sobria: 'Monitorado', musical: 'Afinado' },
        presta: 'A operação é monitorada e a medição fecha. Falta antecipação: você ainda reage ao desvio em vez de prevenir.',
        contrata: 'Você enxerga o contrato em dia. O que falta é a evidência automática, que hoje depende de alguém montar.',
        degrau: 'No próximo degrau, a operação se comprova sozinha e o contratante audita sem precisar pedir.'
      },
      {
        max: 18, ordem: 4, nomes: { sobria: 'Integrado', musical: 'Orquestrado' },
        presta: 'A operação se comprova sozinha. Aqui a conversa não é mais sobre controlar, é sobre escalar sem perder o controle.',
        contrata: 'Seu contrato é auditorável em tempo real. A pergunta passa a ser quantos dos seus contratos estão nesse nível.',
        degrau: 'E quantos desses controles sobrevivem a uma auditoria do contratante?'
      }
    ]
  };

  /* =====================================================================
     2) RECOMENDADOR
     ===================================================================== */
  const CATALOGO = {
    'colaboradores':        { nome: 'Colaboradores', frase: 'Tira a escala e o ponto da planilha e mostra a cobertura em tempo real.' },
    'analitico':            { nome: 'Analítico', frase: 'Transforma o registro da operação no painel e no relatório que o contratante aceita.' },
    'suprimentos':          { nome: 'Suprimentos', frase: 'Controla estoque, EPI e uniforme com entrada, saída e responsável.' },
    'clientes':             { nome: 'Clientes', frase: 'Abre para o contratante a visão que ele hoje pede por e-mail.' },
    'documentos':           { nome: 'Documentos', frase: 'Guarda ASO, NR e certificado com prazo e aviso antes de vencer.' },
    'treinamentos':         { nome: 'Treinamentos', frase: 'Aplica e certifica a capacitação sem depender de sala e planilha.' },
    'atendimento-interno':  { nome: 'Atendimento Interno', frase: 'Centraliza chamados e solicitações com histórico e responsável.' },
    'sensores':             { nome: 'Sensores', frase: 'Troca a ida até o local por leitura automática, com acionamento na plataforma.' },
    'recrutamento-selecao': { nome: 'Recrutamento e Seleção', frase: 'Encurta o caminho da vaga até a admissão quando entra gente toda semana.' },
    'projetos':             { nome: 'Projetos', frase: 'Organiza obras e frentes por fase, prazo e responsável.' },
    'loyalty':              { nome: 'Loyalty', frase: 'Reconhece quem executa bem usando o dado que a operação já gera.' },
    'pesquisas':            { nome: 'Pesquisas', frase: 'Escuta equipe e contratante de forma estruturada, sem formulário paralelo.' },
    'oportunidades':        { nome: 'Oportunidades', frase: 'Mantém uma base viva de candidatos para a próxima vaga.' },
    'app-registro-presenca': { app: true, nome: 'App · Registro Presença', frase: 'Registra presença no posto pelo celular, com hora e local.' },
    'app-deslocamento':      { app: true, nome: 'App · Deslocamento', frase: 'Acompanha a equipe móvel do chamado até a chegada.' },
    'app-controle-acesso':   { app: true, nome: 'App · Controle de Acesso', frase: 'Registra entrada e saída de pessoas e veículos na unidade.' },
    'app-equipamentos':      { app: true, nome: 'App · Equipamentos', frase: 'Mostra status, local e responsável de cada máquina ou veículo.' },
    'app-confirmacoes':      { app: true, nome: 'App · Confirmações', frase: 'Coleta assinatura de EPI, treinamento e justificativa sem papel.' },
    'app-saida-estoque':     { app: true, nome: 'App · Saída de Estoque', frase: 'Dá baixa no material pelo celular, no momento da entrega.' },
    'app-ocorrencias':       { app: true, nome: 'App · Ocorrências', frase: 'Abre ocorrência com foto no momento em que acontece.' },
    'app-ler-qr':            { app: true, nome: 'App · Ler QR Code', frase: 'Identifica o equipamento apontando a câmera para o QR.' },
    'app-offline':           { app: true, nome: 'Aplicativo Off-line', frase: 'Executa ordem de serviço onde não há sinal e sincroniza depois.' },
    'app-maestro':           { app: true, nome: 'Aplicativo Maestro', frase: 'Leva a operação para o campo: presença, ocorrências, checklists e evidência pelo celular.' }
  };

  const ORDEM_FIXA = ['colaboradores', 'analitico', 'suprimentos', 'clientes', 'documentos', 'treinamentos',
    'atendimento-interno', 'sensores', 'recrutamento-selecao', 'projetos', 'loyalty', 'pesquisas'];

  const VERTICAIS = [
    { id: 'seguranca',  texto: 'Segurança patrimonial',   peso: ['app-registro-presenca', 'colaboradores', 'analitico'] },
    { id: 'facilities', texto: 'Facilities e limpeza',    peso: ['colaboradores', 'clientes', 'analitico'] },
    { id: 'manutencao', texto: 'Manutenção predial',      peso: ['suprimentos', 'app-equipamentos', 'documentos'] },
    { id: 'industria',  texto: 'Indústria',               peso: ['suprimentos', 'sensores', 'treinamentos'] },
    { id: 'saude',      texto: 'Saúde',                   peso: ['documentos', 'treinamentos', 'colaboradores'] },
    { id: 'varejo',     texto: 'Shopping e varejo',       peso: ['app-controle-acesso', 'atendimento-interno', 'sensores'] },
    { id: 'utilities',  texto: 'Utilities',               peso: ['app-deslocamento', 'sensores', 'analitico'] },
    { id: 'construcao', texto: 'Construção e engenharia', peso: ['projetos', 'suprimentos', 'documentos'] },
    { id: 'publico',    texto: 'Setor público',           peso: ['analitico', 'documentos', 'clientes'] },
    { id: 'outro',      texto: 'Outro',                   peso: [] }
  ];

  const RECOMENDADOR = {
    id: 'recomendador',
    nome: 'Maestro sob Medida',
    chamada: 'Descubra quais módulos conversam com a sua operação',
    tipo: 'recomendador',
    icone: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="4"/><path d="M6.3 6.3l2.6 2.6M15.1 15.1l2.6 2.6M17.7 6.3l-2.6 2.6M8.9 15.1l-2.6 2.6"/>'),
    rapida: [1, 3, 4, 5, 6, 7],
    perguntas: [
      {
        id: 'vertical', bloco: 'A', formato: 'grade',
        titulo: 'Em que setor a sua operação atua?',
        opcoes: VERTICAIS.map(v => ({ texto: v.texto, valor: v.id, vertical: v.peso }))
      },
      {
        id: 'porte', bloco: 'A',
        titulo: 'Quantas pessoas trabalham na operação de campo?',
        opcoes: [
          { texto: 'De 21 a 100', valor: '21-100', fator: 1 },
          { texto: 'Mais de 500', valor: '500+', fator: 3 },
          { texto: 'De 101 a 500', valor: '101-500', fator: 2 },
          { texto: 'Até 20', valor: 'ate-20', fator: 0 }
        ]
      },
      {
        id: 'distribuicao', bloco: 'A',
        titulo: 'Onde essas pessoas trabalham?',
        opcoes: [
          { texto: 'Em postos fixos dentro do cliente', valor: 'postos', modulos: { colaboradores: 2, 'app-registro-presenca': 2, analitico: 1 } },
          { texto: 'Em equipes móveis, circulando entre locais', valor: 'moveis', modulos: { 'app-deslocamento': 2, 'app-offline': 1, analitico: 1 } },
          { texto: 'Numa planta ou unidade própria', valor: 'planta', modulos: { 'app-controle-acesso': 2, 'app-equipamentos': 1, sensores: 1 } },
          { texto: 'Uma mistura dos três', valor: 'mistura', modulos: { analitico: 1 } }
        ]
      },
      {
        id: 'recorrencia', bloco: 'B',
        titulo: 'Como são as atividades do dia a dia da sua operação?',
        opcoes: [
          { texto: 'Uma base de rotina com bastante demanda avulsa', fator: 2 },
          { texto: 'Rotinas fixas que se repetem todo dia ou toda semana', fator: 3 },
          { texto: 'Quase tudo sob demanda, conforme o pedido chega', fator: 1 },
          { texto: 'Cada trabalho é único, começa e termina diferente', fator: 0 }
        ]
      },
      {
        id: 'urgencia', bloco: 'B',
        titulo: 'Quando aparece uma demanda não planejada, em quanto tempo ela precisa ser atendida?',
        opcoes: [
          { texto: 'Em poucas horas', fator: 2 },
          { texto: 'Em minutos', fator: 3 },
          { texto: 'No mesmo dia ou no dia seguinte', fator: 1 },
          { texto: 'Entra na fila, sem prazo apertado', fator: 0 }
        ]
      },
      {
        id: 'criticidade', bloco: 'B',
        titulo: 'Se uma atividade programada deixa de ser executada, o que acontece?',
        opcoes: [
          { texto: 'Multa, glosa ou quebra de cláusula contratual', fator: 2 },
          { texto: 'Risco à segurança de pessoas ou parada de operação', fator: 3 },
          { texto: 'Reclamação do cliente e desgaste da relação', fator: 1 },
          { texto: 'Resolve depois, sem impacto relevante', fator: 0 }
        ]
      },
      {
        id: 'dores', bloco: 'C', formato: 'multipla', limite: 3,
        titulo: 'O que hoje vive em planilha, papel ou WhatsApp?',
        apoio: 'escolha até 3',
        opcoes: [
          { texto: 'Escala e controle de ponto', valor: 'escala', modulos: { colaboradores: 3, 'app-registro-presenca': 2 } },
          { texto: 'Checklists e ordens de serviço', valor: 'checklists', modulos: { 'app-confirmacoes': 1, analitico: 1 } },
          { texto: 'Documentos dos colaboradores (ASO, NR, certificados)', valor: 'documentos', modulos: { documentos: 3, colaboradores: 1 } },
          { texto: 'Estoque, EPIs e uniformes', valor: 'estoque', modulos: { suprimentos: 3, 'app-saida-estoque': 2 } },
          { texto: 'Chamados e solicitações internas', valor: 'chamados', modulos: { 'atendimento-interno': 3, 'app-ocorrencias': 1 } },
          { texto: 'Relatórios para o cliente ou contratante', valor: 'relatorios', modulos: { analitico: 3, clientes: 2 } },
          { texto: 'Controle de veículos, máquinas e equipamentos', valor: 'equipamentos', modulos: { 'app-equipamentos': 3, 'app-ler-qr': 2 } },
          { texto: 'Treinamentos e reciclagens', valor: 'treinamentos', modulos: { treinamentos: 3, colaboradores: 1 } }
        ]
      },
      {
        id: 'transparencia', bloco: 'C',
        titulo: 'O que o seu cliente ou contratante precisa enxergar da operação?',
        opcoes: [
          { texto: 'Relatórios periódicos', valor: 'relatorios', modulos: { analitico: 3, clientes: 1 } },
          { texto: 'Um painel em tempo real', valor: 'painel', modulos: { clientes: 3, analitico: 2 } },
          { texto: 'Ele precisa abrir chamado direto com a gente', valor: 'chamado', modulos: { clientes: 3, 'atendimento-interno': 2 } },
          { texto: 'Nada, a relação é por telefone e e-mail', valor: 'nada', modulos: { analitico: 1 } }
        ]
      },
      {
        id: 'entrada', bloco: 'C',
        titulo: 'Com que frequência entra gente nova na operação?',
        opcoes: [
          { texto: 'Todo mês', valor: 'mes', modulos: { 'recrutamento-selecao': 2, treinamentos: 1 } },
          { texto: 'Toda semana', valor: 'semana', modulos: { 'recrutamento-selecao': 3, treinamentos: 2, documentos: 1 } },
          { texto: 'Algumas vezes por ano', valor: 'ano', modulos: { treinamentos: 1 } },
          { texto: 'Quase nunca, a equipe é estável', valor: 'estavel', modulos: { loyalty: 1, pesquisas: 1 } }
        ]
      },
      {
        id: 'ativos', bloco: 'C',
        titulo: 'Tem algum ambiente ou ativo físico que alguém precisa ir até lá conferir?',
        opcoes: [
          { texto: 'Periodicamente, em rondas ou inspeções', valor: 'periodico', modulos: { sensores: 2 } },
          { texto: 'Várias vezes por dia', valor: 'dia', modulos: { sensores: 3, analitico: 1 } },
          { texto: 'Raramente', valor: 'raro', modulos: {} },
          { texto: 'Não se aplica', valor: 'nao', modulos: {} }
        ]
      }
    ],
    /* O enquadramento descreve o tamanho da configuração recomendada, não uma nota da operação:
       nenhuma faixa soa como recusa e a de baixo mostra por onde começar.
       O índice de 0 a 12 continua gravado na sessão, para ordenar a fila de follow-up.
       `limite` é quantos módulos aparecem no resultado de cada faixa. */
    aderencia: [
      { max: 3,  limite: 1, piso: 3, essencial: true, rotulo: 'Configuração essencial',
        texto: 'O ganho está concentrado em uma frente. É por ela que a gente começaria, com o aplicativo junto desde o primeiro dia.' },
      { max: 6,  limite: 3, piso: 3, rotulo: 'Configuração focada',
        texto: 'Algumas frentes resolvem o que mais dói hoje. O resto da plataforma pode esperar.' },
      { max: 9,  limite: 5, piso: 2, rotulo: 'Configuração ampla',
        texto: 'A maior parte da sua operação entra agora, e o que sobrar vem numa segunda etapa.' },
      { max: 12, limite: 6, piso: 2, rotulo: 'Configuração completa',
        texto: 'A plataforma inteira conversa com a sua operação, do campo ao contrato.' }
    ]
  };

  const QUIZZES = [DIAGNOSTICO, RECOMENDADOR];
  const BY_QUIZ = Object.fromEntries(QUIZZES.map(q => [q.id, q]));
  const APELIDOS = { maturidade: 'diagnostico', conexao: 'recomendador' };

  window.MAESTRO_QUIZZES = QUIZZES.map(q => ({ id: q.id, nome: q.nome }));
  window.MAESTRO_ABRIR_QUIZ = id => abrirQuiz(APELIDOS[id] || id);

  /* =====================================================================
     ESTADO
     ===================================================================== */
  const S = { quiz: null, etapa: 0, perfil: null, respostas: [], sessao: null, idleT: null, calcT: null };

  const PARAMS = new URLSearchParams(location.search);
  const LINK_Q = APELIDOS[PARAMS.get('q')] || PARAMS.get('q');
  const INSTALADO = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
  const VISITANTE = !!(LINK_Q && BY_QUIZ[LINK_Q]) && !INSTALADO && PARAMS.get('modo') !== 'totem';
  const NOMENCLATURA = CQ.nomenclatura === 'musical' ? 'musical' : 'sobria';
  const SEGUNDOS_INATIVO = CQ.inatividade || 30;
  const captura = () => window.MAESTRO_CAPTURA || null;

  /* =====================================================================
     BOTÕES NA GRADE
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
     FLUXO
     ===================================================================== */
  const perguntasDoQuiz = q =>
    (q.tipo === 'recomendador' && CQ.versaoRapida) ? q.rapida.map(i => q.perguntas[i]) : q.perguntas;

  function abrirQuiz(id) {
    const q = BY_QUIZ[id];
    if (!q) return;
    S.quiz = q; S.etapa = 0; S.perfil = null; S.respostas = [];
    S.sessao = {
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)),
      quiz: q.id, evento: CQ.evento || '', dispositivo: CQ.dispositivo || '',
      inicio: new Date().toISOString(), fim: null,
      teste: !!CQ.modoTeste, concluiu: false, capturou_contato: false
    };
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
    clearTimeout(S.idleT); clearTimeout(S.calcT);
    if (S.sessao && !S.sessao.concluiu && S.respostas.length) gravarSessao();
    S.quiz = null; S.sessao = null;
    try { history.replaceState(null, '', location.pathname); } catch { /* file:// */ }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  }

  function reiniciarInatividade() {
    clearTimeout(S.idleT);
    const barra = $('#quizIdleBar');
    if (VISITANTE || document.body.dataset.view !== 'quiz') return;
    if (barra) {
      barra.style.transition = 'none'; barra.style.transform = 'scaleX(1)';
      void barra.offsetWidth;
      barra.style.transition = `transform ${SEGUNDOS_INATIVO}s linear`; barra.style.transform = 'scaleX(0)';
    }
    S.idleT = setTimeout(voltarAoInicio, SEGUNDOS_INATIVO * 1000);
  }

  function gravarSessao() {
    const c = captura();
    if (c && S.sessao) c.gravar(S.sessao);
  }

  /* =====================================================================
     CÁLCULO
     ===================================================================== */
  function calcularDiagnostico() {
    const q = DIAGNOSTICO;
    const porPergunta = S.respostas.map((r, i) => q.perguntas[i].opcoes[r].pontos);
    const total = porPergunta.reduce((a, b) => a + b, 0);
    const nivel = q.niveis.find(n => total <= n.max) || q.niveis[q.niveis.length - 1];

    const eixos = Object.entries(EIXOS).map(([id, e]) => {
      const pontos = e.perguntas.reduce((soma, i) => soma + porPergunta[i], 0);
      return { id, nome: e.nome, pontos, max: e.max, pct: Math.round(pontos / e.max * 100) };
    });

    const ordenados = [...eixos].sort((a, b) =>
      a.pct - b.pct || a.pontos - b.pontos ||
      PRIORIDADE_EIXO.indexOf(a.id) - PRIORIDADE_EIXO.indexOf(b.id));

    const perfeito = eixos.every(e => e.pct === 100);
    const gargalos = perfeito ? [] : ordenados.slice(0, 2).map(e => {
      const idx = EIXOS[e.id].perguntas.slice().sort((a, b) => porPergunta[a] - porPergunta[b])[0];
      return { ...e, frase: q.perguntas[idx].opcoes[S.respostas[idx]].frase };
    });

    return { total, nivel, eixos, gargalos, perfeito };
  }

  function calcularRecomendador() {
    const perguntas = perguntasDoQuiz(RECOMENDADOR);
    const escolhas = {}, placar = {};
    const somar = mods => Object.entries(mods || {}).forEach(([id, p]) => { placar[id] = (placar[id] || 0) + p; });

    perguntas.forEach((p, i) => {
      const r = S.respostas[i];
      if (r === undefined || r === null) return;
      if (p.formato === 'multipla') {
        const marcadas = Array.isArray(r) ? r : [];
        escolhas[p.id] = marcadas.map(k => p.opcoes[k].valor);
        marcadas.forEach(k => somar(p.opcoes[k].modulos));
      } else {
        const o = p.opcoes[r];
        escolhas[p.id] = o.valor || o.texto;
        somar(o.modulos);
        if (o.vertical) o.vertical.forEach(id => { placar[id] = (placar[id] || 0) + 0.5; });
      }
    });

    const fator = id => {
      const i = perguntas.findIndex(p => p.id === id);
      const r = S.respostas[i];
      return (i >= 0 && r != null) ? (perguntas[i].opcoes[r].fator || 0) : 0;
    };
    const fatores = {
      capital_humano: fator('porte'), recorrencia: fator('recorrencia'),
      urgencia: fator('urgencia'), criticidade: fator('criticidade')
    };
    const indice = Object.values(fatores).reduce((a, b) => a + b, 0);
    const faixa = RECOMENDADOR.aderencia.find(a => indice <= a.max);

    const dores = escolhas.dores || [];
    const pDores = perguntas.find(x => x.id === 'dores');
    const porDor = id => !!(pDores && pDores.opcoes.some(o => dores.includes(o.valor) && (o.modulos || {})[id]));

    // Piso por faixa: nas configurações maiores ele baixa, para o limite maior render mais módulos
    const piso = faixa.piso || 3;
    const candidatos = Object.entries(placar)
      .filter(([, p]) => p >= piso)
      .sort((a, b) =>
        b[1] - a[1] ||
        (porDor(b[0]) ? 1 : 0) - (porDor(a[0]) ? 1 : 0) ||
        (ORDEM_FIXA.indexOf(a[0]) + 99) - (ORDEM_FIXA.indexOf(b[0]) + 99));

    const limite = faixa.limite || 3;
    const limiteApp = Math.max(2, Math.round(limite / 2));
    const top = [];
    let doApp = 0;
    for (const [id] of candidatos) {
      if (top.length >= limite) break;
      const ehApp = !!(CATALOGO[id] && CATALOGO[id].app);
      if (ehApp && doApp >= limiteApp) continue;
      if (ehApp) doApp++;
      top.push(id);
    }
    // Configuração essencial: uma frente só, com o aplicativo junto
    if (faixa.essencial) {
      const primeiro = top.find(id => !(CATALOGO[id] || {}).app) || top[0];
      top.length = 0;
      if (primeiro) top.push(primeiro);
      top.push('app-maestro');
    }
    if (!top.length) top.push('app-maestro');

    const porte = escolhas.porte;
    const extra = (['101-500', '500+'].includes(porte) && escolhas.entrada === 'estavel' && !top.includes('loyalty')) ? 'loyalty' : null;

    const escala = { Starter: 1, Business: 2, Enterprise: 3 };
    const planoPorte = { '500+': 'Enterprise', '101-500': 'Enterprise', '21-100': 'Business', 'ate-20': 'Starter' }[porte] || 'Starter';
    let planoModulo = 'Starter';
    if (top.some(id => ['suprimentos', 'recrutamento-selecao', 'projetos'].includes(id))) planoModulo = 'Enterprise';
    else if (top.some(id => ['treinamentos', 'documentos', 'analitico', 'clientes'].includes(id))) planoModulo = 'Business';
    const plano = escala[planoModulo] >= escala[planoPorte] ? planoModulo : planoPorte;

    return { escolhas, fatores, indice, faixa, top, extra, plano };
  }

  /* =====================================================================
     TELAS
     ===================================================================== */
  function render() {
    const q = S.quiz;
    if (!q) return;
    const palco = $('#quizStage');
    const perguntas = perguntasDoQuiz(q);
    const temPerfil = q.tipo === 'diagnostico';
    const totalEtapas = perguntas.length + (temPerfil ? 1 : 0);

    let html;
    if (temPerfil && S.etapa === 0) html = telaPerfil(q);
    else if (S.etapa < totalEtapas) html = telaPergunta(q, perguntas, S.etapa - (temPerfil ? 1 : 0));
    else if (S.etapa === totalEtapas) html = telaCalculando();
    else html = q.tipo === 'diagnostico' ? telaResultadoDiagnostico() : telaResultadoRecomendador();

    palco.innerHTML = html;
    palco.classList.remove('enter'); void palco.offsetWidth; palco.classList.add('enter');

    $('#quizSteps').innerHTML = Array.from({ length: totalEtapas }, (_, i) =>
      `<i class="${i < S.etapa ? 'feito' : i === S.etapa ? 'atual' : ''}"></i>`).join('');
    $('#quizStep').textContent = pad(Math.min(S.etapa + 1, totalEtapas));
    $('#quizTotal').textContent = pad(totalEtapas);
    $('#btnQuizBack').hidden = S.etapa === 0 || S.etapa > totalEtapas;

    if (S.etapa === totalEtapas) {
      clearTimeout(S.calcT);
      S.calcT = setTimeout(() => { S.etapa++; render(); }, 2000);
    }
    if (S.etapa > totalEtapas) concluir();
  }

  function telaPerfil(q) {
    return `
      <div class="q-head anim" style="--i:0">
        <p class="eyebrow">${q.nome}</p>
        <h2 class="q-title">${q.perfil.titulo}</h2>
      </div>
      <div class="q-options q-perfil">
        ${q.perfil.opcoes.map((o, k) => `
          <button class="q-opt anim" style="--i:${k + 1}" data-perfil="${o.id}" type="button">
            <span class="q-text"><b>${o.texto}</b><small>${o.apoio}</small></span>
          </button>`).join('')}
      </div>`;
  }

  function telaPergunta(q, perguntas, i) {
    const p = perguntas[i];
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const marcadas = Array.isArray(S.respostas[i]) ? S.respostas[i] : [];
    const multipla = p.formato === 'multipla';
    return `
      <div class="q-head anim" style="--i:0">
        <p class="eyebrow">${q.nome} · ${pad(i + 1)} de ${pad(perguntas.length)}${p.apoio ? ' · ' + p.apoio : ''}</p>
        <h2 class="q-title">${p.titulo}</h2>
      </div>
      <div class="q-options ${p.formato === 'grade' ? 'q-grade' : ''} ${multipla ? 'q-multipla' : ''}">
        ${p.opcoes.map((o, k) => `
          <button class="q-opt anim ${marcadas.includes(k) ? 'marcada' : ''}" style="--i:${k + 1}" data-opcao="${k}" type="button">
            ${p.formato === 'grade' ? '' : `<span class="q-letter">${multipla ? (marcadas.includes(k) ? '✓' : '') : letras[k]}</span>`}
            <span class="q-text">${o.texto}</span>
          </button>`).join('')}
      </div>
      ${multipla ? `<div class="q-acoes anim" style="--i:9">
        <span class="q-contador"><b>${marcadas.length}</b> de ${p.limite} escolhidas</span>
        <button class="btn-lime" data-confirmar type="button" ${marcadas.length ? '' : 'disabled'}>Continuar</button>
      </div>` : ''}`;
  }

  const telaCalculando = () => `
    <div class="q-calc">
      <div class="calc-anim"><span></span><span></span><span></span><span></span></div>
      <p class="eyebrow">Analisando as suas respostas</p>
    </div>`;

  const nomeDoNivel = n => n.nomes[NOMENCLATURA];

  function telaResultadoDiagnostico() {
    const r = calcularDiagnostico();
    const leitura = (PERFIS[S.perfil] || PERFIS.presta).leitura;
    const c = captura();
    const bench = c ? c.benchmark(DIAGNOSTICO.id) : null;

    const gargalos = r.perfeito
      ? `<div class="res-gargalo anim" style="--i:3"><p>${r.nivel.degrau}</p></div>`
      : r.gargalos.map((g, k) => {
        const linha = bench ? bench.frasePara(g.id) : '';
        return `<div class="res-gargalo anim" style="--i:${3 + k}">
          <span class="res-gargalo-eixo">${g.nome}</span>
          <p>${g.frase}</p>
          ${linha ? `<span class="res-bench">${linha}</span>` : ''}
        </div>`;
      }).join('');

    return `
      <div class="res">
        <div class="res-left">
          <p class="eyebrow anim" style="--i:0">Resultado</p>
          <h2 class="res-title anim" style="--i:1">${nomeDoNivel(r.nivel)}</h2>
          <div class="res-gauge anim" style="--i:1">
            ${DIAGNOSTICO.niveis.map(n => `<i class="${n.ordem <= r.nivel.ordem ? 'on' : ''}"></i>`).join('')}
            <span>Nível ${r.nivel.ordem} de ${DIAGNOSTICO.niveis.length}</span>
          </div>
          <p class="res-text anim" style="--i:2">${r.nivel[leitura]}</p>
          ${!r.perfeito ? `<p class="res-degrau anim" style="--i:4"><i class="sq"></i> ${r.nivel.degrau}</p>` : ''}
        </div>
        <div class="res-right">
          <p class="eyebrow anim" style="--i:2">${r.perfeito ? 'Uma pergunta para levar daqui' : 'Onde a operação está exposta'}</p>
          <div class="res-gargalos">${gargalos}</div>
          <div class="res-actions anim" style="--i:6">
            <button class="btn-lime" data-captura type="button">Receber o diagnóstico completo</button>
            <button class="btn-link" data-quiz-refazer type="button">Refazer</button>
          </div>
        </div>
      </div>`;
  }

  function telaResultadoRecomendador() {
    const r = calcularRecomendador();
    const vertical = (VERTICAIS.find(v => v.id === r.escolhas.vertical) || {}).texto || 'uma operação';
    const porte = { '500+': 'mais de 500 pessoas', '101-500': 'de 101 a 500 pessoas', '21-100': 'de 21 a 100 pessoas', 'ate-20': 'até 20 pessoas' }[r.escolhas.porte] || '';
    const onde = { postos: 'em postos fixos', moveis: 'em equipes móveis', planta: 'em planta própria', mistura: 'em formatos misturados' }[r.escolhas.distribuicao] || '';
    const frase = `Para ${vertical.toLowerCase()}${porte ? ' com ' + porte : ''}${onde ? ', ' + onde : ''}…`;

    const cartao = (id, k, extra) => {
      const m = CATALOGO[id];
      if (!m) return '';
      const abre = !m.app && BY_ID[id];
      return `<button class="res-mod anim ${extra ? 'res-mod-extra' : ''}" style="--i:${k + 3}" ${abre ? `data-open="${id}"` : ''} type="button">
        <span class="res-mod-top"><span class="res-mod-n">${m.nome}</span>${m.app ? '<span class="tag-app">Aplicativo</span>' : ''}</span>
        <span class="res-mod-h">${m.frase}</span>
        ${abre ? '<span class="res-mod-cta">Conhecer o módulo →</span>' : ''}
      </button>`;
    };

    return `
      <div class="res res-conexao">
        <div class="res-left">
          <p class="eyebrow anim" style="--i:0">${frase}</p>
          <h2 class="res-title anim" style="--i:1">${r.faixa.rotulo}</h2>
          <p class="res-text anim" style="--i:2">${r.faixa.texto}</p>
          <p class="res-base anim" style="--i:3">Administração, Gestor e o Aplicativo Maestro acompanham qualquer configuração.</p>
          <p class="res-plano anim" style="--i:3">Plano sugerido: <b>${r.plano}</b></p>
          <div class="res-actions anim" style="--i:4">
            <button class="btn-lime" data-captura type="button">Receber essa configuração por e-mail</button>
            <button class="btn-link" data-quiz-refazer type="button">Refazer</button>
          </div>
        </div>
        <div class="res-right">
          <p class="eyebrow anim" style="--i:2">${r.faixa.essencial ? 'Por onde começar' : 'Os módulos que conversam com a sua operação'}</p>
          <div class="res-mods ${r.top.length > 3 ? 'res-mods-muitos' : ''}">
            ${r.top.map((id, k) => cartao(id, k)).join('')}
            ${r.extra ? cartao(r.extra, 3, true) : ''}
          </div>
        </div>
      </div>`;
  }

  /* =====================================================================
     CONCLUSÃO E REGISTRO
     ===================================================================== */
  function concluir() {
    if (!S.sessao || S.sessao.concluiu) return;
    S.sessao.fim = new Date().toISOString();
    S.sessao.concluiu = true;

    if (S.quiz.tipo === 'diagnostico') {
      const r = calcularDiagnostico();
      Object.assign(S.sessao, {
        perfil: S.perfil,
        respostas: S.respostas.map((k, i) => DIAGNOSTICO.perguntas[i].opcoes[k].pontos),
        respostas_texto: S.respostas.map((k, i) => DIAGNOSTICO.perguntas[i].opcoes[k].texto),
        pontuacao_total: r.total,
        nivel: nomeDoNivel(r.nivel),
        percentual_por_eixo: Object.fromEntries(r.eixos.map(e => [e.id, e.pct])),
        gargalos: r.gargalos.map(g => g.id)
      });
    } else {
      const r = calcularRecomendador();
      Object.assign(S.sessao, {
        vertical: r.escolhas.vertical, porte_operacao: r.escolhas.porte,
        distribuicao_equipe: r.escolhas.distribuicao,
        fatores: r.fatores, indice_aderencia: r.indice, configuracao: r.faixa.rotulo,
        dores: r.escolhas.dores || [], modulos: r.top, plano_sugerido: r.plano
      });
    }
    gravarSessao();
  }

  /* =====================================================================
     INTERAÇÃO
     ===================================================================== */
  function responder(k) {
    const perguntas = perguntasDoQuiz(S.quiz);
    const i = S.etapa - (S.quiz.tipo === 'diagnostico' ? 1 : 0);
    const p = perguntas[i];
    if (p && p.formato === 'multipla') {
      const marcadas = Array.isArray(S.respostas[i]) ? [...S.respostas[i]] : [];
      const pos = marcadas.indexOf(k);
      if (pos >= 0) marcadas.splice(pos, 1);
      else if (marcadas.length < p.limite) marcadas.push(k);
      S.respostas[i] = marcadas;
      render();
      return;
    }
    S.respostas[i] = k;
    S.etapa++;
    render();
  }

  function ligarEventos() {
    document.addEventListener('click', e => {
      const botaoQuiz = e.target.closest('[data-quiz]');
      if (botaoQuiz) { abrirQuiz(botaoQuiz.dataset.quiz); return; }
      if (document.body.dataset.view !== 'quiz') return;

      const perfil = e.target.closest('[data-perfil]');
      if (perfil) {
        S.perfil = perfil.dataset.perfil;
        perfil.classList.add('escolhida');
        setTimeout(() => { S.etapa++; render(); }, 200);
        return;
      }
      const opcao = e.target.closest('[data-opcao]');
      if (opcao) {
        const multipla = !!opcao.closest('.q-multipla');
        if (!multipla) opcao.classList.add('escolhida');
        setTimeout(() => responder(+opcao.dataset.opcao), multipla ? 0 : 200);
        return;
      }
      if (e.target.closest('[data-confirmar]')) { S.etapa++; render(); return; }
      if (e.target.closest('[data-quiz-refazer]')) { abrirQuiz(S.quiz.id); return; }
      if (e.target.closest('[data-captura]')) {
        const c = captura();
        if (c) c.abrir(S.sessao, () => { if (S.sessao) { S.sessao.capturou_contato = true; gravarSessao(); } });
        return;
      }
    });

    document.addEventListener('pointerdown', () => {
      if (document.body.dataset.view === 'quiz') reiniciarInatividade();
    }, { passive: true });

    $('#btnQuizClose').addEventListener('click', voltarAoInicio);
    $('#btnLogoQuiz').addEventListener('click', voltarAoInicio);
    $('#btnQuizBack').addEventListener('click', () => { if (S.etapa > 0) { S.etapa--; clearTimeout(S.calcT); render(); } });
  }

  /* =====================================================================
     INÍCIO
     ===================================================================== */
  /* Atalho de conferência e demonstração, para abrir direto no resultado:
     ?q=diagnostico&perfil=presta&respostas=1,3,2,1,4,2
     Os números são a posição da alternativa na tela, de 1 a 4. */
  function aplicarDemonstracao() {
    const respostas = PARAMS.get('respostas');
    if (!respostas || !S.quiz) return;
    const perfil = PARAMS.get('perfil');
    if (S.quiz.tipo === 'diagnostico') S.perfil = PERFIS[perfil] ? perfil : 'presta';
    const perguntas = perguntasDoQuiz(S.quiz);
    S.respostas = respostas.split(',').map((n, i) => {
      const p = perguntas[i];
      if (!p) return 0;
      const k = Math.max(1, Math.min(p.opcoes.length, parseInt(n, 10) || 1)) - 1;
      return p.formato === 'multipla' ? [k] : k;
    });
    S.etapa = perguntas.length + (S.quiz.tipo === 'diagnostico' ? 1 : 0) + 1;
    render();
    // &captura=1 abre direto a tela de captura, para testar a câmera no tablet
    if (PARAMS.get('captura')) setTimeout(() => {
      const b = $('[data-captura]');
      if (b) b.click();
    }, 400);
  }

  function init() {
    if (!$('#quiz')) return;
    montarBotoes();
    ligarEventos();
    if (LINK_Q && BY_QUIZ[LINK_Q]) setTimeout(() => { abrirQuiz(LINK_Q); aplicarDemonstracao(); }, 300);
  }

  init();
})();
