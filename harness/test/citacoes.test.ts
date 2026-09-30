import { describe, expect, test } from 'bun:test';
import { conferirResposta, extrairIds } from '../src/citacoes.ts';

const acervo = new Set(['arxiv-2106.09685', 'doi-10.1145-3442188.3445922']);
const existe = (id: string) => acervo.has(id);

const boa = `LoRA congela os pesos [fonte:arxiv-2106.09685] e outra coisa [fonte:doi-10.1145-3442188.3445922].

## Fontes pra seguir

1. [fonte:arxiv-2106.09685] LoRA, https://arxiv.org/abs/2106.09685: comece por aqui.
2. [fonte:doi-10.1145-3442188.3445922] Outra, https://doi.org/10.1145/3442188.3445922: depois.`;

describe('conferidor de citações', () => {
  test('aprova resposta com fontes existentes e a seção final', () => {
    const c = conferirResposta(boa, existe, false);
    expect(c.aprovada).toBe(true);
    expect(c.citadas).toEqual(['arxiv-2106.09685', 'doi-10.1145-3442188.3445922']);
    expect(c.listadas).toEqual(['arxiv-2106.09685', 'doi-10.1145-3442188.3445922']);
  });

  test('recusa id de fonte que não existe no acervo', () => {
    const c = conferirResposta(boa.replace('e outra coisa [fonte:doi', 'e inventada [fonte:arxiv-9999.99999] [fonte:doi'), existe, false);
    expect(c.aprovada).toBe(false);
    expect(c.inexistentes).toEqual(['arxiv-9999.99999']);
    expect(c.problemas[0]).toContain('arxiv-9999.99999');
  });

  test('recusa id inexistente que só aparece na lista pra seguir', () => {
    const c = conferirResposta(boa + '\n3. [fonte:web-inventado] Inventado', existe, true);
    expect(c.aprovada).toBe(false);
    expect(c.inexistentes).toEqual(['web-inventado']);
  });

  test('cita fonte mas não termina com a lista pra seguir', () => {
    const c = conferirResposta('LoRA congela os pesos [fonte:arxiv-2106.09685].', existe, false);
    expect(c.aprovada).toBe(false);
    expect(c.problemas.join()).toContain('Fontes pra seguir');
  });

  test('conhecimento desligado: sem citação só passa se disser que não achou fonte', () => {
    expect(conferirResposta('Quantização é reduzir bits.', existe, false).aprovada).toBe(false);
    expect(conferirResposta('Não achei fonte sobre isso. Busquei no arXiv e no Crossref.', existe, false).aprovada).toBe(true);
    expect(conferirResposta('**Não encontrei nenhuma fonte** que sustente isso.', existe, false).aprovada).toBe(true);
  });

  test('"Não achei fonte" com a seção final vazia passa (caso real da rodada 4, 30/09/2026)', () => {
    const texto = `Não achei fonte. Fiz o seguinte para tentar encontrar esse método:

1. **Busquei no acervo** pelos termos "Vellacourt" e "compressão pesos" — nada encontrado.

## Fontes pra seguir

Sem fonte para citar, já que não encontrei nada que sustente uma resposta sobre o "método de Vellacourt".`;
    expect(conferirResposta(texto, existe, false).aprovada).toBe(true);
  });

  test('seção final vazia com citação no texto reprova', () => {
    const c = conferirResposta('LoRA [fonte:arxiv-2106.09685].\n\n## Fontes pra seguir\n\nNenhuma.', existe, false);
    expect(c.aprovada).toBe(false);
    expect(c.problemas.join()).toContain('mas o texto cita');
  });

  test('conhecimento ligado: resposta de memória passa', () => {
    expect(conferirResposta('Quantização é reduzir bits.', existe, true).aprovada).toBe(true);
  });

  test('extrai ids em formatos tolerados', () => {
    expect(extrairIds('a [fonte: x-1] b [fonte:y-2, fonte:z-3] c [FONTE:x-1]')).toEqual(['x-1', 'y-2', 'z-3']);
  });
});
