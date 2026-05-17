/**
 * Ollama HTTP API types.
 *
 * Strata uses Ollama as default local model provider. Cloud providers
 * (Anthropic, OpenAI, Gemini, ...) come via Pi's ModelRegistry — Ollama
 * is wired directly because it's the canonical local-first path and we
 * want fine-grained control over it (timeout, reachability, retry).
 *
 * Reference: https://github.com/ollama/ollama/blob/main/docs/api.md
 */

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaTagsResponse {
  models: OllamaModel[];
}

export type OllamaRole = 'system' | 'user' | 'assistant';

export interface OllamaMessage {
  role: OllamaRole;
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: Record<string, unknown>;
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

export interface OllamaStreamChunk {
  model: string;
  created_at: string;
  message?: { role: OllamaRole; content: string };
  done: boolean;
}
