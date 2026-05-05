# Context Director — Strata

> **Para as IAs (sistema):** leia este documento antes de propor mudanças estruturais. Confirme contra o disco — não invente. Este doc descreve **como trabalhamos**, não a filosofia (essa está em `manifesto.md`) nem o backlog atual (esse está em `.speckit/`).

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

Strata é **local-first**, **vault-first**, **Vereda-first**. Toda decisão técnica passa por essas três lentes.

- **Tipos antes de código.** Nenhuma função sem interface TS definida. Nenhum endpoint sem schema.
- **Vereda como padrão é inquebrável.** Nenhuma feature pode tornar Modo Mestre o caminho natural. Atalho pra Mestre via UI ambígua = bug arquitetural.
- **Offline é postura, não fallback.** Ollama local é o caminho default. Cloud é opt-in com configuração explícita.
- **Vault é contrato.** Strata nunca edita nota existente sem permissão. Só cria em `inbox/`. Frontmatter segue schema canônico (`.speckit/product/obsidian-note-spec.md`).
- **Sem fallback silencioso entre providers.** Se Ollama cai e o usuário não configurou cloud, falha clara — não tenta cloud "por conveniência".
- **Atomicidade na geração da nota.** Se a IA gera resposta mas falha ao escrever no vault, o usuário vê o erro — não fica meia-nota órfã.
- **Observabilidade.** Log estruturado JSON, mascarar chave de API, nunca logar conteúdo da nota (privacidade do vault é absoluta).

---

## §3. Stack Travada (mudar só com aval explícito)

| Camada | Escolha | Por quê |
|---|---|---|
| Core agent | Fork de `@mariozechner/pi-coding-agent` | Pi já abstrai múltiplos providers e tem tool-use maduro. Forkar é mais barato que reimplementar e nos dá o ponto de divergência crucial pra Vereda/Mestre (instanciar Tool Executor com subset diferente). |
| GUI | Tauri v2 (Rust + WebView) | Binário enxuto coerente com postura local-first. Electron carrega Chromium completo — fricção maior, contradiz manifesto §VI. |
| UI framework | React 19 + TS + TailwindCSS v3 | React 19 estável. Tailwind v3 (não v4) — ecossistema de componentes ainda majoritariamente v3. |
| Estado | Zustand (slice pattern, setters explícitos) | Sem boilerplate de Redux. Setters explícitos > magic — coerente com "tipos e contratos antes". |
| Modelos locais | Ollama (`localhost:11434`) | API compatível OpenAI, modelos quantizados rodam em hardware modesto. RTX 3050 (8GB) é o baseline. |
| Modelos cloud | Anthropic, OpenAI, Gemini, DeepSeek, Groq, Cerebras (via Pi) | Herdado do Pi. Opt-in, nunca default. |
| Vault | Obsidian (markdown + YAML frontmatter) | Markdown é durável (manifesto §VII — "registro geológico"). Sem lock-in proprietário. |
| Testes | Vitest (unit) + Playwright (e2e) + TestSprite (QA) | Vitest é o padrão moderno de Vite. Playwright cobre Tauri WebView. TestSprite é decisão Mora. |
| Superfícies | CLI (`strata`) + GUI (Tauri) | "Terminal ou janela" — usuário escolhe canal. Mesmo core, mesmo Mode Router. Ver [`.speckit/architecture/ide-integration.md`](.speckit/architecture/ide-integration.md) e [ADR-0002](.speckit/architecture/adr/ADR-0002-strata-as-fork-app-not-extension.md). |
| Design System | Strata DS v2 (editorial register — Fraunces / Geist / Geist Mono variable, OFL · warm grounds · editorial-blue Vereda · warm-mustard Mestre · saturated Bloom ramp) | Editorial poster register (zine/livro técnico, não OS chrome). Identidade própria por produto Mora. 12 screens M1+M2 codificadas. Ver [`design/`](design/) + [`.speckit/product/design-system.md`](.speckit/product/design-system.md). [ADR-0003](.speckit/architecture/adr/ADR-0003-editorial-register.md). |

> **Cesar:** os "por quês" acima são inferidos do manifesto + CLAUDE.md. Edite o que estiver errado — essa coluna é doutrina, não pode estar imprecisa.

---

## §4. Regras Duras de Produto (não-negociáveis)

1. **Modo Vereda é o padrão. Sempre.** Modo Mestre é opt-in com fricção deliberada. Toggle persistente que mantenha Mestre ligado entre sessões = quebra a filosofia (manifesto §V).
2. **Strata nunca escreve código de produção pro usuário em Vereda.** Pode escrever pseudo-código didático, exemplo conceitual curto (≤10 linhas) pra ilustrar — nunca implementação completa pronta pra colar.
3. **Strata nunca edita nota existente do vault sem permissão explícita.** Cria em `inbox/` apenas. `inbox/` é território do Strata por contrato.
4. **Sem fallback silencioso de provider.** Cadeia de fallback é pública (Ollama → provider configurado → erro). Ordem nunca pulada sem o usuário saber.
5. **Frontmatter da nota segue schema único** (`tags`, `bloom`, `data`, `refs`, `relacionados`). Mudança no schema = ADR.
6. **Telemetria é opt-in.** Nada sai da máquina sem o usuário ligar explicitamente.
7. **Nunca logar conteúdo de nota nem prompt do usuário em arquivos de telemetria.** Privacidade do vault é absoluta.

---

## §5. Mapa do Ecossistema

Estado em **2026-05-05**:

```
strata/
├── CLAUDE.md             [existe] instruções operacionais pra Claude Code
├── manifesto.md          [existe] filosofia
├── README.md             [existe] overview público
├── CONTEXT_DIRECTOR.md   [existe] este documento
├── .gitignore            [existe] bloqueia *.zip + design system zips
├── .speckit/             [existe] specs vivas, planos, tracking, ADRs
├── design/               [existe] DS v2 editorial + 12 screens M1+M2 + 4 fontes variable + OFL
└── (sem código de produção ainda — M1 dev começa o scaffolding Tauri)
```

Próximo marco: M0.5.d (3 screens M3 quando quota Claude Design voltar) + M1 dev (scaffolding Tauri + fork Pi + reimplementação dos 12 screens em React/TS real). Tracking em [`.speckit/plans/current.md`](.speckit/plans/current.md).

---

## §6. Como cada IA consulta este doc

- **Claude Code (eu):** antes de propor qualquer feature, confirmo alinhamento com §2 (mentalidade), §3 (stack), §4 (regras duras). Desvio = bloqueador, nunca execução silenciosa.
- **TestSprite:** cenários obrigatórios derivados de §4 (testar que Mestre não persiste entre sessões; que `inbox/` é o único destino de escrita; que Ollama down + sem cloud = erro claro, não fallback silencioso).
- **Planejador externo (se houver):** todo plano declara "Implicações em §3/§4" explicitamente.

---

*Atualize este documento quando uma decisão macro mudar. Decisões pontuais vão pra `.speckit/architecture/adr/`.*
