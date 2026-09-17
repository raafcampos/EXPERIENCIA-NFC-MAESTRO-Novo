/* =====================================================================
   EXPERIÊNCIA NFC · PLATAFORMA MAESTRO
   Conteúdo e configuração. Edite este arquivo para ajustar textos,
   tempos e o vínculo entre as tags NFC e os módulos.
   ===================================================================== */

window.MAESTRO = {

  config: {
    // Endereço publicado. Links das tags para o celular do visitante: <urlBase>/?m=<id do módulo>
    urlBase: "https://experiencia-nfc-maestro-novo.vercel.app",

    tempos: {
      voltarInicio: 90,      // segundos sem interação até voltar à tela inicial
      avancoCena: 14,        // segundos em cada cena do módulo (0 = não avança sozinho)
      bloqueioReleitura: 3   // segundos ignorando a mesma tag lida repetidamente
    },
    telaCheiaAoTocar: true,          // entra em tela cheia no primeiro toque
    manterTelaLigada: true,          // impede o tablet de apagar a tela
    mostrarCaminhoDasImagens: true,  // mostra o nome do arquivo esperado nos espaços de imagem (desligue no evento)

    // Leitor USB em modo teclado (HID)
    leitor: {
      intervaloSemEnter: 150, // ms de silêncio para processar leitores que não enviam Enter
      tamanhoMinimo: 6        // tamanho mínimo do código para ser considerado uma tag
    },

    // Quizzes do evento (ver js/quiz.js e js/captura.js)
    quiz: {
      evento: "SegSummit 2026",
      dispositivo: "tablet-1",        // identifica o aparelho nas respostas, útil com mais de um totem
      nomenclatura: "sobria",         // "sobria" (Reativo/Controlado/Monitorado/Integrado) ou "musical" (Desafinado/Ensaiando/Afinado/Orquestrado)
      inatividade: 30,                // segundos sem toque até voltar à tela inicial durante o quiz
      versaoRapida: false,            // true = recomendador com 6 perguntas, para quando a fila apertar
      modoTeste: false,               // true marca as respostas como teste da equipe e as exclui do agregado
      minimoBenchmark: 20,            // respostas mínimas para exibir o percentual "neste estande"
      endpoint: "",                   // opcional: URL que recebe as sessões (Apps Script, webhook). Vazio = só no tablet
      consentimento: "Ao enviar, você autoriza a Sete a usar seus dados para enviar o material e entrar em contato sobre a plataforma Maestro."
    },

    // Vínculos fixos tag -> módulo. Os vínculos feitos pelo painel de configuração
    // ficam salvos no próprio tablet; use "Exportar" no painel e cole aqui para torná-los permanentes.
    tags: {
      // "04A1B2C3D4E5F6": "gestor",
    }
  },

  // Todas as famílias usam o amarelo do Maestro
  familias: {
    operacao:       { nome: "Operação",        cor: "#EAFF06" },
    pessoas:        { nome: "Pessoas",         cor: "#EAFF06" },
    relacionamento: { nome: "Relacionamento",  cor: "#EAFF06" },
    inteligencia:   { nome: "Inteligência",    cor: "#EAFF06" }
  },

  modulos: [
    {
      id: "administracao",
      nome: "Administração",
      familia: "operacao",
      headline: "A base que deixa a plataforma com a cara da sua operação.",
      resumo: "Centraliza as configurações da plataforma: usuários, permissões, parâmetros e cadastros, garantindo operação segura e personalizada conforme a estrutura da organização.",
      valor: [
        { titulo: "Segurança de acesso", texto: "Perfis e permissões definem exatamente quem vê e quem altera cada informação da operação." },
        { titulo: "Feito sob medida", texto: "Parâmetros e cadastros moldam o Maestro à estrutura real de cada organização, sem desenvolvimento extra." },
        { titulo: "Governança central", texto: "Controles de acesso, medições e análises de uso reunidos em um único ambiente administrativo." }
      ],
      funcionalidades: ["Gestão de usuários e perfis", "Controles de acesso e permissões", "Parâmetros da plataforma", "Cadastros e tabelas tipo", "Medições", "Análise de uso e dados"]
    },
    {
      id: "gestor",
      nome: "Gestor",
      familia: "operacao",
      headline: "O núcleo que orquestra cada etapa da operação.",
      resumo: "Controla os fluxos operacionais de ponta a ponta: processos, planejamento, checklists, prazos, responsáveis e medições, com relatórios para melhoria contínua.",
      valor: [
        { titulo: "Controle em tempo real", texto: "Ordens de serviço e atividades acompanhadas enquanto acontecem, garantindo execução no prazo e conforme o planejado." },
        { titulo: "Menos erros e retrabalho", texto: "Geração automática de ordens de serviço e checklists assegura conformidade com normas e padrões de qualidade." },
        { titulo: "Melhoria contínua", texto: "Medições, não conformidades e relatórios detalhados viram base para decisões e ajustes de rota." }
      ],
      funcionalidades: ["Configuração de processos e fluxos", "Planejamento de atividades", "Checklists, prazos e responsáveis", "Emissão de ordens de serviço", "Medições e gestão operacional", "Não conformidades e planos de ação", "Controle de itens", "Controle de acesso"]
    },
    {
      id: "projetos",
      nome: "Projetos",
      familia: "operacao",
      headline: "Do planejamento à entrega, com cada fase à vista.",
      resumo: "Extensão do Gestor para planejar e acompanhar projetos vinculados a ordens de serviço, com cronogramas, distribuição de tarefas e visões Kanban e Gantt.",
      valor: [
        { titulo: "Previsibilidade", texto: "Cronogramas mais precisos e ajustes feitos antes que o desvio vire atraso." },
        { titulo: "Clareza visual", texto: "Kanban e Gantt mostram progresso, responsáveis e gargalos de relance." },
        { titulo: "Execução conectada", texto: "Tarefas do projeto vinculadas às ordens de serviço do Gestor, sem controles paralelos." }
      ],
      funcionalidades: ["Gestão de projetos", "Meus projetos", "Cronogramas e Gantt", "Quadros Kanban", "Distribuição de tarefas", "Relatório de tarefas"]
    },
    {
      id: "documentos",
      nome: "Documentos",
      familia: "operacao",
      headline: "Todo documento certo, atualizado e a um toque.",
      resumo: "Armazena e organiza documentos contratuais, operacionais e administrativos, com versionamento, rastreamento de alterações e controle de prazos de validade.",
      valor: [
        { titulo: "Segurança jurídica", texto: "Documentação obrigatória sob controle, com prazos de validade monitorados antes de vencer." },
        { titulo: "Pronto para auditoria", texto: "Versionamento e histórico de alterações garantem evidências confiáveis a qualquer momento." },
        { titulo: "Acesso rápido", texto: "Registros organizados e acessíveis para quem precisa, sem pastas perdidas ou arquivos duplicados." }
      ],
      funcionalidades: ["Documentos contratuais, operacionais e administrativos", "Versionamento", "Rastreamento de alterações", "Controle de validade", "Pesquisa de documentos", "Parâmetros por tipo"]
    },
    {
      id: "atendimento-interno",
      nome: "Atendimento Interno",
      familia: "relacionamento",
      headline: "Chamados abertos em segundos e resolvidos com histórico completo.",
      resumo: "Abertura, acompanhamento e resolução de chamados internos, com categorias, anexos e histórico completo, agilizando a resposta das equipes responsáveis.",
      valor: [
        { titulo: "Resposta ágil", texto: "A equipe responsável recebe a demanda já com categoria, origem, descrição e evidências." },
        { titulo: "Comunicação sem ruído", texto: "Tudo registrado em um único fluxo, sem mensagens perdidas entre áreas." },
        { titulo: "Histórico para decidir", texto: "Consulta, filtros e exportação de todos os chamados para entender padrões e prioridades." }
      ],
      funcionalidades: ["Abertura de chamado em poucos passos", "Categoria e origem do problema", "Anexo de fotos e vídeos", "Acompanhamento de status", "Pesquisa e filtros", "Exportação do histórico", "Versão no App Maestro"]
    },
    {
      id: "clientes",
      nome: "Clientes",
      familia: "relacionamento",
      headline: "Mostre sua operação para quem importa, sem abrir a plataforma inteira.",
      resumo: "Ambiente personalizado em que a organização compartilha visualizações da operação com públicos externos e libera interações controladas, como a abertura de chamados, sem expor dados sensíveis.",
      valor: [
        { titulo: "Transparência sob controle", texto: "Você escolhe exatamente quais visualizações cada cliente, parceiro ou fornecedor pode ver." },
        { titulo: "Menos intermediação", texto: "O próprio público externo abre e acompanha chamados, que entram direto no fluxo de atendimento." },
        { titulo: "Dados protegidos", texto: "Informações sensíveis preservadas e nenhum agente externo altera os registros da operação." }
      ],
      funcionalidades: ["Meu Painel personalizado", "Abertura e acompanhamento de chamados", "Dashboards com indicadores", "Ordens de serviço e tarefas pendentes", "Histórico de cada processo", "Deslocamentos e ativos em tempo real"]
    },
    {
      id: "colaboradores",
      nome: "Colaboradores",
      familia: "pessoas",
      headline: "O ciclo de vida de cada colaborador, em conformidade do início ao fim.",
      resumo: "Gerencia o ciclo de vida do colaborador: cadastro, ponto, exames, treinamentos obrigatórios, EPIs e uniformes, mantendo a conformidade legal da operação.",
      valor: [
        { titulo: "Menos riscos trabalhistas", texto: "Exames, NRs, EPIs e treinamentos obrigatórios acompanhados com prazos e evidências." },
        { titulo: "Tudo em um só lugar", texto: "As informações de cada colaborador consolidadas, sem busca individual em sistemas diferentes." },
        { titulo: "Pessoa certa no posto", texto: "Requisitos por função garantem que cada colaborador esteja apto para a atividade que executa." }
      ],
      funcionalidades: ["Cadastro e vínculo a funções", "Controle de ponto", "Exames ocupacionais", "EPIs e uniformes", "Treinamentos obrigatórios", "Requisitos por função e riscos", "Combustível e veículos", "Relatórios de conformidade"]
    },
    {
      id: "dashboards-bi",
      nome: "Dashboards / BI",
      familia: "inteligencia",
      headline: "Todos os contratos, um só painel, em tempo real.",
      resumo: "Painéis interativos que consolidam dados de múltiplos contratos em tempo real, evidenciando KPIs, progresso das atividades, recursos alocados e gargalos.",
      valor: [
        { titulo: "Decisões assertivas", texto: "Indicadores consolidados de diferentes contratos e atividades sustentam cada escolha." },
        { titulo: "Gargalos visíveis", texto: "Atrasos e recursos mal alocados aparecem antes de impactar a entrega." },
        { titulo: "Visão estratégica", texto: "Tendências e eficiência de processos à mão para planejar os próximos passos." }
      ],
      funcionalidades: ["Dashboard operacional", "Dashboard estratégico", "Análise de processos", "BI Publisher", "Disponibilidades", "Acessos ao sistema", "Processo de colaboradores", "Mapa de deslocamento"]
    },
    {
      id: "analitico",
      nome: "Analítico",
      familia: "inteligencia",
      headline: "Os registros da operação transformados em leitura gerencial.",
      resumo: "Consolida e interpreta as informações da operação em dashboards, mapas e relatórios gerenciais, com filtros por empresa, contrato, setor, período e responsável.",
      valor: [
        { titulo: "Previsto x realizado", texto: "Compare efetivos planejados e executados e identifique divergências rapidamente." },
        { titulo: "Operação no mapa", texto: "Georreferenciamento de equipes, deslocamentos e ativos distribuídos pelo território." },
        { titulo: "Filtros que respondem", texto: "Recortes por empresa, contrato, setor, período e responsável em poucos toques." }
      ],
      funcionalidades: ["Dashboards e visões gerenciais", "Mapas georreferenciados", "Solicitações, OS e inspeções", "Veículos, máquinas e equipamentos", "Indicadores de colaboradores", "Produtividade das equipes"]
    },
    {
      id: "sensores",
      nome: "Sensores",
      familia: "inteligencia",
      headline: "Dados de sensores que viram ação automática.",
      resumo: "Integra dispositivos IoT, como a linha Sonare, e transforma os dados coletados em acionamentos automáticos de processos dentro da plataforma.",
      valor: [
        { titulo: "Da leitura à ação", texto: "Regras disparam fluxos na plataforma assim que limites ou condições são atingidos." },
        { titulo: "Integração aberta", texto: "Nativo com a linha Sonare, da Sete, e conectável a outros equipamentos via API." },
        { titulo: "Contexto completo", texto: "Dados relacionados a clientes, contratos, processos e localizações, inclusive no mapa." }
      ],
      funcionalidades: ["Cadastro de dispositivos", "Canais por sensor e variável", "Apurações e cálculos combinados", "Regras, limites e eventos", "Acionamentos automáticos", "Visualização geográfica"]
    },
    {
      id: "recrutamento-selecao",
      nome: "Recrutamento e Seleção",
      familia: "pessoas",
      headline: "Da vaga publicada à admissão, sem perder nenhum candidato.",
      resumo: "Administra o ciclo completo de recrutamento: divulgação de vagas, gestão de candidatos, validação de documentos e integração com sistemas de admissão.",
      valor: [
        { titulo: "Funil sob controle", texto: "Cada processo seletivo acompanhado da criação ao encerramento, com status sempre visível." },
        { titulo: "Admissão mais rápida", texto: "Validação de documentos e integração com sistemas de admissão, como o Rubi." },
        { titulo: "Menos trabalho manual", texto: "Cadastro, aprovação, documentos e foto para crachá em um único fluxo." }
      ],
      funcionalidades: ["Publicação e divulgação de vagas", "Gestão de candidatos", "Processos seletivos", "Validação de documentos", "Envio de documentos SESMT", "Integração com admissão", "Filtros e relatórios"]
    },
    {
      id: "oportunidades",
      nome: "Oportunidades",
      familia: "pessoas",
      headline: "A jornada do candidato organizada, do perfil à candidatura.",
      resumo: "Ambiente do candidato: cadastro de perfil e documentos, consulta às vagas disponíveis e acompanhamento das candidaturas realizadas na organização.",
      valor: [
        { titulo: "Experiência do candidato", texto: "Perfil, documentos e vagas reunidos em um só ambiente, simples de manter atualizado." },
        { titulo: "Base de talentos", texto: "Informações padronizadas e prontas para serem aproveitadas em novos processos." },
        { titulo: "Rastreabilidade", texto: "Histórico de oportunidades e interações ao longo de toda a jornada seletiva." }
      ],
      funcionalidades: ["Cadastro de perfil", "Dados profissionais e complementares", "Registro de dependentes", "Cadastro por documentos", "Consulta de vagas", "Acompanhamento de candidaturas"]
    },
    {
      id: "pesquisas",
      nome: "Pesquisas",
      familia: "relacionamento",
      headline: "Ouça colaboradores, clientes e fornecedores e aja com base nisso.",
      resumo: "Criação e distribuição de questionários para colaboradores, clientes e fornecedores, com análise dos resultados diretamente na plataforma.",
      valor: [
        { titulo: "Feedback estruturado", texto: "Questionários para diferentes públicos criados e distribuídos em um só lugar." },
        { titulo: "Resultados na hora", texto: "Respostas analisadas diretamente na plataforma, sem exportar planilhas." },
        { titulo: "Melhoria contínua", texto: "Percepções reais que orientam o aprimoramento de processos e serviços." }
      ],
      funcionalidades: ["Criação de questionários", "Distribuição por público", "Coleta de respostas", "Análise de resultados", "Administração de pesquisas"]
    },
    {
      id: "treinamentos",
      nome: "Treinamentos",
      familia: "pessoas",
      headline: "Capacitação completa, do curso ao certificado.",
      resumo: "Estrutura cursos, avaliações, turmas e prazos, com execução de conteúdos, assinatura eletrônica e emissão automática de certificados.",
      valor: [
        { titulo: "Conformidade garantida", texto: "Treinamentos obrigatórios com prazos, turmas e acompanhamento de quem concluiu." },
        { titulo: "Autonomia do participante", texto: "Conteúdos, avaliações e assinatura eletrônica pelo computador ou pelo celular." },
        { titulo: "Zero papel", texto: "Certificados emitidos automaticamente e histórico completo sempre disponível." }
      ],
      funcionalidades: ["Cursos em módulos de aprendizagem", "Conteúdos em vídeo e documentos", "Avaliações e critérios de aprovação", "Gestão de turmas e prazos", "Assinatura eletrônica", "Certificados automáticos", "Disponível no App Maestro"]
    },
    {
      id: "loyalty",
      nome: "Loyalty",
      familia: "relacionamento",
      headline: "Engajamento movido pelos dados da própria operação.",
      resumo: "Programas de engajamento baseados nos próprios dados da operação: campanhas, pontuações, recompensas e gamificação com acompanhamento de resultados.",
      valor: [
        { titulo: "Reconhecimento automático", texto: "Comportamentos e atividades registradas no Maestro geram pontos e recompensas." },
        { titulo: "Gamificação sem planilha", texto: "Campanhas e regras rodam na plataforma, sem processos paralelos de controle." },
        { titulo: "Resultados medidos", texto: "Relatórios de aderência mostram o que engaja e onde ajustar a estratégia." }
      ],
      funcionalidades: ["Campanhas e promoções", "Pontuações e recompensas", "Moedas e extratos", "Regulamentos", "Gestão de participantes", "Painéis individuais", "Experiência no App Maestro"]
    },
    {
      id: "suprimentos",
      nome: "Suprimentos",
      familia: "operacao",
      headline: "Estoque sob controle, da entrada ao descarte.",
      resumo: "Controla estoque de ponta a ponta: produtos, depósitos, fornecedores, entradas, saídas, transferências e relatórios de consumo e movimentação.",
      valor: [
        { titulo: "Reposição planejada", texto: "Estoques mínimos e relatórios de consumo evitam faltas e compras de emergência." },
        { titulo: "Rastreabilidade total", texto: "Cada entrada, saída e transferência registrada, com códigos CA e descarte controlados." },
        { titulo: "Cadastro ágil", texto: "Importação de produtos em lote com validação automática e correção na própria plataforma." }
      ],
      funcionalidades: ["Produtos, famílias e componentes", "Depósitos e fornecedores", "Entradas, saídas e transferências", "Estoque mínimo e descarte", "Códigos CA", "Importação em lote", "Carga de dados SINAPI", "Saída de estoque pelo App"]
    }
  ]
};
