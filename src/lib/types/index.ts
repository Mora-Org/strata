/**
 * Shared contracts for Strata.
 *
 * Single source of truth for cross-module types. Imported by:
 * - src/lib/pi/ (session wrappers)
 * - src/lib/ollama/ (client/types)
 * - src/ components (M1.c+)
 */

/** The two modes a Strata session can run in. Director §4 hard rule:
 *  every new session defaults to 'vereda'. Mode never persists between sessions. */
export type StrataMode = 'vereda' | 'mestre';

export const DEFAULT_MODE: StrataMode = 'vereda';

/** Theme is editorial register's data-attribute on <html>. Dark is canonical. */
export type StrataTheme = 'dark' | 'light';

export const DEFAULT_THEME: StrataTheme = 'dark';

/** Absolute path on the local filesystem (POSIX or Windows). */
export type AbsolutePath = string;

/** Workspace folder Strata operates inside (codebase, study folder, etc.). */
export interface WorkspaceConfig {
  path: AbsolutePath;
  name: string;
}

/** Obsidian vault config — central in Strata (optional in Atelier).
 *  Strata only writes inside `inboxFolder` (regra dura §4). */
export interface VaultConfig {
  path: AbsolutePath;
  inboxFolder: string;
}

export const DEFAULT_INBOX_FOLDER = 'inbox';
