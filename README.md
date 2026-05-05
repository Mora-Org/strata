<div align="center">

```
  ___________________________
 |  _______________________  |
 | |  ___________________  | |
 | | |                   | | |
 | | |     S T R A T A   | | |
 | | |___________________| | |
 | |_______________________| |
 |___________________________|
```

# Strata

*"Cada camada de entendimento é um registro permanente."*

[![License: MIT](https://img.shields.io/badge/License-MIT-c084fc?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Mora Org](https://img.shields.io/badge/Mora-Org-5eead4?style=flat-square)](https://github.com/Mora-Org)
[![Built with intention](https://img.shields.io/badge/Built%20with-Inten%C3%A7%C3%A3o-fb7185?style=flat-square)](manifesto.md)

</div>

---

## O que é

Strata é um agente de coding **local-first** que trabalha com o seu Obsidian — não contra o seu aprendizado.

Por padrão, ele não escreve código por você. Ele mapeia o terreno, aponta referências primárias, explica arquitetura e deposita camadas de entendimento diretamente no seu vault. Quando você quer que ele resolva — você ativa o **Modo Mestre**, com intenção.

Roda no terminal e em janela própria. Funciona offline.

---

## Dois modos

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [ VEREDA ]  Padrão                                             │
│              Guia. Referencia. Explica arquitetura.             │
│              Gera notas prontas para o seu vault Obsidian.      │
│              Nunca escreve código de produção por você.         │
│                                                                 │
│  [ MESTRE ]  Opt-in explícito                                   │
│              Agente completo. Escreve, edita, executa.          │
│              Ativado com intenção — não por conveniência.       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Como funciona

1. Você traz um problema ou conceito
2. No **Modo Vereda**, Strata explica o terreno, aponta recursos e gera uma nota `.md` para o seu vault
3. A nota inclui nível Bloom estimado, backlinks e referências primárias
4. **Você implementa.** O entendimento é seu.

---

## Integração Obsidian

Strata gera notas com frontmatter compatível:

```markdown
---
tags: [conceito, sistemas, c]
bloom: 2
data: 2026-05-04
refs: [K&R, CS:APP]
---

## [[malloc]] e o Heap

O heap é a região de memória gerenciada manualmente...
```

As notas vão direto para `inbox/` ou `conceitos/` do seu vault — você decide.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Core agent | Fork do [Pi](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent) (TypeScript) |
| GUI | Tauri (Rust) + React + TypeScript + TailwindCSS |
| Estado | Zustand |
| Modelos locais | Ollama |
| Modelos cloud | Anthropic, OpenAI, Gemini, DeepSeek e outros (via Pi) |
| Vault | Obsidian (markdown + frontmatter) |
| Design system | Strata DS v2 — editorial register (Fraunces / Geist / Geist Mono variable) — ver [`design/`](design/) |

---

## Por que existe

As ferramentas de IA atuais otimizam para velocidade de output.  
Strata otimiza para profundidade de entendimento.

A maioria das ferramentas escreve o código por você.  
Strata mostra o caminho e espera você andar.

Leia o [**Manifesto Strata →**](manifesto.md)

---

## Parte da Mora

> *Glyph · Atlas · Lattes Director · **Strata***

[**Mora Org →**](https://github.com/Mora-Org)

---

<div align="center">

**Strata** · Um produto Mora · Open Source com alma

</div>
