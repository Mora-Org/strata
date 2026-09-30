import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type TipoFonte = 'artigo' | 'pagina';

// O que o modelo manda pra guardar. Tema, resumo e ordem são decisão dele; arquivo e índice são do código.
export interface PedidoGuardar {
  tipo: TipoFonte;
  titulo: string;
  autores: string[];
  ano: number | null;
  link: string;
  doi?: string;
  arxiv?: string;
  oQueDiz: string;
  praQueServe: string;
  tema: string;
  descricaoTema?: string;
  // 1 = ler primeiro. Sem posição, a fonte nova vai pro fim e a que já estava no tema fica onde está.
  posicao?: number;
}

// Frontmatter de fontes/<id>.md
export interface NotaFonte {
  id: string;
  tipo: TipoFonte;
  titulo: string;
  autores: string[];
  ano: number | null;
  link: string;
  doi?: string;
  arxiv?: string;
  temas: string[];
  guardado_em: string;
}

export interface ResultadoGuardar {
  id: string;
  tema: string;
  posicao: number;
  fonteNova: boolean;
  jaEstavaNoTema: boolean;
}

export interface Achado {
  arquivo: string;
  titulo: string;
  trechos: string[];
  pontos: number;
}

interface Tema {
  slug: string;
  nome: string;
  descricao: string;
  // Linhas da lista sem o número, na ordem de leitura; o id sai do link
  entradas: { id: string; texto: string }[];
}

const ID_SEGURO = /^[a-z0-9][a-z0-9.-]{0,119}$/;
const LINK_FONTE = /\]\(\.\.\/fontes\/([^)\s]+)\.md\)/;
const TAMANHO_MAX_ID = 90;

// ---------- ids e nomes ----------

export function idDaFonte(d: { arxiv?: string; doi?: string; link: string }): string {
  const doi = normalizarDoi(d.doi) ?? doiDoLink(d.link);
  // DOI do próprio arXiv (10.48550/arXiv.X) é o mesmo artigo: mesma nota
  const arxivPeloDoi = doi?.match(/^10\.48550\/arxiv\.(.+)$/i)?.[1];
  const arxiv = normalizarArxiv(d.arxiv) ?? normalizarArxiv(arxivPeloDoi) ?? arxivDoLink(d.link);
  if (arxiv) return 'arxiv-' + seguro(arxiv);
  if (doi) return 'doi-' + seguro(doi);
  const url = new URL(d.link);
  return 'web-' + seguro(url.hostname.replace(/^www\./, '') + url.pathname);
}

