/** @type {import('tailwindcss').Config} */
// Bridge Tailwind utilities to design tokens (CSS vars from design/colors_and_type.css).
// Single source of truth = design/. Tailwind classes here are just aliases —
// don't add a new color here without it existing in design/colors_and_type.css.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sedimentary z-layers (warm-leaning, never clinical)
        bedrock: 'var(--bedrock)',
        stratum: 'var(--stratum)',
        vein: 'var(--vein)',
        surface: 'var(--surface)',

        // Foreground (warm cream-white, nunca pure white)
        'fg-1': 'var(--fg-1)',
        'fg-2': 'var(--fg-2)',
        'fg-3': 'var(--fg-3)',
        'fg-4': 'var(--fg-4)',

        // Mode accent (data-mode swaps the value at <html>)
        accent: 'var(--accent)',
        'accent-fg': 'var(--accent-fg)',

        // Reference primitives (citation indigo + wiki-link lavender)
        'ref-citation': 'var(--ref-citation)',
        'ref-wikilink': 'var(--ref-wikilink)',

        // Bloom — saturated editorial 6-step ramp
        'bloom-1': 'var(--bloom-1)',
        'bloom-2': 'var(--bloom-2)',
        'bloom-3': 'var(--bloom-3)',
        'bloom-4': 'var(--bloom-4)',
        'bloom-5': 'var(--bloom-5)',
        'bloom-6': 'var(--bloom-6)',

        // Semantic
        error: 'var(--error)',
        success: 'var(--success)',

        // Borders + hover surface
        'border-1': 'var(--border-1)',
        'border-2': 'var(--border-2)',
        hover: 'var(--hover)',
      },
      fontFamily: {
        serif: 'var(--font-serif)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        0: '0',
        1: '3px',
        2: '6px',
      },
    },
  },
  plugins: [],
};
