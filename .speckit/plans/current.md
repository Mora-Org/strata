---
dono: Cesar
atualizado: 2026-09-30
status: ativo
---

# Plano atual

## Iteração: Fatia 1, o harness no terminal
**Início:** 2026-09-30
**Plano completo:** [`proposta-fatia-1.md`](proposta-fatia-1.md)
**Critério de fechamento:** o César pergunta sobre um conceito no terminal e recebe resposta montada
a partir de fontes que o Strata achou, com cada afirmação ligada a uma fonte; a fonte vira nota no
acervo; numa sessão seguinte, uma pergunta parecida é respondida com o que já está guardado e
termina com a lista de fontes para seguir, em ordem.

### Parte A: papelada e limpeza (branch `fatia-1-papelada`)
- [x] Direção nova e entrevista do manifesto registradas (`product/direcao-2026-09.md`, `product/entrevista-manifesto.md`)
- [x] Manifesto novo, em inglês e português
- [x] ADR-0005 (harness próprio sobre o pi-ai), ADR-0006 (janela Tauri, teto de 400 MB), ADR-0007 (acervo em árvore de índices)
- [x] ADR-0001 e ADR-0002 marcados como substituídos; ADR-0004 em revisão
- [x] `CONTEXT_DIRECTOR.md` e `CLAUDE.md` reescritos
- [x] `vision.md` e `modes-spec.md` reescritos; `pi-anatomy`, `data-flow`, `ide-integration` e `obsidian-note-spec` marcados como substituídos
- [x] Removidos `src/lib/pi/`, `src/lib/ollama/` e seus testes; removido `@mariozechner/pi-coding-agent`
- [x] `VaultConfig` e `DEFAULT_INBOX_FOLDER` removidos de `src/lib/types`
- [x] `vite.config.ts` exclui `e2e/` do vitest
- [x] `npm run test:run` e `npm run build` verdes

### Parte B: o harness (branch `fatia-1-harness`, worktree `strata-fatia1`)
Implementada, sem commit. 37 testes sem rede, tipos limpos, executável de 87,9 MB.
Rodadas reais com o modelo: acervo vazio, sessão nova e executável passaram. O critério 4 (conceito
inventado e conceito real, conhecimento desligado e ligado) e o critério 6 (respostas sem
travessão e sem negrito) precisam ser repetidos com o modelo real.

### Fora da fatia 1
A janela Tauri, o modo Ação, a busca geral na web (aulas e matérias), o julgamento do aluno sobre
cada fonte, o diário de sessão, o mapa do que a pessoa domina e o conselheiro de modelos.
