import { beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buscarNoAcervo,
  guardarFonte,
  idDaFonte,
  lerIndiceRaiz,
  lerNotaFonte,
  lerTema,
  slugTema,
  type PedidoGuardar,
} from '../src/acervo.ts';

let pasta: string;
beforeEach(() => {
  pasta = mkdtempSync(join(tmpdir(), 'strata-acervo-'));
});

const lora: PedidoGuardar = {
  tipo: 'artigo',
  titulo: 'LoRA: Low-Rank Adaptation of Large Language Models',
  autores: ['Edward J. Hu', 'Yelong Shen'],
  ano: 2021,
  link: 'https://arxiv.org/abs/2106.09685v2',
  arxiv: '2106.09685',
  tema: 'Ajuste fino eficiente',
  descricaoTema: 'Como adaptar modelos grandes treinando pouco',
  oQueDiz: 'Congela os pesos e treina matrizes de posto baixo.',
  praQueServe: 'Porta de entrada pra ajuste fino barato.',
};

const apot: PedidoGuardar = {
  tipo: 'artigo',
  titulo: 'Additive Powers-of-Two Quantization',
  autores: ['Yuhang Li'],
  ano: 2019,
  link: 'https://arxiv.org/abs/1909.13144',
  tema: 'Quantização de pesos',
  descricaoTema: 'Reduzir a precisão dos pesos de uma rede',
  oQueDiz: 'Níveis de quantização como soma de potências de dois.',
  praQueServe: 'Exemplo de quantização não uniforme.',
};

function linhasDeFonte(texto: string | null): string[] {
  return (texto ?? '').split('\n').filter((l) => l.includes('](../fontes/'));
}

describe('ids', () => {
  test('ids seguros pra nome de arquivo', () => {
    expect(idDaFonte({ arxiv: '2106.09685v2', link: 'https://x' })).toBe('arxiv-2106.09685');
    expect(idDaFonte({ link: 'https://arxiv.org/pdf/2106.09685v1' })).toBe('arxiv-2106.09685');
    expect(idDaFonte({ doi: '10.1016/0893-6080(91)90077-I', link: 'https://doi.org/x' })).toBe('doi-10.1016-0893-6080-91-90077-i');
    expect(idDaFonte({ link: 'https://doi.org/10.1145/3442188.3445922' })).toBe('doi-10.1145-3442188.3445922');
    // DOI do arXiv aponta pro mesmo artigo que o id do arXiv
    expect(idDaFonte({ doi: '10.48550/arXiv.2106.09685', link: 'https://doi.org/10.48550/arXiv.2106.09685' })).toBe('arxiv-2106.09685');
    expect(idDaFonte({ link: 'https://www.example.com/aula/quantizacao?x=1' })).toBe('web-example.com-aula-quantizacao');
    const longo = idDaFonte({ link: 'https://example.com/' + 'a/'.repeat(80) });
    expect(longo.length).toBeLessThanOrEqual(94);
    expect(slugTema('Quantização de pesos')).toBe('quantizacao-de-pesos');
  });
});

