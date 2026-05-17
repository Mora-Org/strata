# Patch Notes

Mudanças com impacto observável. Granularidade: alguém externo deveria conseguir entender o que mudou só lendo aqui.

## 2026-05-04 — fundação documental
- Criado `CONTEXT_DIRECTOR.md`
- Criado `.speckit/` com estrutura inicial (product, architecture, plans, tracking)
- ADR-0001 registrado: forkar Pi
- `git init` no repo
- Sem código ainda — só base documental

## 2026-05-04 (tarde) — clarificações arquiteturais
- ADR-0002: Strata é app standalone (fork/upgrade do Pi), não extensão
- `architecture/pi-anatomy.md`: mapa de abstrações do Pi que tocamos (`createAgentSession`, `SessionManager`, `ModelRegistry`, `registerTool`, agent loop, JSONL format)
- `architecture/ide-integration.md`: duas superfícies (terminal + janela), workspace awareness (abordagem A pra M1, B pra M5+), restrições herdadas de modelo local
- `product/modes-spec.md`: Vereda termina com "ponte pra IDE"; restrição de prompt ≤2K tokens (lição do `claude-code-local`)
- `product/vision.md`: posicionamento "IDE companion" explícito
- CONTEXT_DIRECTOR §3: linha de superfícies CLI + GUI adicionada

## 2026-05-04 (noite) — M0 fechada + design system aprovado
- M0 commitada (`7253929: M0: fundação documental`) e pushada pra `Mora-Org/strata` (público)
- Design System v2 aprovado via Claude Design — registro editorial (Fraunces / Geist / Geist Mono, warm grounds, editorial-blue Vereda, warm-mustard Mestre, saturated Bloom)
- Spec de screens criada em `plans/m05-screen-spec.md` — input pra segunda passada do Claude Design (M0.5.b)
- M0.5 dividida em a/b/c (DS / screens / codificação única) — `plans/current.md` atualizada
- Backlog reorganizado: M0.5.b → M0.5.c → M1 (que agora reimplementa screens em React/TS real, kit é só referência)
- Codificação no repo (DS + screens + fontes locais + ADR-0003) **adiada pra após M0.5.b retornar** — pass único

## 2026-05-04 (noite, late) — screen specs detalhados + .gitignore
- Spec de screens **dividida em 4 arquivos** pra digerir melhor no Claude Design:
  - `plans/m05-screen-spec.md` reescrita como índice + app shell + flows + anti-design + prompt template
  - `plans/m05-screens-m1.md` (NOVO) — 6 screens detalhadas com wireframes ASCII, states, copy PT+EN, anti-patterns
  - `plans/m05-screens-m2.md` (NOVO) — 7 surfaces detalhadas (mode flow + note preview + tool-call + diff)
  - `plans/m05-screens-m3.md` (NOVO) — branch tree signature primitive + fork interaction + command palette
- `.gitignore` criado: bloqueia `Strata Design System.zip` (todas variantes), preempts node_modules/dist/build/.env/Tauri target
- Cada spec tem: wireframe ASCII, elementos top-to-bottom com DS primitives, interactive elements, todos os states, copy strings PT+EN, anti-patterns específicos, justificativa

## 2026-05-05 — decisões de escopo (Brave Search M4 + email out + customization scope)
- **Brave Search aprovado pra M4** como tool opt-in (`web.search` / `brave.search`); requer API key em `~/.strata/auth/brave.json`; tool não registra sem key (sem fallback silente)
- **Email/inbox declarado OUT do escopo Strata**; será produto Mora separado quando virar prioridade. Adicionado ao parking lot do backlog como referência
- **ADR-0004 (draft)** criado — `Customization scope: extensible surfaces vs locked product rules` — formaliza a linha contratual entre o que usuário pode mudar (tools, providers, comandos, themes, skills, models.json, paths) e o que é regra dura travada (Vereda default, Mestre não persiste, vault inbox-only, sem fallback silente, frontmatter canônico, telemetria opt-in, mode = accent shift). Promove pra `ativo` em M4.
- `backlog.md` reorganizado: M4 vira "Tools opt-in + frontmatter rich" (web search Brave + vault reader + frontmatter completo + customization guide + Mode Router validation de tools customizadas)
- `decisions.md` acrescenta entrada 2026-05-05 com as 3 decisões

## 2026-05-05 (final, M0.5.c) — DS + M1+M2 codificados no repo
- **`design/` criada no repo** com DS v2 completo (extraído do Strata-handoff M1+M2):
  - `design/colors_and_type.css` — tokens canônicos (oklch, type families, primitives)
  - `design/README.md` — guia visual completo (skill manifest)
  - `design/SKILL.md` — Claude Code skill manifest pra reutilizar DS em outros projetos
  - `design/assets/fonts/` — 4 fontes variable: `Fraunces[SOFT,WONK,opsz,wght].ttf` + italic variant + `GeistVF.woff2` + `GeistMonoVF.woff2` + 2 OFL.txt
  - `design/preview/` — 12 review cards (formato editorial spread)
  - `design/ui_kits/strata-desktop/` — kit interativo (HTML/CSS/JSX) + 12 screens em `screens/` (M1: 6 + M2: 6)
