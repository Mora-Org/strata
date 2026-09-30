# DEV.md: Strata, setup de desenvolvimento

Referência rápida pra rodar o Strata localmente. Pra filosofia, [`manifesto.md`](manifesto.md). Pra regras e stack, [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md). Pro plano atual, [`.speckit/plans/current.md`](.speckit/plans/current.md). Pra quem é novo no repo, o README explica o que o programa faz.

O repo tem duas partes que não dependem uma da outra: o harness (`harness/`), que é o programa de verdade, e a casca da janela (`src/`, `src-tauri/`), que ainda não tem chat.

## Pré-requisitos

- Bun, pro harness: `winget install Oven-sh.Bun`. O Node não serve pro harness: o pi-ai exige Node 22.19 ou mais novo, e o Node da máquina do César é o 22.18.
- Node 22 e npm 10, pra casca da janela.
- Uma chave do OpenCode Go na variável de ambiente `OPENCODE_API_KEY`, só pra rodar o harness contra o modelo de verdade. Os testes não precisam dela.
- Rust, Tauri 2 CLI e as ferramentas de build do MSVC, só quando a janela for mexida.

No PowerShell, `[Environment]::SetEnvironmentVariable('OPENCODE_API_KEY', '<chave>', 'User')` grava a variável, mas só terminais abertos depois enxergam. Num terminal que já estava aberto, `$env:OPENCODE_API_KEY` continua vazio.

## Harness

```bash
cd harness
bun install
bun test                  # 39 testes, sem rede
bun run typecheck         # checagem de tipos
bun run start             # abre o prompt
bun run compile           # gera strata.exe
```

O executável gerado pesa uns 88 MB, quase tudo o runtime do Bun, e não entra no git. Ele procura a pasta `modos/` ao lado dele.

### Configuração

Sem arquivo, o padrão é o OpenCode Go com o modelo `deepseek-v4-flash`, o acervo em `~/Strata/acervo` e o conhecimento do modelo desligado. Pra mudar, crie `~/.strata/config.json` com as chaves `provedor`, `modelo`, `acervo` e `conhecimento_ligado`. Chave desconhecida é erro, e chave de API nunca vai nesse arquivo.

A variável `STRATA_CONFIG` aponta pra outro arquivo de config. É o jeito de testar sem sujar o acervo real.

### Estrutura

```
harness/
├── src/
│   ├── main.ts           o terminal: prompt, comandos, streaming
│   ├── ciclo.ts          o ciclo do agente, com teto de passos por pergunta
│   ├── ferramentas.ts    as seis ferramentas que o modelo recebe
│   ├── acervo.ts         lê e grava o acervo, regenera os índices
│   ├── fontes.ts         arXiv, Crossref e leitura de página
│   ├── citacoes.ts       o conferidor: toda fonte citada existe
│   └── config.ts         leitura do config
├── modos/                os prompts, em markdown (mexer aqui muda o comportamento)
└── test/                 testes e fixtures reais do arXiv e do Crossref
```

### Armadilhas conhecidas

- O OpenCode Go devolve 400 `MissingSessionID` se a chamada não levar `sessionId`. O harness passa um por conversa.
- O Bun bloqueia os postinstalls de `@google/genai` e `protobufjs`. Deixe bloqueados enquanto nada quebrar.
- Teste que chama `buscar_artigos` precisa zerar a espera do arXiv (`zerarEsperaArxiv`), senão o segundo pedido espera 4 segundos de verdade.
- O arXiv recusou pedidos com 429 e timeout em 30/09/2026, até um `curl` isolado. O intervalo de 4 segundos em `INTERVALO_ARXIV_MS` é provisório.
- Teste com o modelo de verdade custa centavos, mas custa. Use acervos de teste descartáveis, fora do repo.
- No PowerShell 5.1, ao gravar a saída do harness, ponha `[Console]::OutputEncoding` e `$OutputEncoding` em UTF-8, senão os acentos viram `?`.

## Casca da janela

Saiu da fase de maio e ainda não tem chat. Não roda o harness.

```bash
npm install
npm run dev          # servidor Vite (localhost:5173)
npm run build        # checagem de tipos e bundle
npm run test:run     # Vitest, uma rodada
npm run test         # Vitest em modo watch
npm run e2e          # Playwright
```

```
src/
├── main.tsx, App.tsx
├── components/       chat, icons, layout (Header, Sidebar, AppShell), ui
├── store/strata.ts   estado com Zustand
├── lib/types/        tipos compartilhados
├── types/messages.ts
└── styles/tokens.css ponte pra design/colors_and_type.css
```

Os identificadores `vereda` e `mestre` continuam nesse código. São os nomes antigos de Estudo e Ação, e o renome acontece junto com a fatia da janela.

### Ponte de tokens

`src/styles/tokens.css` faz `@import '../../design/colors_and_type.css'`, e o design system em `design/` é a única fonte dos tokens. Mudança nele aparece em `src/` sozinha. Não duplique token: se precisar de um novo, acrescente em `design/colors_and_type.css`.

### design/

A pasta tem 18 telas desenhadas com o Claude Design. É referência visual, não runtime. Pra ver o kit no navegador precisa de um servidor HTTP, por causa do React via Babel CDN:

```bash
cd design/ui_kits/strata-desktop
python -m http.server 8765
# abre http://localhost:8765
```

## Stack travada

Se a stack mudar, atualize [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md) §3 e abra um ADR. A stack atual está lá, com o motivo de cada escolha.
