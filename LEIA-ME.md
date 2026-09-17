# Experiência NFC · Plataforma Maestro

Página interativa para tablet na horizontal. O visitante encosta o totem de um módulo no leitor NFC e a tela mostra a apresentação daquele módulo em três cenas: **Visão geral**, **Como agrega valor** e **Funcionalidades**.

## Estrutura

```
EXPERIENCIA NFC MAESTRO/
├── index.html                  página
├── css/style.css               visual e animações
├── js/modulos.js               TEXTOS DOS 16 MÓDULOS + CONFIGURAÇÕES  ← edite aqui
├── js/app.js                   lógica (leitura NFC, navegação, mídias)
├── sw.js / manifest.webmanifest  funcionamento offline e "instalar como app"
├── iniciar-experiencia.command duplo clique para rodar no Mac
└── assets/
    ├── logos/  fonts/
    └── modulos/<modulo>/       IMAGENS E VÍDEOS de cada módulo
```

## Inserir imagens e vídeos

Coloque os arquivos na pasta do módulo em `assets/modulos/` com estes nomes exatos. Não é preciso mexer no código.

| Arquivo | Onde aparece | Formato ideal |
|---|---|---|
| `capa.jpg` | Visão geral | 1600×1200 (4:3) |
| `video.mp4` | Funcionalidades | 1920×1080, H.264, sem áudio, até ~20 MB |
| `tela-1.jpg` … `tela-4.jpg` | Funcionalidades (carrossel, se não houver vídeo) | 1920×1200 (16:10) |

Também aceita `.png` e `.webp`. Enquanto o arquivo não existir, aparece um espaço animado com o nome esperado. Para esconder esses nomes no evento, mude `mostrarCaminhoDasImagens` para `false` em `js/modulos.js`.

## Testar no computador

1. Dê duplo clique em `iniciar-experiencia.command`. O navegador abre em `http://localhost:8080`.
2. Sem leitor, use o teclado:
   - **1 a 16 + Enter** abre o módulo correspondente
   - **← →** troca de cena, **↑ ↓** vai para o módulo anterior ou seguinte
   - **Esc** volta ao início

## Leitor NFC

### Opção A: leitor USB em modo teclado (recomendada)
- Use um leitor de 13,56 MHz com "emulação de teclado/HID", compatível com NTAG213/215.
- Conecte no tablet por USB-C (OTG). Android e iPad reconhecem o leitor como teclado.
- O leitor envia o código da tag e a página abre o módulo vinculado.

### Opção B: NFC do próprio tablet (Android)
- Só funciona no Chrome para Android, em tablet com NFC, com a página publicada em **HTTPS**.
- Ative no painel de configuração, em "Ativar NFC do tablet".
- Nesse modo a tag também pode conter o link do módulo (ex.: `https://…/index.html?m=gestor`). O mesmo link abre a página no celular do visitante.

## Vincular cada tag ao seu totem

1. Na tela inicial, **segure o logo Maestro por 2 segundos** (ou tecle Ctrl+Shift+A). Abre o painel.
2. Toque em **Vincular** no módulo e aproxime a tag do totem correspondente.
3. Repita para os 16 totens. Os vínculos ficam salvos no tablet.
4. Para garantir, use **Exportar vínculos → Copiar** e cole o conteúdo em `config.tags` no arquivo `js/modulos.js`.

## Colocar no tablet para o evento

1. Publique a pasta inteira em um endereço HTTPS: Netlify Drop (arraste a pasta em app.netlify.com/drop), GitHub Pages ou Vercel.
2. Abra o endereço no Chrome do tablet e use **Adicionar à tela inicial**. A experiência abre em tela cheia, como um aplicativo.
3. Com internet, abra o painel e toque em **Preparar para offline**. A partir daí funciona sem conexão.
4. Configure o tablet: brilho alto, suspensão de tela desativada e fixação de tela (Android) ou Acesso Guiado (iPad), para o visitante não sair do app.

## Links para gravar nas tags (celular do visitante)

Grave em cada tag um registro **URL/URI** com o link do totem. Pelo app NFC Tools: Gravar → Adicionar registro → URL/URI. Quando o visitante aproxima o celular, a página do módulo abre direto.

