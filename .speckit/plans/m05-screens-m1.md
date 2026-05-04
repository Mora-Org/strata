---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# M0.5.b — Screens M1 (priority 1)

Screens necessárias pra M1 (**chat hello-world Ollama**). Sem Mode Router funcional ainda, sem Note Builder real. Vereda como única vibe operacional.

> **Veja primeiro:** [`m05-screen-spec.md`](m05-screen-spec.md) — overview, app shell, flows globais, anti-design.

## Inventário

| # | Tipo | Nome | Quando aparece |
|---|---|---|---|
| 1.1 | Screen | Empty state (primeira sessão) | App abre sem conversa anterior |
| 1.2 | Screen | Active conversation (Vereda) | Sessão ativa com ≥1 message |
| 1.3 | State | Streaming indicator | Inline na message em construção |
| 1.4 | Screen | Settings | User abre via comando ou ícone |
| 1.5 | Screen | Workspace picker | Sem workspace setado / user troca |
| 1.6 | State | Connection-lost banner | Ollama não responde |

---

## 1.1 — Empty State (primeira sessão)

> **Energy reference:** "MONDAY" (display serif ornamentado como compositional moment) + "REST IN PEACE" (gravitas literária).

### Purpose
Primeira tela quando o usuário abre Strata sem conversa anterior. Não é onboarding — é um **manifesto moment**. O input está pronto; o resto é pausa editorial.

### Surface
Janela principal Tauri (baseline 1280×800). Header 56px no topo, sidebar 260px à esquerda, main column central (sem aside). Sidebar mostra workspace setado mas conversations vazia.

