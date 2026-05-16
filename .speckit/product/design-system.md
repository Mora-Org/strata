---
dono: Cesar
atualizado: 2026-05-05
status: ativo
---

# Strata Design System — Spec Canônico

> Versão **enxuta** do DS. Conteúdo completo (todos os primitivos com exemplos, kit interativo, 12 screens) vive em [`design/`](../../design/). Esta spec é o **contrato** entre `.speckit/` e `design/` — se algo aqui diverge do `design/`, esta spec ganha (e `design/` precisa ser atualizado em iteração separada).

## Status
**v2 — editorial register · M1+M2 codificados (12 screens) · 2026-05-05**

Ver [ADR-0003](../architecture/adr/ADR-0003-editorial-register.md) pra rationale completa da escolha.

---

## Pilares (3)

### 1. Editorial register
Não OS chrome. Não SaaS clean. **Magazine / zine / livro técnico** — calmo, considerado, opinativo. Referências: Stripe Press, Are.na, Real Life Magazine, Pitchfork's review pages. **Não:** Cursor, ChatGPT, Linear, The Verge.

### 2. Two modes, one layout
Vereda → Mestre = **accent shift only**. NEVER layout change. Regra dura §4 do Director. Mode é postura, não app diferente.

### 3. Reading-first
Half chat, half book. Body em serif (Fraunces). Density média (Obsidian-like, não Notion-airy). **Reference primitives são first-class** — `.bridge`, `.ref-chip`, `.wiki-chip` têm cor própria. Nunca cinza italic.

---

## Tipografia — 3 famílias

| Família | Uso | Arquivo (em `design/assets/fonts/`) | Eixos variable |
|---|---|---|---|
| **Fraunces** | body + display | `Fraunces[SOFT,WONK,opsz,wght].ttf` + italic variant | opsz 9–144 · SOFT 0–100 · WONK 0–1 · wght 300–700 |
| **Geist** | UI chrome (headers, buttons, labels) | `GeistVF.woff2` | wght 100–900 |
| **Geist Mono** | code, file:line, masthead values | `GeistMonoVF.woff2` | wght 100–900 |

Todas **OFL (Open Font License)** — self-hosted, sem CDN.

### Presets de Fraunces variable
- **Body:** `opsz 18, SOFT 0` — calmo, reading-optimized
- **Display:** `opsz 144, SOFT 100, WONK 1` — characterful, editorial
- **Italic display (note title, pullquote):** `opsz 96-144, SOFT 80-100, WONK 0`

Nunca usar valores manuais fora dessas presets.

---

## Color (key tokens — full set em `design/colors_and_type.css`)

### Grounds (warm-leaning sempre, never clinical)

| Token | Dark | Light |
|---|---|---|
| `--bedrock` | `oklch(0.18 0.020 250)` warm-charcoal navy | `oklch(0.97 0.015 75)` warm cream |
| `--stratum` | 0.21 | 0.95 |
| `--vein` | 0.24 | 0.93 |
| `--surface` | 0.27 | 0.98 |

### Foreground (warm cream-white, nunca pure white)

| Token | Dark | Light |
|---|---|---|
| `--fg-1` | `oklch(0.93 0.010 80)` | `oklch(0.22 0.020 250)` |
| `--fg-2` | 0.74 | 0.42 |
| `--fg-3` | 0.56 | 0.58 |
| `--fg-4` | 0.40 | 0.72 |

### Mode accents

| Mode | Dark | Light | Semantic |
|---|---|---|---|
| **Vereda** | `oklch(0.62 0.14 255)` deep editorial blue | `oklch(0.45 0.14 255)` | calm, considered, literary |
| **Mestre** | `oklch(0.74 0.13 75)` warm mustard | `oklch(0.55 0.15 70)` | active, present, earth-bound — NÃO alarm |

### Reference primitives (sparing — README-palette territory)

| Token | Uso |
|---|---|
| `--ref-citation` | indigo-lavender, citações primárias |
| `--ref-wikilink` | lavender, links pra notas do vault |

### Bloom — saturated 6-step editorial ramp

| Level | Dark | Semantic |
|---|---|---|
| `--bloom-1` | `oklch(0.62 0.13 255)` deep blue | lembrar |
| `--bloom-2` | `oklch(0.62 0.13 200)` teal | entender |
| `--bloom-3` | `oklch(0.66 0.13 165)` green | aplicar |
| `--bloom-4` | `oklch(0.74 0.13 75)` mustard | analisar |
| `--bloom-5` | `oklch(0.68 0.16 45)` bronze | avaliar |
| `--bloom-6` | `oklch(0.64 0.18 25)` rust | criar |

**Não é heatmap** — leia pelo deslocamento de hue, não por lightness.

---

## Editorial primitives (7)

| Class | Uso | Spec resumida |
|---|---|---|
| `.masthead` | hyphen-cols metadata strip ("workspace—X / vault—Y / model—Z") | mono UPPERCASE fg-3 + values fg-2, dividers `—` between, hairline border-bottom |
| `.frame` + `.frame.marks` | hairline 1px border + `+` glyphs nos cantos (TL, TR, BL, BR) | 1px var(--border-2), radius 3, optional bg var(--stratum) |
| `.italic-display` | display moments (note titles, pullquotes, mode-confirm titles) | Fraunces italic 44px, opsz 144 SOFT 100 WONK 1 |
| `.bloom-rail` | 4px solid vertical bar à esquerda de cards (note preview) | colored por --bloom-N |
| `.hyphen-cols` | three-column header pattern ("Darling—/Don't—/You—") | grid auto-flow column, mono UPPERCASE |
| `.pullquote` | quote moments — empty state, manifesto refs | Fraunces italic 32px, opsz 96 SOFT 80, max 26ch |
| `.accent-bar` | 4px horizontal saturado no topo de moments editoriais | full-width bg var(--accent) |

