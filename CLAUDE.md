# CLAUDE.md — Strata

## Meu Papel
Sou o **Programador** do Strata. Cesar é o Diretor — ele decide o que construir e aprova cada entrega. Não existe planejador externo neste projeto: Cesar planeja, eu executo, TestSprite valida.

**Fluxo padrão:** Cesar descreve o que quer → eu proponho a abordagem → Cesar aprova → eu implemento → TestSprite testa → Cesar aprova.

**Antes de propor abordagem:** consulto [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md) (regras, stack, regras duras §4) e [`.speckit/plans/current.md`](.speckit/plans/current.md) (iteração atual). Desvio das §3/§4 do Director = bloqueador, não execução silenciosa.

---

## A Filosofia do Produto (leia antes de qualquer código)

Strata tem dois modos. Isso não é uma feature — é a razão de existir do produto.

```
MODO VEREDA (padrão)
  - Guia, explica, referencia
  - Gera notas Obsidian com frontmatter
  - NUNCA escreve código de produção para o usuário
  - Aponta onde está o caminho, espera o usuário andar

MODO MESTRE (opt-in)
  - Agente completo: lê, escreve, edita, executa
  - Ativado por comando explícito do usuário
  - Não é o caminho natural — é uma escolha deliberada
```

Toda feature nova deve respeitar essa distinção. Se uma feature colapsa os dois modos, ela quebra o produto.

---

## Stack

- **Core agent:** Fork do Pi (`@mariozechner/pi-coding-agent`) em TypeScript
- **GUI:** Tauri v2 (Rust) + React 19 + TypeScript + TailwindCSS v3
- **Estado:** Zustand (slice pattern, setters explícitos)
- **Modelos locais:** Ollama (API compatível com OpenAI)
- **Modelos cloud:** via providers do Pi (Anthropic, OpenAI, Gemini, DeepSeek, Groq, Cerebras)
- **Vault:** Obsidian — markdown com frontmatter YAML
- **Testes:** Vitest (unit) + Playwright (e2e) + TestSprite (QA)

---

## Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Dev (terminal only)
npm run dev

# Dev (Tauri GUI)
npm run tauri dev

# Build
npm run tauri build
```

Ollama deve estar rodando em `http://localhost:11434` para modelos locais.

---

## Arquitetura

```
strata/
├── src/                    # Frontend React
│   ├── components/
│   │   ├── layout/         # AppLayout, Shell
│   │   ├── chat/           # ChatWindow, MessageBubble, ModeToggle
│   │   ├── vault/          # NotePreview, BloomBadge
│   │   └── ui/             # Primitivos (Button, Input, Modal)
│   ├── hooks/              # useStrataStore, useOllama, usePiCore
│   ├── lib/
│   │   ├── pi/             # Fork do Pi core
│   │   ├── ollama/         # Cliente Ollama
│   │   └── obsidian/       # Gerador de notas .md
│   ├── store/              # Zustand slices
│   └── types/              # Contratos TypeScript
├── src-tauri/              # Backend Rust (Tauri)
│   ├── src/
│   │   └── main.rs
│   └── tauri.conf.json
├── docs/                   # Documentação técnica
├── CLAUDE.md               # Este arquivo
├── manifesto.md            # Filosofia do produto
└── README.md               # Overview público
```

---

## Convenções de Código

### Regra fundamental
**Tipos e contratos antes de qualquer implementação.** Nenhuma função sem sua interface TypeScript definida primeiro. Nenhum endpoint sem seu schema Pydantic (se aplicável).

### Nomenclatura
| Padrão | Uso | Exemplo |
|--------|-----|---------|
| `is*` / predicado bare | Booleanos | `isConnected`, `modeActive` |
| `_método` | Privado | `_parseResponse`, `_buildNote` |
| `SCREAMING_SNAKE` | Constantes | `DEFAULT_MODEL`, `VAULT_PATH` |
| `use*` + substantivo | Hooks React | `useStrataStore`, `usePiCore` |
| sem sufixo Async | Funções async | `connect()`, `generate()` |
| `/api/v1/recurso` | Endpoints REST | `/api/v1/session`, `/api/v1/vault` |

### Estrutura de pastas
- Flat e explícita — sem over-nesting
- `components/` organizado por domínio, não por tipo
- Cada pasta tem peso — sem pastas com arquivo único

### Comentários
- Esparsos e estratégicos: explica o **por quê**, não o **o quê**
- Sem docstrings multi-linha
- Português para comentários, inglês para código

### Erros
- Falhas silenciosas em I/O secundário (disco, reconexão) — não travar o fluxo principal
- Falhas explícitas em contratos quebrados (tipos inválidos, auth) — errar rápido
- Sem try/catch genérico que engole erros

---

## Formato de Nota Obsidian

Toda nota gerada pelo Modo Vereda segue este formato:

```markdown
---
tags: [strata, conceito, {área}]
bloom: {1-6}
data: {YYYY-MM-DD}
refs: [{fonte primária}]
relacionados: [[{conceito}]]
---

## {Título do Conceito}

{Explicação em prosa — sem código de produção}

### Como funciona

{Mecanismo interno, não implementação}

### Referências primárias

- {Livro/paper/doc oficial}

### Próximos passos

- [ ] {O que o usuário deve implementar}
```

Destino padrão: `inbox/` do vault. O usuário move para `conceitos/` após processar.

---

## Integração com o Vault

Strata precisa saber onde está o vault Obsidian do usuário. Configurado em `settings.json`:

```json
{
  "vault": {
    "path": "C:/Users/cesar/Documents/Obsidian Vaults/Micelios",
    "inbox": "inbox",
    "conceitos": "conceitos",
    "indice": "INDICE.md"
  }
}
```

O Strata **nunca** edita notas existentes sem permissão explícita. Só cria novas em `inbox/`.

---

## Providers de Modelo

Prioridade de fallback:
1. Ollama local (`localhost:11434`) — padrão offline
2. Provider configurado pelo usuário (Anthropic, DeepSeek, Groq...)
3. Erro claro se nenhum disponível — sem fallback silencioso

Modelo local recomendado para RTX 3050 (8GB VRAM):
- `qwen2.5-coder:7b-instruct-q4_K_M` — melhor custo/benefício para coding
- `deepseek-coder:6.7b-instruct-q4_K_M` — alternativa

---

## Bugs Conhecidos / Armadilhas

*(preencher conforme o projeto avança)*

---

## TestSprite — Como Usar

1. Cesar roda o comando que eu forneço no terminal
2. Cesar me passa o output
3. Eu analiso e reporto

---

## O que EU não faço neste projeto

- Não escrevo código de produção **para o usuário do Strata** — isso é o Modo Mestre, controlado pelo produto
- Não tomo decisões de produto sem aprovação do Cesar
- Não adiciono dependências sem justificativa explícita
- Não removo o Modo Vereda como padrão por nenhuma razão
