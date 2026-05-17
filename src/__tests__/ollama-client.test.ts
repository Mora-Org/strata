import { describe, it, expect, vi } from 'vitest';
import { OllamaClient } from '../lib/ollama/client';
import type {
  OllamaTagsResponse,
  OllamaChatResponse,
} from '../lib/ollama/types';

// Mocked fetch — these tests never hit a real Ollama. Real integration
// (wire chat hello-world) lands in M1.d when Ollama is required running.

function mockResponse(body: unknown, { ok = true, status = 200 } = {}): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe('OllamaClient', () => {
  describe('isReachable', () => {
    it('returns true on 200', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse({}));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      expect(await client.isReachable()).toBe(true);
    });

    it('returns false when fetch rejects (connection refused)', async () => {
      const fetchImpl = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      expect(await client.isReachable()).toBe(false);
    });

    it('returns false on non-ok status', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse({}, { ok: false, status: 500 }));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      expect(await client.isReachable()).toBe(false);
    });

    it('targets the configured baseUrl', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse({}));
      const client = new OllamaClient({
        baseUrl: 'http://custom-host:8080',
        fetchImpl: fetchImpl as typeof fetch,
      });
      await client.isReachable();
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://custom-host:8080/',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  describe('listModels', () => {
    it('parses /api/tags response correctly', async () => {
      const tagsResponse: OllamaTagsResponse = {
        models: [
          { name: 'llama3.1:8b', modified_at: '2026-05-17T00:00:00Z', size: 4_661_222_400, digest: 'sha256:abc' },
          { name: 'qwen2.5-coder:7b', modified_at: '2026-05-17T00:00:00Z', size: 4_500_000_000, digest: 'sha256:def' },
        ],
      };
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse(tagsResponse));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      const models = await client.listModels();
      expect(models).toHaveLength(2);
      expect(models[0]?.name).toBe('llama3.1:8b');
      expect(models[1]?.name).toBe('qwen2.5-coder:7b');
    });

    it('throws on non-200', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse({}, { ok: false, status: 500 }));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      await expect(client.listModels()).rejects.toThrow(/HTTP 500/);
    });
  });

  describe('chat', () => {
    it('sends POST /api/chat with stream:false', async () => {
      const chatResponse: OllamaChatResponse = {
        model: 'llama3.1:8b',
        created_at: '2026-05-17T00:00:00Z',
        message: { role: 'assistant', content: 'oi cesar' },
        done: true,
      };
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse(chatResponse));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      const reply = await client.chat({
        model: 'llama3.1:8b',
        messages: [{ role: 'user', content: 'oi' }],
      });
      expect(reply.message.content).toBe('oi cesar');
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://localhost:11434/api/chat',
        expect.objectContaining({
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: expect.stringContaining('"stream":false'),
        }),
      );
    });

    it('throws on non-200', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse({}, { ok: false, status: 503 }));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      await expect(
        client.chat({ model: 'llama3.1:8b', messages: [{ role: 'user', content: 'oi' }] }),
      ).rejects.toThrow(/HTTP 503/);
    });

    it('preserves user-supplied options field', async () => {
      const chatResponse: OllamaChatResponse = {
        model: 'llama3.1:8b',
        created_at: '2026-05-17T00:00:00Z',
        message: { role: 'assistant', content: 'ok' },
        done: true,
      };
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse(chatResponse));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      await client.chat({
        model: 'llama3.1:8b',
        messages: [{ role: 'user', content: 'oi' }],
        options: { temperature: 0.2 },
      });
      const callArgs = fetchImpl.mock.calls[0]?.[1];
      const body = JSON.parse(callArgs?.body as string);
      expect(body.options).toEqual({ temperature: 0.2 });
    });
  });

  describe('defaults', () => {
    it('defaults baseUrl to http://localhost:11434', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(mockResponse({}));
      const client = new OllamaClient({ fetchImpl: fetchImpl as typeof fetch });
      await client.isReachable();
      expect(fetchImpl).toHaveBeenCalledWith(
        'http://localhost:11434/',
        expect.anything(),
      );
    });
  });
});
