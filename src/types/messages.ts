/**
 * Message types for the chat surface.
 *
 * M1.c keeps the shape minimal — just role + text. M1.d/M2 will enrich
 * with paragraphs containing inline elements (bridge, ref-chip, wiki-chip)
 * and message metadata (bloom level, refs count, note candidacy).
 */

export type MessageRole = 'user' | 'strata';

export interface UserMessage {
  id: string;
  role: 'user';
  text: string;
}

export interface StrataMessage {
  id: string;
  role: 'strata';
  text: string;
  /** Bloom level inferred for the response (1-6). Optional in M1.c. */
  bloom?: number;
  /** Whether this message produced a draft note worth previewing. */
  noteCandidate?: boolean;
}

export type Message = UserMessage | StrataMessage;
