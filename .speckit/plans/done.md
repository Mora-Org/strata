---
dono: Cesar
atualizado: 2026-09-30
status: ativo
---

# Iterações Concluídas

## M0: fundação documental (fechada 2026-05-04)
`CONTEXT_DIRECTOR.md`, `.speckit/`, repo público `Mora-Org/strata`. Commit `7253929`.

## M0.5: fundação visual (fechada 2026-05-16)
Design System v2 (registro editorial: Fraunces, Geist, Geist Mono, terrenos quentes) e 18 telas
desenhadas com o Claude Design, codificadas em `design/`. Quatro fontes variable e duas licenças
OFL versionadas. ADR-0003 registra a escolha do registro editorial.

## M1.a: fundação do frontend (fechada 2026-05-17)
Vite 7, React 19, TypeScript strict, Tailwind v3, Vitest. Ponte de tokens que importa
`design/colors_and_type.css`. 16 testes.

## M1.b: Tauri 2, wrapper do Pi e cliente do Ollama (fechada 2026-05-17)
Casca Tauri 2, wrapper do `@mariozechner/pi-coding-agent` e cliente HTTP do Ollama, 40 testes com
mocks. O wrapper e o cliente foram apagados em 30/09/2026 (ADR-0005): o Pi era importado no
frontend, dentro do webview, onde não existe Node, e o `pi-ai` cobre o Ollama.

## M1 (M1.c a M1.f): encerrado sem entrega em 2026-09-30
O projeto parou em 17/05/2026. Não chegou a existir chat funcionando. O trabalho de interface
(M1.c: Header, Sidebar, Composer, Zustand, Playwright) entrou na casca e fica para a fatia da
janela. A direção mudou em 30/09/2026 (ver `product/direcao-2026-09.md`), e o M1 de maio deixou
de ser o plano.
