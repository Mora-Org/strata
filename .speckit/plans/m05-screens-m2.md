---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# M0.5.b — Screens M2 (priority 2)

Screens necessárias quando Mode Router + Note Builder forem implementados (M2 do dev). Vereda já bloqueia tools de escrita; Mestre opt-in com fricção; Note preview funcional; Mestre tool-call surface visível.

> **Veja primeiro:** [`m05-screen-spec.md`](m05-screen-spec.md) (overview) e [`m05-screens-m1.md`](m05-screens-m1.md) (M1 base).

## Inventário

| # | Tipo | Nome | Quando aparece |
|---|---|---|---|
| 2.1 | Interaction | Mode toggle (header click) | User clica no mode badge |
| 2.2 | Modal | Mode confirmation modal (editorial) | Confirma transição de modo |
| 2.3 | Transition | Mode cross-fade | Após confirmação, accent muda |
| 2.4 | Surface | Note preview (right aside) | Reply tem densidade conceitual |
| 2.5 | State | Note written confirmation | Após user clicar Write |
| 2.6 | Component | Tool-call surface (Mestre) | Mestre executa tool |
| 2.7 | Component | Inline diff (Mestre Write/Edit) | Mestre propõe edit |

---

## 2.1 — Mode toggle interaction

### Purpose
O `mode-badge` no header é clicável. Click → opens 2.2 modal. Não troca direto.

### Spec

- Mode badge no header (já em 1.2) tem `cursor: pointer`
- Hover: tonal step-up no background do badge (mesmo padrão de outros buttons)
- Click: emit `requestModeChange` → renders 2.2 modal
- Tooltip on hover: `Trocar modo (requer confirmação · ⌘+M)`

### Keyboard shortcut
`Cmd/Ctrl+M` → mesmo efeito que click no badge.

---

## 2.2 — Mode confirmation modal (editorial)

> **Energy reference:** "REST IN PEACE" (gravitas) + "MONDAY" (display serif title) + "SOLITARY" (frame fino + body restraint).

### Purpose
Pausa editorial quando user pede troca de modo. **Fricção deliberada**, não anti-padrão. O modo é uma postura — entrar em Mestre é uma decisão consciente.

### Surface
Full-screen scrim 50% opacity (no blur), centralized modal frame ~520px wide.

### Wireframe (Vereda → Mestre)

```
                        ╔═══════════════════════════════════════════╗
                        ║ ────                                       ║  ← .accent-bar 4px mestre mustard, full-width inside frame
                        ║                                            ║
                        ║ + ──────────────────────────────────── +   ║  ← frame.marks
                        ║   ENTRAR EM                              ║  ← masthead label
                        ║                                            ║
                        ║   *Modo Mestre*                            ║  ← italic-display 44px Fraunces
                        ║                                            ║
                        ║   Strata passa a executar tools no seu     ║  ← serif body 15px / 1.65
                        ║   workspace: ler, escrever, editar arqui-  ║
                        ║   vos, rodar comandos. Cada operação       ║
                        ║   destrutiva ainda pede confirmação.       ║
                        ║                                            ║
                        ║   Mestre não persiste entre sessões — a    ║
                        ║   próxima vez que você abrir Strata,       ║
                        ║   começa em Vereda de novo.                ║
                        ║                                            ║
                        ║   ─── CONSEQUÊNCIA ────────────────────    ║
                        ║                                            ║
                        ║   Tools liberadas: Read · Write · Edit ·   ║  ← mono fg-2
                        ║                    Bash · Grep · Find · Ls ║
                        ║                                            ║
                        ║                                            ║
                        ║          [ Cancelar ]   [ Entrar em Mestre]║  ← buttons (cancel ghost, primary mustard)
                        ║                                            ║
                        ║ + ──────────────────────────────────── +   ║
                        ╚═══════════════════════════════════════════╝
```

### Layout

- Frame: `.frame.marks` com `.accent-bar` no topo
- max-width: 520px
- padding: var(--sp-6) var(--sp-8) var(--sp-6) var(--sp-8)
- background: var(--surface)

### Elements top-to-bottom

