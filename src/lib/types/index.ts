/**
 * Shared contracts for Strata.
 *
 * Single source of truth for cross-module types. Imported by the React components and store.
 */

/** The two modes a Strata session can run in. 'vereda' e 'mestre' são os identificadores
 *  antigos de Estudo e Ação; o renome acontece junto com a janela Tauri. */
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
