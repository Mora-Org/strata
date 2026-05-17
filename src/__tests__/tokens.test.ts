import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Token bridge contract: src/ depends on design/colors_and_type.css as
// single source of truth. These tests are deterministic — verify the
// contract at filesystem level (visual rendering tested in e2e M1.c).

describe('token bridge (design/ → src/)', () => {
  const REPO_ROOT = resolve(__dirname, '../..');
  const DESIGN_TOKENS = resolve(REPO_ROOT, 'design/colors_and_type.css');
  const SRC_BRIDGE = resolve(REPO_ROOT, 'src/styles/tokens.css');

  it('design/colors_and_type.css exists at canonical path', () => {
    expect(existsSync(DESIGN_TOKENS)).toBe(true);
  });

  it('src/styles/tokens.css exists', () => {
    expect(existsSync(SRC_BRIDGE)).toBe(true);
  });

  it('bridge imports from design/colors_and_type.css', () => {
    const content = readFileSync(SRC_BRIDGE, 'utf-8');
    expect(content).toMatch(/@import.*design\/colors_and_type\.css/);
  });

  it('design tokens file contains key oklch color variables', () => {
    const content = readFileSync(DESIGN_TOKENS, 'utf-8');
    expect(content).toContain('--bedrock');
    expect(content).toContain('--accent');
    expect(content).toContain('--fg-1');
  });

  it('design tokens file contains Bloom ramp (6 levels)', () => {
    const content = readFileSync(DESIGN_TOKENS, 'utf-8');
    expect(content).toContain('--bloom-1');
    expect(content).toContain('--bloom-2');
    expect(content).toContain('--bloom-3');
    expect(content).toContain('--bloom-4');
    expect(content).toContain('--bloom-5');
    expect(content).toContain('--bloom-6');
  });

  it('design tokens file declares editorial type families', () => {
    const content = readFileSync(DESIGN_TOKENS, 'utf-8');
    expect(content).toMatch(/Fraunces/);
    expect(content).toMatch(/Geist/);
  });

  it('design tokens file declares @font-face for self-hosted fonts', () => {
    const content = readFileSync(DESIGN_TOKENS, 'utf-8');
    expect(content).toContain('@font-face');
  });
});