| Totem | Link |
|---|---|
| 01 · Administração | https://experiencia-nfc-maestro-novo.vercel.app/?m=administracao |
| 02 · Gestor | https://experiencia-nfc-maestro-novo.vercel.app/?m=gestor |
| 03 · Projetos | https://experiencia-nfc-maestro-novo.vercel.app/?m=projetos |
| 04 · Documentos | https://experiencia-nfc-maestro-novo.vercel.app/?m=documentos |
| 05 · Atendimento Interno | https://experiencia-nfc-maestro-novo.vercel.app/?m=atendimento-interno |
| 06 · Clientes | https://experiencia-nfc-maestro-novo.vercel.app/?m=clientes |
| 07 · Colaboradores | https://experiencia-nfc-maestro-novo.vercel.app/?m=colaboradores |
| 08 · Dashboards / BI | https://experiencia-nfc-maestro-novo.vercel.app/?m=dashboards-bi |
| 09 · Analítico | https://experiencia-nfc-maestro-novo.vercel.app/?m=analitico |
| 10 · Sensores | https://experiencia-nfc-maestro-novo.vercel.app/?m=sensores |
| 11 · Recrutamento e Seleção | https://experiencia-nfc-maestro-novo.vercel.app/?m=recrutamento-selecao |
| 12 · Oportunidades | https://experiencia-nfc-maestro-novo.vercel.app/?m=oportunidades |
| 13 · Pesquisas | https://experiencia-nfc-maestro-novo.vercel.app/?m=pesquisas |
| 14 · Treinamentos | https://experiencia-nfc-maestro-novo.vercel.app/?m=treinamentos |
| 15 · Loyalty | https://experiencia-nfc-maestro-novo.vercel.app/?m=loyalty |
| 16 · Suprimentos | https://experiencia-nfc-maestro-novo.vercel.app/?m=suprimentos |

Os links também aparecem no painel de configuração (segure o logo Maestro), com o botão **Copiar link** em cada módulo. Se o endereço do site mudar, atualize `config.urlBase` em `js/modulos.js`.

**Modo visitante:** aberta por esses links num navegador comum (celular), a página não volta sozinha ao início, não avança as cenas e não pede tela cheia. O tablet do estande, instalado como app pela tela inicial, continua no modo totem. Para testar o modo totem por link, acrescente `&modo=totem`.

## Quizzes

Os dois últimos botões da tela "Os 16 módulos" são quizzes, em amarelo cheio. Eles ocupam o lugar de Administração e Dashboards / BI na grade; esses dois módulos continuam com página própria, acessíveis pela tag, pela faixa da tela inicial e como recomendação nos resultados.

| Quiz | O que faz | Link direto |
|---|---|---|
| Diagnóstico da Operação | Pergunta de perfil (presta, contrata ou os dois) + 6 perguntas. Mostra o nível (1 a 4), o diagnóstico na leitura do perfil escolhido, os 2 gargalos com a resposta dada e o próximo degrau | `?q=diagnostico` |
| Maestro sob Medida | 10 perguntas em 3 blocos. Mostra o índice de aderência, os 3 módulos que mais conversam com a operação e o plano sugerido | `?q=recomendador` |

Os links antigos `?q=maturidade` e `?q=conexao` continuam funcionando e levam aos quizzes novos.

**Diagnóstico.** Quatro eixos: Comprovação (P1), Efetivo e escala (P2 e P3), Dado e medição (P4 e P5) e Transparência (P6). Cada alternativa vale de 0 a 3, num total de 18. Os níveis são 0–4, 5–9, 10–14 e 15–18. Os dois gargalos são os eixos de menor percentual do próprio máximo, com desempate por pontuação absoluta e, depois, pela ordem Comprovação, Dado e medição, Efetivo e escala, Transparência. A tela não mostra a pontuação numérica, de propósito.

**Maestro sob Medida.** O índice (0 a 12) soma capital humano (porte), recorrência, urgência e criticidade. O resultado não dá nota à operação: ele nomeia **o tamanho da configuração recomendada**, e por isso nenhuma faixa soa como recusa.

| Índice | Faixa | Módulos no resultado |
|---|---|---|
| 10 a 12 | Configuração completa | até 6 |
| 7 a 9 | Configuração ampla | até 5 |
| 4 a 6 | Configuração focada | até 3 |
| 0 a 3 | Configuração essencial | 1 frente + Aplicativo Maestro |

