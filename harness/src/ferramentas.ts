import { Type } from '@earendil-works/pi-ai';
import {
  buscarNoAcervo,
  existeFonte,
  guardarFonte,
  lerFonte,
  lerIndiceRaiz,
  lerTema,
  listarTemas,
  type TipoFonte,
} from './acervo.ts';
import type { Ferramenta, ResultadoFerramenta } from './ciclo.ts';
import { buscarArxiv, buscarCrossref, lerPagina, type Buscador, type CandidatoFonte } from './fontes.ts';

const MAX_PADRAO = 5;
const RESUMO_MAX = 700;

// As seis ferramentas que o modelo recebe, presas a uma pasta de acervo e a um fetch (falso nos testes)
export function criarFerramentas(pasta: string, buscar: Buscador = fetch): Ferramenta[] {
  return [
    {
      definicao: {
        name: 'ler_indice',
        description:
          'Lê o acervo de fontes já guardadas. Sem tema, devolve o índice raiz (um tema por linha). ' +
          'Com tema, devolve a lista de fontes daquele tema na ordem sugerida de leitura. Use antes de buscar fora.',
        parameters: Type.Object({
          tema: Type.Optional(Type.String({ description: 'Nome ou slug do tema, como aparece no índice raiz. Omita pra ler o índice raiz.' })),
        }),
      },
      async executar(args) {
        const tema = texto(args.tema);
        if (!tema) {
          const raiz = lerIndiceRaiz(pasta);
          return ok(raiz ?? 'O acervo está vazio: nenhuma fonte guardada ainda.');
        }
        const conteudo = lerTema(pasta, tema);
        if (conteudo === null) {
          const temas = listarTemas(pasta);
          return erro(`Tema "${tema}" não existe no acervo. Temas existentes: ${temas.length ? temas.join(', ') : 'nenhum'}.`);
        }
        return ok(conteudo);
      },
    },
    {
      definicao: {
        name: 'ler_fonte',
        description: 'Lê a nota de uma fonte guardada no acervo (metadados, o que ela diz, pra que serve).',
        parameters: Type.Object({
          id: Type.String({ description: 'Id da fonte, por exemplo arxiv-2106.09685 ou doi-10.1145-3442188.3445922' }),
        }),
      },
      async executar(args) {
        const id = texto(args.id);
        const nota = lerFonte(pasta, id);
        return nota === null ? erro(`Fonte "${id}" não existe no acervo.`) : ok(nota);
      },
    },
    {
      definicao: {
        name: 'buscar_no_acervo',
        description:
          'Busca por texto nas notas do acervo (temas e fontes). Use quando os índices não apontarem o caminho.',
        parameters: Type.Object({
          consulta: Type.String({ description: 'Palavras a procurar, em português ou inglês' }),
        }),
      },
      async executar(args) {
        const achados = buscarNoAcervo(pasta, texto(args.consulta));
        if (achados.length === 0) return ok('Nada encontrado no acervo pra essa consulta.');
        return ok(
          achados
            .map((a) => [`${a.arquivo}: ${a.titulo}`, ...a.trechos.map((t) => `  ${t}`)].join('\n'))
            .join('\n\n'),
        );
      },
    },
    {
      definicao: {
        name: 'buscar_artigos',
        description:
          'Busca artigos acadêmicos no arXiv e no Crossref. Devolve título, autores, ano, link, resumo (quando existe) ' +
          'e o id que a fonte terá no acervo. Termos em inglês funcionam melhor.',
        parameters: Type.Object({
          termos: Type.String({ description: '2 a 6 palavras-chave, de preferência em inglês' }),
          fonte: Type.Optional(Type.String({ description: 'arxiv, crossref ou ambas (padrão: ambas)' })),
          max: Type.Optional(Type.Integer({ minimum: 1, maximum: 10, description: 'Resultados por fonte (padrão: 5)' })),
        }),
      },
      async executar(args) {
        const termos = texto(args.termos);
        const fonte = texto(args.fonte) || 'ambas';
        if (!['arxiv', 'crossref', 'ambas'].includes(fonte)) return erro(`fonte tem que ser arxiv, crossref ou ambas; veio "${fonte}"`);
        const max = typeof args.max === 'number' ? args.max : MAX_PADRAO;

        const partes: string[] = [];
        let algumaDeuCerto = false;
        const buscas: [string, () => Promise<CandidatoFonte[]>][] = [];
        if (fonte !== 'crossref') buscas.push(['arXiv', () => buscarArxiv(termos, max, buscar)]);
        if (fonte !== 'arxiv') buscas.push(['Crossref', () => buscarCrossref(termos, max, buscar)]);
        for (const [nome, rodar] of buscas) {
          // Uma fonte fora do ar não derruba a outra; o erro vai no texto pro modelo e aparece no terminal
          try {
            const achados = await rodar();
            algumaDeuCerto = true;
            partes.push(`## ${nome}: ${achados.length} resultado(s)\n\n` + achados.map((c) => formatarCandidato(c, pasta)).join('\n\n'));
          } catch (e) {
            partes.push(`## ${nome}: falhou (${e instanceof Error ? e.message : String(e)})`);
          }
        }
        return { texto: partes.join('\n\n'), erro: !algumaDeuCerto };
      },
    },
    {
      definicao: {
        name: 'ler_pagina',
        description: 'Lê o texto de uma página da web (HTML ou texto puro) por URL. Não lê PDF.',
        parameters: Type.Object({ url: Type.String({ description: 'URL completa, com https://' }) }),
      },
      async executar(args) {
        const p = await lerPagina(texto(args.url), buscar);
        const aviso = p.truncado ? '\n\n(texto cortado no limite de tamanho)' : '';
        return ok(`${p.titulo}\n${p.url}\n\n${p.texto}${aviso}`);
      },
    },
    {
      definicao: {
        name: 'guardar_fonte',
        description:
          'Guarda uma fonte no acervo, dentro de um tema. Guarde toda fonte que você citar. ' +
          'Guardar de novo a mesma fonte atualiza a nota sem duplicar. Pra pôr a fonte em mais de um tema, ' +
          'chame uma vez por tema. Devolve o id pra citar como [fonte:<id>].',
        parameters: Type.Object({
          tipo: Type.Optional(Type.String({ description: 'artigo ou pagina (padrão: artigo)' })),
          titulo: Type.String(),
          autores: Type.Array(Type.String()),
          ano: Type.Optional(Type.Integer({ description: 'Omita se não souber' })),
          link: Type.String({ description: 'Link da fonte (https://...)' }),
          doi: Type.Optional(Type.String()),
          arxiv: Type.Optional(Type.String({ description: 'Id do arXiv, por exemplo 2106.09685' })),
          tema: Type.String({ description: 'Nome do tema em português. Reuse um tema do índice quando couber.' }),
          descricao_tema: Type.Optional(Type.String({ description: 'Descrição curta do tema (uma linha), pro índice raiz' })),
          posicao: Type.Optional(Type.Integer({ minimum: 1, description: 'Posição na ordem de leitura do tema; 1 = ler primeiro. Omita pra pôr no fim.' })),
          o_que_diz: Type.String({ description: 'O que a fonte diz, em português, com suas palavras' }),
          pra_que_serve: Type.String({ description: 'Pra que ela serve a quem está estudando o tema (uma ou duas frases)' }),
        }),
      },
      async executar(args) {
        const tipoBruto = texto(args.tipo) || 'artigo';
        if (tipoBruto !== 'artigo' && tipoBruto !== 'pagina') return erro(`tipo tem que ser artigo ou pagina; veio "${tipoBruto}"`);
        const r = guardarFonte(pasta, {
          tipo: tipoBruto as TipoFonte,
          titulo: texto(args.titulo),
          autores: Array.isArray(args.autores) ? args.autores.map(String) : [],
          ano: typeof args.ano === 'number' ? args.ano : null,
          link: texto(args.link),
          ...(texto(args.doi) ? { doi: texto(args.doi) } : {}),
          ...(texto(args.arxiv) ? { arxiv: texto(args.arxiv) } : {}),
          tema: texto(args.tema),
          ...(texto(args.descricao_tema) ? { descricaoTema: texto(args.descricao_tema) } : {}),
          ...(typeof args.posicao === 'number' ? { posicao: args.posicao } : {}),
          oQueDiz: texto(args.o_que_diz),
          praQueServe: texto(args.pra_que_serve),
        });
        const estado = r.fonteNova ? 'guardada' : r.jaEstavaNoTema ? 'atualizada' : 'acrescentada a mais um tema';
        return ok(`Fonte ${estado}: [fonte:${r.id}] no tema "${r.tema}", posição ${r.posicao}. Cite como [fonte:${r.id}].`);
      },
    },
  ];
}

function formatarCandidato(c: CandidatoFonte, pasta: string): string {
  const autores = c.autores.length > 3 ? `${c.autores.slice(0, 3).join(', ')} et al.` : c.autores.join(', ') || 'não informados';
  const ident = c.arxiv ? `arxiv: ${c.arxiv}` : c.doi ? `doi: ${c.doi}` : '';
  const resumo = c.resumo ? (c.resumo.length > RESUMO_MAX ? c.resumo.slice(0, RESUMO_MAX) + '…' : c.resumo) : '(a fonte não trouxe resumo)';
  return [
    `[${c.id}] ${c.titulo}${c.ano ? ` (${c.ano})` : ''}`,
    `autores: ${autores}`,
    `link: ${c.link}${ident ? ` | ${ident}` : ''}${c.publicadoEm ? ` | em: ${c.publicadoEm}` : ''}`,
    `já no acervo: ${existeFonte(pasta, c.id) ? 'sim' : 'não'}`,
    `resumo: ${resumo}`,
  ].join('\n');
}

function texto(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function ok(t: string): ResultadoFerramenta {
  return { texto: t, erro: false };
}

function erro(t: string): ResultadoFerramenta {
  return { texto: t, erro: true };
}
