---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# M0.5.b — Screens for Claude Design (index)

Input pra segunda passada do Claude Design: agora que o DS v2 está aprovado, ele constrói as **telas** usando os primitivos editoriais já definidos.

> **Spec dividida em 4 arquivos** (este = índice; 3 = detalhes por fase). Cada fase pode ir pra Claude Design em conversa separada — output mais focado.

---

## Estado atual

| Fase | Status |
|---|---|
| M0 — Fundação documental | ✅ commitado em `7253929`, pushado pra `Mora-Org/strata` |
| M0.5.a — Design System v2 (editorial) | ✅ aprovado em 2026-05-04, **ainda não codificado no repo** |
| **M0.5.b — Screens via Claude Design** | 🟡 **em andamento — esta spec é o input** |
| M0.5.c — Codificação única (DS + screens) | ⏸️ adiada, faremos pass único quando screens chegarem |
| M1 — Scaffolding Tauri + Pi (código real) | 📋 backlog |

**Por que adiar a codificação:** evitar 2 commits parciais (DS-only, depois screens). Pass único depois é mais limpo.

---

## Materiais de referência pra Claude Design

Quando você abrir nova conversa no Claude Design, manda:

1. **A DS v2 inteira** — anexar o zip `Strata Design System.zip` v3 diretamente
2. **O repo público** — https://github.com/Mora-Org/strata — pedir pra ler:
   - [`manifesto.md`](../../manifesto.md) (filosofia)
   - [`CONTEXT_DIRECTOR.md`](../../CONTEXT_DIRECTOR.md) (regras duras §4, mentalidade §2)
   - [`.speckit/product/modes-spec.md`](../product/modes-spec.md) (Vereda vs Mestre)
   - [`.speckit/product/obsidian-note-spec.md`](../product/obsidian-note-spec.md) (formato canônico da nota)
   - [`.speckit/architecture/ide-integration.md`](../architecture/ide-integration.md) (duas superfícies, ponte pra IDE)
3. **A spec da fase escolhida** — copy-paste o conteúdo do arquivo M{N}

---

## Screen index

| Fase | Arquivo | Quantas telas | O que cobre |
|---|---|---|---|
| **M1** — chat hello-world Ollama | [`m05-screens-m1.md`](m05-screens-m1.md) | 4 screens + 2 states | empty state, active conversation Vereda, streaming, settings, workspace picker, connection-lost |
| **M2** — Mode Router + Note Builder | [`m05-screens-m2.md`](m05-screens-m2.md) | 1 modal + 1 aside + 4 components | mode toggle, mode confirm modal, mode transition, note preview right-aside, note written confirm, tool-call surface, inline diff |
| **M3** — Signature primitive + ergonomia | [`m05-screens-m3.md`](m05-screens-m3.md) | 2 surfaces + 1 interaction | session branch tree (signature), fork from message, command palette (Cmd+K) |

---

## App shell (aplica a todas as screens)

