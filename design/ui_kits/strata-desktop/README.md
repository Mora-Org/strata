# Strata Desktop — UI kit

Hi-fi recreation of the Strata desktop app. Use this as the source of truth when designing or building for Strata.

## Files

- `index.html` — canonical surface (screen 1.2, Vereda dark). The single source of compositional truth — the rest of the screens defer to it.
- `app.css` — layout, components, primitives. Imports `../../colors_and_type.css`.
- `screens/` — twelve standalone screens (six M1 + six M2). Each is self-contained HTML that links back to `../app.css`.
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

