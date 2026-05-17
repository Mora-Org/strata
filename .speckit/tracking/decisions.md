# Decisões Macro

Log cronológico. Decisões com impacto arquitetural geram ADR (`.speckit/architecture/adr/`); este arquivo aponta pra elas.

## 2026-05-04
- **Adotada estrutura Director + speckit + CLAUDE.md em 3 camadas.** Manifesto = por quê, Director = como, speckit = o quê. Razão: separar imutável (filosofia) de raramente-mutável (regras) de vivo (specs/planos).
- **ADR-0001:** Forkar Pi. Ver `architecture/adr/ADR-0001-fork-pi-vs-from-scratch.md`.
- **ADR-0002:** Strata é app standalone (fork/upgrade do Pi), não extensão. Ver `architecture/adr/ADR-0002-strata-as-fork-app-not-extension.md`.
- **Posicionamento "IDE companion" explícito.** Strata roda ao lado da IDE (janela ou terminal), não dentro. IDE é fonte da verdade do código; Strata mexe nas anotações e aponta pro código. Detalhe em `architecture/ide-integration.md`.
- **Influência registrada:** `Czar210/claude-code-local` informa restrição de prompt size (≤2K tokens em Vereda) e necessidade de camada de tolerância pra tool-use em modelo local 7B.
- **M0.5 dividida em 3 sub-fases (a/b/c).** M0.5.a = DS via Claude Design (aprovado v2, editorial register). M0.5.b = screens via Claude Design (spec em `plans/m05-screen-spec.md`). M0.5.c = codificação única no repo. Razão: evitar 2 commits parciais — codifica tudo num pass quando voltar com screens.
- **DS v2 — registro editorial confirmado** (não desaturado v1). Fraunces variable + Geist + Geist Mono, warm grounds, editorial-blue Vereda, warm-mustard Mestre, saturated Bloom ramp. Influências: posters editoriais ("retro", "MONDAY", "SOLITARY", "Yellow Grass", "Drink Well", "Rest in Peace", "Brutalism"). ADR-0003 será criado em M0.5.c registrando a escolha.

## 2026-05-05
- **Brave Search aprovado pra M4** como tool opt-in (`web.search` ou `brave.search`). Configurada via `~/.strata/auth/brave.json`; sem key não registra (sem fallback silente, mantém regra dura §4 do Director). Razão: citação primária verificável > citação alucinada do modelo. Compatível com manifesto §VII (vault como evidência defensável). ADR de implementação específica virá em M4 (provavelmente ADR-0005).
- **Email/inbox OUT do escopo Strata.** Quando virar prioridade, é novo produto Mora separado (não extensão do Strata). Razão: cada produto Mora com identidade forte > produto canivete-suíço; vault Obsidian é território de markdown+código + IDE companion, não inbox. Adicionado ao parking lot do backlog como referência futura.
- **Linha extensível vs travado confirmada como princípio arquitetural.** Strata herda extensibilidade do Pi (tools customizadas, providers, comandos slash, themes, skills, models.json) MAS regras duras §4 (Vereda default, Mestre não persiste, vault inbox-only, sem fallback silente, frontmatter canônico, telemetria opt-in, mode = accent shift never layout shift) são travadas — não user-configurable. Mudança requer ADR. Detalhe em `architecture/adr/ADR-0004-customization-scope-extensible-vs-locked.md` (status: draft, vai pra ativo em M4).

## 2026-05-05 (continued)
- **M2 screens aprovados** — 6 surfaces entregues na mesma conversa Claude Design (mode-confirm Vereda↔Mestre, note preview aside, tool-call surface, inline diff, active-conversation Mestre como prova da regra "no layout change between modes"). Quota da semana acabou — M3 (branch tree signature + palette + fork) fica pra próxima semana (M0.5.d).
- **M0.5.c codificada** — DS v2 + M1+M2 screens + 4 fontes variable (Fraunces upright+italic, GeistVF, GeistMonoVF) + 2 OFL.txt commitados em `design/`. ADR-0003 promovido a `status: ativo` registrando a escolha do registro editorial (rationale: 3 DS reusáveis avaliados, todos rejeitados; 7 referências de posters editoriais alimentaram a iteração 2 que foi aprovada).
- **CONTEXT_DIRECTOR.md §3** ganhou row "Design System" travada na stack. CLAUDE.md ganhou linha "Antes de escrever UI/CSS" + Arquitetura agora mostra `design/`. README.md Stack table inclui Design system pública.
- **`.speckit/product/design-system.md`** criado como spec canônico enxuto (~250 linhas) — contrato entre speckit e `design/`. Em conflito, esta spec ganha; `design/` precisa ser atualizado em iteração separada.

