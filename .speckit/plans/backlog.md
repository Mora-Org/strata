---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# Backlog Priorizado

Ordem reflete prioridade. Itens sem ordem ainda ficam em "Não-priorizado".

## Próximas iterações

1. ~~**M0.5.b**~~ ✅ M1+M2 entregues 2026-05-05; M3 entregue 2026-05-16 — todas 18 screens design completas
2. ~~**M0.5.c**~~ ✅ Codificação M1+M2 + DS no repo — fechada 2026-05-05
3. ~~**M0.5.d**~~ ✅ Screens M3 entregues (branch tree signature + fork-from-msg + Cmd+K palette) — 2026-05-16
4. ~~**M0.5.e**~~ ✅ Codificação M3 (adicionada ao `design/` existente sem sobrescrever) — fechada 2026-05-16
5. **M1** ← **ATIVA** — Scaffolding Tauri + fork Pi + reimplementação dos 18 screens em React/TS real + chat hello-world Ollama. Sub-passes:
   - ~~**M1.a**~~ ✅ Foundation (Vite + React 19 + TS + Tailwind v3 + Vitest + token bridge + 16/16 testes) — 2026-05-17
   - **M1.b** ← próxima — Tauri 2 init + fork Pi pra src/lib/pi/ + Ollama client wrapper (com mocks)
   - **M1.c** — UI shell (Header + Sidebar + Composer) + Zustand + Playwright + snapshot tests vs design/
   - **M1.d** — wire chat hello-world (requer Ollama rodando)
   - **M1.e** — settings + workspace picker + Tauri store persistence
   - **M1.f** — polish + TestSprite scenarios + M1 fecha
6. **M2** — Mode Router (Vereda/Mestre) + bloqueio de tools de escrita em Vereda + Note Builder + Vault Writer
7. **M3** — Session branch tree (signature primitive) + Command palette (Cmd+K) + fork-from-message — implementação React/Tauri sobre os screens já desenhados em M0.5.d
8. **M4** — **Tools opt-in + frontmatter rich** (extensibility wave). Inclui:
   - Web search via Brave (`web.search` tool, opt-in com API key em `~/.strata/auth/brave.json`)
   - Vault reader (`vault.read` tool pra preencher `relacionados` no frontmatter)
   - Frontmatter completo (bloom auto-estimation, refs com URL real do search)
   - Pattern de tool customization documentado (`.speckit/product/customization-guide.md`) — primeiro exemplo concreto de [ADR-0004](../architecture/adr/ADR-0004-customization-scope-extensible-vs-locked.md)
   - Mode Router validation: bloqueia tool customizada de escrita em Vereda
9. **M5** — Refinamentos de UX, atalhos de teclado, settings completo, a11y audit (target WCAG AA mínimo)

## Não-priorizado (parking lot)

- Histórico de sessões
- Múltiplos vaults
- Sync de nota com edits do usuário
- Telemetria opt-in
- UI de configuração de providers cloud
- Atalho de teclado pra alternar modo
- Export de conversa pra markdown
- **Produto Mora separado: agente de email/inbox** (escopo declarado OUT do Strata em decisão 2026-05-05; quando virar prioridade, novo repo `Mora-Org/{nome}` com Director + speckit próprios)
