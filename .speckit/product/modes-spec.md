---
dono: Cesar
atualizado: 2026-09-30
status: ativo
---

# Spec dos dois modos

Os modos se chamavam Vereda e Mestre. Em 30/09/2026 o César renomeou para Estudo e Ação. Os
identificadores `vereda` e `mestre` continuam no código da janela (`src/`) e no design
system até a fatia da janela Tauri, que faz o renome.

## Modo Estudo (padrão)

O prompt vive em `harness/modos/estudo.md`. Mudar o comportamento é editar esse arquivo.

### Faz
- Lê o acervo antes de buscar fora: índice raiz, depois o tema, depois as fontes.
- Pesquisa em fontes (arXiv e Crossref na primeira fatia) quando o acervo não basta.
- Guarda toda fonte que usa antes de citá-la.
- Pode escrever código de exemplo.
- Não apressa: começa pelo conceito base, diz de onde cada ideia veio e deixa o próximo
  passo de leitura.
- Termina com `## Fontes pra seguir`, em ordem de leitura.

### Não faz
- Responder conceito de memória quando o conhecimento do modelo está desligado.
- Citar fonte que não está guardada.
- Usar travessão ou negrito no texto.

### Conhecimento do modelo
Começa desligado. `/conhecimento ligado` acrescenta a seção de
`harness/modos/conhecimento-do-modelo.md` ao prompt. Com ele desligado e sem fonte que
sustente a resposta, o Strata escreve "Não achei fonte", conta o que buscou e para.

## Modo Ação

Escreve, edita e executa. Fica para fatia futura. Regras já decididas:
- Pode ser o padrão pelo config.
- Continua valendo o que vale para todo o Strata: nada sai da máquina além do que vai para o
  provedor escolhido, e toda fonte citada existe.
- Operação destrutiva (apagar, force-push, drop) pede confirmação.

## Casos de teste

1. Sessão nova abre no modo configurado, e Estudo é o padrão sem config.
2. Com o conhecimento desligado, pergunta sobre conceito inventado recebe "Não achei fonte".
3. Com o conhecimento desligado e um conceito real que não está no acervo, a resposta vem de
   fontes buscadas.
4. Com o conhecimento ligado, a mesma pergunta pode ser respondida de memória.
5. Id de fonte inexistente é barrado pelo conferidor.
