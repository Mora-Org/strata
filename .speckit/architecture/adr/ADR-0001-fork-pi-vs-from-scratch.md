---
dono: Cesar
atualizado: 2026-05-04
status: ativo
supersedes: nenhum
superseded_by: nenhum
---

# ADR-0001 — Forkar Pi vs reimplementar do zero

## Contexto

Strata precisa de um loop de agente: receber prompt, chamar provider, executar tools, devolver resposta. Existem três caminhos:

1. Reimplementar do zero em TS
2. Forkar `@mariozechner/pi-coding-agent`
3. Usar Pi como dependência sem fork

## Decisão

**Forkar.**

## Consequências

### Positivas
- Pi já tem providers (Anthropic, OpenAI, Gemini, DeepSeek, Groq, Cerebras) maduros
- Tool-use já implementado e testado
- Fork (vs dependência) permite o ponto de divergência crucial: instanciar Tool Executor com subset diferente em Vereda vs Mestre — algo que Pi como dep não permite limpo
- TypeScript, mesmo ecossistema do resto do Strata

### Negativas
- Carregamos manutenção de mudanças upstream do Pi
- Risco de divergência: se Pi evoluir muito, sync vira custo
- Decisão arquitetural do Pi (loop, formato de mensagem) vira nossa por inércia

## Mitigações
- Manter `UPSTREAM.md` listando commits do Pi já mergeados
- Reservar `src/lib/pi/strata-extensions/` pra código nosso — não tocar no fork direto fora dali
- Reavaliar em 6 meses (2026-11)
