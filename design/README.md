# Strata Design System

> **Brand:** Strata, by Mora — a local-first coding companion.
> **Voice:** *calma deliberada* (deliberate calm). Stratified, reading-first, dark-by-default.
> **Posture:** the brand is the pause. No urgency cues, no flashy gradients, no pulsing badges.

This skill packages everything you need to design or build for Strata — voice, visual foundations, tokens, primitives, assets, and a full interactive desktop kit.

---

## Repository layout

```
strata-design/
├─ SKILL.md                    ← skill manifest (read first)
├─ README.md                   ← you are here
├─ colors_and_type.css         ← @import this; tokens + semantic primitives
├─ assets/
│  ├─ fonts/                   ← Fraunces (variable serif), Geist VF, Geist Mono VF
│  ├─ strata-mark.svg          ← stratified glyph (4 layered bars)
│  ├─ strata-wordmark.svg      ← italic-display Fraunces lockup
│  ├─ mora-wordmark.svg        ← parent brand
│  ├─ desktop-vereda.png       ← canonical screenshot of screen 1.2
│  ├─ desktop-mestre.png       ← Mestre variant (M2)
│  └─ desktop-branched.png     ← signature view with branch tree (M3)
├─ preview/                    ← small reference cards for review
│  ├─ screen-empty-state.html         ← 1.1 first session
│  ├─ screen-active-conversation.html ← 1.2 canonical thread
│  ├─ screen-streaming.html           ← 1.3 sediment-dot indicator
│  ├─ screen-settings.html            ← 1.4 editorial colofão
│  ├─ screen-workspace-picker.html    ← 1.5 folder selector
│  ├─ screen-connection-lost.html     ← 1.6 inline error banner
│  ├─ screen-mode-confirm-*.html      ← 2.2 mode-router modal (×2)
│  ├─ screen-active-conversation-mestre.html        ← 2.3 same shell, mestre accent
│  ├─ screen-active-conversation-with-note-preview  ← 2.4 right aside, bloom rail
│  ├─ screen-active-conversation-with-tool-call     ← 2.6 inline tool surface
│  ├─ screen-active-conversation-with-diff          ← 2.7 proposed diff + approval
│  ├─ screen-branch-tree.html         ← 3.1 signature primitive (2 + 4 branches)
│  ├─ screen-fork-interaction.html    ← 3.2 hover action on a message
│  └─ screen-command-palette.html     ← 3.3 ⌘K · default + filtered + no-match
└─ ui_kits/
   └─ strata-desktop/          ← full hi-fi recreation; lift from here
      ├─ index.html            ← canonical surface (screen 1.2, Vereda dark)
      ├─ index-branched.html   ← canonical + branch tree visible (M3 signature)
      ├─ app.css               ← layout + component CSS
      ├─ screens/              ← all nineteen screens (M1 + M2 + M3), standalone
      ├─ Composer.jsx, Header.jsx, Message.jsx, Sidebar.jsx,
      │  Settings.jsx, NotePreview.jsx, ModeConfirm.jsx, primitives.jsx
      └─ data.js
```

---

## Voice

**Calma deliberada.** The interface should feel like a well-edited page — paragraphs of body type with the occasional editorial flourish. Conversation, not chat. Reading, not chatting. Every primitive earns its place; every animation has a reason; nothing demands attention it hasn't earned.

**Editorial register.** Body copy uses Fraunces (humanist serif) with optical-size and SOFT/WONK axes tuned for screen reading. Display moments use italic Fraunces at large `opsz` to carry the voice. Sans (Geist) is for UI chrome — masthead labels, buttons, captions. Mono (Geist Mono) is for code, file:line refs, and the masthead grid only.

**Two modes, one layout.** Mode is a *posture*, not a layout. Vereda (default editorial-blue) and Mestre (warm mustard/bronze) change only the accent token and the mode badge. Layout, density, and information architecture are identical. Switching modes requires confirmation and is a deliberate gesture.

**Portuguese-first, English-aware.** UI strings are pt-BR by default. The brand grew up in Portuguese — *vereda*, *mestre*, *bloom*, *vault*, *bridge* — and copy should feel native there. English is supported but not the source of truth.

---

## Three rules that dominate

1. **No flashy gradients, no pulsing badges, no urgency cues.** The brand is the pause. Errors are inline and declarative, never red toasts. Streaming uses three sediment dots, never a spinner. Success is silent.
2. **Mode is a posture, not a layout.** Vereda → Mestre changes only the accent and the badge. Sidebar, masthead, message rendering, composer — all identical. If you find yourself adding mode-specific layout, stop.
3. **References are first-class.** Citations get their own primitive (`.ref-chip`), wiki-links get theirs (`.wiki-chip`), and code refs get `.bridge`. Never use grey italic text for any of these. The system reads better when references are typographically distinct.

---

## Visual foundations

### Color

