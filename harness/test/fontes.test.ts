import { describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { criarFerramentas } from '../src/ferramentas.ts';
import { htmlParaTexto, lerAtomArxiv, lerJsonCrossref, lerPagina, limparJats, type Buscador } from '../src/fontes.ts';

// Respostas reais gravadas em 30/09/2026; nenhum teste sai pra rede
const XML_ARXIV = readFileSync(join(import.meta.dir, 'fixtures', 'arxiv-quantizacao.xml'), 'utf8');
const JSON_CROSSREF = readFileSync(join(import.meta.dir, 'fixtures', 'crossref-quantizacao.json'), 'utf8');

function buscadorFalso(urlsVistas: string[] = []): Buscador {
  return async (url) => {
    urlsVistas.push(url);
    if (url.startsWith('https://export.arxiv.org/')) return new Response(XML_ARXIV, { headers: { 'content-type': 'application/atom+xml' } });
    if (url.startsWith('https://api.crossref.org/')) return new Response(JSON_CROSSREF, { headers: { 'content-type': 'application/json' } });
    throw new Error(`teste tentou sair pra rede: ${url}`);
  };
}

describe('arXiv', () => {
  test('lê o Atom gravado', () => {
    const r = lerAtomArxiv(XML_ARXIV);
    expect(r.length).toBe(3);
    const primeiro = r[0]!;
    expect(primeiro.id).toBe('arxiv-1909.13144');
    expect(primeiro.arxiv).toBe('1909.13144');
    expect(primeiro.titulo).toBe('Additive Powers-of-Two Quantization: An Efficient Non-uniform Discretization for Neural Networks');
    expect(primeiro.autores).toEqual(['Yuhang Li', 'Xin Dong', 'Wei Wang']);
    expect(primeiro.ano).toBe(2019);
    expect(primeiro.link).toBe('https://arxiv.org/abs/1909.13144');
    expect(primeiro.resumo).toStartWith('We propose Additive Powers-of-Two~(APoT) quantization');
    expect(r.every((c) => c.origem === 'arxiv' && c.tipo === 'artigo')).toBe(true);
  });

  test('erro da API do arXiv vira erro explícito', () => {
    const erro = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><id>http://arxiv.org/api/errors#x</id><title>Error</title><summary>malformed query</summary></entry></feed>`;
    expect(() => lerAtomArxiv(erro)).toThrow('malformed query');
  });
});

describe('Crossref', () => {
  test('lê o JSON gravado, com e sem resumo', () => {
    const r = lerJsonCrossref(JSON.parse(JSON_CROSSREF));
    expect(r.length).toBe(5);
    const semResumo = r.find((c) => c.doi === '10.1109/ijcnn48605.2020.9207281')!;
    expect(semResumo.id).toBe('doi-10.1109-ijcnn48605.2020.9207281');
    expect(semResumo.resumo).toBeNull();
    expect(semResumo.ano).toBe(2020);
    expect(semResumo.link).toBe('https://doi.org/10.1109/ijcnn48605.2020.9207281');
    expect(semResumo.autores.length).toBe(2);

    const comResumo = r.find((c) => c.doi === '10.2139/ssrn.6981422')!;
    expect(comResumo.resumo).toStartWith('Deep neural networks (DNNs) deliver remarkable performance');
    expect(comResumo.resumo).not.toContain('<');
    expect(comResumo.ano).toBe(2026);

    // Ano ausente no Crossref vira null, não NaN nem 0
    const dissertacao = r.find((c) => c.doi?.startsWith('10.70675/'))!;
    expect(dissertacao.ano).toBeNull();
    expect(dissertacao.resumo).not.toContain('jats');
  });

  test('limpa JATS, inclusive HTML escapado dentro', () => {
    expect(limparJats('<jats:title>Abstract</jats:title><jats:p>Um &lt;p&gt;texto&lt;/p&gt;  com   <jats:italic>tags</jats:italic></jats:p>')).toBe(
      'Um texto com tags',
    );
  });
});

describe('ferramenta buscar_artigos', () => {
  test('junta arXiv e Crossref e mostra o id que a fonte terá no acervo', async () => {
    const pasta = mkdtempSync(join(tmpdir(), 'strata-fontes-'));
    const urls: string[] = [];
    const ferramenta = criarFerramentas(pasta, buscadorFalso(urls)).find((f) => f.definicao.name === 'buscar_artigos')!;
    const r = await ferramenta.executar({ termos: 'weight quantization neural', max: 3 });
    expect(r.erro).toBe(false);
    expect(r.texto).toContain('## arXiv: 3 resultado(s)');
    expect(r.texto).toContain('[arxiv-1909.13144] Additive Powers-of-Two Quantization');
    expect(r.texto).toContain('## Crossref: 5 resultado(s)');
    expect(r.texto).toContain('(a fonte não trouxe resumo)');
    expect(r.texto).toContain('já no acervo: não');
    expect(urls[0]).toContain('search_query=all%3Aweight%20AND%20all%3Aquantization%20AND%20all%3Aneural');
    expect(urls[1]).toContain('api.crossref.org/works?query=weight%20quantization%20neural&rows=3');
  });

  test('uma fonte fora do ar não derruba a outra', async () => {
    const pasta = mkdtempSync(join(tmpdir(), 'strata-fontes-'));
    const meioQuebrado: Buscador = async (url) => {
      if (url.includes('crossref')) return new Response('fora', { status: 503 });
      return buscadorFalso()(url);
    };
    const ferramenta = criarFerramentas(pasta, meioQuebrado).find((f) => f.definicao.name === 'buscar_artigos')!;
    const r = await ferramenta.executar({ termos: 'quantization' });
    expect(r.erro).toBe(false);
    expect(r.texto).toContain('## Crossref: falhou (Crossref respondeu 503)');
    expect(r.texto).toContain('## arXiv: 3 resultado(s)');
  });
});

describe('ler página', () => {
  test('HTML vira texto sem script nem estilo', async () => {
    const html = '<html><head><title>Aula &amp; notas</title><style>x{}</style></head><body><script>alert(1)</script><h1>Quantização</h1><p>Reduz&nbsp;bits.</p></body></html>';
    const p = await lerPagina('https://exemplo.org/aula', async () => new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } }));
    expect(p.titulo).toBe('Aula & notas');
    expect(p.texto).toBe('Quantização\nReduz bits.');
    expect(p.truncado).toBe(false);
    expect(htmlParaTexto('<p>a</p><p>b</p>').texto).toBe('a\nb');
  });

  test('PDF é recusado com motivo', async () => {
    const promessa = lerPagina('https://arxiv.org/pdf/1909.13144', async () => new Response('%PDF', { headers: { 'content-type': 'application/pdf' } }));
    expect(promessa).rejects.toThrow('PDF');
  });
});
