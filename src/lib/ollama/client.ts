import type {
  OllamaModel,
  OllamaTagsResponse,
  OllamaChatRequest,
  OllamaChatResponse,
} from './types';

export interface OllamaClientOptions {
  /** Base URL of Ollama HTTP API. Default: http://localhost:11434 */
  baseUrl?: string;
  /** Timeout for individual requests in ms. Default: 60000 (60s). */
  timeoutMs?: number;
  /** Override fetch (for testing). */
  fetchImpl?: typeof fetch;
}

const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_TIMEOUT_MS = 60_000;

/**
 * Minimal HTTP client for Ollama's local API.
 *
 * Designed for the M1.d "wire chat hello-world" milestone. Streaming chat
 * (`stream: true`) is intentionally NOT here yet — it lands in M1.d when
 * we wire the streaming-dots indicator. For M1.b smoke, non-streaming
 * chat + listModels + isReachable are enough to prove the contract.
 */
export class OllamaClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: OllamaClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  /** Returns true if Ollama responds with 200 on its root path. */
  async isReachable(): Promise<boolean> {
    try {
      const res = await this._fetchWithTimeout('/', {});
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Lists installed models via /api/tags. Throws on non-200. */
  async listModels(): Promise<OllamaModel[]> {
    const res = await this._fetchWithTimeout('/api/tags', {});
    if (!res.ok) {
      throw new Error(`Ollama listModels: HTTP ${res.status}`);
    }
    const data = (await res.json()) as OllamaTagsResponse;
    return data.models;
  }

  /** Sends a non-streaming chat request via /api/chat. Throws on non-200. */
  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    const res = await this._fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...request, stream: false }),
    });
    if (!res.ok) {
      throw new Error(`Ollama chat: HTTP ${res.status}`);
    }
    return (await res.json()) as OllamaChatResponse;
  }

  private async _fetchWithTimeout(path: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await this.fetchImpl(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }
}
