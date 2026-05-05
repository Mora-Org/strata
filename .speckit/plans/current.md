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

#### M0.5.d — Screens M3 (signature + palette) ⏸️ AGUARDA QUOTA CLAUDE DESIGN
- 3 surfaces pendentes: branch tree (signature primitive), fork-from-message, command palette (Cmd+K)
- Spec já pronta em [`m05-screens-m3.md`](m05-screens-m3.md)
- Quando quota voltar: nova conversa Claude Design (mesma estratégia M1/M2), output adicionado ao `design/` existente
- Codificação será iteração pequena (M0.5.e) ou direto na M0.5.d

## Próxima iteração (preview)

**M1 — Scaffolding Tauri + Pi** (começa só após M0.5 fechar)
- `npm init`, Vite + React 19 + TS + Tailwind v3
- `tauri init` (v2)
- Fork manual do Pi pra `src/lib/pi/`
- Token bridge: importa `design/colors_and_type.css` como single source of truth → gera Tailwind config a partir dele (não duplicar)
- **Reimplementa as M1-screens** do kit Claude Design em React/TS real (kit é referência, não runtime)
- "Hello world" no chat: usuário digita, Ollama responde, masthead com workspace/vault/model
- Sem Mode Router funcional (Vereda só visualmente)
- Sem nota gerada ainda (vem em M2)