Layout grid global, herdado em todas as fases:

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER 56px — masthead inline                                        │
├────────────────┬─────────────────────────────────────────────────────┤
│                │                                                     │
│   SIDEBAR      │   MAIN                                              │
│   260px        │   1fr (grid takes the rest)                         │
│   var(--vein)  │   var(--bedrock)                                    │
│   fixed        │   scrollable vertical                               │
│                │                                                     │
│                │   ┌───────────────────────────────────────────────┐ │
│                │   │ composer (sticky bottom of main)              │ │
│                │   └───────────────────────────────────────────────┘ │
│                │   footer keyboard hints                             │
└────────────────┴─────────────────────────────────────────────────────┘
```

Quando `note preview` (M2) está ativa, grid muda pra `260 1fr 420`.
Quando `branch tree` (M3) está ativa, grid muda pra `260 80 1fr [420]`.

### Header (always-present)

- 56px height
- Bg `var(--bedrock)` (no border-bottom OR 1px hairline `var(--border-1)`)
- Layout: `[mark + italic wordmark "strata"] [inline masthead — workspace/vault/model] [switch label] [mode-badge]`
- Wordmark "strata" em italic Fraunces opsz 72 SOFT 60, fg-1, 17px
- Inline masthead usa `.masthead` style (UPPERCASE mono fg-3 + value mono fg-2 com ` —` divider)
- Mode badge: `.mode-badge` (sempre visível, color = current accent)

### Sidebar (always-present)

- 260px fixed width
- Bg `var(--vein)` (one tonal step up from bedrock)
- Sections separadas por section dividers `─── LABEL ───`
- M1 sections: WORKSPACE · CONVERSATIONS · VAULT
- Bottom: `[+ New]` button + `[⚙ Settings]` icon button
- Active conversation item: 2px left-rail in `var(--accent)` + bg `var(--hover)`

### Footer keyboard hints

- Linha sob composer com `+` corner marks
- Format: `+ ↵ send · ⇧↵ newline · vereda · explica, não edita +`
- Mono-sm fg-3, tracking-meta

---

## Interaction flows críticos

### Flow 1 — primeira sessão até primeira nota

```
[Empty state 1.1] → user types → [Active Vereda 1.2]
  → streaming (1.3) → reply with refs → user clicks Preview
  → [Note preview 2.4 slides in (M2)]
  → user reads + adjusts bloom → [Write to vault]
  → [Note written 2.5 confirmation]
  → preview closes, return to chat
```

### Flow 2 — mode toggle Vereda → Mestre

```
[Vereda] → user clicks mode badge (2.1)
  → [Confirm modal 2.2 — editorial pause]
  → user reads, confirms → modal fades
  → [Mode cross-fade 2.3 — accent blue→mustard, 240ms]
  → [Mestre active] (mesmo layout, accent mustard, badge "mestre", footer hint muda)
```

### Flow 3 — fork de branch

```
[Active conversation, msg 5] → user hovers msg 5 → fork action visible (3.2)
  → user clicks ⤴ OR pressiona Alt+F
  → [New branch 3.1 created from msg 5]
  → [Branch tree col slides in if first fork] OR [tree updates with new bar]
  → composer focused on new branch
  → editorial inline confirmation
```

---

## Anti-design (global — vale pra todas as fases)

### Visual / aesthetic
- ❌ Gradientes — nunca, nem sutis
- ❌ Drop shadows no dark mode
- ❌ Imagery em chrome (foto, ilustração, abstract shapes)
- ❌ Rounded pills, fully-round avatars
- ❌ Border > 1px (excepto bloom-rail e accent-bar que são solid blocks de 4px)
- ❌ Typography Title Case (sentence case sempre)
- ❌ Caps lock except em masthead labels e section dividers
- ❌ Mais de 6 type roles em uso

### Padrões UX a evitar
- ❌ ChatGPT-style: chat centralizado com input flutuante grande
- ❌ Cursor/IDE-style: dark chrome agressivo, syntax highlighting saturado
- ❌ SaaS dashboard: cards-grid, KPI tiles, metric counters
- ❌ Empty states com mascote / cartoon / SVG decorativo
- ❌ Notification toasts vermelhos/amarelos pulsantes
- ❌ Email capture, signup walls, paid-tier teasers
- ❌ Modais "🎉 Welcome! Take a tour"
- ❌ Onboarding multi-step
- ❌ "Achievement unlocked" / progress bars de gamification
- ❌ Spinners circulares (use 3 sediment dots — ver 1.3)
- ❌ Pulsing badges
- ❌ Auto-fade toasts >8s (irritante)

### Copy / tone
- ❌ Imperative ("Click here!", "Get started now!")
- ❌ Exclamation marks (banido)
- ❌ Cute apologetic ("Oops!", "Hmm…", "Looks like…")
- ❌ Marketing language ("powerful", "seamless", "intuitive")
- ❌ Emoji em product chrome (zero)
- ❌ Title Case em headings/buttons (use sentence case)

### Comportamento
- ❌ Mode mudando sem confirmation
- ❌ Strata escrevendo arquivo sem pedir (excepto `inbox/` em Vereda quando user clica Write)
- ❌ Provider fallback silente (sempre indicado no masthead)
- ❌ Persistir Mestre entre sessões (sempre reset pra Vereda)
- ❌ Telemetria sem opt-in
- ❌ Tracking de engagement / dwell time

---

## Bilingual policy

- **Português é primary.** Todos os product nouns que SÃO nomes (não traduções) ficam em PT mesmo na versão EN: `Vereda`, `Mestre`, `Mora`.
- **Inglês é parallel.** Toda copy tem versão EN equivalente, switchable.
- **Code, paths, file:line refs** sempre em mono, nunca traduzidos.

Cada screen spec inclui `## Copy strings` com PT (primary) e EN (parallel).

