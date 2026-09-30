import { describe, expect, test } from 'bun:test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createModels, fauxAssistantMessage, fauxProvider, fauxText, fauxToolCall, getCurrentSystemPrompt } from '@earendil-works/pi-ai';
import { lerIndiceRaiz } from '../src/acervo.ts';
import { criarFerramentas } from '../src/ferramentas.ts';
import { carregarPrompts, novaSessao, tratarLinha, type Sessao } from '../src/main.ts';

function preparar(conhecimentoLigado = false) {
  const faux = fauxProvider();
  const models = createModels();
  models.setProvider(faux.provider);
  const pasta = mkdtempSync(join(tmpdir(), 'strata-sessao-'));
  const saida: string[] = [];
  const s: Sessao = novaSessao({
    pastaAcervo: pasta,
    models,
    modelo: faux.getModel(),
    // Sem rede: qualquer busca externa neste teste é defeito
    ferramentas: criarFerramentas(pasta, async (url) => {
      throw new Error(`teste tentou sair pra rede: ${url}`);
    }),
    conhecimentoLigado,
    prompts: carregarPrompts(),
    temChave: true,
    escrever: (t) => saida.push(t),
    cores: false,
  });
  return { faux, s, pasta, saida: () => saida.join('') };
}

const guardarLora = fauxToolCall('guardar_fonte', {
  titulo: 'LoRA: Low-Rank Adaptation of Large Language Models',
  autores: ['Edward J. Hu'],
  ano: 2021,
  link: 'https://arxiv.org/abs/2106.09685',
  arxiv: '2106.09685',
  tema: 'Ajuste fino eficiente',
  descricao_tema: 'Adaptar modelos grandes treinando pouco',
  o_que_diz: 'Congela os pesos e treina matrizes de posto baixo.',
  pra_que_serve: 'Porta de entrada.',
});

describe('sessão no terminal', () => {
  test('conferidor reprova, pede correção uma vez e aprova', async () => {
    const { faux, s, saida } = preparar();
    faux.setResponses([
      fauxAssistantMessage([fauxToolCall('ler_indice', {})], { stopReason: 'toolUse' }),
      // Cita sem ter guardado: o conferidor tem que pegar
      fauxAssistantMessage('LoRA congela os pesos [fonte:arxiv-2106.09685].\n\n## Fontes pra seguir\n\n1. [fonte:arxiv-2106.09685] LoRA'),
      fauxAssistantMessage([guardarLora], { stopReason: 'toolUse' }),
      fauxAssistantMessage([fauxText('LoRA congela os pesos [fonte:arxiv-2106.09685].\n\n## Fontes pra seguir\n\n1. [fonte:arxiv-2106.09685] LoRA')]),
    ]);
    await tratarLinha(s, 'o que é LoRA?');
    const texto = saida();
    expect(texto).toContain('→ ler_indice()');
    expect(texto).toContain('Conferidor: reprovou.');
    expect(texto).toContain('[fonte:arxiv-2106.09685] não existe no acervo');
    expect(texto).toContain('→ guardar_fonte(');
    expect(texto).toContain('Conferidor: ok na segunda tentativa (1 citada(s) no texto, 1 pra seguir).');
    expect(texto).toContain('[fonte:arxiv-2106.09685] LoRA: Low-Rank Adaptation of Large Language Models (2021) https://arxiv.org/abs/2106.09685');
    expect(texto).toContain('4 chamada(s) ao modelo');
    expect(faux.getPendingResponseCount()).toBe(0);
    expect(lerIndiceRaiz(s.pastaAcervo)).toContain('(1 fonte)');
  });

  test('conhecimento desligado recusa resposta de memória; ligado aceita', async () => {
    const { faux, s, saida } = preparar(false);
    faux.setResponses([fauxAssistantMessage('Não achei fonte sobre o método Zorblax.')]);
    await tratarLinha(s, 'o que é o método Zorblax?');
    expect(saida()).toContain('Conferidor: ok');

    await tratarLinha(s, '/conhecimento ligado');
    const ultima = s.historico.at(-1);
    expect(ultima?.role).toBe('system');
    expect(ultima?.role === 'system' && ultima.sections?.conhecimento).toStartWith('## Conhecimento do modelo: ligado');
    faux.setResponses([
      (contexto) => {
        // O prompt que chega ao modelo tem que carregar o trecho do conhecimento ligado
        const temTrecho = getCurrentSystemPrompt(contexto.messages).includes('Conhecimento do modelo: ligado');
        return fauxAssistantMessage(temTrecho ? 'Zorblax, pelo que sei, não existe.' : 'SEM TRECHO');
      },
    ]);
    await tratarLinha(s, 'o que é o método Zorblax?');
    expect(saida()).toContain('Zorblax, pelo que sei, não existe.');
    expect(saida()).not.toContain('SEM TRECHO');
  });

  test('terminal mostra o título da nota lida e não imprime espaço solto antes da ferramenta', async () => {
    const { faux, s, saida } = preparar();
    faux.setResponses([
      fauxAssistantMessage([guardarLora], { stopReason: 'toolUse' }),
      fauxAssistantMessage([fauxText('\n\n'), fauxToolCall('ler_fonte', { id: 'arxiv-2106.09685' })], { stopReason: 'toolUse' }),
      fauxAssistantMessage('LoRA [fonte:arxiv-2106.09685].\n\n## Fontes pra seguir\n\n1. [fonte:arxiv-2106.09685] LoRA'),
    ]);
    await tratarLinha(s, 'o que é LoRA?');
    expect(saida()).toContain('← # LoRA: Low-Rank Adaptation of Large Language Models');
    expect(saida()).not.toContain('\n\n\n');
  });

  test('comandos /acervo e /sair', async () => {
    const { s, saida } = preparar();
    expect(await tratarLinha(s, '/acervo')).toBe(true);
    expect(saida()).toContain('(acervo vazio em');
    expect(await tratarLinha(s, '/sair')).toBe(false);
  });
});
