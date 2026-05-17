# DEV.md — Strata Developer Setup

Quick reference pra rodar Strata localmente em dev. Pra filosofia/produto, ver [`manifesto.md`](manifesto.md). Pra regras/stack, ver [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md). Pra plano atual, ver [`.speckit/plans/current.md`](.speckit/plans/current.md).

## Pré-requisitos

- **Node.js 22+** (atual: v22.18+)
- **npm 10+**
- **Ollama** (pra M1.d+) rodando em `localhost:11434` — `ollama serve`
- **Rust + Tauri 2 CLI + MSVC build tools** (Windows) — vem em M1.b

## Instalação

```bash
npm install
```

## Comandos

```bash
npm run dev          # dev server Vite (localhost:5173)
npm run build        # build produção (TS check + Vite bundle)
npm run preview      # preview do build local
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run (CI-friendly)
npm run test:ui      # Vitest UI interativa
```

## Estrutura

```
strata/
├── design/                       DS canônico — referência visual (não runtime)
├── src/                          código React/TS
│   ├── main.tsx                  entry point
│   ├── App.tsx                   componente raiz
│   ├── index.css                 entry CSS (importa tokens + Tailwind)
│   ├── styles/
│   │   └── tokens.css            bridge pra design/colors_and_type.css
│   ├── setupTests.ts             Vitest setup (jest-dom matchers)
│   ├── App.test.tsx              smoke test
│   └── __tests__/
│       ├── tokens.test.ts        token bridge contract
│       └── fonts.test.ts         fonts bundle contract
├── .speckit/                     specs vivas
├── index.html                    Vite entry HTML
├── package.json
├── tsconfig.json + tsconfig.app.json + tsconfig.node.json
├── vite.config.ts                Vite + Vitest config
├── tailwind.config.js
├── postcss.config.js
└── DEV.md                        este arquivo
```

## Token bridge — como funciona

`src/styles/tokens.css` faz `@import '../../design/colors_and_type.css'`. O DS canônico (em `design/`) é a **single source of truth**.

- Mudanças em `design/colors_and_type.css` refletem automaticamente em `src/`
- `@font-face` dentro do colors_and_type.css resolve paths relativos à PRÓPRIA localização do arquivo CSS — fontes em `design/assets/fonts/` continuam alcançáveis
- Tokens disponíveis em qualquer componente via `var(--bedrock)`, `var(--accent)`, `var(--bloom-3)`, etc.

**Não duplique tokens.** Se precisar de novo token, adicione em `design/colors_and_type.css` e ele aparece automaticamente.

## Testes (estado em M1.a)

| Suite | Cobre |
|---|---|
| `App.test.tsx` | App renderiza, marker M1.a presente, landmark `<main>` |
| `__tests__/tokens.test.ts` | Bridge existe, design tokens file presente, oklch vars + Bloom ramp + type families declarados |
| `__tests__/fonts.test.ts` | 4 variable fonts presentes em design/assets/fonts/, OFL licenses preservadas |

**Próximos passos de teste (por sub-pass):**
- **M1.b** — Pi session com mock, Ollama client com fetch mockado
- **M1.c** — Snapshot tests contra design/ HTML, Playwright e2e setup
- **M1.d** — e2e smoke (input → reply visível), stream parsing, banner connection-lost
- **M1.e** — Settings save/load, workspace picker e2e
- **M1.f** — A11y audit baseline, TestSprite QA scenarios escritos

## Sobre o design/

A pasta `design/` contém 18 screens M1+M2+M3 desenhadas via Claude Design — **kit de referência visual**, NÃO runtime. Em M1.c reimplemento as M1 screens em React real, usando o HTML/CSS do kit como guia.

Pra rever visualmente o kit (precisa servidor HTTP por causa do React via Babel CDN):
```bash
cd design/ui_kits/strata-desktop
python -m http.server 8765
# abre http://localhost:8765
```

## Stack travada (CLAUDE.md §3)

Stack mudou? Atualizar [`CONTEXT_DIRECTOR.md`](CONTEXT_DIRECTOR.md) §3 e abrir ADR. Stack atual:

- **Build:** Vite 7 + TypeScript strict
- **UI:** React 19 + TailwindCSS v3
- **Estado:** Zustand (entra em M1.c)
- **Testes:** Vitest 3 + Testing Library + jsdom + Playwright (M1.c+) + TestSprite (QA)
- **Tauri 2** (entra em M1.b)
- **Pi fork** (entra em M1.b)
- **Design system:** Strata DS v2 — ver `design/` + `.speckit/product/design-system.md`
