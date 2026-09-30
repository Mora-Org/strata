---
dono: Cesar
atualizado: 2026-09-30
status: ativo
supersedes: nenhum
superseded_by: nenhum
---

# ADR-0006: janela Tauri como cliente do harness, com teto de 400 MB de RAM

## Contexto

O César recusou Electron por consumo de RAM ("rodar um chromium é muito pesado"). Medido
no PC dele em 30/09/2026 (15,7 GB de RAM): o WebView2 do Teams usava 1.220 MB de memória
privada em 8 processos, e o da busca do Windows 173 MB em 5. No Windows, o Tauri usa o
WebView2, que é o motor do Chromium. O ganho sobre o Electron é não empacotar um Chromium
no instalador. O peso em memória depende sobretudo do que o app desenha.

O César espera que a maioria das pessoas ligue a própria API em vez de rodar modelo local.
Para essas pessoas, a janela é o que mais pesa na RAM.

## Decisão

1. A janela é Tauri v2, como cliente do harness. Ela sobe o executável do harness como
   processo auxiliar (`externalBin`) e conversa com ele por mensagens.
2. O terminal continua sendo uma superfície completa. Nenhuma capacidade existe só na
   janela.
3. Teto: com a tela de chat aberta e uma conversa longa carregada, a soma da memória
   privada do processo do Tauri com a dos processos do WebView2 dele fica em até 400 MB. O
   harness conta à parte, porque roda igual no terminal.

## Consequências

- A janela só entra depois da primeira fatia (harness no terminal), e é medida contra o
  teto antes de qualquer pessoa além do César usar.
- O harness procura a pasta `modos/` ao lado do executável. A janela precisa levá-la junto.
- Se a janela passar de 400 MB, o plano B é uma interface nativa em Rust (egui, iced ou
  Slint). Isso obriga a refazer o design system e a desenhar markdown, código e links à
  mão. A decisão de adotar o plano B fica para quando acontecer.

## Como medir

Somar a memória privada (`PrivateMemorySize64`) do processo do Tauri e dos processos
`msedgewebview2.exe` filhos dele, com a conversa longa aberta.
