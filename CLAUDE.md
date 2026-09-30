# CLAUDE.md: Strata

## Meu Papel
Sou o **Programador** do Strata. Cesar é o Diretor: ele decide o que construir e aprova cada entrega. Não existe planejador externo neste projeto: Cesar planeja, eu executo, TestSprite valida.

**Fluxo padrão:** Cesar descreve o que quer → eu proponho a abordagem → Cesar aprova → eu implemento → testes e TestSprite → Cesar aprova.

**Antes de propor abordagem:** consulto [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md) (regras, stack, regras duras §4) e [`.speckit/plans/current.md`](.speckit/plans/current.md) (iteração atual). Desvio das §3/§4 do Director = bloqueador, não execução silenciosa.

**Antes de escrever UI/CSS:** consulto [`design/`](design/) (DS canônico v2: Fraunces / Geist / Geist Mono, registro editorial, 18 telas) e [`.speckit/product/design-system.md`](.speckit/product/design-system.md). O kit em `design/` é referência visual.

**Direção atual (30/09/2026):** [`.speckit/product/direcao-2026-09.md`](.speckit/product/direcao-2026-09.md), com as falas do César e as perguntas abertas. As falas das entrevistas estão em [`.speckit/product/entrevista-manifesto.md`](.speckit/product/entrevista-manifesto.md).

---

## A Filosofia do Produto (leia antes de qualquer código)

Strata é um harness de estudo. Quem não fuça não aprende, só copia código e cola, e o Strata é o jeito de evitar isso. Leia o [`manifesto.md`](manifesto.md).

```
MODO ESTUDO (padrão)
  - Pesquisa o conceito em fontes, não responde de memória
  - Guarda cada fonte no acervo e lista quais seguir
  - Não apressa; pode escrever código de exemplo

MODO AÇÃO
  - Escreve, edita e executa
  - Pode ser o padrão pelo config
```

O conhecimento do próprio modelo começa desligado; a pessoa liga quando quiser.

Os modos se chamavam Vereda e Mestre. O renome para Estudo e Ação está feito na documentação e no harness. Os identificadores `vereda` e `mestre` continuam em `src/` e em `design/` até a fatia da janela.

---

## Stack

Detalhe e justificativas em [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md) §3.

- **Harness:** programa próprio em TypeScript (`harness/`), rodando e compilando com Bun. Provedores pelo `@earendil-works/pi-ai`, versão exata. Primeira fatia: OpenCode Go com `deepseek-v4-flash`.
- **Janela (fatia futura):** Tauri v2 + React 19 + TypeScript + TailwindCSS v3 + Zustand, com teto de 400 MB de RAM (ADR-0006).
- **Acervo:** markdown em árvore de índices (ADR-0007). Obsidian é opcional.
- **Design system:** Strata DS v2, ver [`design/`](design/) e [ADR-0003](.speckit/architecture/adr/ADR-0003-editorial-register.md).
- **Testes:** `bun test` no harness (sem rede), Vitest e Playwright na janela, TestSprite como QA.

---

## Como Rodar Localmente

O Bun vem do winget: `winget install Oven-sh.Bun`. O Node da máquina do César é o 22.18 e o pi-ai exige 22.19, então o harness não roda em Node.

```bash
# Harness (quando a Parte B da fatia 1 entrar)
cd harness
bun install
bun test
bun run src/main.ts

# Janela (casca de maio, ainda sem chat)
npm install
npm run test:run
npm run build
```

A chave do provedor vem da variável `OPENCODE_API_KEY`. Nunca vai em arquivo de config.

---

## Arquitetura

