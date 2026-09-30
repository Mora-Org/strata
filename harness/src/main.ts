import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createModels, type Api, type Message, type Model, type Models, type ToolCall } from '@earendil-works/pi-ai';
import { opencodeGoProvider } from '@earendil-works/pi-ai/providers/opencode-go';
import { existeFonte, lerIndiceRaiz, lerNotaFonte } from './acervo.ts';
import { iniciarHistorico, rodarCiclo, somarEm, usoVazio, type Ferramenta, type ResultadoCiclo, type Uso } from './ciclo.ts';
import { conferirResposta, type Conferencia } from './citacoes.ts';
import { carregarConfig, type StrataConfig } from './config.ts';
import { criarFerramentas } from './ferramentas.ts';

export interface Prompts {
  estudo: string;
  conhecimento: string;
  pasta: string;
}

export interface Sessao {
  pastaAcervo: string;
  models: Models;
  modelo: Model<Api>;
  sessionId: string;
  historico: Message[];
  ferramentas: Ferramenta[];
  conhecimentoLigado: boolean;
  prompts: Prompts;
  tetoPassos: number;
  temChave: boolean;
  usoTotal: Uso;
  escrever: (t: string) => void;
  cores: boolean;
}

export interface OpcoesSessao {
  pastaAcervo: string;
  models: Models;
  modelo: Model<Api>;
  ferramentas: Ferramenta[];
  conhecimentoLigado: boolean;
  prompts: Prompts;
  temChave: boolean;
  escrever: (t: string) => void;
  cores: boolean;
  tetoPassos?: number;
}

export interface RespostaFinal {
  ciclo: ResultadoCiclo;
  conferencia: Conferencia | null;
  corrigida: boolean;
}

// Teto por rodada do ciclo. A correção pedida pelo conferidor ganha outra rodada com o mesmo teto.
export const TETO_PASSOS = 12;
const SECAO_CONHECIMENTO = 'conhecimento';
const PROVEDORES_INCLUIDOS = ['opencode-go'];

export function novaSessao(o: OpcoesSessao): Sessao {
  const secoes: Record<string, string> = o.conhecimentoLigado ? { [SECAO_CONHECIMENTO]: o.prompts.conhecimento } : {};
  return {
    pastaAcervo: o.pastaAcervo,
    models: o.models,
    modelo: o.modelo,
    sessionId: crypto.randomUUID(),
    historico: iniciarHistorico(o.prompts.estudo, secoes, o.ferramentas),
    ferramentas: o.ferramentas,
    conhecimentoLigado: o.conhecimentoLigado,
    prompts: o.prompts,
    tetoPassos: o.tetoPassos ?? TETO_PASSOS,
    temChave: o.temChave,
    usoTotal: usoVazio(),
    escrever: o.escrever,
    cores: o.cores,
  };
}

// Devolve false quando é hora de sair
export async function tratarLinha(s: Sessao, bruta: string): Promise<boolean> {
  const linha = bruta.trim();
  if (!linha) return true;
  if (!linha.startsWith('/')) {
    await perguntar(s, linha);
    return true;
  }
  const [comando, ...resto] = linha.split(/\s+/);
  const arg = resto.join(' ').toLowerCase();
  if (comando === '/sair') return false;
  if (comando === '/acervo') {
    const indice = lerIndiceRaiz(s.pastaAcervo);
    s.escrever((indice ?? `(acervo vazio em ${s.pastaAcervo})`).trimEnd() + '\n');
  } else if (comando === '/conhecimento' && (arg === 'ligado' || arg === 'desligado')) {
    mudarConhecimento(s, arg === 'ligado');
  } else {
    s.escrever('Comandos: /conhecimento ligado, /conhecimento desligado, /acervo, /sair\n');
  }
  return true;
}

export function mudarConhecimento(s: Sessao, ligado: boolean): void {
  if (s.conhecimentoLigado === ligado) {
    s.escrever(`Conhecimento do modelo já está ${ligado ? 'ligado' : 'desligado'}.\n`);
    return;
  }
  s.conhecimentoLigado = ligado;
  // Mensagem de sistema nova no histórico: o pi-ai reaplica as seções em ordem, e o passado fica como foi
  s.historico.push({
    role: 'system',
    content: '',
    sections: { [SECAO_CONHECIMENTO]: ligado ? s.prompts.conhecimento : null },
    timestamp: Date.now(),
  });
  s.escrever(`Conhecimento do modelo ${ligado ? 'ligado' : 'desligado'}.\n`);
}

