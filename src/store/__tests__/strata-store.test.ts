import { describe, it, expect, beforeEach } from 'vitest';
import { useStrataStore, selectMode } from '../strata';
import { DEFAULT_MODE } from '../../lib/types';

beforeEach(() => {
  useStrataStore.setState({
    mode: DEFAULT_MODE,
    workspace: null,
    vault: null,
    ollamaStatus: 'unknown',
    modelName: null,
    messages: [],
    activeConversationId: null,
  });
});

describe('useStrataStore (Zustand)', () => {
  it('initializes with mode "vereda" (Director §4 hard rule)', () => {
    expect(useStrataStore.getState().mode).toBe('vereda');
  });

  it('setMode updates the mode', () => {
    useStrataStore.getState().setMode('mestre');
    expect(useStrataStore.getState().mode).toBe('mestre');
  });

  it('setWorkspace stores name + path', () => {
    useStrataStore.getState().setWorkspace({ name: 'strata-cli', path: '/tmp' });
    expect(useStrataStore.getState().workspace).toEqual({
      name: 'strata-cli',
      path: '/tmp',
    });
  });

  it('addMessage appends to messages array', () => {
    useStrataStore.getState().addMessage({ id: 'a', role: 'user', text: 'oi' });
    useStrataStore.getState().addMessage({ id: 'b', role: 'strata', text: 'oi de volta' });
    expect(useStrataStore.getState().messages).toHaveLength(2);
    expect(useStrataStore.getState().messages[1]?.text).toBe('oi de volta');
  });

  it('clearMessages empties the array', () => {
    useStrataStore.getState().addMessage({ id: 'a', role: 'user', text: 'oi' });
    useStrataStore.getState().clearMessages();
    expect(useStrataStore.getState().messages).toHaveLength(0);
  });

  it('ollamaStatus defaults to "unknown" and updates correctly', () => {
    expect(useStrataStore.getState().ollamaStatus).toBe('unknown');
    useStrataStore.getState().setOllamaStatus('reachable');
    expect(useStrataStore.getState().ollamaStatus).toBe('reachable');
    useStrataStore.getState().setOllamaStatus('unreachable');
    expect(useStrataStore.getState().ollamaStatus).toBe('unreachable');
  });

  it('selectMode returns the mode (selector helper)', () => {
    expect(selectMode(useStrataStore.getState())).toBe('vereda');
    useStrataStore.getState().setMode('mestre');
    expect(selectMode(useStrataStore.getState())).toBe('mestre');
  });
});
