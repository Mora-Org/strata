---
dono: Cesar
atualizado: 2026-09-30
status: ativo
supersedes: ADR-0001, ADR-0002
superseded_by: nenhum
---

# ADR-0005: harness próprio sobre o pi-ai

## Contexto

Em maio o Strata decidiu forkar o Pi inteiro (ADR-0001) e ser um app standalone, não uma
extensão (ADR-0002). Dois fatos mudaram até 30/09/2026:

1. O Pi andou de 0.73.1 para 0.99.1 em quatro meses, mais de 100 commits no último mês, e
   trocou o escopo dos pacotes (`@mariozechner` para `@earendil-works`). Carregar o Pi
   inteiro é acompanhar algo que muda toda semana.
2. O motivo principal do fork caiu: extensões do Pi passaram a poder bloquear chamadas de
   ferramenta e trocar ferramentas ativas e prompt. Mas o César não quer carregar o Pi,
   quer o molde dele: altamente configurável, em arquivos, sem nada escondido em código
   empacotado.

O código de maio também tinha um erro de desenho: o Pi era importado no frontend, dentro
do webview do Tauri, onde não existe Node. Os testes passavam por usarem mock.

## Decisão

O harness é um programa próprio, em TypeScript, que mora em `harness/`. O ciclo do agente,
as ferramentas, o acervo e os modos são código e arquivos nossos. Só a camada de provedores
de modelo vem do `@earendil-works/pi-ai`, com versão exata no `package.json`.

O harness roda no terminal e é compilado num executável único com `bun build --compile`,
que é como o próprio Pi se distribui. A janela Tauri (ADR-0006) sobe esse executável como
processo auxiliar e conversa com ele.

## Por que só o pi-ai

Provedores mudam de formato de streaming e de chamada de ferramenta sem aviso. Manter isso
é trabalho sem valor de produto. O que diferencia o Strata é o ciclo de estudo, o acervo e
os modos, e isso fica com código nosso, pequeno e legível.

## Consequências

- O `pi-ai` exige Node 22.19 ou mais novo. O harness roda, testa e compila com Bun e não
  depende do Node da máquina.
- O Bun bloqueia os postinstalls de `@google/genai` e `protobufjs`. Ficam bloqueados
  enquanto nada quebrar.
- Só o provedor `opencode-go` entra no executável da primeira fatia. Outro provedor no
  config dá erro explícito.
- O OpenCode Go devolve 400 `MissingSessionID` sem o header `x-opencode-session`. Toda
  chamada leva um `sessionId`, e o `pi-ai` monta o header.
- O executável tem uns 88 MB, quase todos do runtime do Bun.
- Atualizar o `pi-ai` é decisão consciente, nunca automática.

## Reavaliar

Se o `pi-ai` mudar de escopo de novo ou sumir, trocar por outra biblioteca de provedores
(AI SDK da Vercel, por exemplo) só mexe na camada de chamada ao modelo.