| # | Element | Spec |
|---|---|---|
| A | Accent bar | 4px solid var(--accent-mestre) (= cor de DESTINO, não de origem) |
| B | Top corner marks `+` | `.frame.marks` |
| C | Section label "ENTRAR EM" | masthead label uppercase mono fg-3 tracking-meta |
| D | Italic display title | Fraunces 44px italic, opsz 144 SOFT 100 WONK 1, fg-1, `*Modo Mestre*` |
| E | Body explanation | serif body 15px / 1.65 fg-1, max 60ch, 2-3 paragraphs |
| F | Section divider "CONSEQUÊNCIA" | `─── CONSEQUÊNCIA ───` mono uppercase fg-3 |
| G | Tools liberadas list | mono 13px fg-2, comma-separated com `·` |
| H | Buttons row | flex-row gap var(--sp-3), justify-end |
| I | Bottom corner marks | mirror of C |

### Buttons

- **Cancelar** — `.btn-ghost`, copy `Cancelar`. Default focus.
- **Entrar em Mestre** — `.btn-primary` em accent-mestre (mostarda), copy `Entrar em Mestre`. Para Vereda inverso: `Voltar pra Vereda`.

### Interactive

| Element | Behavior |
|---|---|
| Backdrop scrim | click → cancel (close modal, no mode change) |
| Esc key | cancel |
| Cancel button | cancel |
| Primary button | confirm → emits `modeChange(target)` → triggers 2.3 transition |
| Modal interior click | no-op (don't close) |

### Variants

**Vereda → Mestre** (mais comum, fricção real):
- Title: `*Modo Mestre*`
- Body: explica liberação de tools + reset por sessão
- Accent bar: mustard
- Primary button: `Entrar em Mestre`

**Mestre → Vereda** (mais leve, fricção menor mas confirmada):
- Title: `*Voltar pra Vereda*`
- Body: `Strata para de executar tools no workspace. Volta a explicar e propor notas. Mudanças não confirmadas em Mestre são descartadas.`
- Accent bar: editorial blue
- Primary button: `Voltar pra Vereda`

### Animation

- Modal cross-fade in: 160ms ease-out (opacity 0→1, translateY -4px → 0)
- Modal cross-fade out: 160ms ease-out (opposite)
- Scrim fade: synced

### Copy strings

**PT (Vereda → Mestre):**
- Section label: `ENTRAR EM`
- Title: `*Modo Mestre*`
- Body para 1: `Strata passa a executar tools no seu workspace: ler, escrever, editar arquivos, rodar comandos. Cada operação destrutiva ainda pede confirmação.`
- Body para 2: `Mestre não persiste entre sessões — a próxima vez que você abrir Strata, começa em Vereda de novo.`
- Consequência label: `CONSEQUÊNCIA`
- Tools list: `Tools liberadas: Read · Write · Edit · Bash · Grep · Find · Ls`
- Cancel: `Cancelar`
- Confirm: `Entrar em Mestre`

**PT (Mestre → Vereda):**
- Section label: `VOLTAR PARA`
- Title: `*Vereda*`
- Body: `Strata para de executar tools no workspace. Volta a explicar e propor notas. Edits ainda não confirmados em Mestre são descartados.`
- Confirm: `Voltar pra Vereda`

### DS primitives required
`.frame.marks` · `.accent-bar` · `.italic-display` · `.t-body` · masthead label · section divider · `.btn-ghost` · `.btn-primary`

### Anti-patterns
- ❌ Modal pequeno tipo "Are you sure? [Yes] [No]"
- ❌ Checkbox "Don't ask again" (essa fricção é o ponto)
- ❌ Cor vermelha pra Mestre (não é destrutivo, é capabilidade)
- ❌ Emoji ⚠️ no título
- ❌ Body sem explicar consequência (o "porquê" é o ponto)

---

## 2.3 — Mode cross-fade transition

### Purpose
Após confirmação, accent transiciona suave. **Layout NÃO muda** (regra dura §4 do Director).

### Spec

- Modal fades out 160ms
- 80ms gap (sem nada animando, pausa pequena)
- `var(--accent)` cross-fades 240ms ease-out (azul → mostarda ou inverso)
  - Implementação: CSS custom property animation via `@property` ou JS RAF interpolation
  - Tudo que usa `var(--accent)` muda junto: mode-badge, bridge chips, focus rings, accent-bar, btn-primary bg
- Mode badge text muda **abruptamente no momento exato do midpoint** do cross-fade (frame 30 de 60) — não anima string
- Composer placeholder muda no mesmo midpoint
- Footer hint muda no mesmo midpoint (`vereda · explica, não edita` ↔ `mestre · executa quando você confirma`)

### What does NOT change

- Layout (grid, sidebar, header, composer position)
- Spacing
- Typography
- Iconography
- Sidebar items
- Sidebar conversation list
- Settings values

### Anti-patterns
- ❌ Layout shift entre modos
- ❌ Accent change instantâneo (sem fade — abrupto demais)
- ❌ Mais de 240ms (lento demais — vira animation showpiece)
- ❌ Pulse / glow no mode-badge após mudança

---

## 2.4 — Note preview (right aside)

> **Energy reference:** "Yellow Grass" (single saturated accent rail à esquerda) + página de revista técnica (display serif + frontmatter + body prose).

### Purpose
Quando reply Vereda tem densidade conceitual (≥1 ref primária citada), botão `Preview note` no message footer abre right-aside com preview editorial da nota antes de escrever no vault.

### Surface
Aside à direita da main column, width 420px, full-height. Main column shrinks pra acomodar (grid changes from `260 1fr` to `260 1fr 420`).

### Wireframe

```
┌───────────────┬──────────────────────────────┬────────────────────────┐
│ (sidebar)     │ (chat — Active conversation) │ + ─────────── + [×]   │  ← × close aside
│               │                              │                        │
│               │                              │   PREVIEW DE NOTA      │  ← masthead label
│               │                              │   ─── inbox/2026-05-… ──│
│               │                              │                        │
│               │                              │ ▌ *Borrow Checker e    │  ← bloom-rail 4px à esquerda
│               │                              │ ▌  Lifetimes em        │      (cor por bloom level)
│               │                              │ ▌  Parsers Recursivos* │  ← italic-display 28px
│               │                              │ ▌                      │
│               │                              │ ▌  ┌──────────────────┐│
│               │                              │ ▌  │ tags:    rust ·  ││  ← frontmatter block
│               │                              │ ▌  │           parsing ││     mono-sm
│               │                              │ ▌  │ bloom:   3       ││
│               │                              │ ▌  │ data:    2026-05 ││
│               │                              │ ▌  │ refs:    K&R ch10││
│               │                              │ ▌  └──────────────────┘│
│               │                              │ ▌                      │
│               │                              │ ▌  O borrow checker do │  ← serif body 14px
│               │                              │ ▌  Rust não falha por  │     prose, fg-1
│               │                              │ ▌  problema de memória │
│               │                              │ ▌  — falha por escopo. │
│               │                              │ ▌  Quando você toma um │
│               │                              │ ▌  borrow mutável...   │
│               │                              │ ▌                      │
│               │                              │ ▌  ## Como funciona    │  ← italic Fraunces h2
│               │                              │ ▌  ...                 │
│               │                              │ ▌                      │
│               │                              │ ▌  ## Próximos passos  │
│               │                              │ ▌  - [ ] reescrever    │
│               │                              │ ▌    parser sem...     │
│               │                              │ ▌                      │
│               │                              │  ┌────────────────────┐│
│               │                              │  │  [Descartar]       ││
│               │                              │  │  [Escrever no vault]│ ← .btn-primary vereda
│               │                              │  └────────────────────┘│
│               │                              │ + ─────────────── +    │
└───────────────┴──────────────────────────────┴────────────────────────┘
```

### Layout

- Aside: 420px width, var(--vein) bg (different tonal step from main)
- Padding-left 24px reserved for bloom-rail
- bloom-rail: 4px solid `var(--bloom-N)` (N = nível inferido), full-height, position absolute left
- Frame: `.frame.marks` em volta do conteúdo da nota
- Header: masthead label + path do arquivo

### Elements top-to-bottom

| # | Element | DS primitive | Spec |
|---|---|---|---|
| A | Bloom rail | `.bloom-rail` | 4px solid var(--bloom-N), full height aside |
| B | Top: masthead label + close | `.masthead` style | `PREVIEW DE NOTA` left, `[×]` right (32×32 ghost button) |
| C | Path divider | section divider | `─── inbox/{slug}.md ───` mono fg-3 |
| D | Note title (italic display) | `.italic-display` (28px variant) | `*Title here*`, max 3 lines, ellipsis |
| E | Frontmatter block | `.frontmatter` | YAML rendered: `key:` em fg-3, `value` em fg-1 |
| F | Body prose | `.note p`, `.note h2`, `.note h3` | Fraunces serif, italic h2/h3 |
| G | Próximos passos checklist | `.note ul li` w/ checkbox glyph | Render `- [ ] item` como `☐ item` |
| H | Action buttons row | flex-row gap | `Descartar` (.btn-ghost) + `Escrever no vault` (.btn-primary) |
| I | Bottom corner marks | `.frame.marks` | + glyphs |

### Frontmatter rendering

```
tags:    [rust, parsing, borrow-checker]
bloom:   3
data:    2026-05-04
refs:    [K&R ch.10, Klabnik & Nichols ch.10]
relacionados: [[lifetimes-básico]]
```

Em vez de YAML cru:
```
tags     —  rust · parsing · borrow-checker     ← mono fg-2
bloom    —  3                                    ← mono fg-2
data     —  2026-05-04                           ← mono fg-2
refs     —  K&R ch.10 · Klabnik & Nichols ch.10  ← ref-chips inline
relacion —  [[lifetimes-básico]]                 ← wiki-chip inline
```

Hyphens prefixados (`—`) nos labels — mantém vibe editorial masthead. Values usam ref-chip e wiki-chip onde aplicável.

### Interactive elements

| Element | Behavior |
|---|---|
| `[×]` close | close aside, return to chat full-width |
| Editable title | click on title → inline edit (italic display fica editable) |
| Editable bloom | click on bloom value → small dropdown 1-6 |
| Editable tags | click → inline pill editor |
| Body | NOT editable em M2 (read-only preview); user pode editar depois no Obsidian |
| `Descartar` | discard preview, close aside, return to chat |
| `Escrever no vault` | writes file, shows confirmation 2.5, closes aside |

### States

| State | Visual |
|---|---|
| `building` | aside abre vazio com 3 sediment-dot pulse no centro (`Construindo nota…`) |
| `ready` | full preview as wireframe |
| `editing-field` | clicked field has accent ring 1px |
| `writing` | buttons disabled, "Writing…" text inline replaces button row briefly |
| `written` | aside fades out, 2.5 confirmation appears |
| `discarded` | aside fades out, no confirmation |
| `write-error` | error banner inline (border-left error tone): `Erro ao escrever — disco cheio?` + `Tentar de novo` button |

### Copy (PT primary)

- Masthead label: `PREVIEW DE NOTA`
- Path divider format: `─── inbox/{slug}.md ───`
- Building text: `Construindo nota…`
- Writing text: `Escrevendo…`
- Discard button: `Descartar`
- Write button: `Escrever no vault`
- Write error: `Erro ao escrever — disco cheio?`
- Retry: `Tentar de novo`

### DS primitives required
`.bloom-rail` · `.frame.marks` · `.italic-display` (28px) · `.frontmatter` · `.note` styled prose · `.tag` · `.ref-chip` · `.wiki-chip` · `.btn-ghost` · `.btn-primary`

### Anti-patterns
- ❌ Note preview em modal central (perde context da conversa)
- ❌ Botão "Edit in Obsidian" (não temos hook ainda; deixa user fazer manualmente depois)
- ❌ Frontmatter cru YAML sem render
- ❌ Botão "Save" (estamos escrevendo no vault, não "salvando") — usar `Escrever no vault`

---

## 2.5 — Note written confirmation (state)

### Purpose
Após user clicar "Escrever no vault", aside fecha e confirmation aparece inline.

### Visual

```
[chat continues...]

[▦] {última message strata}
    [L3] · 1 ref · 1 link    [Preview note]

   ▌ Nota criada em inbox/borrow-checker-lifetimes-2026-05-04.md ↗   ← editorial inline confirmation
                                                              [Abrir]

[composer...]
```

### Spec

- Border-left 4px solid `var(--success)` (muted moss `oklch(0.66 0.07 145)`)
- Background `color-mix(in oklch, var(--success) 8%, var(--vein))`
- Padding var(--sp-3) var(--sp-4)
- Text serif body 14px fg-1
- Path em mono fg-2 com seta `↗` clicável
- `[Abrir]` button à direita: `.btn-ghost` mono-sm

### Behavior

- Fade-in 160ms quando aparece
- Auto-fade out após 8s sem interação
- Hover: pause auto-fade timer
- Click no path OR `[Abrir]`: opens via `obsidian://` URL scheme
- Click no `[×]` (mini close): dismiss imediato

### Copy

- Confirmation: `Nota criada em {path} ↗`
- Action: `Abrir`
- Variant write-failed em vez de written (rare): `Falha ao escrever em {path} — verifique permissões.`

### Anti-patterns
- ❌ Toast verde flutuante
- ❌ Animação de check ✓ pulsante
- ❌ "Successfully created!" com exclamação ou emoji ✅

---

## 2.6 — Tool-call surface (Mestre)

> **Energy reference:** marginalia editorial — bloco lateral diferente do prose principal, com identidade própria mas sem roubar atenção.

### Purpose
Quando Mestre chama uma tool (Read, Write, Edit, Bash, Grep, Find, Ls), render como **bloco colapsável inline** na message. Default collapsed; expandable pra ver args + result. Para Write/Edit, render inline diff (ver 2.7).

### Visual (collapsed)

```
[▦] Vou ler o parser pra entender a estrutura.

   ┌─ ▌ READ ─────────────────────────────────────────── [▾] ─┐  ← collapsed, accent rail à esquerda
   │   src/parser/expr.rs · 1.2 KB                              │
   └────────────────────────────────────────────────────────────┘

   Vejo que você tem um lookahead recursivo. O problema é que...
```

### Visual (expanded)

```
[▦] Vou ler o parser pra entender a estrutura.

   ┌─ ▌ READ ─────────────────────────────────────────── [▴] ─┐
   │   src/parser/expr.rs · 1.2 KB                              │
   ├────────────────────────────────────────────────────────────┤
   │   ARGS                                                     │
   │   path: src/parser/expr.rs                                 │
   │                                                            │
   │   RESULT (truncado a 20 linhas)                            │
   │   pub fn parse_expr(tokens: &mut Tokens) -> Result<Expr>{  │
   │     let lhs = parse_term(tokens)?;                         │
   │     loop {                                                 │
   │       match tokens.peek() {                                │
   │         ...                                                │
   │       }                                                    │
   │     }                                                      │
   │   }                                                        │
   │                                                       [Copy] │
   └────────────────────────────────────────────────────────────┘

   Vejo que você tem um lookahead recursivo. O problema é que...
```

### Spec (collapsed)

- Border 1px solid `var(--border-1)`
- Border-radius 3
- Padding var(--sp-2) var(--sp-3)
- Background var(--vein)
- Left accent rail 4px solid `var(--accent)` (Mestre mustard quando ativo)
- Header row:
  - `[▾]` chevron right-aligned (clickable to expand)
  - Tool name uppercase mono fg-2 (`READ`, `WRITE`, `BASH`, etc.)
  - Inline summary: arg principal + meta info (size, line count, etc.)

### Spec (expanded)

- Same border + rail
- Sections inside: ARGS, RESULT (or DIFF for Write/Edit)
- ARGS: mono-sm fg-2, key: value pairs
- RESULT: mono-sm fg-1, in `.codeblock` style, max-height 320px scrollable, truncation note if applicable
- `[Copy]` button bottom-right: `.btn-ghost` mono-sm

### Tool variants

| Tool | Collapsed summary | Expanded extras |
|---|---|---|
| READ | `{path} · {size}` | full file (truncated) |
| WRITE | `{path} · +{lines added}` | inline diff (2.7) |
| EDIT | `{path} · {lines changed}` | inline diff (2.7) |
| BASH | `$ {first 60 chars of command}` | full command + stdout/stderr |
| GREP | `"{pattern}" · {N matches}` | match list with line numbers |
| FIND | `{glob} · {N files}` | file list |
| LS | `{path} · {N entries}` | dir listing |

### Interactive

- Click header row → toggle expanded
- Hover header → tonal step-up bg
- Copy button → copies content to clipboard, briefly show "✓ copiado" inline

### States

| State | Visual |
|---|---|
| `executing` | header tem 3 sediment-dot pulse à direita do tool name; chevron disabled |
| `success` | default visual |
| `error` | left rail muda pra `var(--error)` (rust); expanded shows error message instead of result |
| `truncated` | bottom of expanded shows `… truncado em N linhas · Ver completo no vault` (em mono-sm fg-3) |

### Copy

- Sections: `ARGS` `RESULT` `ERROR` `DIFF`
- Truncation: `… truncado em {N} linhas`
- Copy success: `✓ copiado` (sem emoji excessivo, apenas checkmark mono)
- Error prefix: nenhum — só mostra a stderr/error literal

### DS primitives required
`.codeblock` · accent rail (custom, mesmo padrão do .frame mas left-only) · `.t-mono-sm` · `.btn-ghost` · chevron icon (Lucide)

### Anti-patterns
- ❌ Tool name colorido (deve ser fg-2 uniforme)
- ❌ Spinner durante executing — usar sediment dots (consistência com 1.3)
- ❌ Auto-expand result longo (poluí scroll do chat)
- ❌ Botão "Approve" antes de execute (em Mestre, execute happens, depois mostra; user só vê, não pre-aprova — exceto destructive ops que têm 2.2-style modal)

---

## 2.7 — Inline diff (Mestre Write/Edit)

> **Energy reference:** GitHub diff sóbrio + Stripe Press tipografia (não Cursor saturado).

### Purpose
Quando Mestre propõe Write ou Edit, render do diff antes de aplicar. User pode `Apply` ou `Discard`.

### Visual

```
   ┌─ ▌ EDIT ───────────────────────────────── [▴] ─┐
   │   src/parser/expr.rs · 3 added, 2 removed      │
   ├──────────────────────────────────────────────────┤
   │   DIFF                                           │
   │                                                  │
   │   141 │   pub fn parse_expr(tokens: &mut Tokens) │
   │ - 142 │     let lhs = parse_term(tokens)?;       │  ← removed: bg color-mix(error 8%)
   │ - 143 │     let lookahead = tokens.peek();       │
   │ + 142 │     let lhs = parse_term(tokens)?;       │  ← added: bg color-mix(success 8%)
   │ + 143 │     let owned_tokens = tokens.take_n(2); │
   │ + 144 │     let lookahead = owned_tokens.first();│
   │   145 │     match lookahead {                    │
   │                                                  │
   │                                  [Discard] [Apply]│
   └──────────────────────────────────────────────────┘
```

### Spec

- Same envelope as 2.6 expanded
- DIFF section:
  - Mono 13px
  - Line numbers em fg-3 (3-digit padded)
  - `+` prefix (success tone) for added, `-` prefix (error tone) for removed
  - Background tint:
    - Added line: `color-mix(in oklch, var(--success) 8%, transparent)`
    - Removed line: `color-mix(in oklch, var(--error) 8%, transparent)`
  - Context lines (unchanged): plain
  - Max-height 480px scroll
- For NEW files (Write of new file), show `+ 1 │ ...` for every line, no removed lines, header says `{path} · new file, +{N} lines`

### Buttons

- `[Discard]` — `.btn-ghost`, default focus
- `[Apply]` — `.btn-primary` em accent-mestre

### Interactive

| Element | Behavior |
|---|---|
| Discard | revert proposal, message continues sem aplicar |
| Apply | execute Write/Edit, replaces this surface with success state |
| Click line number | scroll to that line in the diff (no-op if all visible) |
| Hover line | subtle bg tone-up |

### States

| State | Visual |
|---|---|
| `proposed` | as wireframe, user can Apply or Discard |
| `applying` | buttons disabled, sediment-dot pulse next to "Applying…" |
| `applied` | DIFF section collapses, header changes to `EDIT · applied · 3 added, 2 removed` w/ success rail |
| `discarded` | entire surface fades out |
| `apply-error` | error banner inline w/ retry button |

### Destructive op pre-confirmation

For DELETE / overwrite of file with substantial content / git destructive ops:
- BEFORE Apply executes, second confirmation appears: full editorial 2.2-style modal
- Body: `Esta operação substitui {path} ({N} linhas). Não há undo.`
- Buttons: `Cancelar` / `Continuar e aplicar`

### Copy

- Discard: `Descartar`
- Apply: `Aplicar`
- Applying: `Aplicando…`
- Header applied: `EDIT · aplicado · {N} added, {M} removed`
- Destructive confirm body: `Esta operação substitui {path} ({N} linhas). Não há undo.`
- Destructive confirm action: `Continuar e aplicar`

### DS primitives required
`.codeblock` (com diff coloring) · accent rail · `.btn-ghost` · `.btn-primary` · destructive confirm = reuse 2.2 modal pattern

### Anti-patterns
- ❌ Syntax highlighting saturado (Cursor-like) — use editorial restraint colors
- ❌ Auto-apply without confirmation
- ❌ "Apply All" button somando múltiplos diffs (cada edit é uma decisão)
- ❌ Diff em modal full-screen (perde context da conversa)
- ❌ Botão "Edit in editor" (Mestre é pra aplicar — use Vereda + bridge se quiser editar)
