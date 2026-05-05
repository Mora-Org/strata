---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# Backlog Priorizado

Ordem reflete prioridade. Itens sem ordem ainda ficam em "Não-priorizado".

## Próximas iterações

1. **M0.5.b** — Screens via Claude Design (em andamento — ver [`m05-screen-spec.md`](m05-screen-spec.md))
2. **M0.5.c** — Codificação única (DS + screens) no repo
3. **M1** — Scaffolding Tauri + fork Pi + reimplementação das M1-screens em React/TS real + chat hello-world Ollama
4. **M2** — Mode Router (Vereda/Mestre) + bloqueio de tools de escrita em Vereda + Note Builder + Vault Writer
5. **M3** — Session branch tree (signature primitive) + Command palette (Cmd+K) + fork-from-message
6. **M4** — **Tools opt-in + frontmatter rich** (extensibility wave). Inclui:
   - Web search via Brave (`web.search` tool, opt-in com API key em `~/.strata/auth/brave.json`)
   - Vault reader (`vault.read` tool pra preencher `relacionados` no frontmatter)
   - Frontmatter completo (bloom auto-estimation, refs com URL real do search)
   - Pattern de tool customization documentado (`.speckit/product/customization-guide.md`) — primeiro exemplo concreto de [ADR-0004](../architecture/adr/ADR-0004-customization-scope-extensible-vs-locked.md)
   - Mode Router validation: bloqueia tool customizada de escrita em Vereda
7. **M5** — Refinamentos de UX, atalhos de teclado, settings completo

## Não-priorizado (parking lot)

- Histórico de sessões
- Múltiplos vaults
- Sync de nota com edits do usuário
- Telemetria opt-in
- UI de configuração de providers cloud
- Atalho de teclado pra alternar modo
- Export de conversa pra markdown
- **Produto Mora separado: agente de email/inbox** (escopo declarado OUT do Strata em decisão 2026-05-05; quando virar prioridade, novo repo `Mora-Org/{nome}` com Director + speckit próprios)
