import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';

export interface StrataConfig {
  provedor: string;
  modelo: string;
  pastaAcervo: string;
  conhecimentoLigado: boolean;
  // De onde veio a configuração, pra o terminal dizer ao usuário
  origem: string;
}

// Formato do arquivo em disco. Chave de API não entra aqui de propósito.
interface ArquivoConfig {
  provedor?: string;
  modelo?: string;
  acervo?: string;
  conhecimento_ligado?: boolean;
}

const CHAVES_ACEITAS = ['provedor', 'modelo', 'acervo', 'conhecimento_ligado'] as const;

export const PROVEDOR_PADRAO = 'opencode-go';
export const MODELO_PADRAO = 'deepseek-v4-flash';

export function caminhoConfig(): string {
  const doAmbiente = process.env.STRATA_CONFIG;
  if (doAmbiente) return resolve(doAmbiente);
  return join(homedir(), '.strata', 'config.json');
}

export function carregarConfig(caminho: string = caminhoConfig()): StrataConfig {
  const padrao: StrataConfig = {
    provedor: PROVEDOR_PADRAO,
    modelo: MODELO_PADRAO,
    pastaAcervo: join(homedir(), 'Strata', 'acervo'),
    conhecimentoLigado: false,
    origem: 'padrão (sem arquivo de config)',
  };

  if (!existsSync(caminho)) {
    // STRATA_CONFIG apontando pra arquivo que não existe é engano de quem chamou, não "usar padrão"
    if (process.env.STRATA_CONFIG) throw new Error(`STRATA_CONFIG aponta pra um arquivo que não existe: ${caminho}`);
    return padrao;
  }

  const bruto: unknown = JSON.parse(readFileSync(caminho, 'utf8'));
  const arquivo = validarArquivo(bruto, caminho);

  return {
    provedor: arquivo.provedor ?? padrao.provedor,
    modelo: arquivo.modelo ?? padrao.modelo,
    pastaAcervo: arquivo.acervo ? resolverPasta(arquivo.acervo, dirname(caminho)) : padrao.pastaAcervo,
    conhecimentoLigado: arquivo.conhecimento_ligado ?? padrao.conhecimentoLigado,
    origem: caminho,
  };
}

function validarArquivo(bruto: unknown, caminho: string): ArquivoConfig {
  if (typeof bruto !== 'object' || bruto === null || Array.isArray(bruto)) {
    throw new Error(`${caminho}: o config tem que ser um objeto JSON`);
  }
  const obj = bruto as Record<string, unknown>;
  // Chave desconhecida vira erro: é assim que "apiKey" ou "chave" nunca ficam gravados aqui sem ninguém ver
  const estranhas = Object.keys(obj).filter((k) => !(CHAVES_ACEITAS as readonly string[]).includes(k));
  if (estranhas.length > 0) {
    throw new Error(
      `${caminho}: chave(s) não reconhecida(s): ${estranhas.join(', ')}. Aceitas: ${CHAVES_ACEITAS.join(', ')}. ` +
        'A chave de API vem só da variável de ambiente, nunca do arquivo.',
    );
  }
  for (const k of ['provedor', 'modelo', 'acervo'] as const) {
    if (obj[k] !== undefined && (typeof obj[k] !== 'string' || obj[k] === '')) {
      throw new Error(`${caminho}: "${k}" tem que ser texto não vazio`);
    }
  }
  if (obj.conhecimento_ligado !== undefined && typeof obj.conhecimento_ligado !== 'boolean') {
    throw new Error(`${caminho}: "conhecimento_ligado" tem que ser true ou false`);
  }
  return obj as ArquivoConfig;
}

function resolverPasta(valor: string, base: string): string {
  if (valor === '~' || valor.startsWith('~/') || valor.startsWith('~\\')) return join(homedir(), valor.slice(1));
  // Caminho relativo vale a partir da pasta do config, não de onde o terminal foi aberto
  return isAbsolute(valor) ? valor : resolve(base, valor);
}
