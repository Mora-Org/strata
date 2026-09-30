---
dono: Cesar
atualizado: 2026-09-30
status: rascunho, espera aval
---

# Direção nova do Strata (setembro de 2026)

Este arquivo registra a virada do produto antes de qualquer código. Enquanto ele estiver
em rascunho, o `manifesto.md`, o `CONTEXT_DIRECTOR.md` e os ADRs antigos continuam
valendo no papel, mas não guiam trabalho novo. Quando o César der o aval, as decisões
daqui viram ADRs e reescrevem esses arquivos.

## Por que voltou

Nas palavras do César, em 29/09/2026:

> "esse projeto voltou porque um amigo pediu um lugar pra aprender a programar, e fazer
> pesquisa academica"

> "eu acabei sem querer criando muitos projetos e daí ele foi soterrado"

O Strata parou em 17/05/2026 no M1.b. Havia 18 telas desenhadas, o design system e a
fundação com 40 testes, mas o chat nunca chegou a rodar.

## O que o César pediu

Falas literais da conversa de 29/09/2026.

Sobre o motor:

> "eu penso parcialmente num Harness proprio, seguindo a mesma configuração do PI de
> altamente configuravel, eu até gosto muito do PI sim mas não quero ter que carregar ele"

Sobre rodar local:

> "Não acho mais que local é o único caminho acredito que tem que ser local mas as pessoas
> também tem que poder ligar as proprias APIs como Opencode pra aprender, o importante é
> aprender não ncessáriamente ter que rodar local, mas rodar localmente ser uma opção é
> muito bom"

Sobre o modo de estudo:

> "Ter o modo de estudo onde ele não tenta te fazer aprender rapido e evita usar
> conhecimentos prévios ele pode sim gerar código de exemplo mas conceitos ele tem que
> gostar de pesquisar e ele tem que conseguir pesquisar tipo o Opencode que consegue"

> "Do modelo, não usar conhecimento de alto nivel do modelo, pesquisar o que existe na
> internet, ou usar do modelo com modo ligado/desligado"

Sobre os modelos:

> "Um Harness focado em aprendizado e que te recomenda usar modelos locais e daí te fala
> sobre modelos como Bonsai, Gemma e outros pequenos e médios locais ou sobre custo
> beneficio x privacidade dos dados, ter detalhes das empresas modelos e etc"

Sobre o público:

> "Para um publico opensource, e pra pessoas que querem aprender a programar incluindo eu
> e por isso tem que ser altamente personlizavel e não lockado através de código
> empacotado"

Sobre o que separa o Strata de um agente comum:

> "O trabalho prévio é a parte que faz o Strata existir, e acho que devemos criar mais
> funções uma hierarquia, pesquisar, checar metodos de estudo, ter o sistema de achar
> documentos"

Respostas de 30/09/2026:

> "Hierarquia é um sistema de organização de informação a IA sabendo como organizar pra
> ler mais tarde"

> "artigos academicos, aulas, matérias, etc"

> "Um deles sabe um pouco de javascript e quer transicionar de área, o outro sabe de
> programação e trabalha mas quer usar pra se especializar pro metrado, o primeiro a usar
> sou eu depois eles"

> "Meu problema com chromium é memória do PC"

> "podemos sim usar o Tauri se não queimar mais que 400mb de RAM nele, acho que mais gente
> vai ligar a IA doq rodar local também"

Sobre a hierarquia seguir o molde do second-brain:

> "acho que pode ser inspirado mas temos que discutir se isso é melhor"

Depois da discussão:

> "achei o 4 interessante"

> "os tres obviamente importam, mas com certeza, responder com as fontes já guardadas e
> listar quais pra seguir"

## Decisões fechadas

