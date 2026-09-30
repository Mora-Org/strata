import { XMLParser } from 'fast-xml-parser';
import { idDaFonte, normalizarArxiv, normalizarDoi, type TipoFonte } from './acervo.ts';

export interface CandidatoFonte {
  // Id que a fonte vai ter no acervo se for guardada; o modelo usa pra citar
  id: string;
  origem: 'arxiv' | 'crossref';
  tipo: TipoFonte;
  titulo: string;
  autores: string[];
  ano: number | null;
  link: string;
  arxiv?: string;
  doi?: string;
  // null quando a fonte não trouxe resumo (o Crossref muitas vezes não traz)
  resumo: string | null;
  publicadoEm?: string;
}

export interface PaginaLida {
  url: string;
  titulo: string;
  texto: string;
  truncado: boolean;
}

// fetch injetável: os testes passam um falso e nada sai pra rede
export type Buscador = (url: string, init?: RequestInit) => Promise<Response>;

const AGENTE = 'strata-harness/0.1 (https://github.com/Mora-Org/strata)';
const TEMPO_MAX_MS = 30_000;
const TAMANHO_MAX_PAGINA = 15_000;

// ---------- arXiv ----------

// Provisório: em 30/09/2026 o arXiv devolveu timeout e 429 em rajadas de busca. Este intervalo
// fixo entre pedidos é a solução temporária; a estratégia definitiva vem com os testes a fundo.
export const INTERVALO_ARXIV_MS = 4000;
let ultimoPedidoArxiv = Number.NEGATIVE_INFINITY;

export async function esperarVezArxiv(
  intervaloMs = INTERVALO_ARXIV_MS,
  agora: () => number = Date.now,
  dormir: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
): Promise<void> {
  // reserva o horário antes de dormir, pra duas buscas simultâneas não passarem juntas
  const horario = Math.max(agora(), ultimoPedidoArxiv + intervaloMs);
  ultimoPedidoArxiv = horario;
  const falta = horario - agora();
  if (falta > 0) await dormir(falta);
}

// só pros testes
export function zerarEsperaArxiv(): void {
  ultimoPedidoArxiv = Number.NEGATIVE_INFINITY;
}

export async function buscarArxiv(termos: string, max: number, buscar: Buscador = fetch): Promise<CandidatoFonte[]> {
  const palavras = termos.trim().split(/\s+/).filter(Boolean);
  if (palavras.length === 0) throw new Error('buscar_artigos: termos vazios');
  await esperarVezArxiv();
  const consulta = palavras.map((p) => `all:${p}`).join(' AND ');
  const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(consulta)}&max_results=${max}`;
  const resp = await buscar(url, { headers: { 'User-Agent': AGENTE }, signal: AbortSignal.timeout(TEMPO_MAX_MS) });
  if (!resp.ok) throw new Error(`arXiv respondeu ${resp.status}`);
  return lerAtomArxiv(await resp.text());
}

export function lerAtomArxiv(xml: string): CandidatoFonte[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    parseTagValue: false,
    isArray: (nome) => ['entry', 'author', 'link', 'category'].includes(nome),
  });
  const doc = parser.parse(xml) as { feed?: { entry?: EntradaAtom[] } };
  if (!doc.feed) throw new Error('arXiv: resposta sem <feed>, não é Atom');
  const entradas = doc.feed.entry ?? [];
  const erro = entradas.find((e) => texto(e.id).includes('/api/errors'));
  if (erro) throw new Error(`arXiv recusou a consulta: ${limparEspacos(texto(erro.summary))}`);

  return entradas.map((e) => {
    const arxiv = normalizarArxiv(texto(e.id));
    if (!arxiv) throw new Error(`arXiv: id inesperado na entrada: ${texto(e.id)}`);
    const link = `https://arxiv.org/abs/${arxiv}`;
    const publicado = texto(e.published);
    const doi = normalizarDoi(texto(e.doi) || undefined);
    return {
      id: idDaFonte({ arxiv, link }),
      origem: 'arxiv' as const,
      tipo: 'artigo' as const,
      titulo: limparEspacos(texto(e.title)),
      autores: (e.author ?? []).map((a) => limparEspacos(texto(a.name))).filter(Boolean),
      ano: publicado ? Number(publicado.slice(0, 4)) : null,
      link,
      arxiv,
      ...(doi ? { doi } : {}),
      resumo: limparEspacos(texto(e.summary)) || null,
    };
  });
}

interface EntradaAtom {
  id?: unknown;
  title?: unknown;
  summary?: unknown;
  published?: unknown;
  doi?: unknown;
  author?: { name?: unknown }[];
}

// ---------- Crossref ----------

export async function buscarCrossref(termos: string, max: number, buscar: Buscador = fetch): Promise<CandidatoFonte[]> {
  if (!termos.trim()) throw new Error('buscar_artigos: termos vazios');
  const campos = 'DOI,title,author,issued,published,published-print,published-online,abstract,type,container-title';
  const url = `https://api.crossref.org/works?query=${encodeURIComponent(termos.trim())}&rows=${max}&select=${campos}`;
  const resp = await buscar(url, { headers: { 'User-Agent': AGENTE }, signal: AbortSignal.timeout(TEMPO_MAX_MS) });
  if (!resp.ok) throw new Error(`Crossref respondeu ${resp.status}`);
  return lerJsonCrossref(await resp.json());
}

