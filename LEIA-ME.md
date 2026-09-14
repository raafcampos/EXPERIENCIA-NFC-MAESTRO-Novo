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

Links diretos para cada módulo: `index.html?m=<id>` ou `index.html#/<id>`. Os ids são os nomes das pastas em `assets/modulos/`.

## Ajustes rápidos (`js/modulos.js`)

- `tempos.voltarInicio`: segundos sem interação até voltar à tela inicial (padrão 90).
- `tempos.avancoCena`: segundos em cada cena antes de avançar sozinho (padrão 14; 0 desliga).
- Textos de cada módulo: `headline`, `resumo`, `valor` (3 cartões) e `funcionalidades`.
- Cores das famílias de módulos: `familias`.

**Depois de editar CSS ou JS:** aumente o número de versão `?v=` no `index.html` (CSS e JS) e o `CACHE` no `sw.js`. Assim o tablet não continua usando os arquivos antigos guardados no cache.