### Wireframe (dark mode)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▦ strata    workspace—strata-cli  vault—~/notes  model—llama3.1│vereda│  ← header 56px (italic Fraunces wordmark)
├────────────┬─────────────────────────────────────────────────────────┤
│ WORKSPACE  │ +                                                     + │
│ strata-cli │                                                         │
│ ~/code/... │                                                         │
│            │                                                         │
│ CONVERSAT. │       Cada sessão é uma camada.                         │  ← italic Fraunces 60px
│ (none yet) │       O resto é seu.                                    │     opsz 144 SOFT 100 WONK 1
│            │                                                         │
│            │       — manifesto §III                                  │  ← uppercase mono fg-3
│ VAULT      │                                                         │
│ • ~/notes  │       ────                                              │  ← accent-bar 4px vereda
│ • ollama OK│                                                         │
│            │       BLOOM SCALE                                       │  ← masthead label
│            │       L1 lembrar  L2 entender  L3 aplicar               │  ← bloom chips saturados
│            │       L4 analisar L5 avaliar  L6 criar                  │
│            │                                                         │
│            │ ┌─────────────────────────────────────────────────────┐ │
│            │ │ Pergunte sobre seu código. Uma nota será proposta — │ │  ← composer inline (não flutua)
│            │ │ nada é escrito sem seu OK.                      [↵] │ │
│            │ └─────────────────────────────────────────────────────┘ │
│            │ + ↵ send · ⇧↵ newline · vereda · explica, não edita   + │  ← footer keyboard hints
└────────────┴─────────────────────────────────────────────────────────┘
```

### Elements (top-to-bottom, main column)

| # | Element | DS primitive | Spec |
|---|---|---|---|
| A | Top corner marks (`+`) | `.frame.marks` | mono `+` glyph, fg-3, 11px, padding-top 6px |
| B | Big italic display quote | `.italic-display` | Fraunces 60px, opsz 144 / SOFT 100 / WONK 1, fg-1, max-width ~18ch, line-height 1.05, letter-spacing -0.02em |
| C | Attribution | `.t-mono-sm` | uppercase, fg-3, tracking-meta 0.06em, prefixed `— ` |
| D | Accent bar | `.accent-bar` | 4px solid var(--accent), width 80px, margin-top var(--sp-6) |
| E | Section label "BLOOM SCALE" | masthead label style | uppercase mono, fg-3, tracking-meta, after `—` |
| F | Bloom chips row (6×) | `.bloom .bloom-1` … `.bloom-6` | inline-flex gap var(--sp-3), in order L1→L6 |
| G | Composer | inline | width 100% of main column minus padding, NEVER floats |
| H | Footer keyboard hints | `.t-mono-sm` between `+` marks | corner `+` at extremities, hints separated by `·` |

### Interactive elements

- **Composer textarea** — autofocus on load. Placeholder in fg-3.
  - Enter → send · Shift+Enter → newline · Cmd/Ctrl+K → command palette (M3)
  - Send button `[↵]` à direita: disabled (opacity 40%) quando vazio; quando preenchido, accent border + accent-fg color.
- **Sidebar items** — workspace name clickable (abre 1.5 picker); ollama status row clickable (abre 1.4 settings na seção Provider).

### States

| State | Visual change vs default |
|---|---|
| `default` | como wireframe |
| `workspace-not-set` | sidebar mostra `WORKSPACE — (não definido)` em fg-3 + botão `.btn-primary "Escolher pasta"` abaixo. Composer disabled, placeholder muda pra `Defina um workspace pra começar.` |
| `ollama-down` | sidebar VAULT row: `• ollama indisponível` em var(--error). Composer ainda enabled mas thin `.accent-bar` em error tone aparece sob composer com texto declarativo (ver 1.6) |
| `keyboard-focus` | composer ring 1px outset var(--accent), offset 1px |

### Copy strings

**PT (primary):**
- Quote: *Cada sessão é uma camada. O resto é seu.*
- Attribution: `— manifesto §III`
- Section label: `BLOOM SCALE`
- Bloom: `L1 lembrar` `L2 entender` `L3 aplicar` `L4 analisar` `L5 avaliar` `L6 criar`
- Composer placeholder: `Pergunte sobre seu código. Uma nota será proposta — nada é escrito sem seu OK.`
- Footer: `↵ send · ⇧↵ newline · vereda · explica, não edita`
- Workspace empty button: `Escolher pasta`

**EN (parallel):**
- Quote: *Each session is a layer. The rest is yours.*
- Attribution: `— manifesto §III`
- Bloom: `L1 remember` `L2 understand` `L3 apply` `L4 analyze` `L5 evaluate` `L6 create`
- Composer placeholder: `Ask about your code. A note will be drafted — nothing is written without your OK.`
- Footer: `↵ send · ⇧↵ newline · vereda · explains, never edits`
- Workspace empty button: `Choose folder`

### DS primitives required
`.frame.marks` · `.italic-display` · `.accent-bar` · `.bloom-1`…`.bloom-6` · `.t-mono-sm` · `.masthead` (no header) · `.mode-badge` · composer (inline, custom) · `.btn-primary`

### Anti-patterns specific
- ❌ Botão "Get Started" / "Take a tour" / qualquer CTA forçada
- ❌ Centered chat box layout — composer fica inline at bottom of main column
- ❌ Mascote, ilustração cartoon, empty-state SVG decorativo
- ❌ Placeholder com emoji ("Type your first message ⌨️")
- ❌ Welcome modal overlay
- ❌ Animação de entrada (só fade do conteúdo, 160ms)

### Why this matters
Primeira superfície do produto. A postura do manifesto (`pausa`, `alma`, deliberada) vive ou morre aqui. Se essa tela parecer formulário OU AI chat genérico, o resto do produto luta morro acima.

---

## 1.2 — Active conversation (Vereda)

> **Energy reference:** "SOLITARY" (frame fino, restraint composicional) + página de revista técnica com marginalia.

### Purpose
Layout principal quando há conversa em andamento. Tudo orbita ao redor da troca de mensagens. Header masthead + sidebar persistente + main scroll + composer inline.

### Surface
Janela principal Tauri. Mesmo grid que 1.1 mas main column tem mensagens em vez do empty hero.

### Wireframe (dark mode, mid-conversation)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▦ strata    workspace—strata-cli  vault—~/notes  model—llama3.1│vereda│
├────────────┬─────────────────────────────────────────────────────────┤
│ WORKSPACE  │ +                                                     + │
│ strata-cli │                                                         │
│ ~/code/... │  [u] Why does the borrow checker complain about my      │  ← user message bubble
│            │      parser? Compiles fine until I add the lookahead.   │     (sans Geist 14px, fg-1)
│ CONVERSAT. │                                                         │
││Rust life…│ │  [▦] The mutable borrow you take on the lookahead at  │  ← strata reply
│ Tokio task │      src/parser/expr.rs:142 → outlives the immutable   │     (Fraunces body 16px)
│ Postgres   │      borrow held by the caller on src/parser/expr.rs:  │     bridge chips em accent
│ Why CRDTs  │      118 →. The compiler can't prove they don't alias.  │
│            │                                                         │
│ VAULT      │      This is a scope problem, not memory. See           │
│ • ~/notes  │      Klabnik & Nichols ch.10 ↗ for canonical treatment, │  ← ref-chip indigo
│ • ollama OK│      or [[borrow-checker-mental-model]] in your vault.  │  ← wiki-chip lavender
│            │                                                         │
│            │      Simplest fix: take ownership of the token slice    │
│            │      before the lookahead, rather than borrowing it     │
│            │      across the call boundary.                          │
│            │                                                         │
│            │      [L3] · 1 ref · 1 link              [Preview note]  │  ← bloom + meta + action
│            │                                                         │
│            │ ┌─────────────────────────────────────────────────────┐ │
│            │ │ Ask about the codebase. A note will be drafted; ... │ │
│            │ │                                                 [↵] │ │
│            │ └─────────────────────────────────────────────────────┘ │
│            │ + ↵ send · ⇧↵ newline · vereda · explica, não edita   + │
└────────────┴─────────────────────────────────────────────────────────┘
```

