# Context Director: Strata

> **Para as IAs (sistema):** leia este documento antes de propor mudanças estruturais. Confirme contra o disco, não invente. Este doc descreve **como trabalhamos**, não a filosofia (essa está em `manifesto.md`) nem o backlog atual (esse está em `.speckit/`).
>
> Reescrito em 30/09/2026 a partir da direção nova: [`.speckit/product/direcao-2026-09.md`](.speckit/product/direcao-2026-09.md).

---

## §1. Identidade e Time

Definição operacional vive em [`CLAUDE.md`](CLAUDE.md). Em resumo:

| Papel | Quem | Escopo |
|---|---|---|
| Diretor | Cesar | Visão, prioridade, aprovação |
| Programador | Claude Code | Executa o aprovado, lê disco antes de propor |
| QA | TestSprite | Testes e2e, integração, cenários de borda |

IAs **não decidem mudança de stack ou arquitetura sozinhas**. Levantam como bloqueador e esperam aval.

---

## §2. Mentalidade Arquitetural

Strata é um **harness de estudo**: pesquisa fontes, guarda num acervo que a pessoa possui e ensina em vez de responder pela pessoa. Toda decisão técnica passa por estas lentes.

- **Fonte acima de memória.** Com o conhecimento do modelo desligado (o padrão), conceito vem de fonte com nome e endereço.
- **O acervo é da pessoa.** Markdown comum em pasta dela, em árvore de índices ([ADR-0007](.speckit/architecture/adr/ADR-0007-acervo-em-arvore-de-indices.md)). Obsidian é opcional.
- **Personalizável sem código empacotado.** Comportamento mora em arquivos que a pessoa lê e edita (`harness/modos/`, config). Nada de regra escondida.
- **Worse is better.** A versão simples que roda hoje vence a elegante que demora.
- **Tipos antes de código.** Nenhuma função sem interface TS definida.
- **Erro claro em vez de fallback silencioso.** Se o provedor falha, a pessoa vê o erro.
- **Soberania.** Rodar local é recomendado e sempre possível, mas a pessoa pode ligar a própria API. O importante é aprender, não onde o modelo roda.

---

## §3. Stack Travada (mudar só com aval explícito)

| Camada | Escolha | Por quê |
|---|---|---|
| Harness | Programa próprio em TypeScript, em `harness/` | ADR-0005. O ciclo do agente, as ferramentas, o acervo e os modos são nossos. |
| Provedores de modelo | `@earendil-works/pi-ai`, versão exata | ADR-0005. Só a camada de provedores. Primeira fatia: OpenCode Go, modelo `deepseek-v4-flash`. |
| Runtime e build do harness | Bun (testes, execução e `bun build --compile`) | O `pi-ai` exige Node 22.19 ou mais novo, e o Node da máquina do César é o 22.18. |
| Janela | Tauri v2 como cliente do harness, teto de 400 MB de RAM | ADR-0006. Electron recusado por RAM. Só depois da primeira fatia. |
| UI | React 19 + TS + TailwindCSS v3 + Zustand | Herdado de maio, para a janela. |
| Acervo | Markdown em árvore de índices | ADR-0007. |
| Busca de fontes | arXiv e Crossref (sem chave) | Medido em 30/09/2026. OpenAlex e Semantic Scholar entram depois, com chave. |
| Testes | `bun test` no harness, Vitest e Playwright na janela, TestSprite como QA | Testes do harness não usam rede. |
| Design System | Strata DS v2, registro editorial (Fraunces / Geist / Geist Mono) | [ADR-0003](.speckit/architecture/adr/ADR-0003-editorial-register.md). 18 telas desenhadas em `design/`. |

---

## §4. Regras Duras de Produto (nenhum config muda)

1. **O Strata nunca manda seus dados para fora.** Só sai o que vai para o provedor que a pessoa escolheu: sem telemetria, sem terceiro escondido. Com modelo local, nada sai. Com modelo na nuvem, o Strata diz claramente o que está saindo.
2. **Toda fonte citada existe.** O conferidor de citações barra id que não está no acervo.

Todo o resto é configurável, inclusive o modo padrão. A decisão de saber se alguma outra regra deve ficar travada está aberta no [ADR-0004](.speckit/architecture/adr/ADR-0004-customization-scope-extensible-vs-locked.md).

---

## §5. Mapa do Ecossistema

Estado em **2026-09-30**:

```
strata/
├── CLAUDE.md             instruções operacionais pra Claude Code
├── manifesto.md          filosofia, em inglês e português
├── README.md             overview público (ainda descreve a versão de maio)
├── CONTEXT_DIRECTOR.md   este documento
├── harness/              o harness (PR da Parte B da fatia 1)
├── .speckit/             specs vivas, planos, tracking, 7 ADRs
├── design/               DS v2 editorial + 18 telas + 4 fontes variable
├── src/, src-tauri/      casca da janela de maio (Tauri + React), ainda sem chat
└── e2e/                  Playwright
```

Próximo marco: a primeira fatia do harness no terminal. Plano em [`.speckit/plans/proposta-fatia-1.md`](.speckit/plans/proposta-fatia-1.md), tracking em [`.speckit/plans/current.md`](.speckit/plans/current.md).

---

## §6. Como cada IA consulta este doc

- **Claude Code (eu):** antes de propor qualquer feature, confirmo alinhamento com §2 (mentalidade), §3 (stack), §4 (regras duras). Desvio = bloqueador, nunca execução silenciosa.
- **TestSprite:** cenários obrigatórios derivados de §4 (nada de telemetria, toda fonte citada existe).
- **Planejador externo (se houver):** todo plano declara "Implicações em §3/§4" explicitamente.

---

*Atualize este documento quando uma decisão macro mudar. Decisões pontuais vão pra `.speckit/architecture/adr/`.*