- **`.speckit/product/design-system.md`** (NOVO) — spec canônico enxuto, ~250 linhas, contrato entre speckit e `design/`
- **ADR-0003** (status: ativo) — `Editorial register chosen as Strata's visual language`. Documenta 3 DS rejeitados (Atlas/Glyph/Metis), 7 posters de referência, escolhas finais de fonte/cor/primitivos, mitigações e relação com ADRs anteriores
- **CONTEXT_DIRECTOR.md §3** — row "Design System" adicionada à stack travada; §5 mapa atualizado com `design/` e `.gitignore`
- **CLAUDE.md** — adicionada linha "Antes de escrever UI/CSS"; Stack inclui Design system row; Arquitetura tree atualizada com `design/`
- **README.md** — Stack table tem row "Design system"
- **plans/current.md** — M0.5.b marcada ✅ (M1+M2); M0.5.c marcada ✅ FECHADA com 9 entregas detalhadas; M0.5.d criada (M3 pendente quota Claude Design)
- **plans/backlog.md** — reordenada: M0.5.b/c marcadas done; M0.5.d adicionada antes de M0.5.e (codificação M3); M5 ganha bullet sobre a11y audit
- M3 screens (branch tree signature + palette + fork) ficam pra **M0.5.d** quando quota Claude Design voltar (próxima semana)

## 2026-05-16 (M0.5.d + M0.5.e) — M3 entregue e codificada · M0.5 fechada
- **Backup salvo:** `~/Documents/strata-design-backups/handoff-m3-2026-05-16.zip` (1.87 MB)
- **6 novos screens em `design/ui_kits/strata-desktop/screens/`:**
  - `branch-tree-2-branches.html` + `branch-tree-4-branches.html` (signature primitive — sediment columns, NÃO git-graph)
  - `conversation-with-fork-hover.html` (interaction `⤴ ⌥+F`)
  - `command-palette-default.html` + `command-palette-filtered.html` + `command-palette-no-match.html` (Cmd+K overlay editorial)
- **3 novos preview cards em `design/preview/`:** `screen-branch-tree.html`, `screen-fork-interaction.html`, `screen-command-palette.html`
- **Novo canonical screenshot:** `desktop-branched.png` em `design/assets/` E `design/scratch/` (pasta scratch/ criada)
- **Bonus:** `design/ui_kits/strata-desktop/index-branched.html` (canonical surface com branch tree column ativa, separado do index.html original)
- **Files atualizados pelo Claude Design:** `design/README.md` (lista M3), `design/ui_kits/strata-desktop/README.md`, `design/ui_kits/strata-desktop/app.css` (novos estilos branch tree + palette), `design/preview/_screen-card.css`
- **Specs atualizadas:**
  - `.speckit/product/design-system.md`: "Pendente (M0.5.d)" → "M0.5 completa" com tabela das 18 screens; line de screen count "12 arquivos M1+M2" → "18 arquivos M1+M2+M3"
  - `CONTEXT_DIRECTOR.md §3` row Design System: "12 screens M1+M2" → "18 screens M1+M2+M3 (M0.5 completa 2026-05-16)"
  - `CLAUDE.md`: Stack row + "Antes de escrever UI/CSS" — ambos atualizados pra 18 screens
  - `plans/current.md`: M0.5.d ✅ + M0.5.e ✅ + M0.5 closed 2026-05-16; M1 dev passa a ser "Próxima iteração ATIVA" (não "preview")
  - `plans/backlog.md`: M0.5.d/e marcadas done; M1 promovida pra próxima ativa
- **Total: 18 screens** (M1: 6 + M2: 6 + M3: 6) + 15 preview cards + 3 canonical screenshots
- **M0.5 inteira fechada** — próximo movimento é **M1 dev** (primeiro código de produção)

## 2026-05-17 (M1.a) — Foundation scaffolding ✅ primeiro código de produção
- **Sub-pass M1.a fechada** — Vite + React 19 + TS strict + Tailwind v3 + Vitest pronto
- `package.json` na raiz: name=strata, MIT, type=module, scripts dev/build/test/test:run/test:ui
- `npm install` instalou 248 packages, 0 vulnerabilidades, em 14s
- Configs criadas: `tsconfig.json` (project references) + `tsconfig.app.json` (strict) + `tsconfig.node.json`, `vite.config.ts` (com test config Vitest), `tailwind.config.js`, `postcss.config.js`
- `index.html` na raiz com `data-theme="dark"` `data-mode="vereda"` (defaults conforme Director §4)
- `src/` estrutura inicial:
  - `main.tsx` (StrictMode + createRoot)
  - `App.tsx` placeholder ("Strata · M1.a")
  - `index.css` (entry — importa tokens + Tailwind directives)
  - `styles/tokens.css` ← **token bridge** (@import '../../design/colors_and_type.css')
  - `vite-env.d.ts` (Vite ambient types pra .css imports)
  - `setupTests.ts` (jest-dom matchers)
- **Token bridge funciona** — design/colors_and_type.css é single source of truth; mudanças lá refletem em src/ automaticamente
- **Tests: 16/16 passando** (3 suites: App, tokens, fonts)
- **Build smoke OK** — `npm run build` → ✓ built in 1.19s, 0 warnings, bundle 193 KB JS + 17 KB CSS + 4 fontes
- `DEV.md` criado na raiz (setup pra contributors)
- **Fix bonus:** renomeados Fraunces fonts no design/assets/fonts/ pra remover chars `[ ] ,` que quebravam Vite asset bundling:
  - `Fraunces[SOFT,WONK,opsz,wght].ttf` → `Fraunces-VariableFont.ttf`
  - `Fraunces-Italic[SOFT,WONK,opsz,wght].ttf` → `Fraunces-Italic-VariableFont.ttf`
  - Atualizado `design/colors_and_type.css` @font-face urls + `src/__tests__/fonts.test.ts` paths
  - Build agora bundla todas 4 fontes corretamente
- Próximo: M1.b — Tauri 2 init + fork Pi + Ollama client wrapper
