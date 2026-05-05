---
dono: Cesar
atualizado: 2026-05-05
status: ativo
supersedes: nenhum
superseded_by: nenhum
---

# ADR-0003 — Editorial register chosen as Strata's visual language

## Contexto

Strata precisava de um Design System. Quatro opções avaliadas em sessão de design 2026-05-04:

1. **Reusar Atlas DS** (sister Mora product)
2. **Reusar Glyph DS** (sister Mora product)
3. **Reusar Metis DS** (produto external, não-Mora)
4. **Criar do zero**

Cesar avaliou as 3 reusáveis e nenhuma encaixou:

- **Atlas e Glyph** foram caracterizados como "designs velhos" (palavras dele) — herdariam baggage de produtos diferentes, criados em outro contexto
- **Metis** era external, não-Mora — quebraria coerência da org
- **Princípio Mora compartilhado:** cada produto tem manifesto próprio = identidade visual própria. Reusar DS de produto irmão quebra isso na primeira escolha visual

### Iterações de design (Claude Design)

**Iteração 1 — desaturated/austere "OS chrome calmo":**
DS criado from-scratch via Claude Design. Tecnicamente excelente (Fraunces/Geist, sedimentary metaphor, primitives funcionais). Mas Cesar identificou: *"gostaria de algo mais colorido, identidade própria, meio estilo revista"*. Diagnóstico: enfatizei "calma" demais, "deliberada" de menos. Magazine não é loud — é opinionada.

**Iteração 2 — editorial poster register (✓ aprovado):**
Cesar trouxe **7 referências visuais** de posters editoriais:
1. **"retro"** — cream/peach + massive blue serif + cloud photo masking
2. **"REST IN PEACE"** — bronze + knight-masked title plate + marginalia
3. **"Yellow Grass"** — grayscale halftone + ONE saturated yellow accent
4. **"SOLITARY"** — photograph + thin frame + repeated mantra text
5. **"residential BRUTALISM"** — architectural plate + display serif over photo
6. **"MONDAY"** — cream + ornate display serif + three-column hyphen header
7. **"Drink Well / Live Well"** — repeated navy serif italic + cocktail photo

Linguagem compartilhada extraída: warm grounds, display serif como compositional anchor, ONE saturated accent per surface, hyphen-prefixed metadata strips, thin frame + corner marks, italic serif para voice, asymmetric placements.

## Decisão

**Strata DS v2 — registro editorial (zine/poster).**

Componentes da decisão:

### Tipografia (3 famílias, todas OFL)

- **Fraunces** variable (axes opsz 9-144 / SOFT 0-100 / WONK 0-1 / wght 300-700) — body + display
- **Geist** variable (wght 100-900) — UI chrome
- **Geist Mono** variable (wght 100-900) — code, file:line, masthead values

Self-hosted em `design/assets/fonts/`. Fraunces faz dupla duty: opsz 18 SOFT 0 calmo pra body, opsz 144 SOFT 100 WONK 1 characterful pra display.

### Color

- **Grounds:** warm-charcoal navy dark (`oklch(0.18 0.020 250)`) + warm cream light (`oklch(0.97 0.015 75)`) — never clinical slate ou pure white
- **Vereda accent:** deep editorial blue (`oklch(0.62 0.14 255)` dark) — calm, considered, literary
- **Mestre accent:** warm mustard/bronze (`oklch(0.74 0.13 75)` dark) — active, present, earth-bound (NÃO alarm-red)
- **Bloom ramp:** saturated editorial 6-step (deep blue → teal → green → mustard → bronze → rust)
- **Reference primitives:** indigo (citation) + lavender (wiki-link) — README-palette territory used sparingly

### 7 editorial primitives

`.masthead` (hyphen-cols metadata) · `.frame.marks` (hairline + `+` corner glyphs) · `.italic-display` (Fraunces opsz 144 SOFT 100 WONK 1) · `.bloom-rail` (4px solid vertical) · `.hyphen-cols` (three-column header) · `.pullquote` (italic Fraunces 32px max 26ch) · `.accent-bar` (4px horizontal saturated)

Plus primitives funcionais (`.mode-badge`, `.bridge`, `.ref-chip`, `.wiki-chip`, `.bloom`, `.frontmatter`, `.tag`).

