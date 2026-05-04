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