export function normalizarArxiv(bruto: string | undefined): string | undefined {
  if (!bruto) return undefined;
  const limpo = bruto
    .trim()
    .replace(/^arxiv:/i, '')
    .replace(/^https?:\/\/(export\.)?arxiv\.org\/(abs|pdf)\//i, '')
    .replace(/\.pdf$/i, '')
    .replace(/v\d+$/i, '');
  if (/^\d{4}\.\d{4,5}$/.test(limpo) || /^[a-z-]+(\.[a-z]{2})?\/\d{7}$/i.test(limpo)) return limpo.toLowerCase();
  return undefined;
}

export function normalizarDoi(bruto: string | undefined): string | undefined {
  if (!bruto) return undefined;
  const limpo = bruto
    .trim()
    .replace(/^doi:\s*/i, '')
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .toLowerCase();
  return /^10\.\d{4,9}\/\S+$/.test(limpo) ? limpo : undefined;
}

function arxivDoLink(link: string): string | undefined {
  const m = link.match(/arxiv\.org\/(abs|pdf)\/([^?#\s]+)/i);
  return m ? normalizarArxiv(m[2]) : undefined;
}

function doiDoLink(link: string): string | undefined {
  const m = link.match(/doi\.org\/(10\.[^?#\s]+)/i);
  return m ? normalizarDoi(decodeURIComponent(m[1] ?? '')) : undefined;
}

function seguro(s: string): string {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
  if (base.length <= TAMANHO_MAX_ID) return base;
  // Corta e põe um pedaço do hash pra dois ids longos parecidos não colidirem
  const hash = createHash('sha1').update(s).digest('hex').slice(0, 8);
  return base.slice(0, TAMANHO_MAX_ID - 9).replace(/[-.]+$/, '') + '-' + hash;
}

export function slugTema(nome: string): string {
  const slug = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
  if (!slug) throw new Error(`nome de tema inválido: "${nome}"`);
  return slug;
}

export function idSeguro(id: string): boolean {
  return ID_SEGURO.test(id) && !id.includes('..');
}

// ---------- leitura ----------

export function lerIndiceRaiz(pasta: string): string | null {
  const caminho = join(pasta, 'INDICE.md');
  return existsSync(caminho) ? readFileSync(caminho, 'utf8') : null;
}

export function lerTema(pasta: string, tema: string): string | null {
  const caminho = join(pasta, 'temas', slugTema(tema) + '.md');
  return existsSync(caminho) ? readFileSync(caminho, 'utf8') : null;
}

export function listarTemas(pasta: string): string[] {
  const dir = join(pasta, 'temas');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.slice(0, -3))
    .sort();
}

export function lerFonte(pasta: string, id: string): string | null {
  if (!idSeguro(id)) return null;
  const caminho = join(pasta, 'fontes', id + '.md');
  return existsSync(caminho) ? readFileSync(caminho, 'utf8') : null;
}

export function existeFonte(pasta: string, id: string): boolean {
  return idSeguro(id) && existsSync(join(pasta, 'fontes', id + '.md'));
}

export function lerNotaFonte(pasta: string, id: string): NotaFonte | null {
  const texto = lerFonte(pasta, id);
  return texto === null ? null : parseFrontmatter(texto);
}

export function buscarNoAcervo(pasta: string, consulta: string, max = 8): Achado[] {
  const termos = [...new Set(normalizar(consulta).split(/[^a-z0-9]+/).filter((t) => t.length >= 3))];
  if (termos.length === 0) return [];
  const achados: Achado[] = [];
  for (const sub of ['temas', 'fontes']) {
    const dir = join(pasta, sub);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const texto = readFileSync(join(dir, f), 'utf8');
      const norm = normalizar(texto);
      const batidos = termos.filter((t) => norm.includes(t));
      if (batidos.length === 0) continue;
      const linhas = texto.split('\n');
      const trechos = linhas
        .filter((l) => l.trim() && batidos.some((t) => normalizar(l).includes(t)))
        .slice(0, 2)
        .map((l) => encurtar(l.trim(), 200));
      const titulo = linhas.find((l) => l.startsWith('# '))?.slice(2).trim() ?? f;
      achados.push({ arquivo: `${sub}/${f}`, titulo, trechos, pontos: batidos.length });
    }
  }
  return achados.sort((a, b) => b.pontos - a.pontos).slice(0, max);
}

// ---------- escrita ----------

export function guardarFonte(pasta: string, pedido: PedidoGuardar, hoje: string = dataDeHoje()): ResultadoGuardar {
  validarPedido(pedido);
  const id = idDaFonte(pedido);
  const slug = slugTema(pedido.tema);
  mkdirSync(join(pasta, 'fontes'), { recursive: true });
  mkdirSync(join(pasta, 'temas'), { recursive: true });

  const anterior = lerNotaFonte(pasta, id);
  const temas = anterior ? [...anterior.temas] : [];
  if (!temas.includes(slug)) temas.push(slug);

  const nota: NotaFonte = {
    id,
    tipo: pedido.tipo,
    titulo: pedido.titulo.trim(),
    autores: pedido.autores.map((a) => a.trim()).filter(Boolean),
    ano: pedido.ano,
    link: pedido.link.trim(),
    temas,
    guardado_em: anterior?.guardado_em ?? hoje,
  };
  const arxiv = normalizarArxiv(pedido.arxiv) ?? (id.startsWith('arxiv-') ? id.slice(6) : undefined);
  const doi = normalizarDoi(pedido.doi) ?? doiDoLink(pedido.link);
  if (arxiv) nota.arxiv = arxiv;
  else if (doi) nota.doi = doi;

  // O tema primeiro: a nota da fonte lista os nomes dos temas, que moram no arquivo do tema
  const tema = lerEstruturaTema(pasta, slug) ?? { slug, nome: pedido.tema.trim(), descricao: '', entradas: [] };
  if (pedido.descricaoTema?.trim()) tema.descricao = pedido.descricaoTema.trim();

  const linha = linhaDoTema(nota, pedido.praQueServe);
  const atual = tema.entradas.findIndex((e) => e.id === id);
  const jaEstavaNoTema = atual >= 0;
  if (jaEstavaNoTema && pedido.posicao === undefined) {
    tema.entradas[atual] = { id, texto: linha };
  } else {
    if (jaEstavaNoTema) tema.entradas.splice(atual, 1);
    const destino = pedido.posicao === undefined ? tema.entradas.length : limitar(pedido.posicao - 1, 0, tema.entradas.length);
    tema.entradas.splice(destino, 0, { id, texto: linha });
  }
  escreverTema(pasta, tema);

  writeFileSync(join(pasta, 'fontes', id + '.md'), montarNotaFonte(pasta, nota, pedido));
  reescreverIndiceRaiz(pasta);

  return {
    id,
    tema: slug,
    posicao: tema.entradas.findIndex((e) => e.id === id) + 1,
    fonteNova: anterior === null,
    jaEstavaNoTema,
  };
}

function validarPedido(p: PedidoGuardar): void {
  if (!p.titulo?.trim()) throw new Error('guardar_fonte: falta o título');
  if (!/^https?:\/\/\S+$/.test(p.link?.trim() ?? '')) throw new Error(`guardar_fonte: link inválido: "${p.link}"`);
  if (!p.oQueDiz?.trim()) throw new Error('guardar_fonte: falta dizer o que a fonte diz (o_que_diz)');
  if (!p.praQueServe?.trim()) throw new Error('guardar_fonte: falta dizer pra que a fonte serve (pra_que_serve)');
  if (p.posicao !== undefined && (!Number.isInteger(p.posicao) || p.posicao < 1)) {
    throw new Error(`guardar_fonte: posição tem que ser inteiro >= 1, veio ${p.posicao}`);
  }
}

function linhaDoTema(nota: NotaFonte, praQueServe: string): string {
  const ano = nota.ano ? ` (${nota.ano})` : '';
  return `[${escaparColchete(nota.titulo)}](../fontes/${nota.id}.md)${ano}: ${encurtar(umaLinha(praQueServe), 180)}`;
}

function montarNotaFonte(pasta: string, nota: NotaFonte, pedido: PedidoGuardar): string {
  const campos: [string, unknown][] = [
    ['id', nota.id],
    ['tipo', nota.tipo],
    ['titulo', nota.titulo],
    ['autores', nota.autores],
    ['ano', nota.ano],
    ['link', nota.link],
  ];
  if (nota.arxiv) campos.push(['arxiv', nota.arxiv]);
  if (nota.doi) campos.push(['doi', nota.doi]);
  campos.push(['temas', nota.temas], ['guardado_em', nota.guardado_em]);
  // JSON é YAML válido: aspas e listas saem certas sem biblioteca de YAML
  const frontmatter = campos.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');

  const autores = nota.autores.length > 0 ? nota.autores.join(', ') : 'autores não informados';
  const temas = nota.temas.map((slug) => {
    const nome = lerEstruturaTema(pasta, slug)?.nome ?? slug;
    return `- [${escaparColchete(nome)}](../temas/${slug}.md)`;
  });

  return [
    '---',
    frontmatter,
    '---',
    '',
    `# ${nota.titulo}`,
    '',
    `${autores}${nota.ano ? ` (${nota.ano})` : ''}. [${nota.link}](${nota.link})`,
    '',
    '## O que diz',
    '',
    pedido.oQueDiz.trim(),
    '',
    '## Pra que serve',
    '',
    pedido.praQueServe.trim(),
    '',
    '## Temas',
    '',
    ...temas,
    '',
  ].join('\n');
}

function lerEstruturaTema(pasta: string, slug: string): Tema | null {
  const caminho = join(pasta, 'temas', slug + '.md');
  if (!existsSync(caminho)) return null;
  const linhas = readFileSync(caminho, 'utf8').split(/\r?\n/);
  let nome = slug;
  let descricao = '';
  const entradas: Tema['entradas'] = [];
  let passouTitulo = false;
  for (const bruta of linhas) {
    const l = bruta.trim();
    if (!l) continue;
    const id = l.match(LINK_FONTE)?.[1];
    if (id) {
      // Aceita a lista numerada que o código escreve e a lista com traço que alguém edite à mão
      if (!entradas.some((e) => e.id === id)) entradas.push({ id, texto: l.replace(/^(\d+\.|[-*])\s+/, '') });
    } else if (l.startsWith('# ') && !passouTitulo) {
      nome = l.slice(2).trim();
      passouTitulo = true;
    } else if (passouTitulo && !descricao && !l.startsWith('#') && entradas.length === 0) {
      descricao = l;
    }
  }
  return { slug, nome, descricao, entradas };
}

function escreverTema(pasta: string, tema: Tema): void {
  const corpo = [`# ${tema.nome}`, ''];
  if (tema.descricao) corpo.push(tema.descricao, '');
  tema.entradas.forEach((e, i) => corpo.push(`${i + 1}. ${e.texto}`));
  corpo.push('');
  writeFileSync(join(pasta, 'temas', tema.slug + '.md'), corpo.join('\n'));
}

// O índice raiz é derivado dos arquivos de tema; reescrever tudo é o que mantém a contagem sempre certa
function reescreverIndiceRaiz(pasta: string): void {
  const temas = listarTemas(pasta)
    .map((slug) => lerEstruturaTema(pasta, slug))
    .filter((t): t is Tema => t !== null)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
  const linhas = temas.map((t) => {
    const n = t.entradas.length;
    const desc = t.descricao ? `: ${t.descricao}` : '';
    return `- [${escaparColchete(t.nome)}](temas/${t.slug}.md)${desc} (${n} ${n === 1 ? 'fonte' : 'fontes'})`;
  });
  const texto = [
    '# Acervo',
    '',
    'Um tema por linha. Cada tema lista as fontes na ordem sugerida de leitura.',
    '',
    ...linhas,
    '',
  ].join('\n');
  writeFileSync(join(pasta, 'INDICE.md'), texto);
}

// ---------- utilidades ----------

export function parseFrontmatter(texto: string): NotaFonte | null {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m?.[1]) return null;
  const obj: Record<string, unknown> = {};
  for (const linha of m[1].split(/\r?\n/)) {
    const par = linha.match(/^([a-z_]+):\s*(.*)$/);
    if (!par?.[1]) continue;
    const valor = par[2] ?? '';
    // O código grava em JSON; quem editar à mão no Obsidian pode escrever texto sem aspas
    obj[par[1]] = valor.startsWith('"') || valor.startsWith('[') || /^(-?\d+|null|true|false)$/.test(valor)
      ? JSON.parse(valor)
      : valor;
  }
  if (typeof obj.id !== 'string') return null;
  return {
    id: obj.id,
    tipo: obj.tipo === 'pagina' ? 'pagina' : 'artigo',
    titulo: String(obj.titulo ?? ''),
    autores: Array.isArray(obj.autores) ? obj.autores.map(String) : [],
    ano: typeof obj.ano === 'number' ? obj.ano : null,
    link: String(obj.link ?? ''),
    ...(typeof obj.doi === 'string' ? { doi: obj.doi } : {}),
    ...(typeof obj.arxiv === 'string' ? { arxiv: obj.arxiv } : {}),
    temas: Array.isArray(obj.temas) ? obj.temas.map(String) : [],
    guardado_em: String(obj.guardado_em ?? ''),
  };
}

export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function encurtar(s: string, max: number): string {
  if (s.length <= max) return s;
  const corte = s.slice(0, max);
  const espaco = corte.lastIndexOf(' ');
  return (espaco > max * 0.6 ? corte.slice(0, espaco) : corte) + '…';
}

function umaLinha(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function escaparColchete(s: string): string {
  return s.replace(/\[/g, '(').replace(/\]/g, ')');
}

function limitar(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function dataDeHoje(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