Cada faixa tem um **piso de pontos** próprio: 3 pontos nas configurações essencial e focada, 2 pontos na ampla e na completa, para que o limite maior realmente renda mais módulos. O número de itens do aplicativo é limitado à metade das vagas, para a plataforma não parecer um app de celular. A partir de 4 módulos, o resultado usa duas colunas com cartões compactos. O plano sugerido (Starter, Business ou Enterprise) sai do maior sinal entre porte e módulos, e nenhum valor em reais aparece na tela.

O índice continua gravado em `indice_aderencia` no CSV, junto com `configuracao`: a fila de follow-up segue ordenada por aderência real, mesmo que o visitante nunca veja essa palavra.

**Configuração** (`config.quiz`, em `js/modulos.js`):

| Campo | Para que serve |
|---|---|
| `nomenclatura` | `sobria` (Reativo, Controlado, Monitorado, Integrado) ou `musical` (Desafinado, Ensaiando, Afinado, Orquestrado) |
| `inatividade` | Segundos sem toque até voltar à tela inicial durante o quiz (padrão 30) |
| `versaoRapida` | `true` deixa o recomendador com 6 perguntas, para quando a fila apertar |
| `modoTeste` | `true` marca as respostas como teste da equipe, e elas ficam fora do agregado |
| `minimoBenchmark` | Respostas mínimas para exibir o percentual "neste estande" (padrão 20) |
| `dispositivo` | Identifica o tablet, útil com mais de um totem |
| `endpoint` | Opcional: URL que recebe cada sessão (Apps Script, webhook). Vazio = só no tablet |

- Textos, perguntas, pontuação e matriz de módulos ficam em `js/quiz.js`; a captura e o registro, em `js/captura.js`.
- Para conferir um resultado sem responder tudo: `?q=diagnostico&perfil=contrata&respostas=4,4,4,3,4,4` (a posição da alternativa na tela, de 1 a 4).
- Para mudar quais módulos saem da grade, edite `FORA_DA_GRADE` no topo do `js/quiz.js`.

## Captura de contato e respostas

No fim dos dois quizzes, o botão de receber o material abre a tela de captura:

1. **Câmera**: lê o QR do crachá e guarda o link do código junto com a sessão. Usa o leitor nativo do Chrome quando existe e o `assets/vendor/jsqr.js` como reserva, o que cobre iPad e Safari.
2. **Digitar**: nome, empresa, cargo, e-mail e WhatsApp opcional, com o texto de consentimento à vista.
3. **Agora não**: fecha sem contato. A sessão continua gravada.

**A câmera só funciona em HTTPS** (o site publicado) ou em `localhost`, e depende de conceder a permissão no aparelho. Teste isso no tablet antes do evento.

**Onde ficam as respostas.** Tudo é gravado no próprio tablet, inclusive as sessões abandonadas no meio. No painel de configuração (segure o logo Maestro por 2 s) há a caixa **Respostas dos quizzes**, com a contagem e os botões **Exportar CSV** e **Apagar respostas**. O CSV traz perfil, respostas, nível, eixos, gargalos, aderência, dores, módulos, plano, contato e o link lido do QR.

**Envio do material.** O app promete o e-mail e registra o contato; o envio em si é feito por vocês depois, a partir do CSV. Se quiser envio automático, preencha `config.quiz.endpoint` com a URL de um Apps Script ou webhook: o app manda cada sessão concluída e reenvia sozinho o que ficou pendente quando a internet voltar.

## Ajustes rápidos (`js/modulos.js`)

- `tempos.voltarInicio`: segundos sem interação até voltar à tela inicial (padrão 90).
- `tempos.avancoCena`: segundos em cada cena antes de avançar sozinho (padrão 14; 0 desliga).
- Textos de cada módulo: `headline`, `resumo`, `valor` (3 cartões) e `funcionalidades`.
- Cores das famílias de módulos: `familias`.

**Depois de editar CSS ou JS:** aumente o número de versão `?v=` no `index.html` (CSS e JS) e o `CACHE` no `sw.js`. Assim o tablet não continua usando os arquivos antigos guardados no cache.
