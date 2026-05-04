---
dono: Cesar
atualizado: 2026-05-04
status: draft
---

# Spec dos Dois Modos

## Modo Vereda (padrão)

### Pode
- Explicar conceitos, arquiteturas, mecanismos internos
- Apontar referências primárias com citação
- Mostrar pseudo-código didático curto (≤10 linhas, ilustrativo)
- Gerar nota markdown no `inbox/` do vault
- Ler arquivos do projeto do usuário pra contextualizar explicação

### Não pode
- Escrever arquivo de código de produção (`.ts`, `.py`, `.rs`, etc.)
- Editar arquivo existente do projeto do usuário
- Editar nota existente do vault
- Executar comandos no shell do usuário
- Sugerir solução completa pronta pra colar

### Output esperado de um turno
1. Resposta no chat (explicação + referências)
2. **Quando há ação no código do usuário**, resposta termina com **"ponte pra IDE"**: referência explícita a arquivo:linha + o que fazer ali. Strata aponta, usuário implementa na IDE dele. Detalhe em [`../architecture/ide-integration.md`](../architecture/ide-integration.md).
3. Nota `.md` em `inbox/` (formato em `obsidian-note-spec.md`) — quando a resposta tem densidade conceitual; a seção `Próximos passos` da nota espelha a ponte pra IDE
4. Nenhum outro side-effect

### Restrição de design (modelo local)
System prompt do Strata-Vereda fica em **≤2K tokens** (alvo). Razão: modelos locais 7B (Qwen2.5-coder, DeepSeek-coder) degradam com prompts grandes — lição extraída de [`Czar210/claude-code-local`](https://github.com/Czar210/claude-code-local), que strippa o harness de 10K tokens do Claude Code antes de enviar pro modelo MLX. Tunar valor exato em M2.

## Modo Mestre (opt-in)

### Ativação
- Comando explícito do usuário (ex: `/mestre`, botão com confirmação modal)
- **Não persiste entre sessões.** Toda nova sessão começa em Vereda.
- Indicador visual permanente quando ativo (cor diferente, badge persistente no header)

### Pode
- Tudo que um agente de coding faz: ler, escrever, editar, executar
- Mantém capacidade de gerar nota Obsidian (não desliga Vereda — adiciona Mestre por cima)

### Não pode
- Continuar ativo após `/sair-mestre` ou fim da sessão
- Executar sem confirmação operações destrutivas (delete, force-push, drop)

## Fluxo de transição

```
[Vereda] --usuário digita /mestre--> [Confirmação] --sim--> [Mestre]
                                          |
                                          não
                                          v
                                       [Vereda]

[Mestre] --usuário digita /vereda OU fecha sessão--> [Vereda]
```

## Casos de teste obrigatórios (TestSprite)

1. Sessão nova abre em Vereda — sempre.
2. `/mestre` sem confirmação não ativa.
3. Em Vereda, tentativa de `Write`/`Edit`/`Bash` é bloqueada com mensagem clara.
4. Em Mestre, badge visual presente em todo turno.
5. Fechar e reabrir = volta pra Vereda mesmo se última sessão era Mestre.
6. Em Mestre, tentativa de `rm -rf` ou similar pede confirmação extra.
