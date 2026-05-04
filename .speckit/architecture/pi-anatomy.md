---
dono: Cesar
atualizado: 2026-05-04
status: draft
---

# Anatomia do Pi — o que herdamos, o que estendemos, o que cuidamos

Strata é fork/upgrade de `@mariozechner/pi-coding-agent` (ver [ADR-0001](adr/ADR-0001-fork-pi-vs-from-scratch.md) e [ADR-0002](adr/ADR-0002-strata-as-fork-app-not-extension.md)). Este doc mapeia as abstrações do Pi que tocamos diretamente — pra acelerar onboarding e marcar onde a divergência acontece.

> Fonte: pi-mono, package `coding-agent`, README + exports SDK públicos. Atualizar quando migrarmos versão upstream.

---

## Abstrações principais

### `createAgentSession()`
**O que faz:** factory que inicializa uma sessão (auth + model registry + session manager).

**Como Strata usa:** envelopamos em `createStrataSession({mode, vaultPath, workspacePath})`. O parâmetro `mode: 'vereda' | 'mestre'` decide o tool-set. `vaultPath` e `workspacePath` injetados via closure no Note Builder e Tool Allowlist.

**Não tocar diretamente no Pi:** nossa wrapper mora em `src/lib/strata-extensions/session.ts`.

---

### `SessionManager`
**O que faz:** persiste sessão em JSONL. Tem `.inMemory()` pra efêmero.

**Como Strata usa:** persiste por padrão em `~/.strata/sessions/{date}-{slug}.jsonl`. `inMemory` quando o usuário começa com `/efemero` (caso de "só pensando alto, não quero registrar").

**Aproveitar branching:** Pi suporta `/tree` e `/fork` em sessões. **Casamento direto com a metáfora do manifesto** — cada fork é uma camada alternativa de exploração do mesmo conceito. A nota Obsidian gerada referencia o branch ativo no campo `relacionados` ou em metadata adicional.

---

### `AuthStorage`
**O que faz:** guarda chaves API e credenciais OAuth.

**Como Strata usa:** intocado. Reusamos. Localização Strata: `~/.strata/auth/`.

---

### `ModelRegistry`
**O que faz:** mantém modelos disponíveis por provider. Configurado via `~/.pi/agent/models.json`.

**Como Strata usa:** mesma mecânica, arquivo próprio em `~/.strata/models.json`. Ollama é registrado por padrão na primeira execução (auto-detect em `localhost:11434`).

---

### `pi.registerTool({...})`
**O que faz:** registra tool customizada no agent loop.

**Como Strata usa:** registramos `note` (Note Builder) e `vault.read` (lê notas existentes pra preencher `relacionados`). Em Vereda, **shadowing** das tools `write`, `edit`, `bash` por versões "guarda" que retornam mensagem didática em vez de executar.

---

### Flag `--tools <list>` (e `--no-builtin-tools`)
**O que faz:** allowlist de tools por execução.

**Como Strata usa:** **este é o coração do Mode Router em código.** Não passamos pela CLI flag em runtime — replicamos a lógica em código:
- **Vereda:** `['read', 'grep', 'find', 'ls', 'note', 'vault.read']`
- **Mestre:** todos os builtins + `note` + `vault.read`

Vive em `src/lib/mode/tool-allowlist.ts`.

---

### Agent loop (iteração de tool-call)
**O que faz:** loop que faz: prompt → modelo → tool_calls → execução → resultado → continuação.

**Onde Strata intercepta:** entre `tool_calls` e execução, **Mode Router valida contra o allowlist**. Se Vereda recebe `write`, retornamos um `tool_result` sintético: `"Em Modo Vereda, escrita está desativada. Aponte ao usuário onde editar (arquivo:linha) e o que fazer."` — o modelo continua o turno gracefully.

**Importante:** não modificamos o loop do Pi. Plugamos via shadowing de tools — minimiza diff no fork.

---

### Session JSONL format
**O que faz:** persistência human-readable, append-only.

**Como Strata usa:** reusamos formato — mantém compatibilidade com Pi puro (alguém pode `cat` uma sessão Strata num Pi e ler). Acrescentamos campos opcionais (`strata.mode`, `strata.note_id`, `strata.workspace`) que Pi ignora.

---

## Riscos conhecidos (heranças incômodas)

- **Pi ainda evolui.** Cada bump upstream = sync. Mitigação no [ADR-0001](adr/ADR-0001-fork-pi-vs-from-scratch.md): pasta `strata-extensions/` isolada.
- **Tool-use em modelo local 7B é frágil** (lição do `Czar210/claude-code-local` — "garbled-output recovery"). Pi assume tool-call bem formado. **Vamos precisar de uma camada de tolerância** (parse + retry) entre Pi loop e tool execution. Issue pra abrir em M2.
- **System prompt grande estoura contexto em 7B** (também lição do `claude-code-local`: ele *strippa* o harness de 10K tokens do Claude Code antes de enviar). Strata-Vereda em modelo local precisa de prompt **enxuto** (alvo: ≤2K tokens). Documentado em [`modes-spec.md`](../product/modes-spec.md) e [`ide-integration.md`](ide-integration.md).

## O que NÃO herdamos do Pi

- A interface CLI do Pi (`pi <prompt>`). Strata tem CLI próprio (`strata`) — ver [ADR-0002](adr/ADR-0002-strata-as-fork-app-not-extension.md).
- O sistema de "skills" do Pi (markdown templates) — talvez no futuro.
- Themes do Pi — Strata tem identidade visual própria (Tauri GUI).
