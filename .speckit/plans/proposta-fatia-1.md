---
dono: Cesar
atualizado: 2026-09-30
status: proposta, espera aval total
---

# Plano da primeira fatia: o harness no terminal

Base: [`direcao-2026-09.md`](../product/direcao-2026-09.md). Nada aqui vale antes do aval
total do César.

## O que a fatia entrega

O César abre o `strata` no terminal, pergunta sobre um conceito e recebe uma resposta
montada a partir de artigos que o Strata achou, com cada afirmação ligada à fonte. Cada
fonte usada vira uma nota no acervo, e o acervo se organiza em árvore de índices. Numa
sessão seguinte, uma pergunta vizinha é respondida com o que já está guardado, e a
resposta termina com a lista das fontes guardadas pra seguir, em ordem.

Ficam pra fatias seguintes: a janela Tauri, o Modo Mestre, a busca geral na web (aulas e
matérias), o diário de sessão, o mapa do que a pessoa domina e o conselheiro de modelos.

## Pré-requisitos

1. Bun: instalado em 30/09/2026 pelo winget, versão 1.4.2. O harness roda, testa e
   compila com ele. O Node desta máquina é o 22.18.0 e o `pi-ai` exige 22.19 ou mais
   novo, então o harness não depende do Node. O `pi-ai` 0.99.1 instalou pelo Bun numa
   pasta de teste; o Bun bloqueou dois scripts de instalação (`@google/genai`, que é
   vazio, e `protobufjs`) e eles ficam bloqueados enquanto nada quebrar.
2. Provedor escolhido pelo César: OpenCode Go, modelo `deepseek-v4-flash`. No catálogo do
   `pi-ai` 0.99.1 ele tem 1 milhão de tokens de contexto, raciocínio, fala pela API
   `openai-completions` e custa US$ 0,15 por milhão de tokens de entrada e US$ 0,60 por
   milhão de saída. A chave vem da variável `OPENCODE_API_KEY`, que o César definiu em
   30/09/2026. Testada no mesmo dia com uma chamada real: o modelo chamou a ferramenta
   `somar` com os argumentos certos e respondeu com o resultado dela. As duas chamadas
   custaram US$ 0,00015.

## Parte A: papelada e limpeza

Troca a doutrina antes do código, porque o `CLAUDE.md` do repo trata desvio do
`CONTEXT_DIRECTOR.md` §3 e §4 como bloqueador. Proposta: um PR só pra esta parte.

- [NEW] `.speckit/architecture/adr/ADR-0005-harness-proprio-sobre-pi-ai.md`. Substitui o
  ADR-0001 e o ADR-0002: motor próprio, provedores pelo `@earendil-works/pi-ai` com versão
  exata, processo separado compilado com Bun.
- [NEW] `.speckit/architecture/adr/ADR-0006-janela-tauri-teto-400mb.md`. Janela Tauri como
  cliente do harness, o teto de 400 MB e como medir.
- [NEW] `.speckit/architecture/adr/ADR-0007-acervo-em-arvore-de-indices.md`. O formato do
  acervo descrito na Parte B, com o Obsidian opcional.
- [MODIFY] ADR-0001 e ADR-0002: `status: substituído`, `superseded_by: ADR-0005`.
- [MODIFY] ADR-0004: `status: em revisão`, até a pergunta sobre regras travadas da direção.
- [MODIFY] `CONTEXT_DIRECTOR.md` §2, §3, §4 e §5, pelas decisões da direção nova.
- [MODIFY] `CLAUDE.md`: stack, arquitetura, provedores, e a seção de nota Obsidian vira a
  do acervo.
- [MODIFY] `.speckit/plans/current.md`: o M1 de maio vai pro `done.md` como encerrado sem
  entrega, e esta fatia vira a atual.
- [MODIFY] `.speckit/plans/backlog.md` e `.speckit/tracking/decisions.md`.
- [DELETE] `src/lib/pi/` e `src/__tests__/pi-session.test.ts`. O pacote nem existe mais
  com esse nome.
