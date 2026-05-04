---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# Plano Atual

## Iteração: M0 — Fundação documental
**Início:** 2026-05-04
**Critério de fechamento:** Cesar aprova `CONTEXT_DIRECTOR.md` e `.speckit/` como base estável.

### Entregas
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
- [ ] Cesar revisa e edita "por quês" inferidos no Director §3
- [ ] Cesar valida regras duras §4 e princípios §2
- [ ] Primeiro commit: `"M0: fundação documental"`

## Próxima iteração (preview)

**M1 — Scaffolding Tauri + Pi**
- `npm init`, `tauri init`
- Fork manual do Pi pra `src/lib/pi/`
- "Hello world" no chat: usuário digita, Ollama responde, sem modo ainda
- Sem nota gerada ainda (vem em M2)