export async function perguntar(s: Sessao, pergunta: string): Promise<RespostaFinal | null> {
  if (!s.temChave) {
    s.escrever(`erro: falta a chave do provedor ${s.modelo.provider}. Defina a variável de ambiente e abra de novo.\n`);
    return null;
  }
  s.historico.push({ role: 'user', content: pergunta, timestamp: Date.now() });
  const uso = usoVazio();

  let ciclo = await rodarComTerminal(s, uso);
  if (ciclo.fim !== 'resposta') {
    avisarFimAnormal(s, ciclo);
    fecharResposta(s, uso);
    return { ciclo, conferencia: null, corrigida: false };
  }

  let conferencia = conferir(s, ciclo.texto);
  let corrigida = false;
  if (!conferencia.aprovada) {
    // Uma chance de correção: o modelo vê o motivo e pode guardar a fonte que faltou ou tirar a citação.
    // Mais de uma vira laço caro; se falhar de novo, a resposta fica marcada como reprovada.
    s.escrever(cor(s, 33, `\nConferidor: reprovou.\n${listar(conferencia.problemas)}Pedindo ao modelo pra corrigir uma vez.\n`));
    s.historico.push({
      role: 'user',
      content:
        '[Conferidor do Strata] Sua última resposta não passou na conferência de citações:\n' +
        listar(conferencia.problemas) +
        'Corrija e escreva a resposta final inteira de novo. Se faltou guardar uma fonte, guarde com guardar_fonte antes de citar.',
      timestamp: Date.now(),
    });
    ciclo = await rodarComTerminal(s, uso);
    if (ciclo.fim !== 'resposta') {
      avisarFimAnormal(s, ciclo);
      fecharResposta(s, uso);
      return { ciclo, conferencia, corrigida: false };
    }
    conferencia = conferir(s, ciclo.texto);
    corrigida = true;
  }

  if (conferencia.aprovada) {
    const extra = corrigida ? ' na segunda tentativa' : '';
    s.escrever(cor(s, 32, `\nConferidor: ok${extra} (${conferencia.citadas.length} citada(s) no texto, ${conferencia.listadas.length} pra seguir).\n`));
  } else {
    s.escrever(cor(s, 31, `\nConferidor: reprovou de novo. A resposta acima NÃO passou na conferência:\n${listar(conferencia.problemas)}`));
  }
  escreverLinks(s, conferencia);
  fecharResposta(s, uso);
  return { ciclo, conferencia, corrigida };
}

function conferir(s: Sessao, texto: string): Conferencia {
  return conferirResposta(texto, (id) => existeFonte(s.pastaAcervo, id), s.conhecimentoLigado);
}

async function rodarComTerminal(s: Sessao, uso: Uso): Promise<ResultadoCiclo> {
  let colunaZero = true;
  // O modelo às vezes manda só quebras de linha antes de chamar ferramenta; pular isso no começo de cada passo
  let comecoDoPasso = true;
  const escrever = (t: string) => {
    if (!t) return;
    s.escrever(t);
    colunaZero = t.endsWith('\n');
  };
  const novaLinha = () => {
    if (!colunaZero) escrever('\n');
  };
  s.escrever('\n');
  const r = await rodarCiclo(s.historico, {
    models: s.models,
    modelo: s.modelo,
    sessionId: s.sessionId,
    ferramentas: s.ferramentas,
    tetoPassos: s.tetoPassos,
    observador: {
      aoTexto: (d) => {
        if (comecoDoPasso && !d.trim()) return;
        escrever(comecoDoPasso ? d.trimStart() : d);
        comecoDoPasso = false;
      },
      aoChamar: (c) => {
        novaLinha();
        escrever(cor(s, 36, `  → ${resumirChamada(c)}\n`));
      },
      aoResultado: (_c, r) => {
        escrever(cor(s, r.erro ? 31 : 90, `    ← ${r.erro ? 'erro: ' : ''}${encurtar(primeiraLinhaUtil(r.texto), 140)}\n`));
        comecoDoPasso = true;
      },
    },
  });
  novaLinha();
  somarEm(uso, r.uso);
  return r;
}

function avisarFimAnormal(s: Sessao, r: ResultadoCiclo): void {
  if (r.fim === 'teto') s.escrever(cor(s, 31, `\nParou no teto de ${s.tetoPassos} passos sem resposta final.\n`));
  else s.escrever(cor(s, 31, `\nerro do provedor: ${r.erro}\n`));
}

// Os links saem do acervo, não do texto do modelo: é o jeito de o link estar certo sempre
function escreverLinks(s: Sessao, c: Conferencia): void {
  const ids = [...new Set([...c.listadas, ...c.citadas])].filter((id) => existeFonte(s.pastaAcervo, id));
  if (ids.length === 0) return;
  const linhas = ids.map((id) => {
    const n = lerNotaFonte(s.pastaAcervo, id);
    return n ? `  [fonte:${id}] ${n.titulo}${n.ano ? ` (${n.ano})` : ''} ${n.link}` : `  [fonte:${id}]`;
  });
  s.escrever(`Links das fontes citadas, lidos do acervo:\n${linhas.join('\n')}\n`);
}

function fecharResposta(s: Sessao, uso: Uso): void {
  somarEm(s.usoTotal, uso);
  s.escrever(cor(s, 90, `[${descreverUso(uso)} | sessão: ${dinheiro(s.usoTotal.custo)}]\n`));
}

export function descreverUso(u: Uso): string {
  const n = (x: number) => x.toLocaleString('pt-BR');
  return (
    `${u.chamadas} chamada(s) ao modelo | tokens: ${n(u.entrada)} de entrada + ${n(u.cache)} do cache, ` +
    `${n(u.saida)} de saída | custo: ${dinheiro(u.custo)}`
  );
}

