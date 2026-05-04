---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# M0.5.b — Screens M3 (priority 3 · signature)

Screens da fase M3 do dev. **Branch tree é o primitivo signature** — único do Strata, materializa a metáfora geológica. Sem ele, Strata é "só mais um chat com vault". Com ele, Strata tem identidade única.

> **Veja primeiro:** [`m05-screen-spec.md`](m05-screen-spec.md), [`m05-screens-m1.md`](m05-screens-m1.md), [`m05-screens-m2.md`](m05-screens-m2.md).

## Inventário

| # | Tipo | Nome | Quando aparece |
|---|---|---|---|
| 3.1 | Surface | Session branch tree | Sempre que sessão tem ≥1 branch (ativo no left-rail) |
| 3.2 | Interaction | Fork from message | Hover action em qualquer message |
| 3.3 | Surface | Command palette (Cmd+K) | User pressiona Cmd/Ctrl+K |

---

## 3.1 — Session branch tree (signature primitive)

> **Energy reference:** "Yellow Grass" (vertical sediment-like com cores variando) + página de manuscrito iluminado com marginalia. **Esta é a tela onde o DS editorial paga o preço.**

### Purpose
Pi suporta `/tree` e `/fork` — branches da mesma conversa. Strata visualiza isso como **sediment layers** num vertical timeline: cada branch = uma camada de exploração, com tonal step variando por activity/recência.

Quando uma sessão tem só 1 branch, o tree não aparece (no chrome — sidebar funciona normal). Assim que user faz primeiro fork, o tree materializa.

### Surface
**Coluna esquerda extra** entre sidebar e main, width 80px. Aparece com slide-in 240ms quando primeiro fork acontece. Pode ser togglável via `Cmd+B` (B de branches).

### Wireframe (sessão com 4 branches)

```
┌────────┬──┬─────────────────────────────────────┬────────────────────┐
│sidebar │  │                                     │                    │
│        │  │  (chat — branch ativa)              │  (note preview     │
│        │██│                                     │   se houver)       │
│        │██│                                     │                    │
│        │  │                                     │                    │
│        │██│                                     │                    │
│        │██│                                     │                    │
│        │██│                                     │                    │
│        │  │                                     │                    │
│        │██│                                     │                    │
│        │  │                                     │                    │
│        │██│                                     │                    │
│        │██│                                     │                    │
└────────┴──┴─────────────────────────────────────┴────────────────────┘
         ↑
     branch tree col, 80px wide
```

### Detalhe da coluna (zoom)

```
┌──────────┐
│          │
│   ▌      │  ← branch 1 (origem) — sediment camada deep blue
│   ▌      │      (oldest, fg-3 tone)
│          │
│   ▌▌     │  ← branch 2 (forked from msg 5) — teal, mais saturado
│   ▌▌     │      hovered: shows label
│   ▌▌◀━━━ │  ← active branch indicator (small triangle to the right)
│          │
│     ▌    │  ← branch 3 (forked from msg 12 of branch 2) — green
│     ▌    │
│          │
│       ▌  │  ← branch 4 (forked from msg 3 of branch 1) — mustard
│       ▌  │      most recent activity
│          │
│  · click │  ← footer: hint mono-sm fg-3
│  · ⌥+F   │
└──────────┘
```

### Visual logic

- **Each branch = vertical bar 6-8px wide**, color from `--bloom-{N}` ramp where N is determined by branch index (cycle through ramp)
  - Origin branch: `--bloom-1` (deep blue)
  - Each new fork: next color in ramp
  - After 6, cycle restarts
- **Bar height** = proportional to message count of that branch
- **Bar saturation** = activity recency:
  - Recent (last hour): full saturation
  - Within session: saturation 70%
  - Older: saturation 40%, fg-3 tone
- **Horizontal position** = depth (how nested):
  - Origin: column 1 (leftmost)
  - First-level fork: column 2 (8px right)
  - Deeper: column 3, 4… (max 4 columns visible, rest collapse)
- **Vertical position** = chronological top-to-bottom
- **Junction marks** between fork point and child branch: thin 1px hairline `var(--border-2)` arc connecting them
- **Active branch**: small triangle `▶` glyph to the right of bar at the top of that bar's segment

### Interactive

| Element | Behavior |
|---|---|
| Click on bar | switches active branch to that one, main chat redraws |
| Hover on bar | shows label tooltip: `{branch name} · {N msgs} · {time since last activity}` |
| Right-click on bar | context menu: `Renomear` `Forkar daqui` `Exportar branch como .md` `Apagar branch` |
| Footer hints | `· click` / `· ⌥+F` (alt+F to fork from current message) |
| Cmd+B | toggle visibility of tree column |
| Cmd+1, Cmd+2 … Cmd+6 | switch to branch N (if exists) |

### States

| State | Visual |
|---|---|
| `single-thread` | tree column **NOT visible** (no chrome cost when not needed) |
| `branched` | tree visible w/ all branches |
| `active-branch` | one bar has `▶` indicator |
| `dragging-fork` | (M5+) dragging a message to create a fork — branches show drop targets |
| `branch-empty` | branch with 0 msgs after fork: shows hollow bar (border 1px var(--border-2), no fill) |
| `collapsed` | when >4 columns deep, collapsed branches show as horizontal rule `─` w/ count `+3 deeper` |

