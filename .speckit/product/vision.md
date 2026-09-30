---
dono: Cesar
atualizado: 2026-09-30
status: ativo
---

# Visão de produto: Strata

Resumo operacional do `manifesto.md`. A direção completa, com as falas do César, está em
[`direcao-2026-09.md`](direcao-2026-09.md) e [`entrevista-manifesto.md`](entrevista-manifesto.md).

## Problema

Quem usa IA para programar copia e cola código e não aprende. Quem não fuça não aprende. E
a IA alucina e não toma responsabilidade pelo que diz.

## Proposta

Um harness de estudo, open source e altamente personalizável, para quem quer aprender a
programar e para quem faz pesquisa acadêmica. Ele:

- pesquisa o conceito em fontes com nome e endereço, em vez de responder de memória;
- guarda cada fonte num acervo que a pessoa possui, em árvore de índices;
- responde com as fontes já guardadas e lista quais seguir, em ordem;
- lembra da base que o aluno achou boa e descarta para sempre a que achou ruim (fatia futura);
- recomenda modelos locais e explica custo contra privacidade, mas deixa ligar a própria API.

O modo padrão é Estudo. O modo Ação escreve, edita e executa, e pode virar padrão pelo
config. O conhecimento do próprio modelo começa desligado e a pessoa liga quando quiser.

## Primeiros usuários

O César, depois um amigo que sabe um pouco de JavaScript e quer mudar de área, e outro que
já programa e quer se especializar para o mestrado.

## Métrica de sucesso

Não é velocidade. É a pessoa conseguir dizer em quem confiou e por quê:
- fontes guardadas por tema, e quantas o aluno marcou como boas ou descartadas;
- respostas em que toda afirmação aponta para uma fonte que existe;
- o aluno abrindo a fonte, não só a resposta.

## Regras que nenhum config muda

1. O Strata nunca manda seus dados para fora. Só sai o que vai para o provedor escolhido:
   sem telemetria, sem terceiro escondido. Com modelo local, nada sai. Com modelo na nuvem,
   o Strata diz claramente o que está saindo.
2. Toda fonte citada existe.

## Anti-objetivos

- Não competir em velocidade de resposta com os agentes de código.
- Não esconder o modo Ação nem puni-lo.
- Não travar a pessoa em código empacotado: o comportamento mora em arquivos que ela edita.
