---
name: strata-design
description: Use this skill to generate well-branded interfaces and assets for Strata (a local-first coding companion by Mora), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. The brand language is "calma deliberada" — stratified, reading-first, dark-by-default, two-mode (Vereda/Mestre).
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

The system is organized as:

- `README.md` — voice, visual foundations, iconography, content rules
- `colors_and_type.css` — copy this in and `@import` it; provides every CSS variable and semantic class (mode badge, bridge, ref-chip, wiki-chip, bloom, frontmatter, tag, btn)
- `assets/` — Strata mark, wordmarks
- `preview/` — small reference cards for each token group; useful as a visual sanity check
- `ui_kits/strata-desktop/` — full interactive recreation of the app; lift components and styles from here

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. The fastest path is:

1. Add `<html data-theme="dark" data-mode="vereda">` to your root.
2. Link `colors_and_type.css`.
3. Compose with the semantic classes (`mode-badge`, `bridge`, `ref-chip`, `wiki-chip`, `bloom bloom-3`, `frontmatter`, `tag`, `btn`, `btn-primary`).
4. Switch to Mestre by setting `data-mode="mestre"` on `<html>` — accent colors update, layout does not.

If working on production code, read the rules in `README.md` to become an expert in designing with this brand. Three rules dominate:

- **No flashy gradients, no pulsing badges, no urgency cues.** The brand is the pause.
- **Mode is a posture, not a layout.** Vereda → Mestre changes only the accent and the badge.
- **References are first-class.** Citations and wiki-links get their own primitives — never grey-text.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a screen, a marketing page, a slide, a generated note), ask some questions about scope and tone, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
