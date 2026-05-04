---
dono: Cesar
atualizado: 2026-05-04
status: ativo
supersedes: nenhum
superseded_by: nenhum
---

# ADR-0002 — Strata é app standalone (fork/upgrade do Pi), não extensão do Pi

## Contexto

Pi expõe `pi.registerTool({...})` como API de extensão. Em tese, dava pra empacotar Strata como `@mora/pi-strata-extension` — instala via `pi.use(strataExtension)` e pronto, sem fork.

Avaliamos isso depois do [ADR-0001](ADR-0001-fork-pi-vs-from-scratch.md) (que era sobre "fork vs from-scratch", não cobria "fork vs extension").

## Decisão

**Strata é app standalone, com Pi como upstream forkado.** Não extensão.

## Razões

1. **GUI Tauri não cabe em extensão.** Extensão de Pi roda dentro do processo Pi (terminal). Strata precisa de janela própria — isso é app, não plugin.
2. **Strata tem CLI próprio.** `strata` (não `pi --strata`). Identidade de produto + ergonomia separadas do Pi.
3. **Mode Router intercepta o agent loop**, não só adiciona tools. Em extensão limpa, não temos hook pra interceptar tool-calls antes do execute (só pra registrar tools novas). Em fork, controlamos via shadowing.
4. **Strata já é grande o suficiente.** Vault Writer + Note Builder + Mode Router + Tauri GUI + CLI próprio + extensions Mora-específicas. Empacotar tudo isso como "extension" subverte a expectativa de quem usa Pi.
5. **Distribuição.** Usuário do Strata não precisa entender o que é Pi. `npm i -g strata` (ou binário Tauri) ≠ `npm i -g pi && pi.use(...)`.

## Consequências

### Positivas
- Liberdade total de divergência (UI, CLI, modelo de sessão estendido)
- Strata pode evoluir em ritmo próprio sem esperar PRs upstream
- Marca/identidade própria sem depender de Pi como "host"

### Negativas
- **Custo de manter sync com upstream Pi.** Já levantado em ADR-0001, agora confirmado.
- Risco de fork morto se Strata atrasar e Pi avançar muito.

## Mitigações

- `UPSTREAM.md` rastreando commits Pi mergeados (já planejado em ADR-0001)
- Manter código nosso em `src/lib/strata-extensions/` — minimizar diff no fork puro
- Reavaliar a cada release major do Pi: vale puxar mudanças? Vale congelar versão?

## Relação com ADR-0001

ADR-0001 decidiu "forkar vs from-scratch". ADR-0002 confirma "fork como app standalone vs como extensão". Os dois ficam ativos — não há supersedência.
