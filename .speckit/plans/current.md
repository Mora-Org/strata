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

## Iteração: M1 — Scaffolding Tauri + Pi (ATIVA)
**Início:** 2026-05-17 (M1.a)
**Critério de fechamento:** chat hello-world Ollama rodando em janela Tauri com layout 1.2 (active conversation Vereda) reconhecível.

### Sub-passes

#### M1.a — Foundation scaffolding ✅ FECHADA 2026-05-17
- [x] `package.json` (name=strata, MIT, type=module, scripts dev/build/test/test:run/test:ui)
- [x] `npm install` — 248 packages, 0 vulnerabilidades, em ~14s
- [x] Vite 7 + React 19 + TypeScript 5 strict
- [x] Tailwind v3.4 + PostCSS + Autoprefixer
- [x] Vitest 3 + Testing Library (React + jest-dom + user-event) + jsdom
- [x] `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json` (strict, project references)
- [x] `vite.config.ts` com Vitest test config
- [x] `tailwind.config.js` + `postcss.config.js`
- [x] `index.html` na raiz com `data-theme="dark"` `data-mode="vereda"`
- [x] `src/main.tsx` + `src/App.tsx` placeholder (mostra "Strata · M1.a")
- [x] `src/index.css` (entry CSS — importa tokens + Tailwind directives)
- [x] **Token bridge:** `src/styles/tokens.css` faz `@import '../../design/colors_and_type.css'` — single source of truth
- [x] `src/vite-env.d.ts` (Vite ambient types)
- [x] `src/setupTests.ts` (jest-dom matchers)
- [x] 3 test suites, **16/16 testes passando:**
  - `App.test.tsx` (3) — heading, marker M1.a, landmark
  - `__tests__/tokens.test.ts` (7) — bridge existe, design tokens canônicos presentes
  - `__tests__/fonts.test.ts` (6) — 4 variable fonts + 2 OFL no design/assets/fonts/
- [x] Build smoke: `npm run build` → ✓ built in 1.19s, 0 warnings
- [x] `DEV.md` na raiz (instruções dev pra contributors)
- [x] **Fix bonus:** renomeados 2 fontes Fraunces de `Fraunces[SOFT,WONK,opsz,wght].ttf` → `Fraunces-VariableFont.ttf` (e idem pra italic). Razão: chars `[ ] ,` no filename quebravam o bundling Vite. Atualizado `design/colors_and_type.css` @font-face urls + test paths. Build passou bundlando todas 4 fontes (Fraunces 357KB + 407KB ttf, Geist 70KB + 71KB woff2).

#### M1.b — Tauri 2 init + fork Pi + Ollama client wrapper (próximo)
- `tauri init` (v2) — requer MSVC no Windows
- Fork manual do Pi pra `src/lib/pi/`
- Ollama client wrapper com fetch mockado em testes
- Tests: Pi session criada com mock, Ollama client com fetch mockado, types/contracts validados
- Ainda não precisa de Ollama rodando (mocks)

#### M1.c — UI shell (Header + Sidebar + Composer + Footer)
- Reimplementação React dos JSX de `design/ui_kits/strata-desktop/`
- Snapshot tests contra HTML do `design/`
- Playwright setup
- Zustand entra aqui (estado de modo, workspace, conversation)

#### M1.d — Wire chat hello-world (requer Ollama rodando)
- Composer → Pi session → Ollama → render
- Streaming dots, connection-lost banner
- e2e Playwright smoke

#### M1.e — Settings + workspace picker
- Persistence via Tauri store
- File dialog wireup

#### M1.f — Polish + acceptance
- Todas 6 telas M1 reagindo
- TestSprite scenarios escritos
- M1 fecha aqui