### Copy

- Footer hints: `· click` `· ⌥+F`
- Tooltip format: `{name} · {N} msgs · {time}` (e.g., `borrow-checker-rewrite · 12 msgs · 5min`)
- Toggle command: `Cmd+B`
- Switch branch: `Cmd+{1-6}`
- Context menu: `Renomear` `Forkar daqui` `Exportar branch como .md` `Apagar branch`

### Why this is signature

The geological metaphor is the manifesto's spine (manifesto §III: "Você pode ler a história de milhões de anos em cortes de rocha porque cada época deixou sua marca"). The branch tree is the LITERAL visual rendering of that idea inside the product. Every other primitive in the DS supports this — but this one IS the metaphor.

If we get the tree right, every other choice in the DS (sediment layers, tonal steps, restraint) is justified by it. If we don't, the rest of the DS feels overdesigned for a chat app.

**Treat this as the hero element of the product.** Don't optimize it for "discoverability" or "obviousness" — optimize for the moment when a user notices it after their 5th fork and realizes: "oh — this is what 'strata' meant."

### DS primitives required
`--bloom-1`…`--bloom-6` (sequential) · custom branch-bar component · `.t-mono-sm` (footer hints, tooltips) · `.frame.marks` (optional around the column)

### Anti-patterns
- ❌ Git-graph–style branch viz with circles + lines (too engineering, breaks metaphor)
- ❌ Tabs at the top of main column (default tabs UX — not strata)
- ❌ Sidebar list of branches w/ checkboxes (loses the geological visualization)
- ❌ Full graph viz with names always visible (too noisy — labels via hover only)
- ❌ Animation when switching branches that's >240ms (loses calm)
- ❌ "Currently on branch X" banner (the `▶` indicator is enough)
- ❌ Force-show tree even with 1 branch (no value, only chrome cost)

---

## 3.2 — Fork from message (interaction)

### Purpose
Sutil hover action em cada message: cria new branch a partir dessa message. Discoverable mas não pushy.

### Visual

```
[u] Why does the borrow checker complain about my parser?
                                                       [⤴ ⌥+F]   ← hover-only action, fg-3
                                                                   appears 200ms after hover-in
[▦] The mutable borrow you take...
```

### Spec

- Action button appears at the right edge of the message ON HOVER ONLY
- Glyph: `⤴` (Unicode "rightwards arrow over leftwards arrow") + keyboard hint `⌥+F`
- Color fg-3, mono-sm
- No background, no border on hover state itself
- Delay: 200ms after hover-in (avoid flicker)
- Click → creates new branch starting from that message position
- Keyboard: `Alt+F` while message is focused (arrow keys navigate messages) does same

### Behavior on fork

1. New branch created with copy of all messages up to fork point (inclusive)
2. Tree column 3.1 animates in (if not already visible) with new branch bar appearing from fork point downward
3. Active branch switches to new fork
4. Composer focus
5. Inline editorial confirmation: `Forkado de "{msg snippet}" — branch {bloom-color-name}` (e.g., "branch teal-2"). Editorial inline like 2.5, fades after 5s.

### Branch naming

- Default: descriptive auto-name `{adjective}-{noun}` from latent description (or just `branch-{N}`)
- User can rename via right-click on bar in 3.1

### Copy

- Hover hint: `⤴ ⌥+F`
- Inline confirmation: `Forkado de "{snippet}" — branch {name}`
- Tooltip on hover: `Forkar daqui (Alt+F)`

### Anti-patterns
- ❌ Always-visible fork button on every message (clutters reading)
- ❌ "Branch from here" full button on hover (too verbose — glyph + shortcut suffices)
- ❌ Confirmation modal before forking (cheap operation, undo via switch back)

---

## 3.3 — Command palette (Cmd+K)

> **Energy reference:** "MONDAY" (header three-column) + lista editorial restrained.

### Purpose
Discovery + power. Slash commands `/vereda`, `/mestre`, `/efemero`, `/sem-nota`, `/tree`, `/fork`, `/help` precisam de um lar discoverable. Cmd+K abre palette flutuante.

### Surface
Centered overlay, 560px wide, ~480px max height. Scrim 30% opacity behind. Esc to close.

### Wireframe

