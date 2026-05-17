import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Pi entirely — we don't want to create a real Pi session in unit tests
// (would require ModelRegistry, AuthStorage, etc. configured). Real Pi
// integration happens in e2e (M1.d+).
// Shape mirrors CreateAgentSessionResult from Pi's SDK type.
vi.mock('@mariozechner/pi-coding-agent', () => ({
  createAgentSession: vi.fn().mockResolvedValue({
    session: { id: 'mock-session' },
    extensionsResult: { extensions: [], errors: [], diagnostics: [] },
  }),
}));

import { createStrataSession } from '../lib/pi/session';
import { createAgentSession } from '@mariozechner/pi-coding-agent';

beforeEach(() => {
  vi.mocked(createAgentSession).mockClear();
});

describe('createStrataSession', () => {
  it('defaults mode to "vereda" (Director §4 hard rule)', async () => {
    const handle = await createStrataSession();
    expect(handle.mode).toBe('vereda');
  });

  it('respects explicit mode "mestre"', async () => {
    const handle = await createStrataSession({ mode: 'mestre' });
    expect(handle.mode).toBe('mestre');
  });

  it('passes workspacePath through to the handle', async () => {
    const handle = await createStrataSession({ workspacePath: '/tmp/strata-work' });
    expect(handle.workspacePath).toBe('/tmp/strata-work');
  });

  it('passes vaultPath through to the handle', async () => {
    const handle = await createStrataSession({ vaultPath: '/tmp/strata-vault' });
    expect(handle.vaultPath).toBe('/tmp/strata-vault');
  });

  it('forwards Pi options to createAgentSession', async () => {
    await createStrataSession();
    expect(createAgentSession).toHaveBeenCalledOnce();
  });

  it('attaches Pi session result on the handle', async () => {
    const handle = await createStrataSession();
    expect(handle.pi).toBeDefined();
    expect(handle.pi.session).toBeDefined();
    expect(handle.pi.extensionsResult).toBeDefined();
  });

  it('does NOT persist mode between sessions (Director §4 — toda nova sessão começa em Vereda)', async () => {
    // Simulate two sequential session creations — second one should also default Vereda
    // even though we just created one as Mestre. (Persistence is the runtime's job
    // — at the factory level, default is always Vereda.)
    await createStrataSession({ mode: 'mestre' });
    const second = await createStrataSession();
    expect(second.mode).toBe('vereda');
  });
});
