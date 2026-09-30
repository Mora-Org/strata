import { normalizar } from './acervo.ts';

// Contrato de citação: no texto, [fonte:<id>]; no fim, a seção "Fontes pra seguir" com os ids na ordem de leitura.
export interface Conferencia {
  aprovada: boolean;
  citadas: string[];
  listadas: string[];
  inexistentes: string[];
  problemas: string[];
}

export const TITULO_SECAO = 'Fontes pra seguir';
export const FRASE_SEM_FONTE = 'Não achei fonte';

const MARCADOR = /\[fonte:\s*([^\]]+)\]/gi;
const SECAO = /^[#*_\s]*fontes pra seguir\b/;
const SEM_FONTE = /\bnao (achei|encontrei) (nenhuma )?fontes?\b/;

export function conferirResposta(texto: string, existe: (id: string) => boolean, conhecimentoLigado: boolean): Conferencia {
  const linhas = texto.split(/\r?\n/);
  const inicioSecao = linhas.findIndex((l) => SECAO.test(normalizar(l)));
  const corpo = inicioSecao >= 0 ? linhas.slice(0, inicioSecao).join('\n') : texto;
  const secao = inicioSecao >= 0 ? linhas.slice(inicioSecao + 1).join('\n') : '';

  const citadas = extrairIds(corpo);
  const listadas = extrairIds(secao);
  const todas = [...new Set([...citadas, ...listadas])];
  const inexistentes = todas.filter((id) => !existe(id));
  const problemas: string[] = [];

  for (const id of inexistentes) {
    problemas.push(`[fonte:${id}] não existe no acervo. Guarde a fonte com guardar_fonte antes de citar, ou tire a citação.`);
  }
  // Seção vazia só é problema quando o texto cita fonte: "Não achei fonte" com a seção vazia é resposta certa
  if (citadas.length > 0 && listadas.length === 0) {
    problemas.push(
      inicioSecao < 0
        ? `A resposta cita fontes mas não termina com a seção "${TITULO_SECAO}" listando quais seguir, em ordem.`
        : `A seção "${TITULO_SECAO}" não lista nenhuma fonte no formato [fonte:<id>], mas o texto cita.`,
    );
  }
  if (todas.length === 0 && !conhecimentoLigado && !SEM_FONTE.test(normalizar(texto))) {
    problemas.push(
      `Com o conhecimento do modelo desligado, uma resposta sem nenhuma [fonte:<id>] precisa dizer "${FRASE_SEM_FONTE}".`,
    );
  }

  return { aprovada: problemas.length === 0, citadas, listadas, inexistentes, problemas };
}

export function extrairIds(texto: string): string[] {
  const ids: string[] = [];
  for (const m of texto.matchAll(MARCADOR)) {
    // Aceita [fonte:a, fonte:b] além de [fonte:a] [fonte:b]
    for (const parte of (m[1] ?? '').split(/[,;]/)) {
      const id = parte.trim().replace(/^fonte:\s*/i, '').trim();
      if (id && !ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}