### Layout grid

```
header   56px           full-width, masthead inline
─────────────────────────────────────────────────────
sidebar  260px fixed    var(--vein) bg, fg-1 active item w/ accent left-rail 2px
main     1fr             var(--bedrock) bg, scroll vertical
                         ├ main-scroll (messages)
                         └ composer + footer (sticky bottom)
```

### Sidebar regions (top-to-bottom)

| Region | Content | DS treatment |
|---|---|---|
| `WORKSPACE` | label + workspace name + path | masthead label uppercase mono fg-3; name fg-1 sans 13px; path fg-3 mono-sm |
| `CONVERSATIONS` | label + scrollable list | label same as above; items: title (fg-1 sans 13px) + relative time (fg-3 small) |
| `VAULT` | label + path bullet + ollama bullet | bullet `•` colored: success/error per status |
| `[+ New]` | button bottom-of-sidebar | `.btn-ghost` w/ `+` glyph |
| `[⚙ Settings]` | gear icon bottom corner | `.btn-ghost` icon-only |

Active conversation item in sidebar: 2px left-rail in `var(--accent)` (vereda blue), bg `var(--hover)`.

### Message bubble specs

**User message:**
- Avatar/marker: `[u]` mono glyph fg-2, 16px before text
- Text: Geist sans 14px / 1.6, fg-1
- Background: NONE (no bubble — message is the type itself)
- Margin: `var(--sp-4)` between messages

**Strata message:**
- Avatar/marker: `[▦]` 4-stratum SVG mark, fg-2, 16px before text
- Text: Fraunces body 16px / 1.7, fg-1, font-variation `var(--serif-body)`
- Background: NONE
- Inline elements:
  - **bridge** (`file:line →`) — `.bridge` em accent color (vereda blue), bordered-bottom dotted
  - **ref-chip** (`Klabnik & Nichols ch.10 ↗`) — `.ref-chip` em ref-citation indigo, dotted underline
  - **wiki-chip** (`[[borrow-checker-mental-model]]`) — `.wiki-chip` em ref-wikilink lavender, soft bg
- Footer line (apenas se houver meta): `[L3] · 1 ref · 1 link [Preview note]`
  - bloom chip à esquerda
  - meta em mono-sm fg-3 separados por `·`
  - action button `Preview note` à direita: `.btn` ghost que abre right-aside (M2)

### Composer specs

- Textarea com `min-height 64px`, `max-height 240px` (auto-grow)
- Background `var(--surface)`, border 1px `var(--border-1)`, radius 3
- Placeholder texto em fg-3
- Right-aligned `[↵]` send button, 28×28, `.btn-primary` quando há texto
- Footer abaixo (entre `+` marks): keyboard hints + mode label + tagline

### Interactive elements

