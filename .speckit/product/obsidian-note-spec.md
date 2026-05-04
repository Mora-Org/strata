---
dono: Cesar
atualizado: 2026-05-04
status: ativo
---

# Spec Canônico da Nota Obsidian

Formato único. Mudança aqui = novo ADR.

## Estrutura

```markdown
---
tags: [strata, conceito, {area}]
bloom: {1-6}
data: {YYYY-MM-DD}
refs: [{fonte primária 1}, {fonte primária 2}]
relacionados: [[{conceito existente no vault}]]
---

## {Título do Conceito}

{Explicação em prosa — sem código de produção}

### Como funciona

{Mecanismo interno, não implementação}

### Referências primárias

- {Livro/paper/doc oficial com edição/versão se aplicável}

### Próximos passos

- [ ] {O que o usuário deve implementar/explorar}
```

## Regras de cada campo

| Campo | Regra |
|---|---|
| `tags` | sempre inclui `strata` e `conceito`. `{area}` vem da inferência da conversa. |
| `bloom` | inteiro 1-6 (Bloom revisado: Lembrar, Entender, Aplicar, Analisar, Avaliar, Criar). Strata estima conservador — preferir subestimar. |
| `data` | ISO `YYYY-MM-DD`. Sem hora. |
| `refs` | mínimo 1 fonte primária. Se Strata não tem fonte, **não gera nota** — pede ao usuário ou diz que não sabe. |
| `relacionados` | só se Strata leu o vault e identificou nota existente. Sem inventar wikilinks. |

## Destino

- Sempre `inbox/{slug-do-titulo}-{YYYYMMDD}.md` no vault configurado
- Slug em kebab-case ASCII
- Se já existir arquivo com mesmo nome → sufixo `-2`, `-3`, ...
- Nunca sobrescrever

## Falhas

- Vault não configurado → erro claro no chat, não gera arquivo
- `inbox/` não existe → cria a pasta (uma exceção à regra de "não tocar no vault sem permissão" — `inbox/` é território do Strata por contrato)
- Disco cheio → erro claro, conteúdo da nota fica disponível pra copiar do chat