### 6 type roles, sem mais

display · h1 · h2 · body · ui · mono — variants via `font-variation-settings`, não via novas roles.

---

## Consequências

### Positivas

- **Identidade única** — não confundível com Atlas/Glyph/Metis nem com produtos external (Cursor, Notion, Linear)
- **Editorial register defensável** em manifesto (alma, pausa, "página de revista técnica") — não é decoração arbitrária
- **Open-source fonts** evita licensing complications + redistribuição direta
- **Variable axes (Fraunces)** fazem dupla duty (calmo body + characterful display) com 1 arquivo
- **Saturated Bloom** vira brand mark visual (legível at-a-glance, não desaturated heatmap)
- **Mode contract claro** (accent shift only, never layout change) protege produto de feature drift

### Negativas

- **Mais opinativo = menos modular** — usuário não pode "tematizar" Strata como Material You. (Decidido fine, ver [ADR-0004](ADR-0004-customization-scope-extensible-vs-locked.md) — DS tokens são overrideable mas mode contract é regra dura)
- **Editorial discipline requer continued attention** — não é "set tokens and forget". Cada nova screen tem que se perguntar "isso parece magazine ou OS chrome?"
- **Brand mark é placeholder** ainda — 4-stratum SVG aceito como working version, logo final pendente

### Trade-offs aceitos

- **NÃO é AAA-acessível por default** — variable type pode complicar a11y; target WCAG AA mínimo em M5+, AAA é stretch
- **NÃO é tema-customizável** tipo dashboards corporativos — escopo deliberadamente restrito
- **NÃO usa imagery** em product chrome — restraint editorial, não generic empty states

---

## Mitigações

1. **Variable Fraunces:** documentado em [`design-system.md`](../../product/design-system.md) — opsz 18 SOFT 0 pra body, opsz 144 SOFT 100 WONK 1 pra display. Nunca valores manuais fora dessas presets.
2. **A11y:** target WCAG AA em M5; AAA stretch goal — necessita auditoria especialista quando atingir M5
3. **Brand mark:** revisitar quando logo final aparecer; atualmente 4-stratum SVG (`design/assets/strata-mark.svg`) é working placeholder — mantém manifesto §III (estratificação) visível
4. **Drift de editorial register:** em cada PR de UI, revisar contra os 7 anti-patterns críticos (ver [`design-system.md`](../../product/design-system.md) seção Anti-patterns)

---

## Materializado em

- `design/colors_and_type.css` — tokens completos (oklch, type families, primitives, base classes)
- `design/README.md` — guia visual completo (skill manifest)
- `design/SKILL.md` — Claude Code skill manifest pra reutilizar DS em outros projetos
- `design/ui_kits/strata-desktop/` — kit reference + 12 screens M1+M2 em `screens/`
- `design/preview/` — 12 review cards (formato editorial spread)
- `design/assets/fonts/` — 4 variable font files + 2 OFL.txt licenses
- `.speckit/product/design-system.md` — spec canônico enxuto (esta é a referência tldr)

---

## Pendente (M0.5.d — quando quota Claude Design voltar)

3 screens M3 ainda não desenhadas via Claude Design (semana acabou):

- 3.1 Session branch tree (signature primitive — geological metaphor literal)
- 3.2 Fork from message (interaction)
- 3.3 Command palette (Cmd+K)

Specs já prontas em [`m05-screens-m3.md`](../../plans/m05-screens-m3.md). Quando vier, codifica como M0.5.d (iteração pequena que adiciona ao `design/` existente).

---

## Relação com outros ADRs

- **[ADR-0001](ADR-0001-fork-pi-vs-from-scratch.md)** (forkar Pi) — não conflita; DS é sobre visual layer
- **[ADR-0002](ADR-0002-strata-as-fork-app-not-extension.md)** (app standalone) — habilitou ter GUI Tauri própria pra carry o DS editorial
- **[ADR-0004](ADR-0004-customization-scope-extensible-vs-locked.md)** (customization scope) — DS tokens são overrideable; mode contract é regra dura travada (não-customizável)

---

## Notas

ADR foundational pro produto. Atualizar quando:
- DS v3 vier (mudança maior de tokens ou primitives)
- Brand mark final substituir o 4-stratum placeholder
- A11y audit em M5 trouxer ajustes