```
strata/
├── harness/                # O harness: ciclo do agente, ferramentas, acervo, modos
│   ├── src/                # main, ciclo, config, acervo, fontes, citacoes, ferramentas
│   ├── modos/              # prompts dos modos, em markdown
│   └── test/               # testes sem rede, com fixtures do arXiv e do Crossref
├── src/                    # Casca da janela (React), a partir da fatia da janela
├── src-tauri/              # Tauri
├── design/                 # DS v2 canônico: referência visual
├── .speckit/               # Specs vivas, planos, tracking, ADRs
├── CLAUDE.md               # Este arquivo
├── CONTEXT_DIRECTOR.md     # Regras, stack, regras duras §4
├── manifesto.md            # Filosofia do produto
└── README.md               # Overview público (ainda descreve a versão de maio)
```

---

## Convenções de Código

### Regra fundamental
**Tipos e contratos antes de qualquer implementação.** Nenhuma função sem sua interface TypeScript definida primeiro.

### Nomenclatura
| Padrão | Uso | Exemplo |
|--------|-----|---------|
| `is*` / predicado bare | Booleanos | `isConnected`, `modeActive` |
| `_método` | Privado | `_parseResponse`, `_buildNote` |
| `SCREAMING_SNAKE` | Constantes | `DEFAULT_MODEL`, `TETO_PASSOS` |
| `use*` + substantivo | Hooks React | `useStrataStore` |
| sem sufixo Async | Funções async | `connect()`, `generate()` |

### Estrutura de pastas
- Flat e explícita, sem over-nesting
- Cada pasta tem peso: sem pastas com arquivo único

### Comentários
- Esparsos e estratégicos: explica o **por quê**, não o **o quê**
- Sem docstrings multi-linha
- Português para comentários, inglês para código

### Erros
- Falhas silenciosas em I/O secundário (disco, reconexão), sem travar o fluxo principal
- Falhas explícitas em contratos quebrados (tipos inválidos, auth): errar rápido
- Sem try/catch genérico que engole erros

---

## O Acervo

Árvore de três níveis, markdown comum (ADR-0007):

```
acervo/
  INDICE.md          um tema por linha
  temas/<tema>.md    uma fonte por linha, em ordem de leitura
  fontes/<id>.md     uma nota por fonte (frontmatter + o que a fonte diz)
```

O modelo decide tema, resumo e ordem. O código grava os arquivos e regenera os índices. Pasta padrão: `~/Strata/acervo`, trocável no config.

---

## Provedores de Modelo

- Padrão da primeira fatia: OpenCode Go, modelo `deepseek-v4-flash`.
- A pessoa pode trocar o provedor no config (`~/.strata/config.json`). Modelo local entra por endpoint compatível com OpenAI (Ollama, LM Studio).
- Toda chamada ao OpenCode Go leva um `sessionId`, senão o servidor devolve 400 `MissingSessionID`.
- Sem fallback silencioso: se o provedor falha, a pessoa vê o erro.

---

## Bugs Conhecidos / Armadilhas

- O pi-ai exige Node 22.19 ou mais novo. Usar Bun.
- O Bun bloqueia os postinstalls de `@google/genai` e `protobufjs`. Deixar bloqueados enquanto nada quebrar.
- O vitest da janela pega o spec do Playwright se a pasta `e2e/` não estiver excluída (já excluída em `vite.config.ts`).

---

## TestSprite: Como Usar

1. Cesar roda o comando que eu forneço no terminal
2. Cesar me passa o output
3. Eu analiso e reporto

---

## O que EU não faço neste projeto

- Não tomo decisões de produto sem aprovação do Cesar
- Não adiciono dependências sem justificativa explícita
- Não atualizo o `pi-ai` sem decisão consciente: a versão é exata de propósito
- Não gravo chave de API em arquivo, log ou transcrição

---
## Nota de limpeza de disco (Claude / 2026-06-28)
As pastas recriaveis deste projeto (node_modules, .venv, venv, __pycache__, dist, build, .next, target) podem ter sido removidas para liberar espaco em disco. NAO trate a ausencia delas como problema do projeto -- restaure com o gerenciador de pacotes (npm install / pip install / cargo build). O codigo-fonte e os dados versionados estao intactos.
