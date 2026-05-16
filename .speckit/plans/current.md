---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# Plano Atual

## Iteração: M0 — Fundação documental
**Início:** 2026-05-04
**Critério de fechamento:** Cesar aprova `CONTEXT_DIRECTOR.md` e `.speckit/` como base estável.

### Entregas — M0
- [x] `CONTEXT_DIRECTOR.md` na raiz (criado por Claude)
- [x] `.speckit/` com product/, architecture/, plans/, tracking/ (criado por Claude)
- [x] Template reutilizável em `C:/Users/cesar/Documents/GitHub/speckit-template/` (criado por Claude)
- [x] `git init` no repo Strata
- [x] `architecture/pi-anatomy.md` — mapa das abstrações herdadas do Pi
- [x] `architecture/ide-integration.md` — duas superfícies, workspace awareness
- [x] ADR-0002 — Strata é app standalone, não extensão do Pi
- [x] `product/modes-spec.md` atualizado: "ponte pra IDE" + restrição de prompt ≤2K
- [x] `product/vision.md` atualizado: posicionamento "IDE companion" explícito
- [x] CONTEXT_DIRECTOR §3: linha de "Superfícies CLI + GUI" adicionada
- [x] Commit `M0: fundação documental` em `7253929`
- [x] Repo público criado: `Mora-Org/strata` + push

### M0 closed: 2026-05-04

---

## Iteração: M0.5 — Visual Foundation
**Início:** 2026-05-04
**Critério de fechamento:** DS v2 + screens via Claude Design codificados no repo, fontes versionadas localmente.

### Sub-fases

#### M0.5.a — Design System v2 ✅ APROVADO (2026-05-04)
- Editorial register definido (zine/poster, não OS chrome)
- Fraunces / Geist / Geist Mono
- Warm grounds, editorial-blue Vereda, warm-mustard Mestre, saturated Bloom
- Primitivos editoriais: masthead, frame.marks, italic-display, bloom-rail, hyphen-cols, pullquote, accent-bar
- Artefato: `Strata Design System.zip` v3 (untracked na raiz)

#### M0.5.b — Screens via Claude Design ✅ M1+M2 ENTREGUES (M3 pendente quota)
- Spec dividida em 4 arquivos:
  - [`m05-screen-spec.md`](m05-screen-spec.md) — índice + app shell + flows + anti-design + prompt template
  - [`m05-screens-m1.md`](m05-screens-m1.md) — 6 screens M1 (✅ entregues 2026-05-05)
  - [`m05-screens-m2.md`](m05-screens-m2.md) — 7 surfaces M2 (✅ entregues 2026-05-05)
  - [`m05-screens-m3.md`](m05-screens-m3.md) — 3 surfaces M3 (⏸️ quota acabou — vira M0.5.d)
- 12 screens entregues + 12 review cards em `design/preview/`

#### M0.5.c — Codificação parcial (M1+M2 + DS) ✅ FECHADA 2026-05-05
9 passos executados:
- [x] Criada pasta `design/` no repo com conteúdo completo do handoff Claude Design
- [x] 4 fontes variable em `design/assets/fonts/` (Fraunces ttf + italic, GeistVF, GeistMonoVF) + 2 OFL.txt
- [x] 12 screens em `design/ui_kits/strata-desktop/screens/` (M1: empty, active, streaming, settings, workspace, connection-lost; M2: mode-confirm v→m, mode-confirm m→v, with-note-preview, with-tool-call, with-diff, mestre)
- [x] 12 review cards em `design/preview/`
- [x] `colors_and_type.css` canônico em `design/` (referenciado no kit via `@import`)
- [x] `.speckit/product/design-system.md` criado — spec enxuto canônico (~250 linhas)
- [x] `ADR-0003 — Editorial register chosen as Strata's visual language` (status: ativo)
- [x] `CONTEXT_DIRECTOR.md §3` atualizado com linha "Design System" travada na stack
- [x] `CLAUDE.md` atualizado: linha "Antes de escrever UI/CSS" + Stack inclui Design system + Arquitetura mostra `design/`
- [x] `README.md` Stack table atualizado com row "Design system"
- [x] `decisions.md`, `patch-notes.md`, `current.md`, `backlog.md` atualizados

#### M0.5.d — Screens M3 ✅ ENTREGUES 2026-05-16
- 6 screens novos via Claude Design (mesma conversa do M1+M2):
  - `branch-tree-2-branches.html` + `branch-tree-4-branches.html` — **signature primitive** (sediment columns por Bloom ramp, NÃO git-graph)
  - `conversation-with-fork-hover.html` — fork interaction (hover `⤴ ⌥+F`)
  - `command-palette-default.html` + `command-palette-filtered.html` + `command-palette-no-match.html` — Cmd+K overlay editorial
- 3 novos preview cards: `screen-branch-tree.html`, `screen-fork-interaction.html`, `screen-command-palette.html`
- Novo screenshot canonical: `desktop-branched.png` (canonical surface com branch tree column ativa, 4 branches)
- Bonus: `index-branched.html` mostrando canonical surface branched separado

#### M0.5.e — Codificação M3 ✅ FECHADA 2026-05-16
- Backup: `~/Documents/strata-design-backups/handoff-m3-2026-05-16.zip` (1.87 MB)
- Adicionados ao `design/` sem sobrescrever M1+M2:
  - 6 screens em `design/ui_kits/strata-desktop/screens/`
  - 3 preview cards em `design/preview/`
  - `desktop-branched.png` em `design/assets/` E nova pasta `design/scratch/`
  - `design/ui_kits/strata-desktop/index-branched.html`
- Files atualizados pelo Claude Design: `design/README.md`, `design/ui_kits/strata-desktop/README.md`, `design/ui_kits/strata-desktop/app.css` (novos estilos branch tree + palette), `design/preview/_screen-card.css`
- **Total: 18 screens** (M1: 6 + M2: 6 + M3: 6) + 15 preview cards
- Specs atualizadas: `design-system.md` (Pendente → Completo), `CONTEXT_DIRECTOR §3` (12 → 18 screens), `CLAUDE.md` (idem)

### M0.5 closed: 2026-05-16 — visual foundation completa ✅

---

## Próxima iteração: M1 — Scaffolding Tauri + Pi (ATIVA)
**Início estimado:** quando você der "vai"
**Critério de fechamento:** chat hello-world Ollama rodando em janela Tauri com layout 1.2 (active conversation Vereda) reconhecível.

### Entregas previstas
- `npm init`, Vite + React 19 + TS + Tailwind v3
- `tauri init` (v2)
- Fork manual do Pi pra `src/lib/pi/`
- Token bridge: importa `design/colors_and_type.css` como single source of truth → gera Tailwind config a partir dele (não duplicar tokens)
- @font-face apontando pra `design/assets/fonts/` (mesma estratégia do kit)
- **Reimplementa as M1-screens** do kit `design/ui_kits/strata-desktop/screens/` em React/TS real (kit é referência, não runtime)
- "Hello world" no chat: usuário digita, Ollama responde, masthead com workspace/vault/model
- Sem Mode Router funcional ainda (Vereda só visualmente — bloqueio efetivo de tools vem em M2)
- Sem nota gerada ainda (vem em M2)
