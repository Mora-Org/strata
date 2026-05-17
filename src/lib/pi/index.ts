/**
 * Strata's wrapper around Pi (@mariozechner/pi-coding-agent).
 *
 * Strategy (M1.b): Pi is used as npm dependency. Mode Router (M2) may
 * require switching to a forked copy if we need to intercept tool-calls
 * before execution — see .speckit/architecture/adr/ADR-0001 and
 * .speckit/architecture/pi-anatomy.md for the original analysis.
 *
 * This module re-exports Pi's main SDK plus Strata-specific helpers.
 */

export {
  createAgentSession,
  AgentSession,
  SessionManager,
  AuthStorage,
  ModelRegistry,
  createReadOnlyTools,
  createCodingTools,
} from '@mariozechner/pi-coding-agent';

export type {
  AgentSessionConfig,
  CreateAgentSessionOptions,
  CreateAgentSessionResult,
} from '@mariozechner/pi-coding-agent';

export { createStrataSession } from './session';
export type { StrataSessionOptions, StrataSessionHandle } from './session';