describe('guardar fonte', () => {
  test('guardar a mesma fonte duas vezes não duplica nada', () => {
    const r1 = guardarFonte(pasta, lora, '2026-09-30');
    const temaAntes = lerTema(pasta, lora.tema);
    const indiceAntes = lerIndiceRaiz(pasta);
    const notaAntes = readFileSync(join(pasta, 'fontes', r1.id + '.md'), 'utf8');

    const r2 = guardarFonte(pasta, lora, '2026-10-01');

    expect(r1.id).toBe('arxiv-2106.09685');
    expect(r1.fonteNova).toBe(true);
    expect(r2.fonteNova).toBe(false);
    expect(r2.jaEstavaNoTema).toBe(true);
    expect(readdirSync(join(pasta, 'fontes'))).toEqual(['arxiv-2106.09685.md']);
    expect(readdirSync(join(pasta, 'temas'))).toEqual(['ajuste-fino-eficiente.md']);
    expect(linhasDeFonte(lerTema(pasta, lora.tema)).length).toBe(1);
    expect(lerTema(pasta, lora.tema)).toBe(temaAntes);
    expect(lerIndiceRaiz(pasta)).toBe(indiceAntes);
    // A data de quando foi guardada é a primeira, não a da regravação
    expect(readFileSync(join(pasta, 'fontes', r1.id + '.md'), 'utf8')).toBe(notaAntes);
    expect(lerIndiceRaiz(pasta)).toContain('(1 fonte)');
  });

  test('uma fonte em dois temas mora uma vez e aparece nos dois índices', () => {
    guardarFonte(pasta, lora);
    const r = guardarFonte(pasta, { ...lora, tema: 'Modelos de linguagem', descricaoTema: 'Como LLMs funcionam' });

    expect(readdirSync(join(pasta, 'fontes'))).toEqual(['arxiv-2106.09685.md']);
    expect(linhasDeFonte(lerTema(pasta, 'Ajuste fino eficiente'))[0]).toContain('../fontes/arxiv-2106.09685.md');
    expect(linhasDeFonte(lerTema(pasta, 'Modelos de linguagem'))[0]).toContain('../fontes/arxiv-2106.09685.md');
    expect(r.jaEstavaNoTema).toBe(false);

    const nota = lerNotaFonte(pasta, 'arxiv-2106.09685');
    expect(nota?.temas).toEqual(['ajuste-fino-eficiente', 'modelos-de-linguagem']);
    const corpo = readFileSync(join(pasta, 'fontes', 'arxiv-2106.09685.md'), 'utf8');
    expect(corpo).toContain('- [Ajuste fino eficiente](../temas/ajuste-fino-eficiente.md)');
    expect(corpo).toContain('- [Modelos de linguagem](../temas/modelos-de-linguagem.md)');

    const indice = lerIndiceRaiz(pasta) ?? '';
    expect(indice).toContain('- [Ajuste fino eficiente](temas/ajuste-fino-eficiente.md): Como adaptar modelos grandes treinando pouco (1 fonte)');
    expect(indice).toContain('- [Modelos de linguagem](temas/modelos-de-linguagem.md): Como LLMs funcionam (1 fonte)');
  });

  test('o modelo decide a ordem de leitura e o índice conta as fontes', () => {
    guardarFonte(pasta, apot);
    guardarFonte(pasta, {
      ...apot,
      titulo: 'Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference',
      link: 'https://arxiv.org/abs/1712.05877',
      posicao: 1,
    });
    guardarFonte(pasta, { ...apot, titulo: 'Survey', link: 'https://doi.org/10.1000/xyz123', posicao: 2 });
    const linhas = linhasDeFonte(lerTema(pasta, apot.tema));
    expect(linhas.map((l) => l.match(/fontes\/([^)]+)\.md/)?.[1])).toEqual([
      'arxiv-1712.05877',
      'doi-10.1000-xyz123',
      'arxiv-1909.13144',
    ]);
    expect(linhas[0]?.startsWith('1. ')).toBe(true);
    expect(linhas[2]?.startsWith('3. ')).toBe(true);
    expect(lerIndiceRaiz(pasta)).toContain('(3 fontes)');

    // Mover uma fonte que já está no tema não duplica
    guardarFonte(pasta, { ...apot, posicao: 1 });
    expect(linhasDeFonte(lerTema(pasta, apot.tema))[0]).toContain('arxiv-1909.13144');
    expect(linhasDeFonte(lerTema(pasta, apot.tema)).length).toBe(3);
  });

  test('frontmatter tem os campos do contrato e volta igual', () => {
    guardarFonte(pasta, lora, '2026-09-30');
    const texto = readFileSync(join(pasta, 'fontes', 'arxiv-2106.09685.md'), 'utf8');
    for (const campo of ['id', 'tipo', 'titulo', 'autores', 'ano', 'link', 'arxiv', 'temas', 'guardado_em']) {
      expect(texto).toMatch(new RegExp(`^${campo}: `, 'm'));
    }
    expect(lerNotaFonte(pasta, 'arxiv-2106.09685')).toEqual({
      id: 'arxiv-2106.09685',
      tipo: 'artigo',
      titulo: lora.titulo,
      autores: lora.autores,
      ano: 2021,
      link: lora.link,
      arxiv: '2106.09685',
      temas: ['ajuste-fino-eficiente'],
      guardado_em: '2026-09-30',
    });
  });

  test('recusa pedido quebrado', () => {
    expect(() => guardarFonte(pasta, { ...lora, link: 'não é link' })).toThrow('link inválido');
    expect(() => guardarFonte(pasta, { ...lora, oQueDiz: ' ' })).toThrow('o_que_diz');
    expect(() => guardarFonte(pasta, { ...lora, tema: '!!!' })).toThrow('tema inválido');
  });
});

describe('busca no acervo', () => {
  test('acha por texto sem ligar pra acento', () => {
    guardarFonte(pasta, apot);
    guardarFonte(pasta, lora);
    const achados = buscarNoAcervo(pasta, 'quantizacao potencias');
    expect(achados[0]?.arquivo).toBe('fontes/arxiv-1909.13144.md');
    expect(buscarNoAcervo(pasta, 'inexistentezzz')).toEqual([]);
  });
});