---

## Primitives funcionais (não editoriais)

| Class | Uso |
|---|---|
| `.mode-badge` | pill no header right indicando modo ativo |
| `.bridge` | inline `file:line →` em accent (vereda blue ou mestre mustard) |
| `.ref-chip` | citação primária com `↗` opcional, indigo, dotted underline |
| `.wiki-chip` | `[[wiki-link]]` em lavender soft-bg |
| `.bloom .bloom-N` | taxonomy badge L1-L6 |
| `.frontmatter` | YAML metadata block estilizado (não YAML cru) |
| `.tag` | `#tag` chip mono fg-2 |
| `.btn`, `.btn-primary`, `.btn-ghost` | buttons restraint |

---

## Type roles (6 — sem mais)

`--type-display` · `--type-h1` · `--type-h2` · `--type-body` · `--type-ui` · `--type-mono`

(plus mono variants `--type-mono-sm`, ui variants `--type-ui-strong`, `--type-small`)

Variants editoriais via `font-variation-settings` em vez de novas roles.

---

## Spacing (base 4px)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`

Tokens: `--sp-1`…`--sp-16`. Body padding mora em 12-20px. Gutters em 16-24px.

## Radii (small — right-angle precision)

| Token | Valor | Uso |
|---|---|---|
| `--radius-0` | 0 | inputs, chips, code blocks |
| `--radius-1` | 3px | buttons, primary surfaces |
| `--radius-2` | 6px | modals, popovers |

**Sem pills.** Sem fully-rounded avatars.

## Elevation

- **Dark mode:** ZERO drop shadows. Depth via tonal step + 1px hairline border.
- **Light mode:** uma sombra única pra popovers/modals (`0 4px 12px -2px @ 4%`).

## Motion

- **Fades only** — 120-180ms ease-out (`var(--dur)` = 160ms, `var(--ease)` = `cubic-bezier(0.2, 0, 0.2, 1)`)
- **Mode transition:** accent cross-fade 240ms
- **Sem bounces, springs, staggers, pulses**

---

## Theme + Mode contracts

### Theme (data-attribute em `<html>`)

```html
<html data-theme="dark">  <!-- ou "light" -->
```

Default: `dark`. Light é supported equal mas não canonical.

### Mode (data-attribute em `<html>`)

```html
<html data-mode="vereda">  <!-- ou "mestre" -->
```

Default sempre: `vereda` (regra dura §4 — toda nova sessão começa em Vereda).

### Mode contract

- Mode = posture, NOT different app
- `var(--accent)` é a ÚNICA coisa que muda entre modos
- Layout, density, type, iconography, position — **IDÊNTICOS** entre modos
- Switching requires confirmation modal (ver `design/ui_kits/strata-desktop/screens/mode-confirm-*.html`)
- Mode NUNCA persiste entre sessões — toda nova sessão abre em Vereda

---

## Anti-patterns (resumo — full em `design/README.md`)

- ❌ Centered chat box com floating composer (ChatGPT-clone)
- ❌ Welcome modal, mascot, empty-state illustration
- ❌ Spinner em streaming (use 3 sediment dots)
- ❌ Red toast pra error (use inline declarative banner)
- ❌ Grey italic body text pra citations / wiki-links (use os primitives)
- ❌ Save button em settings (live-apply)
- ❌ Mode switch sem confirmação
- ❌ Emoji em product chrome
- ❌ Gradient backgrounds (em qualquer lugar)
- ❌ Inter / Roboto / system fonts (use Geist)
- ❌ Drop shadow em dark mode
- ❌ Border > 1px (excepto bloom-rail e accent-bar de 4px)

---

## Implementação em código (referência futura — quando M1 dev começar)

1. **Tokens:** importar `design/colors_and_type.css` em `src/index.css` (single source of truth — não duplicar tokens em Tailwind config; gerar Tailwind config dos tokens)
2. **Components:** reimplementar JSX do `design/ui_kits/strata-desktop/` (Composer.jsx, Header.jsx, Message.jsx, Sidebar.jsx, Settings.jsx, NotePreview.jsx, ModeConfirm.jsx) em React 19 real (Vite + Tauri 2 + TS)
3. **Screens:** `design/ui_kits/strata-desktop/screens/` (18 arquivos M1+M2+M3) é referência visual canônica. Bonus: `index-branched.html` mostra canonical surface com branch tree column ativa.
4. **Fonts:** `@font-face` apontando pra `design/assets/fonts/` (relative path do build)

---

## M0.5 completa (2026-05-16)

Todas as **18 screens** M1+M2+M3 codificadas em `design/`. Total entregue:

| Fase | Screens | Highlights |
|---|---|---|
| **M1** | 6 | empty-state, active-conversation (Vereda), streaming, settings, workspace-picker, connection-lost |
| **M2** | 6 | mode-confirm v→m + m→v, with-note-preview, with-tool-call, with-diff, active-conversation-mestre (prova "no layout change") |
| **M3** | 6 | branch-tree-2-branches, **branch-tree-4-branches (signature primitive)**, conversation-with-fork-hover, command-palette default/filtered/no-match |

Plus **15 preview cards editoriais** + **3 canonical screenshots** (`desktop-vereda.png`, `desktop-mestre.png`, `desktop-branched.png`) + `index-branched.html` mostrando branch tree column ativa.

Specs detalhadas: [`m05-screens-m1.md`](../plans/m05-screens-m1.md) · [`m05-screens-m2.md`](../plans/m05-screens-m2.md) · [`m05-screens-m3.md`](../plans/m05-screens-m3.md).

**Próximo:** M1 dev — reimplementação React/Tauri sobre `src/`. `design/` permanece como referência visual canônica.
