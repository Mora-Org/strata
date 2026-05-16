# Strata Desktop — UI kit

Hi-fi recreation of the Strata desktop app. Use this as the source of truth when designing or building for Strata.

## Files

- `index.html` — canonical surface (screen 1.2, Vereda dark). The single source of compositional truth — the rest of the screens defer to it.
- `index-branched.html` — canonical surface with the **branch tree column** visible (3 branches). The M3 signature view.
- `app.css` — layout, components, primitives. Imports `../../colors_and_type.css`.
- `screens/` — nineteen standalone screens (six M1 + six M2 + seven M3). Each is self-contained HTML that links back to `../app.css`.
- `*.jsx` — React component split (Composer, Header, Message, Sidebar, Settings, NotePreview, ModeConfirm, primitives). Useful when porting into a real app.
- `data.js` — sample conversation, vault, workspace data shared across the JSX components.

## How to use

For static design work — open the `screens/*.html` files directly. They render at 1280×800 and use only the foundations CSS plus this kit's `app.css`.

For production scaffolding — start from the JSX split. Components are framework-agnostic in spirit (Strata uses Tauri + a thin client) but written here as plain React for legibility.

## Layout invariants

- **Header masthead is inline**, never floating. `workspace · vault · model` lives in a 3-column label/value grid (Geist Mono).
- **Sidebar is always mounted.** It's organized into `WORKSPACE`, `CONVERSAÇÕES`, and `VAULT` divider sections — each separated by a `─── LABEL ───` hairline divider.
- **Messages don't use bubbles.** User turns render in Geist sans, prefixed `[u]`. Strata turns render in Fraunces body. The visual difference is *typography*, not chrome.
- **Composer is inline at the bottom of the main column.** It never floats over content. Below it sits a keyboard-hints footer with `+` corner marks: `↩ send · ⇧↩ newline · vereda · explica, não edita`.
- **No mode-specific layout.** Switching from Vereda to Mestre changes only the accent color and the mode badge.

## Deviations between the six screens

| Screen | Deviation from 1.2 |
|---|---|
| 1.1 Empty | Main column shows manifesto pull-quote (italic-display Fraunces) instead of a thread. Sidebar shows empty CONVERSAÇÕES list. |
| 1.2 Active | Canonical. Demonstrates bridge / ref-chip / wiki-chip / bloom / Pré-visualizar nota button. |
| 1.3 Streaming | A second message in the thread is mid-stream — three sediment dots cycling fg-3 → fg-2 → fg-3 with 120ms stagger. Composer is disabled. |
| 1.4 Settings | Main column replaced with editorial colofão — `─── LABEL ───` divider sections, hairline frame, no save button. |
| 1.5 Picker | Main column shows centered `.frame.marks` card with italic title, RECENTES list, divider, browse CTA. Sidebar masthead reflects `WORKSPACE — (none)`. |
| 1.6 Conn. lost | Inline banner with 4px rust-coral border-left + Vein background, sits above composer. |

## M2 — Mode router + note builder

Six additional surfaces that introduce mode-switching, the right-aside note preview, the inline tool-call card, and the proposed-diff approval pattern. The shell from M1 is unchanged; these are *additive* primitives that compose into the existing layout.

| Screen | Deviation from 1.2 |
|---|---|
| 2.2a Confirm Vereda → Mestre | Centered modal (~540px), 4px **target-accent bar** at top, italic display title, "tools available" block, primary button tinted with the *target* mode's accent (mustard), not the current mode's. |
| 2.2b Confirm Mestre → Vereda | Symmetric inverse: same modal, target-accent bar in editorial blue, primary button blue-tinted. Confirms the friction is bidirectional and the *target* color always cues the destination. |
| 2.3 Active conversation — Mestre | Same shell as 1.2. Only `data-mode` flips on `<html>`, swapping `--accent` from blue to mustard. Mode-badge reads `mestre`; composer footer reads "mestre · reads, writes, runs". Bridge / ref / wiki / bloom chips keep their original hues. |
| 2.4 Active + note preview | `.app.with-aside` activates the third grid column (420px). Right aside has a 4px **Bloom rail** at its left edge, masthead-style header (`NOTE PREVIEW —`), italic display title, frontmatter block, serif prose with checkbox list-items, and three actions: Discard / Edit first / Write to vault. The trigger button on the message becomes a "Previewing →" active-state. |
| 2.6 Active + tool call | Inline `.toolcall` cards within a Strata reply. Each has a 4px accent rail at left, a single-row mono header (TOOL_NAME · summary · chevron), and an expandable body containing args (key/value mono) and a result block in `--bedrock` with `tracking-mono` and a 320px scrollable max-height. Italic mono truncation marker for long results. The reply's prose flows around the cards — they're inline content. |
| 2.7 Active + proposed diff | An `edit_file` tool call rendered open with a unified diff inside: 22px marker / 44px line-no / mono text. Added lines = success-tinted bg (8%) with green `+`; removed = error-tinted bg (8%) with red `−`. Foot row carries Reject / Edit first / Approve & write — the user explicitly authorizes every change. The success-banner pattern from M1 carries through, showing the path of a previously-written note above the composer. |