Two themes — dark (default) and light. Both grounds are *warm-leaning*, never clinical slate.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bedrock` | warm-charcoal navy 0.18 | cream 0.98 | page ground |
| `--stratum` | 0.21 | 0.96 | sidebar, second layer |
| `--vein` | 0.24 | 0.94 | input rows, vein backgrounds |
| `--surface` | 0.27 | 0.92 | floating cards, popovers |
| `--fg-1..4` | warm cream-white → 0.40 | warm graphite → 0.62 | primary → disabled |
| `--border-1/2` | hairline @ 10–20% α | hairline @ 10–20% α | dividers, frame edges |

Accents (mode-driven):

- `--accent-vereda` — deep editorial blue, lifted for dark surfaces
- `--accent-mestre` — warm mustard / bronze
- Reference primitives — indigo (`--ref-citation`), lavender (`--ref-wikilink`), bridge-blue (code refs)

The **Bloom ramp** (L0–L5) is a saturated editorial accent ramp used for taxonomy badges (capture → connect → cultivate → synthesize → publish). It's a brand mark, not a heatmap — read the chip levels by their hue rotation, not their lightness.

### Type

```
Display       Fraunces italic, opsz 96–144, SOFT 80–100, WONK 1
Body          Fraunces, opsz 24, SOFT 50, weight 400
UI / chrome   Geist, weight 400/500
Mono          Geist Mono, weight 400 (file:line, masthead grid, captions)
```

`var(--type-body)`, `var(--type-mono-sm)`, etc. are exposed as semantic shortcuts. Never use Inter, Roboto, system-ui, or any monospace other than Geist Mono.

### Spacing & rhythm

Spacing is editorial: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72. Use generous vertical rhythm in body copy (1.65 line-height). Sidebar and chrome are denser (1.4). Never tight-pack body type.

### Frame & corner marks

Frames use 1px hairline borders. Corner marks (`+` glyphs at top-left/right and bottom-left/right) signal "framed surface" in editorial layouts — settings cards, workspace pickers, frontmatter blocks. Use sparingly; they're a register, not a decoration.

---

## Semantic primitives (live in `colors_and_type.css`)

| Class | Use |
|---|---|
| `.mode-badge` | the small pill at top-right that names the current mode |
| `.bridge` | inline `file:line` references, e.g. `src/parser/expr.rs:142` |
| `.ref-chip` | citations with author/title and optional `↗` external link |
| `.wiki-chip` | `[[wiki-link]]` to vault notes |
| `.bloom .bloom-N` | taxonomy badge (L0–L5) |
| `.frontmatter` | YAML-style header block at top of a generated note |
| `.tag` | `#tag` chips |
| `.btn`, `.btn-primary` | buttons |
| `.frame`, `.frame.marks` | hairline-bordered surface, optionally with corner marks |
| `.masthead` | top label/value grid (workspace · vault · model) |

---

## Iconography

Strata barely uses icons. The mark itself is the only piece of brand iconography — four horizontal bars, decreasing opacity (1.00 / 0.65 / 0.40 / 0.22), suggesting stratification and sediment. Avoid iconographic UI; prefer text labels in Geist or italic-display moments in Fraunces. The two exceptions are: `↗` for external links inside ref-chips, and the bridge arrow `→` in code-ref chips.

If you need an icon for something not covered by the brand, use an outline glyph at 1.5px stroke from a library you already trust — but ask first.

---

## Anti-patterns

- ❌ Centered chat box with floating composer
- ❌ Welcome modal, mascot, or empty-state illustration
- ❌ Spinner during streaming
- ❌ Red toast for errors
- ❌ Grey italic body text for citations or wiki-links
- ❌ Save button in settings (live-apply)
- ❌ Mode switch without confirmation
- ❌ Emoji as functional UI
- ❌ Gradient backgrounds
- ❌ Inter / Roboto / system fonts

---

## Quick start

```html
<!doctype html>
<html data-theme="dark" data-mode="vereda" lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="colors_and_type.css" />
</head>
<body>
  <span class="mode-badge">vereda</span>
  <span class="bridge">src/parser/expr.rs:142</span>
  <span class="ref-chip">Klabnik & Nichols, cap.10 <em>↗</em></span>
  <span class="wiki-chip">borrow-checker-mental-model</span>
  <span class="bloom bloom-3">L3 aplicar</span>
</body>
</html>
```

For full hi-fi compositions, copy from `ui_kits/strata-desktop/`.

---

## Six canonical M1 screens

The desktop kit ships six screens — together they define the entire surface area of milestone 1.

| # | Screen | Purpose |
|---|---|---|
| 1.1 | **Empty state** | First session, no conversations yet. Manifesto pull-quote moment. |
| 1.2 | **Active conversation** | Canonical thread — sets the rules for everything else. |
| 1.3 | **Streaming** | 3-sediment-dot indicator + composer-disabled state. |
| 1.4 | **Settings** | Editorial colofão. Live-apply, no save button. |
| 1.5 | **Workspace picker** | Folder-selector overlay. Not an OS-dialog clone. |
| 1.6 | **Connection lost** | Inline declarative banner. Never a toast. |