---

## Prompt template pra Claude Design

Use **um por fase** (mais focado que mandar tudo de uma vez).

### Template padrão

```
Strata Design System v2 was approved (this conversation has the kit attached).
Editorial register: Fraunces / Geist / Geist Mono, warm grounds, editorial-blue
Vereda accent, warm-mustard Mestre accent, saturated Bloom ramp, hyphen-prefixed
mastheads, frame+corner-marks, italic display Fraunces for moments.

Now build the SCREENS for {PHASE NAME} using this DS.

Reference materials (read these before starting):
- DS v2 zip (attached)
- Public repo: https://github.com/Mora-Org/strata
  · manifesto.md (philosophy — alma, pausa, layered understanding)
  · CONTEXT_DIRECTOR.md (§2 mentality, §4 hard rules)
  · .speckit/product/modes-spec.md (Vereda vs Mestre behavior)
  · .speckit/product/obsidian-note-spec.md (canonical note format)
  · .speckit/architecture/ide-integration.md (two surfaces, bridge to IDE)
  · .speckit/plans/m05-screen-spec.md (overview, app shell, anti-design)
  · .speckit/plans/m05-screens-{m1|m2|m3}.md ← THIS PHASE'S DETAILED SPEC

The detailed screen spec for THIS PHASE follows below. Build each screen
exactly as described — wireframe, elements, states, copy strings (use PT
primary, EN as data-attribute or alternate file). Keep all anti-design
rules from the global anti-design section.

[paste the entire content of m05-screens-{m1|m2|m3}.md here]

DELIVERABLE:
Expand the existing ui_kits/strata-desktop/ kit with the new screens.
Add a screens/ directory with each screen as its own .html (pure HTML/CSS
where possible, JSX components when interactivity needed). Each screen
imports app.css. Maintain consistency with the v2 ui_kits structure.

Also produce:
- Updated ui_kits/strata-desktop/index.html showing the active conversation
  for THIS phase (e.g., for M2: shows note preview aside open; for M3:
  shows branch tree col with 3 branches)
- Updated screenshot in scratch/ for the active conversation in this phase
```

### Sequência recomendada

1. **Conversa 1 — M1**: gera 6 screens base. ~30 min ida-e-volta.
2. **Conversa 2 — M2**: parte da kit M1, adiciona modal + aside + components. ~40 min.
3. **Conversa 3 — M3**: parte de M1+M2, adiciona signature primitive + palette. ~30 min.

Pode fazer tudo em uma só, mas output fica mais raso. Por fase é melhor.

---

## Process notes

### Backup do zip
**Faz cópia agora**: `~/Documents/strata-design-backups/v3-2026-05-04.zip`. O zip atual (`Strata Design System.zip` v3) está untracked na raiz do repo + ignorado por `.gitignore`. Se você apagar sem cópia, perdemos o trabalho.

### Quando voltar com screens novas
1. Manda nova zip `Strata Design System.zip` (overwrite local)
2. Eu inspeciono o que mudou
3. Quando aprovado: rodo M0.5.c (codificação única — 9 passos, todos os outputs)
4. Antes de M1 começar: `design/` codificada, fontes locais, ADR-0003 registrado, Director atualizado, commit + push

### O que NÃO commitar (já no .gitignore)
- `Strata Design System.zip` (qualquer variante)
- Pastas extraídas/temporárias do design
- `node_modules/`, `dist/`, `build/`, `.env*`, `*.log`
- `src-tauri/target/`
- `.vscode/`, `.idea/`
