---
dono: Cesar
atualizado: 2026-09-30
status: ativo
supersedes: nenhum
superseded_by: nenhum
---

# ADR-0007: acervo em árvore de índices

## Contexto

O acervo existe para a IA não alucinar: para ela lembrar de usar a mesma base que o aluno
achou boa, e descartar para sempre a que achou ruim (palavras do César, 30/09/2026). Em
maio, o Strata guardava notas num vault Obsidian obrigatório, com frontmatter fixo. Agora o
Obsidian é opcional.

O second-brain do César usa um índice que lista todas as notas: 35.630 bytes para 157
notas, cerca de 227 bytes por nota. Com mil notas passaria de 50 mil tokens. Um mestrado
junta centenas de artigos, fora aulas e sessões. Um índice só não aguenta esse volume,
principalmente em modelo local.

## Decisão

O acervo é uma pasta de markdown comum, organizada em árvore de índices de três níveis:

```
acervo/
  INDICE.md          um tema por linha: link, descrição curta, quantas fontes
  temas/<tema>.md    uma fonte por linha, na ordem sugerida de leitura
  fontes/<id>.md     uma nota por fonte
```

- A nota de fonte tem frontmatter (`id`, `tipo`, `titulo`, `autores`, `ano`, `link`, `doi`
  ou `arxiv`, `temas`, `guardado_em`) e um corpo com o que a fonte diz e para que serve.
- Uma fonte que pertence a vários temas mora uma vez em `fontes/` e aparece no índice de
  cada tema.
- O modelo decide tema, resumo e ordem. O código grava os arquivos e regenera os índices,
  então o índice nunca quebra por causa de texto livre do modelo. Guardar a mesma fonte
  duas vezes não duplica nada.
- A IA lê o `INDICE.md`, desce só nos temas que interessam e só então abre as fontes. Busca
  por texto fica de reserva. Embeddings só entram se a árvore falhar numa medição.
- Links em markdown comum e relativos. Pôr a pasta do acervo dentro de um vault basta para
  o Obsidian abrir.
- Pasta padrão: `~/Strata/acervo`, trocável no config.

## Regras que valem para o acervo

1. Toda fonte citada numa resposta existe no acervo. O conferidor de citações barra id
   inexistente.
2. Com o conhecimento do modelo desligado, resposta sem nenhuma citação só passa se disser
   que não achou fonte.

## Consequências

- O custo de cada leitura acompanha a profundidade da árvore, então o acervo cresce sem que
  ler fique mais caro.
- O julgamento do aluno sobre cada fonte (boa, ou descartada para sempre) ainda não está no
  formato. Entra em fatia futura, e uma fonte descartada nunca mais volta numa busca.
- A nota de fonte não guarda conteúdo de conversa, só o que a fonte diz.
