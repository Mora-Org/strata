---
dono: Cesar
atualizado: 2026-05-04
status: draft
---

# Integração com a IDE

Strata roda **ao lado** da IDE do usuário, não dentro. Janela própria (Tauri) ou terminal — o usuário escolhe o canal. A IDE permanece a "fonte da verdade" do código.

---

## Duas superfícies, um core

```
              ┌────────────────────────────────────────┐
              │  Strata Core (fork do Pi + extensões)  │
              └────────────────────────────────────────┘
                     ▲                       ▲
                     │                       │
              ┌──────┴──────┐         ┌──────┴──────┐
              │  Terminal   │         │ Tauri GUI   │
              │  (strata)   │         │ (janela)    │
              └─────────────┘         └─────────────┘
```

Mesma lógica, mesmo Mode Router, mesmo Note Builder. Diferença é só a casca de input/output.

**Regra:** nenhuma feature pode existir só em uma superfície sem versão equivalente na outra. UX pode diferir — capacidade não.

---

## Workspace awareness

| Abordagem | M0/M1 | M5+ |
|---|---|---|
| **A.** Usuário aponta pasta no Strata (file picker no Tauri / `--workspace` no CLI) | ✅ | mantido |
| **B.** Strata observa workspace ativo da IDE (extensão VSCode companion via socket) | ❌ | quando A estabilizar |

Em A, o workspace é um diretório que o Strata trata como contexto. As tools `read`/`grep`/`find`/`ls` (herdadas do Pi) operam relativas a ele. Em Vereda, são as únicas tools de FS disponíveis.

---

## Output em Vereda — "ponte pra IDE"

Vereda **não edita arquivos do workspace**. Mas **referencia eles explicitamente** pra que o usuário abra na IDE e implemente.

Formato esperado de uma resposta Vereda quando há ação no código:

```
{explicação do conceito}

→ Para implementar:
  - Abra `src/foo.ts:42`
  - Substitua o bloco `parseInput` por uma versão que valide com Zod
  - Estrutura sugerida no item 3 da nota gerada
```

A nota Obsidian gerada espelha isso na seção `### Próximos passos` (formato em [`obsidian-note-spec.md`](../product/obsidian-note-spec.md)).

---

## Output em Mestre — "execução com nota opcional"

Mestre edita arquivos diretamente. Por padrão **também gera nota** (registro do que foi feito + por quê — coerente com a metáfora geológica). Usuário pode `/sem-nota` num turno específico se quiser execução pura.

---

## Restrições herdadas do hardware/modelo local

Lições do `Czar210/claude-code-local`:

- **System prompt grande quebra modelo 7B** → prompt do Strata-Vereda fica em **≤2K tokens** (alvo; tunar em M2).
- **Tool-use em local é frágil** → camada de retry + parse-tolerance entre Pi loop e tool execution (M2).
- **Modelo local não memoriza projeto inteiro** → contexto seletivo via `read` sob demanda, não pre-load do workspace.

Hardware baseline: RTX 3050 8GB VRAM. Modelo recomendado: `qwen2.5-coder:7b-instruct-q4_K_M`.

---

## Open questions

- [ ] CLI da Strata: `strata` puro abre em Vereda terminal? `strata gui` abre janela? Ou `strata` detecta se há TTY?
- [ ] Janela Tauri "lembra" workspace entre sessões? (proposta: sim, em `~/.strata/recent-workspaces.json`)
- [ ] Extensão VSCode (abordagem B) — escopo mínimo? Talvez só "abrir Strata no workspace atual" sem socket bidirecional.
- [ ] Como Strata-Vereda no terminal renderiza a "ponte pra IDE"? (proposta: links `file://` clicáveis em terminais modernos; fallback texto)
