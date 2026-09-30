import { describe, expect, test } from 'bun:test';
import {
  createModels,
  fauxAssistantMessage,
  fauxProvider,
  fauxText,
  fauxToolCall,
  Type,
  type Message,
  type ToolCall,
} from '@earendil-works/pi-ai';
import { iniciarHistorico, rodarCiclo, type Ferramenta } from '../src/ciclo.ts';

function preparar() {
  const faux = fauxProvider();
  const models = createModels();
  models.setProvider(faux.provider);
  const executadas: Record<string, unknown>[] = [];
  const somar: Ferramenta = {
    definicao: {
      name: 'somar',
      description: 'Soma dois números',
      parameters: Type.Object({ a: Type.Number(), b: Type.Number() }),
    },
    async executar(args) {
      executadas.push(args);
      return { texto: String(Number(args.a) + Number(args.b)), erro: false };
    },
  };
  return { faux, models, modelo: faux.getModel(), ferramentas: [somar], executadas };
}

describe('ciclo do agente', () => {
  test('executa a ferramenta, devolve o resultado e volta ao modelo', async () => {
    const { faux, models, modelo, ferramentas, executadas } = preparar();
    let resultadoVisto = '';
    faux.setResponses([
      fauxAssistantMessage([fauxText('Vou somar.'), fauxToolCall('somar', { a: 1234, b: 5678 })], { stopReason: 'toolUse' }),
      (contexto) => {
        // O segundo passo tem que enxergar o toolResult que o ciclo acabou de pôr no histórico
        const ultima = contexto.messages.at(-1);
        if (ultima?.role === 'toolResult') resultadoVisto = ultima.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
        return fauxAssistantMessage(`O resultado é ${resultadoVisto}.`);
      },
    ]);
    const historico: Message[] = iniciarHistorico('prompt', {}, ferramentas);
    historico.push({ role: 'user', content: 'Quanto é 1234 + 5678?', timestamp: Date.now() });

    const deltas: string[] = [];
    const chamadas: ToolCall[] = [];
    const r = await rodarCiclo(historico, {
      models,
      modelo,
      sessionId: 'sessao-teste',
      ferramentas,
      tetoPassos: 5,
      observador: { aoTexto: (d) => deltas.push(d), aoChamar: (c) => chamadas.push(c) },
    });

    expect(executadas).toEqual([{ a: 1234, b: 5678 }]);
    expect(resultadoVisto).toBe('6912');
    expect(r.fim).toBe('resposta');
    expect(r.texto).toBe('O resultado é 6912.');
    expect(r.passos).toBe(2);
    expect(r.uso.chamadas).toBe(2);
    expect(chamadas.map((c) => c.name)).toEqual(['somar']);
    expect(deltas.join('')).toContain('Vou somar.');
    expect(historico.map((m) => m.role)).toEqual(['system', 'user', 'assistant', 'toolResult', 'assistant']);
  });

  test('para no teto de passos quando o modelo não para de chamar ferramenta', async () => {
    const { faux, models, modelo, ferramentas, executadas } = preparar();
    faux.setResponses(
      Array.from({ length: 5 }, () => fauxAssistantMessage([fauxToolCall('somar', { a: 1, b: 1 })], { stopReason: 'toolUse' })),
    );
    const historico = iniciarHistorico('prompt', {}, ferramentas);
    historico.push({ role: 'user', content: 'laço', timestamp: Date.now() });
    const r = await rodarCiclo(historico, { models, modelo, sessionId: 's', ferramentas, tetoPassos: 3 });
    expect(r.fim).toBe('teto');
    expect(r.passos).toBe(3);
    expect(executadas.length).toBe(3);
  });

  test('ferramenta desconhecida e argumento inválido voltam ao modelo como erro', async () => {
    const { faux, models, modelo, ferramentas, executadas } = preparar();
    const erros: string[] = [];
    faux.setResponses([
      fauxAssistantMessage([fauxToolCall('multiplicar', { a: 2, b: 3 }), fauxToolCall('somar', { a: 'x' })], { stopReason: 'toolUse' }),
      fauxAssistantMessage('Desisto.'),
    ]);
    const historico = iniciarHistorico('prompt', {}, ferramentas);
    historico.push({ role: 'user', content: 'erro', timestamp: Date.now() });
    const r = await rodarCiclo(historico, {
      models,
      modelo,
      sessionId: 's',
      ferramentas,
      tetoPassos: 5,
      observador: { aoResultado: (_c, res) => res.erro && erros.push(res.texto) },
    });
    expect(r.fim).toBe('resposta');
    expect(executadas.length).toBe(0);
    expect(erros.length).toBe(2);
    expect(erros[0]).toContain('Ferramenta desconhecida');
    const resultados = historico.filter((m) => m.role === 'toolResult');
    expect(resultados.every((m) => m.role === 'toolResult' && m.isError)).toBe(true);
  });

  test('erro do provedor encerra o ciclo sem sujar o histórico', async () => {
    const { faux, models, modelo, ferramentas } = preparar();
    faux.setResponses([fauxAssistantMessage('', { stopReason: 'error', errorMessage: '400 MissingSessionID' })]);
    const historico = iniciarHistorico('prompt', {}, ferramentas);
    historico.push({ role: 'user', content: 'oi', timestamp: Date.now() });
    const r = await rodarCiclo(historico, { models, modelo, sessionId: 's', ferramentas, tetoPassos: 3 });
    expect(r.fim).toBe('erro');
    expect(r.erro).toContain('MissingSessionID');
    expect(historico.at(-1)?.role).toBe('user');
  });
});
