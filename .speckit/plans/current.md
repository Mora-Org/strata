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

#### M0.5.b — Screens via Claude Design 🟡 EM ANDAMENTO
- Spec dividida em **4 arquivos** pra Claude Design digerir por fase:
  - [`m05-screen-spec.md`](m05-screen-spec.md) — índice + app shell + flows + anti-design global + prompt template
  - [`m05-screens-m1.md`](m05-screens-m1.md) — 4 screens + 2 states (empty, active Vereda, streaming, settings, workspace picker, connection-lost)
  - [`m05-screens-m2.md`](m05-screens-m2.md) — 1 modal + 1 aside + 4 components (mode toggle/confirm/transition, note preview, note written, tool-call, inline diff)
  - [`m05-screens-m3.md`](m05-screens-m3.md) — 2 surfaces + 1 interaction (branch tree signature, fork-from-msg, command palette)
- `.gitignore` criado bloqueando zips e artefatos de design
- Cesar leva DS v2 + UMA fase por conversa Claude Design (recomendado: M1 → M2 → M3 sequencial)
- Output esperado: kit expandido com novos screens, screenshot atualizado

#### M0.5.c — Codificação única (após retorno) ⏸️ AGUARDA
9 passos consolidados (DS + screens em pass único):
- [ ] Cria `design/` no repo, copia zip v3 + screens novos
- [ ] Extrai `Fraunces.zip` e `geist-font-1.8.0.zip` pra `design/fonts/`
- [ ] Cria `.speckit/product/design-system.md` (canônico enxuto)
- [ ] Cria `ADR-0003 — Editorial register chosen as Strata's visual language`
- [ ] Atualiza `CONTEXT_DIRECTOR.md §3` com Design System travado
- [ ] Atualiza `decisions.md` + `patch-notes.md`
- [ ] Atualiza `plans/current.md` (M0.5 fecha)
- [ ] Commit `M0.5: design system v2 + screens — editorial register`
- [ ] Push pro `Mora-Org/strata`

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