| Tema | Antes (maio) | Agora |
|---|---|---|
| Motor | Fork do Pi inteiro (ADR-0001, ADR-0002) | Harness próprio. Só a camada de provedores vem do `@earendil-works/pi-ai` |
| Rodar local | Postura obrigatória, Ollama como padrão | Opção recomendada. A pessoa pode ligar a própria API, e o César espera que a maioria faça isso |
| Conhecimento do modelo | Não tratado | Desligado por padrão: o conceito vem de pesquisa. Um botão liga o uso do que o modelo já sabe |
| Código em modo de estudo | Até 10 linhas de pseudocódigo | Pode gerar código de exemplo |
| Público | Dev que sente que entende menos | Open source, gente aprendendo a programar e fazendo pesquisa acadêmica, o César incluso |
| Personalização | Regras duras travadas fora do alcance do usuário (ADR-0004) | Altamente personalizável, configuração em arquivo, nada escondido em código empacotado |
| Notas | Obsidian obrigatório, `inbox/` do vault | Pasta de notas do próprio app com índice. Obsidian vira opcional |
| Hierarquia | Não existia | Sistema de organização da informação: a IA sabe como guardar pra ler mais tarde. Formato: árvore de índices (caminho 4 da seção Hierarquia) |
| Primeiro uso do acervo | Não existia | Responder com as fontes já guardadas e listar quais seguir. Continuar a sessão e saber o que a pessoa domina vêm depois |
| Documentos | Referência primária citada na nota | O Strata acha artigos acadêmicos, aulas e matérias |
| Primeiros usuários | Não havia | O César primeiro. Depois um amigo que sabe um pouco de JavaScript e quer mudar de área, e outro que já programa e quer se especializar pro mestrado |
| App | Desktop Tauri | Desktop Tauri, com teto de 400 MB de RAM na janela. Electron recusado por consumo de RAM |
| Primeira fatia | M1: casca Tauri e 18 telas | O harness no terminal. A janela vem depois, medida contra o teto |
| Repo | Mora-Org/strata | O mesmo |
| Continua | | Nome, os dois modos, design system editorial |

## Arquitetura proposta

Proposta minha, a partir das decisões acima. Espera aval.

O harness é um processo próprio em TypeScript. Ele conversa com os modelos pelo `pi-ai` e
roda o ciclo do agente, as ferramentas, a pesquisa e as notas. É compilado num executável
único com `bun build --compile`, que é como o próprio Pi se distribui hoje (o
`pi-windows-x64.zip` da v0.99.1 tem 43 MB).

O app Tauri é só a janela. Ele sobe o harness como processo auxiliar (o `externalBin` do
Tauri) e conversa com ele por mensagens. O mesmo harness roda sozinho no terminal, o que
mantém a promessa antiga de "terminal ou janela" sem código duplicado.

A configuração mora em arquivos que a pessoa lê e edita: modos, prompts, ferramentas,
provedores e o catálogo de modelos. É o que o Pi e o OpenCode fazem, e é o que responde ao
"não lockado através de código empacotado".

Dois fatos que pesam nessa escolha:

1. O Pi exige Node 22.19 ou mais novo. No código de maio ele era importado no frontend,
   dentro do webview do Tauri, onde não existe Node. Os testes passavam por usarem mock e
   nenhuma tela chegava a importar o Pi. Com o harness em processo separado, esse problema
   some.
2. No Windows, o webview do Tauri é o WebView2, que usa o motor do Chromium e já vem
   instalado no sistema. O ganho do Tauri sobre o Electron ali está em não empacotar um
   Chromium inteiro no instalador. O Chromium continua rodando.
3. Medido no PC do César em 30/09/2026 (15,7 GB de RAM), somando os processos do WebView2
   por app: o Teams tinha 8 processos com 1.220 MB de memória privada; a busca do
   Windows tinha 5 com 173 MB. O mesmo motor varia sete vezes, então o peso vem
   mais do que o app desenha do que do motor em si.
4. Quem rodar modelo local vai gastar a maior parte da RAM no modelo, na casa dos
   gigabytes. O conselheiro de modelos precisa saber quanta RAM a máquina tem. Quem usar
   API, que o César espera ser a maioria, tem na janela o maior consumo do Strata, e é
   pra essa pessoa que o teto de 400 MB existe.

Critério de aceite da janela: com a tela de chat aberta e uma conversa longa carregada, a
soma da memória privada do processo do Tauri com a dos processos do WebView2 dele fica em
até 400 MB. O harness conta à parte, porque roda igual no terminal.

## Hierarquia

