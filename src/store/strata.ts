import { create } from 'zustand';
import type { StrataMode } from '../lib/types';
import { DEFAULT_MODE } from '../lib/types';
import type { Message } from '../types/messages';

/** Reachability state of the active model provider (Ollama by default). */
export type ProviderStatus = 'reachable' | 'unreachable' | 'unknown';

interface StrataState {
  /** Active mode. Default Vereda — Director §4 hard rule. */
  mode: StrataMode;
  /** Switch mode WITHOUT confirmation (raw setter — UI gates with modal in M2). */
  setMode: (mode: StrataMode) => void;

  /** Workspace shown in the masthead. Null until M1.e wires the picker. */
  workspace: { name: string; path: string } | null;
  setWorkspace: (ws: { name: string; path: string } | null) => void;

  /** Vault shown in the sidebar VAULT section. Null until M1.e wires settings. */
  vault: { path: string; inboxFolder: string } | null;
  setVault: (v: { path: string; inboxFolder: string } | null) => void;

  /** Ollama reachability for masthead/status. */
  ollamaStatus: ProviderStatus;
  setOllamaStatus: (s: ProviderStatus) => void;

  /** Active model name. Display only in M1.c — wired in M1.e. */
  modelName: string | null;
  setModelName: (m: string | null) => void;

  /** Chat messages in the active conversation. Cleared on new chat. */
  messages: Message[];
  addMessage: (m: Message) => void;
  clearMessages: () => void;

  /** Active conversation id (mock for M1.c — real history in M5+). */
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export const useStrataStore = create<StrataState>((set) => ({
  mode: DEFAULT_MODE,
  setMode: (mode) => set({ mode }),

  workspace: null,
  setWorkspace: (workspace) => set({ workspace }),

  vault: null,
  setVault: (vault) => set({ vault }),

  ollamaStatus: 'unknown',
  setOllamaStatus: (ollamaStatus) => set({ ollamaStatus }),

  modelName: null,
  setModelName: (modelName) => set({ modelName }),

  messages: [],
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  clearMessages: () => set({ messages: [] }),

  activeConversationId: null,
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
}));

/** Selector helper — read mode without subscribing to the whole state. */
export const selectMode = (s: StrataState) => s.mode;