## 2026-05-16
- **M3 entregue (M0.5.d) ✅** — 6 screens via Claude Design na mesma conversa do M1+M2 (quota resetou após 11 dias de pausa). Surfaces: branch tree signature primitive (2-branches e 4-branches), conversation-with-fork-hover, command palette em 3 estados (default / filtered / no-match). Plus 3 preview cards + canonical screenshot `desktop-branched.png` + bonus `index-branched.html`.
- **Validação visual:** branch tree fiel à metáfora geológica do manifesto §III — sediment columns coloridas pela Bloom ramp (--bloom-1…6), active branch com indicador ▶, junction marks 1px hairline entre fork-point e child, footer com `· click · ⌥+F`. **NÃO** usou git-graph (círculos+linhas) — manteve a identidade visual signature.
- **M0.5.e codificada ✅** — 6 screens + 3 preview cards + canonical png + index-branched.html + pasta `design/scratch/` adicionados ao `design/` sem sobrescrever M1+M2. Files do Claude Design atualizados: README.md (root + kit), app.css (novos estilos), _screen-card.css. Total: **18 screens** + 15 preview cards + 3 canonical screenshots.
- **Specs atualizadas:** design-system.md (Pendente → M0.5 completa), CONTEXT_DIRECTOR §3 (12 → 18 screens), CLAUDE.md (idem). **M0.5 inteira fechada 2026-05-16** — visual foundation completa.
- **Próxima iteração: M1 dev** — primeiro código de produção. Scaffolding Tauri 2 + Vite + React 19 + TS + Tailwind v3 + fork Pi + token bridge importando `design/colors_and_type.css` como single source of truth + @font-face local pras 4 fontes variable. Reimplementação dos 18 screens em React real.

## 2026-05-17 (M1.a fechada)
- **M1.a — Foundation scaffolding completa.** Vite 7 + React 19 + TS strict + Tailwind v3 + Vitest 3 + Testing Library. 248 packages, 16/16 testes, build smoke 0 warnings. Token bridge ativo. Primeiro código de produção do Strata commitado.
- **Decisão operacional:** fontes Fraunces renomeadas no `design/assets/fonts/` pra remover chars URL-unsafe (`[`, `]`, `,`) que quebravam o asset bundling do Vite. Nomes novos: `Fraunces-VariableFont.ttf` + `Fraunces-Italic-VariableFont.ttf`. Implicação pra futuros handoffs Claude Design: se chegar com nomes antigos, re-renomear na codificação. Custo baixo (2 arquivos), benefício alto (build limpo, sem hacks de path encoding).
- **Pendência conhecida:** próximos handoffs Claude Design provavelmente trarão fontes com nomes Google-Fonts-default (`Fraunces[SOFT,WONK,opsz,wght].ttf`). Workflow de codificação precisa contemplar rename como step. Documentar em playbook futuro (M0.5.f? ou check-list em DEV.md).

## 2026-05-17 (M1.b fechada)
- **M1.b — Tauri 2 init + Pi wrapper + Ollama client completa.** 40/40 testes passando (era 16). Build smoke 0 warnings. Pi e Ollama integrados com mocks em todos os testes (sem dependência de Ollama rodando nem Pi inicializado real).
- **Decisão arquitetural: Pi entra como `npm dep`, NÃO fork local em M1.b.** Revisita ADR-0001 sem invalidar: ADR-0001 decidiu "forkar vs from-scratch", recomendando fork porque Mode Router precisa interceptar tool-calls. Em M1.b, ainda não temos Mode Router (vem em M2). Decisão pragmática: `@mariozechner/pi-coding-agent@0.73.1` como dep, wrapper em `src/lib/pi/` re-exporta API + `createStrataSession` helper. **Quando M2 chegar e Mode Router precisar do hook de interceptar, reavaliamos:** se Pi expor extension API suficiente, continua como dep; se não, forka pra `src/lib/pi/forked/`. Custo de mudar agora vs depois é equivalente.
- **Tauri config Mora-flavored:** identifier `org.mora.strata` (em vez do placeholder `com.tauri.dev`), window baseline 1280×800 (alinha com DS screens), minWidth 960. Cargo lib name `strata_lib` (em vez de `app_lib`).
- **Estrutura `src/lib/` estabelecida:** `pi/` (wrapper), `ollama/` (HTTP client), `types/` (shared contracts). Padrão de organização que vai escalar pra `mode/` (M2), `obsidian/` (M2), `vault/` (M2), `tools/` (M4).
- **Test coverage discipline mantida.** Sub-pass acrescentou 24 testes (60% growth). Cesar requested "testes bons e numerosos" — 40 testes pra 8 arquivos de código = razão saudável.
