---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# Visão de Produto — Strata

Resumo executivo do `manifesto.md` em formato operacional. Para a versão poética e completa, leia o manifesto.

## Problema

Devs usam IA pra produzir mais código. Compreensão real cai. O que sobra é dependência da próxima geração de modelo — não conhecimento estratificado.

## Proposta

**Companion da sua IDE** — janela própria (Tauri) ou terminal — que **por padrão não escreve código pro usuário**. Em vez disso:
- Mapeia o terreno (arquitetura, conceitos)
- Aponta referências primárias (livros, papers, docs oficiais)
- Deposita nota Obsidian no vault do usuário
- Termina com **ponte pra IDE**: "abra `src/foo.ts:42` e faça X" — você implementa no seu editor

Quando o usuário precisa de execução pura (scaffolding, protótipo, refactor mecânico), ativa **Modo Mestre** com fricção deliberada — aí Strata coda direto no workspace.

A IDE continua sendo a fonte da verdade do código. Strata mexe nas **anotações** sempre, no **código** só quando você ativa Mestre.

## Métrica de sucesso

Não é "linhas de código geradas". É:
- Densidade do grafo do vault do usuário ao longo do tempo
- Bloom médio das notas crescendo (Lembrar → Aplicar → Avaliar → Criar)
- Razão Vereda/Mestre alta (>5:1) — usuário usa Mestre como exceção, não regra

## Anti-objetivos explícitos

- Não competir com Cursor/Copilot em velocidade de output
- Não otimizar pra "tempo até primeira linha de código"
- Não esconder Modo Mestre nem puni-lo — só não torná-lo o caminho natural
- Não logar conteúdo de notas nem prompts (privacidade do vault é absoluta)
