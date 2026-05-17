import { describe, it, expect } from 'vitest';
import { DEFAULT_MODE, DEFAULT_THEME, DEFAULT_INBOX_FOLDER } from '../lib/types';
import type {
  StrataMode,
  StrataTheme,
  WorkspaceConfig,
  VaultConfig,
} from '../lib/types';

describe('Strata core types & defaults', () => {
  it('DEFAULT_MODE is "vereda" (Director §4 hard rule)', () => {
    expect(DEFAULT_MODE).toBe('vereda');
  });

  it('DEFAULT_THEME is "dark" (DS v2 dark-first canonical)', () => {
    expect(DEFAULT_THEME).toBe('dark');
  });

  it('DEFAULT_INBOX_FOLDER is "inbox" (Obsidian convention)', () => {
    expect(DEFAULT_INBOX_FOLDER).toBe('inbox');
  });

  it('StrataMode type accepts both valid values', () => {
    const a: StrataMode = 'vereda';
    const b: StrataMode = 'mestre';
    expect(a).toBe('vereda');
    expect(b).toBe('mestre');
  });

  it('StrataTheme type accepts both valid values', () => {
    const a: StrataTheme = 'dark';
    const b: StrataTheme = 'light';
    expect(a).toBe('dark');
    expect(b).toBe('light');
  });

  it('WorkspaceConfig requires path and name', () => {
    const ws: WorkspaceConfig = { path: '/tmp/work', name: 'strata-cli' };
    expect(ws.path).toBe('/tmp/work');
    expect(ws.name).toBe('strata-cli');
  });

  it('VaultConfig requires path and inboxFolder', () => {
    const vault: VaultConfig = { path: '/tmp/vault', inboxFolder: 'inbox' };
    expect(vault.path).toBe('/tmp/vault');
    expect(vault.inboxFolder).toBe('inbox');
  });
});