```
                  ╔═══════════════════════════════════════════════╗
                  ║ + ─────────────────────────────────────── + ║
                  ║                                                 ║
                  ║   ┌──────────────────────────────────────────┐  ║
                  ║   │ /                                        │  ║  ← input mono, autofocus
                  ║   └──────────────────────────────────────────┘  ║
                  ║                                                 ║
                  ║   ─── COMANDOS ────────────────────────────  ║
                  ║                                                 ║
                  ║   /vereda          *Voltar para Modo Vereda*   ║  ← italic Fraunces description
                  ║                                                 ║
                  ║   /mestre          *Entrar em Modo Mestre*     ║
                  ║                                                 ║
                  ║   /efemero         *Sessão sem persistir*      ║
                  ║                                                 ║
                  ║   /sem-nota        *Próximo turno sem nota*    ║
                  ║                                                 ║
                  ║   /tree            *Visualizar branches*       ║
                  ║                                                 ║
                  ║   /fork            *Forkar da última message*  ║
                  ║                                                 ║
                  ║   /help            *Atalhos & comandos*        ║
                  ║                                                 ║
                  ║                                                 ║
                  ║   ↵ executar  ·  ↑↓ navegar  ·  esc fechar    ║  ← footer hints
                  ║ + ─────────────────────────────────────── + ║
                  ╚═══════════════════════════════════════════════╝
```

### Layout

- `.frame.marks` envelope, max-width 560px, max-height 480px
- Background `var(--surface)`
- Padding var(--sp-5) var(--sp-6)
- Centered horizontally, ~30% from top vertically

### Elements

| # | Element | Spec |
|---|---|---|
| A | Top corner marks `+` | `.frame.marks` |
| B | Search input | mono Geist Mono 14px, fg-1, autofocus, prefix `/` shown faintly fg-3 |
| C | Section divider COMANDOS | `─── COMANDOS ───` mono uppercase fg-3 |
| D | Command rows (5-7 visible at a time) | each: command name (mono fg-1) + italic Fraunces description (fg-2) |
| E | Footer hints | `↵ executar · ↑↓ navegar · esc fechar` mono-sm fg-3 |

### Command row spec

```
/{name}              *{description}*
↑                    ↑
mono Geist Mono 13px italic Fraunces 14px (opsz 36 SOFT 40)
fg-1                 fg-2
left-aligned         right-aligned (or after gap)
```

Selected row: bg `var(--hover)`, no border, no scale.
Highlighted match (filtering): match chars in fg-1, rest fg-3.

### Filtering

- Type after `/` filters list by fuzzy match on command name
- Commands not matching are hidden (not greyed)
- If 0 matches, show: `Nenhum comando combina. — esc pra fechar`

### Sections

In M3, only `COMANDOS`. In future:
- `BRANCHES` (jump to branch)
- `CONVERSATIONS` (jump to conversation)
- `NOTES` (search vault)
- `WORKSPACE` (recent workspaces)

### Interactive

| Element | Behavior |
|---|---|
| Cmd/Ctrl+K | toggle palette |
| Type | filter |
| ↑↓ arrows | move selection |
| Enter | execute selected command |
| Esc | close (no action) |
| Click on row | execute that command |
| Click on scrim | close |

### Command list (M3)

| Command | Description | Action |
|---|---|---|
| `/vereda` | Voltar para Modo Vereda | open 2.2 (Mestre→Vereda variant) |
| `/mestre` | Entrar em Modo Mestre | open 2.2 (Vereda→Mestre variant) |
| `/efemero` | Sessão sem persistir | toggle SessionManager.inMemory mode |
| `/sem-nota` | Próximo turno sem nota | one-shot toggle, applies to next turn only |
| `/tree` | Visualizar branches | toggle 3.1 (Cmd+B) |
| `/fork` | Forkar da última message | trigger 3.2 from last msg |
| `/help` | Atalhos & comandos | open dedicated help screen (M5+) — em M3, mostra esse próprio palette com all commands |

### States

| State | Visual |
|---|---|
| `default` | input empty, all commands shown |
| `filtered` | only matching commands visible, match chars highlighted |
| `no-match` | empty list, `Nenhum comando combina. — esc pra fechar` em italic Fraunces fg-3 centered |
| `selected` | row has `var(--hover)` bg |
| `closing` | fade-out 120ms |

### Copy

**PT (primary):**
- Section: `COMANDOS`
- Footer: `↵ executar · ↑↓ navegar · esc fechar`
- No-match: `Nenhum comando combina. — esc pra fechar`
- Commands (description column, italic):
  - `/vereda` → `Voltar para Modo Vereda`
  - `/mestre` → `Entrar em Modo Mestre`
  - `/efemero` → `Sessão sem persistir no disco`
  - `/sem-nota` → `Próximo turno sem nota`
  - `/tree` → `Visualizar branches da sessão`
  - `/fork` → `Forkar a partir da última message`
  - `/help` → `Atalhos & comandos`

**EN (parallel):**
- Section: `COMMANDS`
- Footer: `↵ run · ↑↓ navigate · esc close`
- No-match: `No command matches. — esc to close`

### DS primitives required
`.frame.marks` · custom search input (mono w/ `/` prefix) · section divider · italic Fraunces (description) · `.t-mono-sm` (commands & footer)

### Anti-patterns
- ❌ Recent commands section ("recently used") — shows wear, breaks editorial calm
- ❌ Command icons (Lucide icons before each command) — too noisy, words are enough
- ❌ Description in same color/size as command — the italic Fraunces contrast IS the design
- ❌ Auto-execute on single match (typo prone)
- ❌ Persist palette state between opens (always opens fresh)
- ❌ Pinned commands at top (use cycling/recent or just stable order)
