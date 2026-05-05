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