- [DELETE] `src/lib/ollama/` e `src/__tests__/ollama-client.test.ts`. O `pi-ai` cobre o
  Ollama.
- [MODIFY] `package.json` e `package-lock.json`: sai o `@mariozechner/pi-coding-agent`, e a
  descrição deixa de dizer local-first e Obsidian.
- [MODIFY] `src/lib/types/index.ts` e `src/__tests__/strata-types.test.ts`: saem o
  `VaultConfig` e o `DEFAULT_INBOX_FOLDER`.

Fora da Parte A, como estava no plano: o README, que ainda descreve a versão de maio, e a
descrição pública do repo no GitHub, que fica com o César. O manifesto e a visão entraram
na Parte A depois da entrevista de 30/09/2026. O renome de `vereda`/`mestre` em `src/` e em
`design/` fica para a fatia da janela.

Critério de aceite da Parte A:

1. `npm run test:run` e `npm run build` verdes depois da limpeza.
2. Nenhum arquivo de código ou de configuração cita `@mariozechner` (conferido por grep em
   `src/`, `src-tauri/`, `package.json` e `package-lock.json`). Os documentos de histórico
   (ADRs antigos, notas de decisão) continuam citando o nome, de propósito.
3. Os três ADRs novos com `status: ativo`.

## Parte B: o harness

Mora em `harness/`, com `package.json` próprio, ao lado do app. A janela Tauri das
próximas fatias vai subir o executável gerado aqui. Proposta: um PR só pra esta parte.

- [NEW] `harness/package.json`. Dependências: `@earendil-works/pi-ai` com versão exata
  (0.99.1 em 30/09/2026), porque o Pi solta versão quase todo dia; e `fast-xml-parser`,
  pra ler o Atom que o arXiv devolve. Nada além disso.
- [NEW] `harness/tsconfig.json`, em modo strict.
- [NEW] `harness/src/main.ts`. O terminal: lê a pergunta, mostra a resposta em streaming,
  mostra cada ferramenta que o modelo chama, e imprime tokens e custo de cada resposta,
  que o `pi-ai` já devolve. Comandos: `/conhecimento ligado`, `/conhecimento desligado`,
  `/acervo` (mostra o índice raiz) e `/sair`.
- [NEW] `harness/src/ciclo.ts`. O ciclo do agente: chama `models.stream`, executa as
  chamadas de ferramenta, devolve os resultados como `toolResult` e repete até o modelo
  parar, com teto de passos por pergunta pra não entrar em laço. Cada conversa leva um
  `sessionId`: sem ele o OpenCode Go devolve erro 400 `MissingSessionID` (visto em
  30/09/2026), e o `pi-ai` monta o header `x-opencode-session` a partir dele.
- [NEW] `harness/src/config.ts`. Lê `~/.strata/config.json`: provedor, modelo, pasta do
  acervo e se o conhecimento do modelo começa ligado. Sem o arquivo, o padrão é o
  OpenCode Go com o `deepseek-v4-flash`. Chave de API só por variável de ambiente ou pelo
  armazenamento de credencial do `pi-ai`, nunca nesse arquivo.
- [NEW] `harness/src/acervo.ts`. Lê e grava o acervo. O modelo decide tema, resumo e
  ordem de leitura; o código grava os arquivos e atualiza os índices. Assim o índice
  nunca quebra por causa de texto livre do modelo.
- [NEW] `harness/src/fontes.ts`. Busca no arXiv e no Crossref, que em 30/09/2026
  responderam sem chave, e lê uma página por URL.
- [NEW] `harness/src/citacoes.ts`. Confere a resposta final: toda fonte citada ou listada
  pra seguir tem que existir no acervo. Com o conhecimento desligado, resposta sem nenhuma
  citação só passa se disser que não achou fonte.
