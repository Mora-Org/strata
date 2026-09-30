---
dono: Cesar
atualizado: 2026-09-30
status: ativo
---

# Backlog Priorizado

Ordem reflete prioridade. Direção em [`../product/direcao-2026-09.md`](../product/direcao-2026-09.md).

## Próximas iterações

1. **Fatia 1: o harness no terminal** (ativa). Ver [`current.md`](current.md).
2. **Julgamento do aluno sobre cada fonte.** Marcar boa ou descartada para sempre; uma fonte
   descartada nunca mais volta numa busca.
3. **Busca geral na web** para aulas e matérias. Decidir o serviço de busca e se a pessoa traz a
   própria chave. O modelo já improvisou buscas no DuckDuckGo via `ler_pagina` em 30/09/2026.
4. **Janela Tauri** como cliente do harness, medida contra o teto de 400 MB (ADR-0006). Faz também
   o renome de `vereda`/`mestre` para Estudo e Ação no código e no design system.
5. **Modo Ação**, com possibilidade de ser o padrão pelo config.
6. **Conselheiro de modelos:** recomenda modelos locais pequenos e médios (Bonsai, Gemma e outros),
   custo contra privacidade, detalhes das empresas, sabendo a RAM da máquina.
7. **Diário de sessão e mapa do que a pessoa domina**, para continuar de onde parou e ajustar o nível.
8. **Novas fontes de artigos:** OpenAlex e Semantic Scholar, com chave gratuita.
9. **Reescrever o ADR-0004** e decidir se alguma outra regra fica fora do alcance do config.

## Não priorizado

- Múltiplos provedores no executável (hoje só o `opencode-go`)
- Leitura de PDF no `ler_pagina`
- Marcar como "sem fonte" o que vem da memória do modelo com o conhecimento ligado
- Exportar conversa para markdown
- Produto Mora separado: agente de email/inbox (fora do Strata desde 2026-05-05)