O César quer um sistema de organização da informação em que a IA sabe guardar pra ler
depois, e topa se inspirar no second-brain, mas quer discutir se é o melhor caminho.

Medido no second-brain em 30/09/2026: o `INDICE.md`, lido sempre, tem 8.167 bytes. O
`INDICE-NOTAS.md` lista as 157 notas em 35.630 bytes, uns 227 bytes por nota. Na conta
grosseira de 4 bytes por token, são uns 9 mil tokens hoje, e passaria de 50 mil com mil
notas. Um mestrado junta centenas de artigos, fora aulas e sessões. O índice que lista
tudo numa página só não aguenta esse volume, principalmente em modelo local.

Caminhos na mesa:

1. O molde do second-brain como está: índice curto, índice com uma linha por nota,
   pastas. Barato, legível por gente e pelo Obsidian, já usado todo dia pelo César.
   Quebra no volume (a conta acima) e obriga cada nota a morar numa pasta só.
2. Busca semântica (embeddings): corta tudo em pedaços e busca por semelhança. Aguenta
   milhares de documentos. Exige um modelo de embedding (local ou mais uma chave), um
   índice pra manter, e devolve trechos soltos, sem a ordem do que estudar antes.
3. Grafo de conceitos: notas ligadas por links, com notas-mapa por tema e links de
   pré-requisito. Uma nota pode pertencer a vários temas, e o grafo mostra o que estudar
   antes do quê. Custa manutenção dos links pela IA.
4. Árvore de índices, que é o second-brain generalizado: índice raiz curto, um índice
   por tema, notas embaixo; links entre notas pra quem pertence a mais de um tema; busca
   por texto como reserva; embeddings só se a árvore falhar numa medição. O custo de
   cada leitura acompanha a profundidade da árvore, então o acervo pode crescer sem que
   ler fique mais caro.

Escolhido o 4 em 30/09/2026. O formato concreto está no plano da primeira fatia,
`.speckit/plans/proposta-fatia-1.md`.

## O que cai quando isto for aprovado

1. ADR-0001 e ADR-0002 (fork do Pi, app como fork). Substituídos pelo ADR do harness
   próprio sobre o `pi-ai`.
2. ADR-0004 (regras travadas). Precisa ser reescrito a partir da pergunta 2 abaixo.
3. `CONTEXT_DIRECTOR.md` §2 e §3: local-first, vault-first, Ollama como padrão, Pi como
   motor, Obsidian como vault.
4. `CONTEXT_DIRECTOR.md` §4, regras 2, 3 e 5 (as 10 linhas de pseudocódigo, o `inbox/`
   do vault e o frontmatter fixo).
5. Manifesto §VI inteiro e §VII na parte do Obsidian.
6. A descrição pública do repo no GitHub ("Local-first coding agent que constrói camadas
   de entendimento no seu vault Obsidian") fica errada em três pontos.

O que já existe em `src/` é pequeno e quase todo descartável. O cliente do Ollama sai de
cena porque o `pi-ai` cobre Ollama, e o wrapper do Pi deixa de fazer sentido. A casca
Tauri e a ponte de tokens do design system podem ficar.

## Perguntas abertas

1. Aulas e matérias pedem busca geral na web, e ela precisa de um serviço de busca. A
   pessoa traz a própria chave (Brave, Tavily, Exa), ou o Strata tenta algo sem chave?
   Artigos ficam resolvidos na primeira fatia: em 30/09/2026 o arXiv e o Crossref
   responderam sem chave, o OpenAlex estava com a busca anônima pausada e o Semantic
   Scholar recusou por limite.
2. Se tudo é personalizável, sobra alguma regra travada? Respondido em parte em
   30/09/2026: o Mestre pode virar padrão pelo config ("agora deixa"). Falta saber se
   alguma outra regra fica fora do alcance do config.
3. Se a janela Tauri passar dos 400 MB, o plano B é interface nativa em Rust (egui, iced,
   Slint), que obriga a refazer o design system e a desenhar markdown, código e links à
   mão. Vale decidir isso antes, ou só se acontecer?
4. Com o conhecimento do modelo ligado, o que vier da memória dele aparece marcado como
   "sem fonte"? Proposta minha, não pedida.