function dinheiro(v: number): string {
  return 'US$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 5, maximumFractionDigits: 5 });
}

function resumirChamada(c: ToolCall): string {
  const partes = Object.entries(c.arguments).map(([k, v]) => {
    const t = typeof v === 'string' ? JSON.stringify(encurtar(v, 50)) : encurtar(JSON.stringify(v), 50);
    return `${k}=${t}`;
  });
  return `${c.name}(${partes.join(', ')})`;
}

// Pula o frontmatter das notas e títulos vazios pra linha do terminal dizer algo
function primeiraLinhaUtil(texto: string): string {
  const semFrontmatter = texto.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  return (semFrontmatter.split('\n').find((l) => l.trim() && !/^#+\s*$/.test(l.trim())) ?? '').trim();
}

function listar(itens: string[]): string {
  return itens.map((p) => `  - ${p}\n`).join('');
}

function encurtar(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}

function cor(s: Sessao, codigo: number, t: string): string {
  return s.cores ? `\x1b[${codigo}m${t}\x1b[0m` : t;
}

// ---------- arranque ----------

// Os prompts ficam em arquivo ao lado do executável (ou do código), pra quem usa editar sem recompilar
export function carregarPrompts(): Prompts {
  const candidatas = [
    join(dirname(process.execPath), 'modos'),
    join(dirname(process.execPath), '..', 'modos'),
    join(import.meta.dir, '..', 'modos'),
  ];
  const pasta = candidatas.find((p) => existsSync(join(p, 'estudo.md')));
  if (!pasta) throw new Error(`não achei a pasta modos/ com estudo.md. Procurei em:\n  ${candidatas.join('\n  ')}`);
  const conhecimento = join(pasta, 'conhecimento-do-modelo.md');
  if (!existsSync(conhecimento)) throw new Error(`falta ${conhecimento}`);
  return { estudo: readFileSync(join(pasta, 'estudo.md'), 'utf8'), conhecimento: readFileSync(conhecimento, 'utf8'), pasta };
}

function montarModelos(config: StrataConfig): { models: Models; modelo: Model<Api> } {
  // Só o OpenCode Go entra no executável: puxar todos os provedores do pi-ai incharia o binário
  if (!PROVEDORES_INCLUIDOS.includes(config.provedor)) {
    throw new Error(`provedor "${config.provedor}" não está incluído nesta versão. Incluídos: ${PROVEDORES_INCLUIDOS.join(', ')}.`);
  }
  const models = createModels();
  models.setProvider(opencodeGoProvider());
  const modelo = models.getModel(config.provedor, config.modelo);
  if (!modelo) {
    const ids = models.getModels(config.provedor).map((m) => m.id).join(', ');
    throw new Error(`modelo "${config.modelo}" não existe no provedor ${config.provedor}. Existem: ${ids}`);
  }
  return { models, modelo };
}

async function main(): Promise<void> {
  const config = carregarConfig();
  const prompts = carregarPrompts();
  const { models, modelo } = montarModelos(config);
  const temChave = (await models.checkAuth(config.provedor)) !== undefined;
  const interativo = Boolean(process.stdin.isTTY);
  const escrever = (t: string) => void process.stdout.write(t);

  const s = novaSessao({
    pastaAcervo: config.pastaAcervo,
    models,
    modelo,
    ferramentas: criarFerramentas(config.pastaAcervo),
    conhecimentoLigado: config.conhecimentoLigado,
    prompts,
    temChave,
    escrever,
    cores: Boolean(process.stdout.isTTY),
  });

  escrever(
    [
      'Strata, modo de estudo',
      `modelo: ${modelo.provider}/${modelo.id}`,
      `acervo: ${config.pastaAcervo}`,
      `conhecimento do modelo: ${config.conhecimentoLigado ? 'ligado' : 'desligado'}`,
      `config: ${config.origem}`,
      `modos: ${prompts.pasta}`,
      'comandos: /conhecimento ligado, /conhecimento desligado, /acervo, /sair',
      '',
    ].join('\n'),
  );
  if (!temChave) escrever(`aviso: falta a chave do provedor ${config.provedor} (OPENCODE_API_KEY). /acervo funciona; perguntas não.\n`);

  if (interativo) escrever('\nvocê> ');
  for await (const linha of console) {
    // Com entrada por pipe a pergunta não aparece na tela; repetir deixa a transcrição legível
    if (!interativo && linha.trim()) escrever(`\n> ${linha.trim()}\n`);
    if (!(await tratarLinha(s, linha))) break;
    if (interativo) escrever('\nvocê> ');
  }
  escrever(`\nFim da sessão. Total: ${descreverUso(s.usoTotal)}\n`);
  process.exit(0);
}

if (import.meta.main) {
  main().catch((e: unknown) => {
    process.stderr.write(`erro: ${e instanceof Error ? e.message : String(e)}\n`);
    process.exit(1);
  });
}
