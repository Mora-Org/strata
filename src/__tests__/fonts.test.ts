import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

// Font bundle contract: 4 variable fonts + 2 OFL licenses live in
// design/assets/fonts/. M1.a tests filesystem presence; M1.c will
// test actual document.fonts.check() in jsdom or playwright e2e.

describe('fonts (variable, self-hosted in design/assets/fonts/)', () => {
  const FONTS_DIR = resolve(__dirname, '../../design/assets/fonts');

  it('Fraunces variable upright (.ttf) exists', () => {
    // Renamed from "Fraunces[SOFT,WONK,opsz,wght].ttf" (Google Fonts default)
    // to "Fraunces-VariableFont.ttf" for URL-safe bundling — Vite was failing
    // to resolve filenames with [ ] , characters at build time.
    const path = resolve(FONTS_DIR, 'Fraunces-VariableFont.ttf');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(100_000);
  });

  it('Fraunces variable italic (.ttf) exists', () => {
    const path = resolve(FONTS_DIR, 'Fraunces-Italic-VariableFont.ttf');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(100_000);
  });

  it('Geist VF (.woff2) exists', () => {
    const path = resolve(FONTS_DIR, 'GeistVF.woff2');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(10_000);
  });

  it('Geist Mono VF (.woff2) exists', () => {
    const path = resolve(FONTS_DIR, 'GeistMonoVF.woff2');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(10_000);
  });

  it('Fraunces OFL license preserved', () => {
    expect(existsSync(resolve(FONTS_DIR, 'Fraunces-OFL.txt'))).toBe(true);
  });

  it('Geist OFL license preserved', () => {
    expect(existsSync(resolve(FONTS_DIR, 'Geist-OFL.txt'))).toBe(true);
  });
});
