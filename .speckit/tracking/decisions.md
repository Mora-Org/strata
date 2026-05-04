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
