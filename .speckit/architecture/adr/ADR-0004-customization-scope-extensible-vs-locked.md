---
dono: Cesar
atualizado: 2026-05-05
status: draft
supersedes: nenhum
superseded_by: nenhum
---

# ADR-0004 — Customization scope: extensible surfaces vs locked product rules

> **Status: draft.** Promove pra `ativo` quando M4 começar a implementar tool extensibility surface (web search, custom tools, plugins de comunidade). Até lá, conteúdo pode ser editado.

## Contexto

Pi (upstream) é deliberadamente *"aggressively extensible rather than opinionated"* (palavras da própria README do Pi). Strata é fork/upgrade do Pi ([ADR-0001](ADR-0001-fork-pi-vs-from-scratch.md), [ADR-0002](ADR-0002-strata-as-fork-app-not-extension.md)) — herda essa extensibilidade nativamente.

Mas Strata também é um produto **opinativo** (manifesto + [`CONTEXT_DIRECTOR.md`](../../../CONTEXT_DIRECTOR.md) §4 regras duras). Pergunta inevitável: **até onde a extensibilidade do Pi vai antes de bater nas regras duras do Strata?**

Sem decisão clara, dois riscos opostos:
- **Travamos tudo** → Strata vira aplicação rígida, perde o ponto forte da herança Pi (impossibilidade de customizar = impossibilidade de comunidade)
- **Liberamos tudo** → Strata vira "Pi com cara bonita", regras duras §4 ficam descumpríveis (qualquer plugin pode desligar Vereda, sobrescrever frontmatter, escrever fora do `inbox/`)

## Decisão

Estabelecer **linha contratual** entre **superfícies extensíveis** (usuário pode mudar via config/extensão) e **regras duras travadas** (mudança requer novo ADR, não user config).

### Surface extensível (usuário pode customizar)

| Customização | Mecanismo |
|---|---|
| Tools próprias | `pi.registerTool({...})` herdado do Pi |
| Providers de modelo (Anthropic, OpenAI, DeepSeek, etc.) | `~/.strata/models.json` (config file) |
| API keys / credenciais | `~/.strata/auth/{provider}.json` |
| Comandos slash adicionais | extensão Pi (`registerCommand`) |
| Themes do DS | `data-theme="dark|light"` + custom CSS override que respeita tokens |
| Skills / prompt templates (futuro) | `~/.strata/skills/*.md` |
| Modelo local vs cloud | config runtime (auto-detect Ollama default) |
| Workspace path | runtime config (file picker / `--workspace` CLI flag) |
| Vault path + nome do inbox folder | runtime config (default `inbox`) |
| System prompt customization (delta sobre canônico) | (futuro) `~/.strata/prompts/vereda.delta.md` — append, não replace |

### Surface travada (regras duras §4 — mudança = ADR)

| Trava | Razão |
|---|---|
| **Vereda como default ALWAYS** | Manifesto §IV — caminho natural não pode mudar; user toggle persistente quebra a postura |
| **Mestre não persiste entre sessões** | Mesma razão — toggle sticky transformaria Mestre em default de fato |
| **Vault só escrito em `inbox/`** | Manifesto §VII — vault é território do usuário; só `inbox/` é território do Strata por contrato |
| **Sem fallback silente entre providers** | §4 transparency rule — provider chain sempre indicado no masthead |
| **Frontmatter canônico** (`tags`, `bloom`, `data`, `refs`, `relacionados`) | Schema contract entre Strata e Obsidian — mudança = ADR + migração de notas existentes |
| **Telemetria opt-in absoluta** | §4 + privacidade do vault |
| **Modo = accent shift, NUNCA layout shift** | DS v2 contract — Mode é postura, não app diferente |
| **Sem logging de conteúdo de prompts/notas** | §4 privacidade |

### Princípio

**Extensão NUNCA pode dar ao usuário ferramenta pra desligar regra dura.**

Exemplo: se usuário registra tool customizada `bypass-vereda` que escreve em código quando Vereda está ativo, **isso é violação de contrato**. Mesmo que tecnicamente possível via Pi extension API, Strata deve **detectar e bloquear** (ou pelo menos mostrar warning explícito que a tool está operando fora do contrato editorial).

Implementação dessa proteção: ver Mitigações.

## Consequências

### Positivas
- Usuário avançado estende Strata sem perder identidade do produto
- Plugins de comunidade ficam **constrained** — protegem o produto contra subversão acidental
- Linha clara facilita documentação e comunicação (`"isso é config, isso é regra"`)
- Strata pode ter ecossistema de tools customizadas (web search, screenshot, browser automation, …) sem virar "Pi com decoração"

### Negativas
- **Mode Router precisa ativamente validar** tools customizadas — não basta confiar no `--tools <list>` do Pi (que é um allowlist mas não bloqueia tool registrada)
- **Implementação extra:** wrapper sobre `pi.registerTool` que classifica a tool registrada (read-only vs write vs execute) e a rejeita do allowlist Vereda automaticamente
- **Risco de usuário avançado fork do Strata** pra tirar travas — aceitável: é open source, mas o produto canônico mantém regras
- **Documentação extra obrigatória** explicando o porquê das travas (sem isso, vira "produto chato")

## Mitigações

1. **Mode Router em `src/lib/mode/tool-allowlist.ts`** valida QUALQUER tool registrada (built-in ou custom) contra o allowlist do modo ativo. Tool customizada de escrita em Vereda → bloqueada com mensagem didática (ex: `"Tool 'X' tentou escrita em Vereda. Em Vereda, escritas são bloqueadas pra preservar a postura editorial. Ative Mestre se quer execução."`).

2. **Classificador de tool** que inspeciona a tool registrada (via metadata ou heurística sobre seu nome/descrição) e categoriza:
   - `read-only` (read, grep, find, ls, web.search) → permitida em Vereda + Mestre
   - `write` (write, edit) → só Mestre
   - `execute` (bash, exec) → só Mestre + confirmação extra pra destrutivo

3. **Documentar em** `.speckit/product/customization-guide.md` (criar quando M4 começar) o que é extensível e o que é regra dura, com exemplos do que rejeitar e por quê.

4. **`models.json` schema validation** — rejeitar configs que violem regras (ex: tentar setar `default_mode: "mestre"` no config).

5. **Revisitar** quando 1ª comunidade plugin aparecer — possíveis ajustes de implementação à luz de uso real.

## Relação com outros ADRs

- **ADR-0001** decidiu forkar Pi → herdamos a extensibilidade dele
- **ADR-0002** decidiu Strata é app standalone, não extensão do Pi → temos liberdade pra adicionar restrições sobre o que Pi não tem
- **ADR-0003** (planned) — DS editorial register; mode = accent shift never layout shift entra como regra dura referenciada aqui
- **Futuro ADR-0005** (planned) — implementação específica do `web.search` (Brave) como primeira tool opt-in não-trivial; será exemplo concreto deste ADR-0004

## Notas

Este ADR é **arquitetural foundational** — afeta como cada futura tool, plugin, ou config é decidida. Recomendado releitura periódica (a cada release major) pra confirmar que a linha continua correta na prática.
