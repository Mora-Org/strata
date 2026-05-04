---
dono: Cesar
atualizado: 2026-05-04
status: draft
---

# Fluxo de Dados — Chat → Vault

```
┌─────────┐   prompt    ┌──────────┐   chamadas    ┌──────────┐
│ Usuário │ ──────────> │ Pi Core  │ ────────────> │ Provider │
│ (chat)  │             │ (forked) │               │ (Ollama) │
└─────────┘             └──────────┘               └──────────┘
                              │
                              │ resposta + tool_calls
                              v
                        ┌──────────────┐
                        │ Mode Router  │
                        │ (Vereda/     │
                        │  Mestre)     │
                        └──────────────┘
                          │           │
                  Vereda  │           │  Mestre
                          v           v
                    ┌─────────┐  ┌──────────┐
                    │ Note    │  │ Tool     │
                    │ Builder │  │ Executor │
                    └─────────┘  └──────────┘
                          │           │
                          v           v
                    ┌─────────┐  ┌──────────┐
                    │ Vault   │  │ FS / Sh  │
                    │ Writer  │  │ (do user)│
                    └─────────┘  └──────────┘
                          │
                          v
                    ┌─────────┐
                    │ inbox/  │
                    │ *.md    │
                    └─────────┘
```

## Componentes

| Componente | Responsabilidade | Onde mora |
|---|---|---|
| Pi Core (forked) | Loop conversacional, tool-use, providers | `src/lib/pi/` |
| Mode Router | Decide se resposta vira nota ou ação | `src/lib/mode/` |
| Note Builder | Gera markdown a partir da resposta | `src/lib/obsidian/` |
| Vault Writer | I/O no vault do usuário | `src/lib/obsidian/` |
| Tool Executor | Executa tools do Pi (Read, Write, Bash) | herdado do Pi |

## Invariantes

- Mode Router lê o modo do estado Zustand a cada turno (não cacheia)
- Em Vereda, Tool Executor é instanciado **sem** as tools de escrita (Write, Edit, Bash que muta)
- Note Builder roda em todo turno do Vereda quando a resposta tem densidade conceitual
- Vault Writer nunca toca arquivo fora de `inbox/`

## Open questions

- [ ] Heurística pra "vale a pena gerar nota?" — Cesar precisa decidir (proposta inicial: ≥1 ref primária citada na resposta)
- [ ] Mode Router lê config ou estado ou ambos? (proposta: estado pra modo ativo, config pra path do vault)
- [ ] Em Mestre, gerar nota é automático ou opt-in dentro do turno?
