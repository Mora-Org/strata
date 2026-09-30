import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { caminhoConfig, carregarConfig } from '../src/config.ts';

const original = process.env.STRATA_CONFIG;
afterEach(() => {
  if (original === undefined) delete process.env.STRATA_CONFIG;
  else process.env.STRATA_CONFIG = original;
});

function arquivo(conteudo: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), 'strata-config-'));
  const caminho = join(dir, 'config.json');
  writeFileSync(caminho, JSON.stringify(conteudo));
  return caminho;
}

describe('config', () => {
  test('sem arquivo: OpenCode Go, deepseek-v4-flash, ~/Strata/acervo, conhecimento desligado', () => {
    delete process.env.STRATA_CONFIG;
    const c = carregarConfig(join(tmpdir(), 'nao-existe-strata', 'config.json'));
    expect(c.provedor).toBe('opencode-go');
    expect(c.modelo).toBe('deepseek-v4-flash');
    expect(c.pastaAcervo).toBe(join(homedir(), 'Strata', 'acervo'));
    expect(c.conhecimentoLigado).toBe(false);
  });

  test('STRATA_CONFIG aponta outro arquivo; acervo relativo vale a partir dele', () => {
    const caminho = arquivo({ acervo: 'meu-acervo', conhecimento_ligado: true });
    process.env.STRATA_CONFIG = caminho;
    expect(caminhoConfig()).toBe(caminho);
    const c = carregarConfig();
    expect(c.pastaAcervo).toBe(join(caminho, '..', 'meu-acervo'));
    expect(c.conhecimentoLigado).toBe(true);
    expect(c.origem).toBe(caminho);
  });

  test('chave de API no arquivo é recusada', () => {
    expect(() => carregarConfig(arquivo({ apiKey: 'x' }))).toThrow('nunca do arquivo');
  });

  test('tipo errado é recusado', () => {
    expect(() => carregarConfig(arquivo({ conhecimento_ligado: 'sim' }))).toThrow('true ou false');
  });

  test('STRATA_CONFIG pra arquivo inexistente é erro, não padrão silencioso', () => {
    process.env.STRATA_CONFIG = join(tmpdir(), 'nao-existe-strata', 'config.json');
    expect(() => carregarConfig()).toThrow('não existe');
  });
});