See `preview/` for review cards and `ui_kits/strata-desktop/screens/` for standalone HTML.

---

## Six M2 surfaces — mode router + note builder

Milestone 2 introduces the surfaces that turn Strata from a reader into a writer: the friction modal that gates Mestre, the right-aside note preview, the inline tool-call card, and the proposed-diff approval card. The shell from M1 is unchanged.

| # | Screen | Purpose |
|---|---|---|
| 2.2a | **Mode confirm — Vereda → Mestre** | Friction modal. Target-accent bar (mustard). The user must opt in to writes. |
| 2.2b | **Mode confirm — Mestre → Vereda** | Symmetric inverse. Target-accent bar (blue). Bidirectional friction. |
| 2.3 | **Active conversation — Mestre** | Same shell as 1.2; only the accent flips. Proves mode is a posture, not a layout. |
| 2.4 | **Active + note preview** | Right aside (420px) opens, with a 4px Bloom rail. Frontmatter, italic title, prose, three actions. |
| 2.6 | **Active + tool call** | Inline tool-call cards inside a Strata reply (collapsed and expanded). Mono header, args + result, italic truncation. |
| 2.7 | **Active + proposed diff** | Unified diff inside an `edit_file` tool call, with Reject / Edit first / Approve & write. Plus the success banner from M1. |

See `preview/screen-mode-confirm-*.html`, `preview/screen-active-conversation-*.html` for review cards. Standalone screens are in `ui_kits/strata-desktop/screens/`.

---

## Three M3 surfaces — signature primitive + ergonomics

Milestone 3 is the milestone that gives Strata its identity. The **session branch tree** materializes the geological metaphor literally — every fork is a sediment layer, every depth a new column, every recency a saturation step. Without it, Strata is just another chat-with-vault product. With it, the entire DS — sediment grounds, tonal steps, restraint, Bloom ramp — pays off.

| # | Screen | Purpose |
|---|---|---|
| 3.1 | **Session branch tree** *(signature)* | 80px column between sidebar and main, materialized only after the first fork. Each branch = a vertical Bloom-colored bar; depth = horizontal position; recency = saturation. Hairline L-arc junctions, ▶ active indicator, hover tooltips that spill into the main column. |
| 3.2 | **Fork from message** | Hover-only `⤴ ⌥+F` affordance with 200ms delay. No always-visible button. On click, branches the conversation from that message and triggers an inline editorial confirmation. |
| 3.3 | **Command palette (⌘K)** | 560px overlay frame.marks centered ~22vh from top. Two typefaces in one row: mono command name + italic Fraunces description. Filtering highlights matched chars with an accent-tinted pill. No-match state is one centered italic line. |

### Branch tree — why this is the signature

The manifesto says: *"você pode ler a história de milhões de anos em cortes de rocha porque cada época deixou sua marca em camadas."* The branch tree is the literal visual rendering of that idea inside the product. **Don't optimize it for discoverability or obviousness** — optimize it for the moment when a user notices it after their 5th fork and realizes: *"oh — this is what strata meant."*

### M3 primitives added to `app.css`

| Class | Use |
|---|---|
| `.app.with-tree` | App-shell modifier — inserts an 80px tree column between sidebar and main. Combines with `.with-aside` for the 4-column variant. |
| `.branch-tree` + `.branch-canvas` | The tree column. Bars are positioned absolutely inside the canvas using `top`/`bottom` percentages so they scale with viewport height. |
| `.branch-bar` + `.bb-1`–`.bb-6` + `.col-1`–`.col-4` + `.recent`/`.session`/`.older` | A branch bar. Three orthogonal modifiers: Bloom color, depth column, saturation tier. |
| `.branch-junction` | 6×6 inline-SVG L-arc — connects parent bar's right edge to child bar's top. |
| `.branch-active-indicator` | The small ▶ caret next to the active branch's top, in the current `--accent`. |
| `.branch-tooltip` | Floating tooltip with name + meta — anchored to a bar but rendered to the right of the 80px column. |
| `.fork-action` (inside `.msg`) | Hover affordance at the right edge of any message. `opacity: 0` by default, fades in 200ms after hover-in. |
| `.banner-fork` | Inline editorial confirmation after a fork. Bloom-2 left-rail, serif body. Same pattern as `.banner-success`. |
| `.palette-scrim` + `.palette-frame` + `.palette-input-wrap` | ⌘K overlay frame. 560px wide, ~22vh from top, scrim at 70% bedrock. |
| `.palette-row` + `.cmd` + `.desc` | Two-column row: mono command + italic-Fraunces description. The typographic contrast IS the design. |
| `.palette-no-match` | Single centered italic line — no illustration, no panel. |

See `preview/screen-branch-tree.html`, `preview/screen-fork-interaction.html`, `preview/screen-command-palette.html` for review cards. Standalone screens live in `ui_kits/strata-desktop/screens/branch-tree-*.html`, `conversation-with-fork-hover.html`, and `command-palette-*.html`.