| Element | Behavior |
|---|---|
| Sidebar conversation item | click → switch active conversation, scroll to bottom of new conversation |
| Sidebar `[+ New]` | click → clears messages, focus composer, breadcrumb shows "untitled" |
| Sidebar `[⚙ Settings]` | click → mounts Settings (1.4) over main, sidebar stays |
| Workspace name (sidebar) | click → opens workspace picker (1.5) |
| Ollama status row | click → opens Settings na seção Provider |
| Bridge `file:line →` | click → emits IDE bridge intent (in Tauri, opens via OS handler `vscode://`, `cursor://` etc) |
| Ref-chip | click → opens primary source URL (external) com confirmação se não-https |
| Wiki-chip | click → opens vault note no Obsidian (via `obsidian://` URL scheme) |
| Bloom chip in message footer | hover → tooltip com nível Bloom textual (`L3 — apply`) |
| `Preview note` button | click → mounts right-aside (M2 — note preview) |
| Composer Enter | send · Shift+Enter newline · Cmd/Ctrl+K palette (M3) |

### States

| State | Visual change |
|---|---|
| `default` | como wireframe, scroll position bottom |
| `streaming` | última message tem `.streaming` indicator (ver 1.3) |
| `composer-focused` | composer ring accent 1px outset |
| `composer-disabled` | enquanto strata streama, composer fica disabled w/ placeholder `Aguardando resposta…` |
| `sidebar-collapsed` | (M5+) hamburger oculta sidebar, masthead readjust |
| `ollama-error-mid-turn` | banner 1.6 aparece acima do composer; última strata message marca `error` em vez de fade |

### Copy strings

**PT:**
- Composer placeholder: `Pergunte sobre o código. Uma nota será proposta; nada é escrito sem seu OK.`
- Sidebar labels: `WORKSPACE` `CONVERSAÇÕES` `VAULT`
- New chat button tooltip: `Nova conversa (Cmd+N)`
- Settings tooltip: `Configurações`
- Empty conversation list: `Nenhuma conversa ainda`
- Footer: `↵ send · ⇧↵ newline · vereda · explica, não edita`

**EN:**
- Composer placeholder: `Ask about the codebase. A note will be drafted; nothing is written without your OK.`
- Sidebar labels: `WORKSPACE` `CONVERSATIONS` `VAULT`
- Footer: `↵ send · ⇧↵ newline · vereda · explains, never edits`

### DS primitives required
`.masthead` (no header) · `.mode-badge` · `.bridge` · `.ref-chip` · `.wiki-chip` · `.bloom` · sidebar (custom) · message bubble (custom, sem `.note` class — só prose com primitivos inline) · composer · `.btn-primary` · `.btn-ghost` · `.frame.marks` (footer hint frame)

### Anti-patterns specific
- ❌ Bubble com background colorido (chat-clone)
- ❌ Avatar redondo com inicial colorida
- ❌ "Strata is typing…" em italic chato — usar streaming dot pulse (1.3)
- ❌ Markdown syntax visível no render (deve renderizar)
- ❌ Code highlight saturado tipo Cursor — usar paleta editorial (azul/mostarda/verde restraint)
- ❌ Botão "Copy message" hover-floating — usar copy via context menu ou `/copy` no palette

---

## 1.3 — Streaming indicator (state)

### Purpose
Sinal calmo de que o modelo está gerando. **Pulso de 3 sediment dots inline na message em construção.** Nunca spinner, nunca "Strata is typing…", nunca shimmer.

### Visual

```
[▦] The mutable borrow you take on the lookahead at src/parser/...
    outlives the immutable borrow held by the caller on src/par...
    ●  ●  ●        ← 3 sediment dots, ~6px each, fg-3 → fg-2 → fg-3 cycle
```

### Spec

- 3 dots, 6px diameter, gap 6px
- Cycle: cada dot escurece de fg-3 → fg-2 → fg-3 com 360ms cycle, staggered 120ms entre dots
- Easing: `cubic-bezier(0.2, 0.0, 0.2, 1)` (= var(--ease))
- Position: append abaixo da última paragraph já streamada, sem deslocar layout
- Disappear: cross-fade 160ms quando stream completa
- **No bouncing, no scaling, no color shift to accent** — só tonal step entre fg-3 e fg-2

### Stalled state (sub-state)

Se stream parou >5s sem token novo:
- Dots param de pulsar, ficam estáticos em fg-3
- Inline text aparece à direita: `· estagnado — modelo pode ter travado · Tentar de novo`
- Botão `Tentar de novo` é `.btn-ghost` mono-sm, click → reenvia último prompt