export function lerJsonCrossref(json: unknown): CandidatoFonte[] {
  const itens = (json as { message?: { items?: ItemCrossref[] } })?.message?.items;
  if (!Array.isArray(itens)) throw new Error('Crossref: resposta sem message.items');
  const saida: CandidatoFonte[] = [];
  for (const it of itens) {
    const titulo = limparEspacos(it.title?.[0] ?? '');
    const doi = normalizarDoi(it.DOI);
    // Componente é material suplementar de outro artigo; sem título ou DOI não dá pra citar
    if (!titulo || !doi || it.type === 'component') continue;
    const arxiv = normalizarArxiv(doi.match(/^10\.48550\/arxiv\.(.+)$/)?.[1]);
    const link = arxiv ? `https://arxiv.org/abs/${arxiv}` : `https://doi.org/${doi}`;
    const publicadoEm = it['container-title']?.[0];
    saida.push({
      id: idDaFonte({ doi, link }),
      origem: 'crossref',
      tipo: 'artigo',
      titulo,
      autores: (it.author ?? []).map((a) => limparEspacos(a.name ?? [a.given, a.family].filter(Boolean).join(' '))).filter(Boolean),
      ano: anoCrossref(it),
      link,
      ...(arxiv ? { arxiv } : { doi }),
      resumo: it.abstract ? limparJats(it.abstract) || null : null,
      ...(publicadoEm ? { publicadoEm: limparEspacos(publicadoEm) } : {}),
    });
  }
  return saida;
}

interface DataCrossref {
  'date-parts'?: (number | null)[][];
}

interface ItemCrossref {
  DOI?: string;
  type?: string;
  title?: string[];
  author?: { given?: string; family?: string; name?: string }[];
  abstract?: string;
  'container-title'?: string[];
  issued?: DataCrossref;
  published?: DataCrossref;
  'published-print'?: DataCrossref;
  'published-online'?: DataCrossref;
}

function anoCrossref(it: ItemCrossref): number | null {
  for (const d of [it.issued, it.published, it['published-print'], it['published-online']]) {
    const ano = d?.['date-parts']?.[0]?.[0];
    if (typeof ano === 'number') return ano;
  }
  return null;
}

// O resumo do Crossref vem em JATS, às vezes com HTML escapado dentro
export function limparJats(s: string): string {
  let t = s.replace(/<jats:title>[\s\S]*?<\/jats:title>/g, ' ');
  t = decodificarEntidades(t.replace(/<[^>]+>/g, ' '));
  t = t.replace(/<[^>]+>/g, ' ');
  return limparEspacos(t);
}

// ---------- página ----------

export async function lerPagina(url: string, buscar: Buscador = fetch): Promise<PaginaLida> {
  if (!/^https?:\/\//.test(url)) throw new Error(`ler_pagina: URL inválida: "${url}"`);
  const resp = await buscar(url, {
    headers: { 'User-Agent': AGENTE, Accept: 'text/html,text/plain;q=0.9' },
    signal: AbortSignal.timeout(TEMPO_MAX_MS),
    redirect: 'follow',
  });
  if (!resp.ok) throw new Error(`ler_pagina: ${url} respondeu ${resp.status}`);
  const tipo = resp.headers.get('content-type') ?? '';
  if (tipo.includes('pdf')) throw new Error('ler_pagina: é PDF, e esta versão não lê PDF. Use o resumo ou a página /abs do artigo.');
  if (!tipo.includes('html') && !tipo.includes('text/plain')) throw new Error(`ler_pagina: tipo de conteúdo não suportado: ${tipo}`);
  const bruto = await resp.text();
  const { titulo, texto: corpo } = tipo.includes('html') ? htmlParaTexto(bruto) : { titulo: url, texto: bruto.trim() };
  const truncado = corpo.length > TAMANHO_MAX_PAGINA;
  return { url, titulo, texto: truncado ? corpo.slice(0, TAMANHO_MAX_PAGINA) : corpo, truncado };
}

export function htmlParaTexto(html: string): { titulo: string; texto: string } {
  const titulo = limparEspacos(decodificarEntidades(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''));
  const texto = decodificarEntidades(
    html
      .replace(/<(script|style|noscript|svg|head|nav|footer)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(br|\/p|\/div|\/h[1-6]|\/li|\/tr|\/blockquote)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
  return { titulo, texto };
}

// ---------- utilidades ----------

function texto(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (v && typeof v === 'object' && '#text' in v) return String((v as { '#text': unknown })['#text']);
  return '';
}

function limparEspacos(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

const ENTIDADES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  middot: '·',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  copy: '©',
};

function decodificarEntidades(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (inteiro, nome: string) => {
    if (nome[0] === '#') {
      const cod = nome[1] === 'x' || nome[1] === 'X' ? parseInt(nome.slice(2), 16) : parseInt(nome.slice(1), 10);
      return Number.isFinite(cod) ? String.fromCodePoint(cod) : inteiro;
    }
    return ENTIDADES[nome.toLowerCase()] ?? inteiro;
  });
}
