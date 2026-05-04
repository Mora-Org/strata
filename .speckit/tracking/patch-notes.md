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