### Anti-patterns
- ❌ Spinner SVG circular
- ❌ Texto piscando "Generating…"
- ❌ Skeleton shimmer (anxious)

---

## 1.4 — Settings

> **Energy reference:** página interna de catálogo / colofão de revista — masthead, frame, secciones com hierarquia clara.

### Purpose
Configurar vault path, provider de modelo (Ollama default + cloud opt-in), aparência (dark/light/auto), e Mestre defaults (M2+).

### Surface
Mounts SOBRE main column (sidebar permanece visível). Não é modal — é uma view alternativa do main. Botão de fechar `[×]` no canto top-right da settings view (return to chat).

### Wireframe (dark mode)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▦ strata    workspace—strata-cli  vault—~/notes  model—llama3.1│vereda│
├────────────┬─────────────────────────────────────────────────────────┤
│ (sidebar   │ +                                                  [×] +│  ← × fecha settings
│  same as   │                                                         │
│  1.2)      │   SETTINGS                                              │  ← masthead label
│            │   Configurações do Strata. As mudanças aplicam ao vivo. │  ← serif body intro
│            │                                                         │
│            │   ─── VAULT ──────────────────────────────────────────  │  ← section divider (mono uppercase + hairline)
│            │                                                         │
│            │   Vault path                                            │
│            │   ┌─────────────────────────────────────────┐ [Browse]  │
│            │   │ /Users/cesar/Documents/Obsidian/Micelio │           │
│            │   └─────────────────────────────────────────┘           │
│            │   Strata só escreve em `inbox/` dentro deste vault.     │  ← help text fg-3 mono-sm
│            │                                                         │
│            │   Inbox folder                                          │
│            │   ┌─────────────┐                                       │
│            │   │ inbox       │                                       │
│            │   └─────────────┘                                       │
│            │                                                         │
│            │   ─── PROVIDER ───────────────────────────────────────  │
│            │                                                         │
│            │   Local model (default)                                 │
│            │   ┌─────────────────────────────────────────┐           │
│            │   │ ollama · llama3.1:8b               [▾]  │           │
│            │   └─────────────────────────────────────────┘           │
│            │   • Ollama acessível em localhost:11434                 │  ← status linha
│            │                                                         │
│            │   Cloud fallback (opt-in)                               │
│            │   ( ) None    ( ) Anthropic    ( ) OpenAI    ( ) Other  │  ← radio group
│            │   When local is unavailable, fall back here. Never      │  ← help fg-3
│            │   silently — always shown in masthead.                  │
│            │                                                         │
│            │   ─── APPEARANCE ─────────────────────────────────────  │
│            │                                                         │
│            │   Theme       ( ) Auto    (•) Dark    ( ) Light         │
│            │   Density     (•) Default                               │
│            │                                                         │
│            │   ─── MESTRE DEFAULTS ────────────────────────────────  │  ← M2+ section, mostrar em M1 com texto "Disponível em M2"
│            │   (em construção)                                       │
│            │                                                         │
│            │ +                                                     + │
└────────────┴─────────────────────────────────────────────────────────┘
```

### Sections

| Section | Fields |
|---|---|
| **VAULT** | Vault path (input + Browse button) · Inbox folder (input, default `inbox`) |
| **PROVIDER** | Local model (select dropdown auto-populated by `ollama list`) · Cloud fallback (radio: None default) · API key inputs (revealed if non-None) |
| **APPEARANCE** | Theme (radio: Auto / Dark / Light) · Density (radio, default only in M1) |
| **MESTRE DEFAULTS** | Placeholder em M1, ativo em M2 |

### Section divider style

Linha começa com `─── LABEL ──`:
- 3 hyphens espaçados (mono Geist Mono 13px)
- Label em UPPERCASE mono tracking-meta fg-2
- Continua com hairline `var(--border-1)` 1px até o fim da column
- margin-top var(--sp-8), margin-bottom var(--sp-4)

### Field style

- Label: sans 13px fg-2, margin-bottom var(--sp-2)
- Input: full-width (or constrained), border 1px var(--border-2), radius 0 (chip-like), padding `var(--sp-2) var(--sp-3)`, font mono 13px (paths) ou sans 13px (text)
- Help text: mono-sm fg-3, margin-top var(--sp-1)
- Browse button: `.btn` à direita do input em flex-row gap var(--sp-2)
- Radio group: inline horizontal, dot 12px com 4px ring quando selected

### Interactive elements

| Element | Behavior |
|---|---|
| Vault path input | text editable; on blur → validate (folder exists, writable) |
| `[Browse]` button | opens OS folder picker |
| Inbox folder input | text editable, default `inbox`; on blur → ensure directory created |
| Local model dropdown | shows installed Ollama models; `[Refresh]` icon at right re-pulls list |
| Cloud fallback radios | switching to non-None reveals: API key field + "Test connection" button |
| Theme radios | live apply on click (no save button) |
| `[×]` close | returns to chat (saves on field blur, no explicit save needed) |

### States

| State | Visual |
|---|---|
| `default` | as wireframe |
| `vault-invalid` | input border in `var(--error)`, help text replaced by `Pasta não existe ou não tem permissão de escrita.` em error tone |
| `ollama-down` | dropdown disabled, status row mostra `× Ollama não responde em localhost:11434 · Iniciar Ollama` (com link/button pra abrir docs) |
| `cloud-key-set` | API key field mostra `••••••••` mascarado, com `[Test]` button + último teste timestamp |

### Copy strings (PT primary)

- Title: `SETTINGS`
- Intro: `Configurações do Strata. As mudanças aplicam ao vivo.`
- Section labels: `VAULT` `PROVIDER` `APPEARANCE` `MESTRE DEFAULTS`
- Vault help: `Strata só escreve em `inbox/` dentro deste vault.`
- Cloud fallback help: `Quando o modelo local cai, Strata usa esta opção. Nunca em silêncio — sempre indicado no masthead.`
- Mestre defaults placeholder: `(disponível em M2 — quando o Modo Mestre for liberado)`

### DS primitives required
`.masthead` · `.btn` · `.btn-primary` · field inputs (custom, low-radius) · radio groups (custom) · section divider (custom — mono uppercase + hairline)

### Anti-patterns specific
- ❌ Settings em modal centralizado (perde sidebar context)
- ❌ Save button explícito (live-apply é mais editorial)
- ❌ Tabs no topo (radio-group não aguenta estado complexo aqui — usar sections)
- ❌ Toggles iOS-style — usar radios (mais decisivos)

---

## 1.5 — Workspace picker

> **Energy reference:** "retro" poster — header com hyphen-cols metadata + frame pequena central + corner marks.

### Purpose
Quando usuário não tem workspace ativo (primeira vez OU clica pra trocar), mostra picker editorial. Não é file dialog do OS — é uma view editorial do Strata que **chama** o file dialog quando user clica `Browse`.

### Surface
Modal-like view sobre main, mas COM masthead/sidebar visíveis (não bloqueia chrome). Pode ser dispensado com `Esc` ou `[×]`.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▦ strata    workspace—(none)      vault—~/notes  model—llama3.1│vereda│  ← masthead reflete não-set
├────────────┬─────────────────────────────────────────────────────────┤
│ WORKSPACE  │                                                         │
│ (none)     │  ┌─ + ──────────────────────────────────────────── + ─┐ │  ← frame.marks
│            │  │                                                    │ │
│            │  │   *Choose a workspace*                             │ │  ← italic-display 36px
│            │  │                                                    │ │
│            │  │   Strata vai operar dentro desta pasta. Pode ser   │ │  ← serif body
│            │  │   o root de um projeto, ou uma pasta de estudo.    │ │
│            │  │                                                    │ │
│            │  │   ─── RECENTES ─────────────────────────────────   │ │
│            │  │                                                    │ │
│            │  │   ▸ strata-cli   ~/code/strata-cli           2h    │ │  ← recent items
│            │  │   ▸ pi-fork      ~/code/pi-fork              ontem │ │
│            │  │   ▸ rust-book    ~/code/rust-book            sem.  │ │
│            │  │                                                    │ │
│            │  │   ─── OU ────────────────────────────────────────  │ │
│            │  │                                                    │ │
│            │  │       [Browse pra escolher outra pasta]            │ │  ← .btn-primary
│            │  │                                                    │ │
│            │  │  + ──────────────────────────────────────────── +  │ │
│            │  └────────────────────────────────────────────────────┘ │
│            │                                                         │
└────────────┴─────────────────────────────────────────────────────────┘
```