- [NEW] `harness/modos/estudo.md`. O prompt do modo de estudo em markdown. É aqui que mora
  o "não lockado": mudar o comportamento é editar texto.
- [NEW] `harness/modos/conhecimento-do-modelo.md`. O trecho que entra no prompt quando o
  conhecimento do modelo está ligado.
- [NEW] `harness/test/`. Testes com o `fauxProvider` do `pi-ai` e respostas do arXiv e do
  Crossref gravadas em arquivo. Nenhum teste usa rede.

Ferramentas que o modelo recebe: `buscar_artigos`, `ler_pagina`, `ler_indice`,
`ler_fonte`, `buscar_no_acervo` (busca por texto) e `guardar_fonte`.

### Formato do acervo

```
acervo/
  INDICE.md          um tema por linha: link, descrição curta, quantas fontes
  temas/<tema>.md    uma fonte por linha, na ordem sugerida de leitura
  fontes/<id>.md     uma nota por fonte
```

A nota de fonte tem frontmatter (`id`, `tipo`, `titulo`, `autores`, `ano`, `link`, `doi`
ou `arxiv`, `temas`, `guardado_em`) e um corpo com o que a fonte diz e pra que ela serve.
Uma fonte que pertence a vários temas mora uma vez em `fontes/` e aparece no índice de
cada tema. Os links são markdown comum, então pôr a pasta do acervo dentro de um vault
basta pro Obsidian abrir.

Pasta padrão: `~/Strata/acervo`, trocável no config.

Ordem de leitura: o modelo lê o `INDICE.md`, desce só nos temas que interessam e só então
abre as fontes. A busca por texto entra quando os índices não apontam o caminho.

### Critério de aceite da Parte B

1. `bun test` verde sem rede, cobrindo: o ciclo executa a ferramenta e volta ao modelo;
   guardar a mesma fonte duas vezes não duplica nada; uma fonte em dois temas aparece nos
   dois índices; o conferidor recusa id de fonte que não existe; o arXiv e o Crossref são
   lidos a partir das respostas gravadas.
2. Com o provedor escolhido e o acervo vazio, uma pergunta de conceito termina com pelo
   menos duas fontes citadas com link, as notas em `fontes/`, e o índice do tema e o
   índice raiz atualizados. O César confere a olho.
3. Com o processo reiniciado, uma pergunta vizinha é respondida com fontes do acervo e
   termina com a lista de quais seguir, em ordem. O terminal mostra a leitura do acervo
   antes de qualquer busca nova, e o conferidor passa.
4. Com o conhecimento desligado, uma pergunta sobre um conceito inventado recebe "não
   achei fonte" em vez de uma resposta de memória. Com o conhecimento ligado, a mesma
   pergunta é respondida. O mesmo par de testes roda também com um conceito real que não
   está no acervo (pedido do César em 30/09/2026): desligado, a resposta vem de fontes
   buscadas; ligado, pode vir da memória do modelo.
6. As respostas do modelo saem sem travessão e sem negrito (pedido do César em
   30/09/2026), conferido nas transcrições.
5. `bun build --compile` gera o `strata.exe`, e ele roda a partir de uma pasta sem
   `node_modules`.

## Riscos

1. Os critérios 2, 3 e 4 dependem de o DeepSeek V4 Flash chamar ferramenta direito. Se
   um deles falhar, repetir com outro modelo do OpenCode Go separa defeito do harness de
   limite do modelo.
2. O Pi solta versão quase todo dia e já trocou o nome dos pacotes uma vez. Versão exata
   no `package.json`, atualização só de propósito.
3. O Crossref nem sempre traz o resumo do artigo. Sem resumo, a nota guarda os metadados
   e diz que falta o resumo.
4. OpenAlex e Semantic Scholar ficam de fora por enquanto: em 30/09/2026 um estava com a
   busca anônima pausada e o outro recusou por limite. Entram depois com chave gratuita,
   se fizer falta.

## Perguntas abertas desta fatia

Nenhuma. Falta o aval total do César.