### M2 primitives added to `app.css`

| Class | Use |
|---|---|
| `.modal-scrim` + `.mode-modal` | Friction modal frame; set `data-target="vereda"` or `data-target="mestre"` to drive the target-accent bar and primary button. |
| `.btn-primary-target` | Variant of `.btn-primary` that uses `--modal-target-accent` instead of the ambient `--accent`. |
| `.note-aside` + `.bloom-rail` | Right-aside note preview shell. Add `.b1`–`.b6` for Bloom ramp variants. |
| `.banner-success` | Inline success banner — green left-rail, file-path with dotted underline, `Open` action. Pairs with the existing `.banner-lost` pattern. |
| `.toolcall` + `.toolcall-head/body/foot` | Inline tool-call card. Add `.error` or `.success-rail` to recolor the left rail. |
| `.toolcall-status-dots` | 3-dot streaming indicator scoped to a tool call (uses the existing `sediment` keyframes). |
| `.diff` + `.diff-line.added/removed/context` | Unified diff renderer with marker / line-no / text columns. |
| `.mode-modal-divider` + `.mode-modal-tools` | Hyphen-rule + tool capability list, used inside the mode-confirm body. |

## M3 — Signature primitive + ergonomics

Three surfaces that turn Strata from a calm reader-writer into a product with its own visual DNA. The **branch tree** is the hero — it is the literal visual rendering of the manifesto's geological metaphor.

| Screen | Notes |
|---|---|
| 3.1 Branch tree (2 branches) | Minimal materialization — the column appears the moment the first fork happens. Two bars, one junction. |
| 3.1 Branch tree (4 branches) | Full range: depth across three columns, recency saturation, an abandoned mid-branch (faded, ends at 68%), a freshly forked recent branch (full saturation, hovered tooltip showing). |
| 3.2 Conversation + fork hover | A Strata reply with the `⤴ ⌥+F` affordance forced visible via `.fork-action.shown`. In practice it appears only on hover with a 200ms delay. |
| 3.3 Palette — default | All seven commands listed: `/vereda` `/mestre` `/efemero` `/sem-nota` `/tree` `/fork` `/help`. First row selected (hover bg). |
| 3.3 Palette — filtered | User typed `/me`. Section label reads "2 matches". `/mestre` and `/sem-nota` visible with the `me` chars highlighted (accent-tinted pill). |
| 3.3 Palette — no match | User typed `/xyz`. Body collapses to a single centered italic line: *"Nenhum comando combina. — esc pra fechar"* in Fraunces italic. |

### M3 primitives added to `app.css`

| Class | Use |
|---|---|
| `.app.with-tree` | Grid modifier — inserts the 80px tree column between sidebar and main. Combines with `.with-aside` for 4-column layouts. |
| `.branch-tree` + `.branch-canvas` | Tree column shell. Bars are absolutely positioned with `top`/`bottom` percentages so they scale with viewport height. |
| `.branch-bar` + `.bb-N` + `.col-N` + saturation tier | One branch. Three orthogonal modifiers: Bloom color (1–6), depth column (1–4), saturation (`.recent` / `.session` / `.older`). |
| `.branch-junction` | 6×6 hairline SVG L-arc connecting parent bar's right edge to child bar's top. Uses inline `<path>` with `stroke: var(--border-2)`. |
| `.branch-active-indicator` | The small `▶` caret next to the active branch's top, in the current `--accent`. |
| `.branch-tooltip` | Floating tooltip with name + meta. Positioned outside the 80px column (spills right into main) and rendered with a small arrow pointing back to the bar. |
| `.fork-action` (inside `.msg`) | Hover-only affordance with 200ms transition-delay. Use `.shown` to force visible for screenshots. |
| `.banner-fork` | Editorial inline confirmation after a fork. Bloom-2 left-rail; same pattern as `.banner-success`. |
| `.palette-scrim` + `.palette-frame` | ⌘K overlay frame. 560px wide, ~22vh from top, scrim at 70% bedrock. Frame has `.frame.marks`-style `+` corners. |
| `.palette-input-wrap` + `.palette-slash` + `.palette-input` / `.palette-input-typed` | Mono input with `/` prefix. `.palette-input-typed` is a static visual variant with a faux caret (for screenshots). |
| `.palette-row` + `.cmd` + `.desc` | Two-column row: mono command name + italic Fraunces description. `.cmd .match` highlights the filtered substring. |
| `.palette-no-match` | Single centered italic Fraunces line. No illustration. |
| `.palette-footer` | Keyboard hint footer with `<kbd>` chips. |

