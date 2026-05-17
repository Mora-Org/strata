import type {
  CreateAgentSessionOptions,
  CreateAgentSessionResult,
} from '@mariozechner/pi-coding-agent';
import { createAgentSession } from '@mariozechner/pi-coding-agent';
import type { StrataMode } from '../types';
import { DEFAULT_MODE } from '../types';

/**
 * Options for creating a Strata session. Wraps Pi's CreateAgentSessionOptions
 * with Strata-specific defaults (mode, workspace path, vault path).
 */
export interface StrataSessionOptions {
  /** Vereda (default) blocks writes; Mestre allows full agent execution. */
  mode?: StrataMode;
  /** Workspace folder the agent operates inside. */
  workspacePath?: string;
  /** Optional Obsidian vault for note generation. */
  vaultPath?: string;
  /** Pi-level options pass-through (advanced). */
  pi?: CreateAgentSessionOptions;
}

/**
 * Handle returned by createStrataSession — wraps Pi's session with the
 * Strata mode it's operating in. Mode Router (M2) will use this to gate
 * tool calls (Vereda blocks write/edit/bash; Mestre allows all).
 */
export interface StrataSessionHandle {
  mode: StrataMode;
  workspacePath?: string;
  vaultPath?: string;
  pi: CreateAgentSessionResult;
}

/**
 * Factory for a Strata session. Currently minimal (M1.b smoke) — in M2,
 * this wires up the Mode Router (Vereda → read-only tools / Mestre → full
 * tools) and the Note Builder (deposit nota Obsidian when applicable).
 *
 * Throws if Pi's createAgentSession throws — caller handles.
 */
export async function createStrataSession(
  options: StrataSessionOptions = {},
): Promise<StrataSessionHandle> {
  const mode = options.mode ?? DEFAULT_MODE;
  const pi = await createAgentSession(options.pi ?? {});
  return {
    mode,
    workspacePath: options.workspacePath,
    vaultPath: options.vaultPath,
    pi,
  };
}