### Layout

- `.frame.marks` central, max-width 560px, centered horizontal
- padding var(--sp-8)
- background var(--surface) (one tonal step up from main bedrock)

### Elements

| # | Element | Spec |
|---|---|---|
| A | Italic display title | Fraunces 36px, opsz 96 SOFT 80, `*Choose a workspace*` (asterisks NÃO são visíveis — são marca pra italic) |
| B | Body explanation | serif body 16px / 1.7, fg-2, max-width 48ch |
| C | Section divider RECENTES | `─── RECENTES ───` mono uppercase |
| D | Recent items list | each: arrow `▸` + name (sans 14px fg-1) + path (mono-sm fg-3) + relative time (mono-sm fg-3 right-aligned) |
| E | Section divider OR | `─── OU ───` (smaller, fg-3) |
| F | Browse button | `.btn-primary`, centered |

### Interactive elements

- **Recent item** — click → set as active workspace, close picker, return to chat (ou empty state)
- **Browse button** — click → OS folder picker → on select → set workspace + close
- **Esc / [×]** — close without changing workspace (only available if workspace already set; if first-time, can't dismiss)

### States

| State | Visual |
|---|---|
| `first-time` | sem `[×]`, sem `Esc` (forçado escolher); RECENTES section omitida |
| `has-recents` | full view |
| `no-recents-but-not-first-time` | RECENTES section omitida, só Browse |
| `permission-error` | após Browse, se sem permissão de leitura: error banner inline `Sem permissão para acessar essa pasta.` em error tone |

### Copy (PT)

- Title: `Choose a workspace` (italic — poderia ser PT mas inglês funciona como title)
- Body: `Strata vai operar dentro desta pasta. Pode ser o root de um projeto, ou uma pasta de estudo.`
- RECENTES label: `RECENTES`
- OR label: `OU`
- Browse button: `Browse pra escolher outra pasta`
- Empty recents text: `Nenhuma pasta usada ainda.`
- Permission error: `Sem permissão para acessar essa pasta.`

### DS primitives required
`.frame.marks` · `.italic-display` (custom 36px variant) · `.t-body` · `.btn-primary` · section divider · recent item (custom)

### Anti-patterns
- ❌ File browser embedded (overlap com OS dialog, usability ruim)
- ❌ "Drag a folder here" zone (não-discoverable, confunde)
- ❌ Recents com thumbnails (visual noise)

---

## 1.6 — Connection-lost banner (cross-cutting state)

### Purpose
Quando Ollama (ou provider ativo) cai mid-session, banner inline declarativo. Nunca toast vermelho intrusivo.

### Visual

```
┌──────────────────────────────────────────────────────────────────────┐
│ │ Modelo local indisponível.                                       │ │  ← banner inline acima do composer
│ │ Configurar fallback ou retomar quando voltar.    [Configurar →]  │ │     1px border-left em var(--error), bg vein
└──────────────────────────────────────────────────────────────────────┘
[composer …]
```

### Spec

- Posição: inline acima do composer, full-width do main column
- Border-left: 4px solid `var(--error)` (rust/coral em dark — `oklch(0.66 0.12 30)`)
- Background: `var(--vein)` (subtle elevation)
- Padding: var(--sp-3) var(--sp-4)
- Text: serif body 14px fg-1 (NOT all-caps, NOT bold)
- Action button à direita: `.btn-ghost` com seta `→`

### Behavior

- Aparece com fade-in 160ms quando provider está inacessível por >2s
- Desaparece com fade-out 160ms quando provider responde de novo
- Click em `[Configurar →]` abre Settings na seção Provider

### Copy (PT primary)

- Banner principal: `Modelo local indisponível. Configurar fallback ou retomar quando voltar.`
- Action button: `Configurar →`
- Variante cloud-down: `Anthropic indisponível. Sem fallback configurado — defina em Settings.`

### Anti-patterns
- ❌ Toast vermelho flutuante
- ❌ Modal bloqueante
- ❌ Pulsação / shake animation
- ❌ Emoji ⚠️ ou 🔴
- ❌ "ERROR:" prefix em caps
