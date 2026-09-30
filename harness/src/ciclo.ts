import {
  validateToolArguments,
  type Api,
  type AssistantMessage,
  type Message,
  type Model,
  type Models,
  type SystemMessage,
  type Tool,
  type ToolCall,
} from '@earendil-works/pi-ai';

export interface ResultadoFerramenta {
  texto: string;
  erro: boolean;
}

export interface Ferramenta {
  definicao: Tool;
  executar(args: Record<string, unknown>): Promise<ResultadoFerramenta>;
}

export interface Observador {
  aoTexto?(delta: string): void;
  aoPensar?(): void;
  aoChamar?(chamada: ToolCall): void;
  aoResultado?(chamada: ToolCall, resultado: ResultadoFerramenta): void;
}

export interface Uso {
  entrada: number;
  // Tokens de entrada servidos do cache do provedor; o pi-ai conta à parte de "input"
  cache: number;
  saida: number;
  custo: number;
  chamadas: number;
}

export interface OpcoesCiclo {
  models: Models;
  modelo: Model<Api>;
  // Um por conversa. Sem ele o OpenCode Go devolve 400 MissingSessionID
  sessionId: string;
  ferramentas: Ferramenta[];
  tetoPassos: number;
  observador?: Observador;
}

export interface ResultadoCiclo {
  texto: string;
  fim: 'resposta' | 'teto' | 'erro';
  erro?: string;
  passos: number;
  uso: Uso;
}

// O prompt e as ferramentas moram na mensagem de sistema do próprio histórico,
// assim ligar e desligar o conhecimento vira uma mensagem de sistema nova, sem reescrever o passado.
export function iniciarHistorico(prompt: string, secoes: Record<string, string>, ferramentas: Ferramenta[]): Message[] {
  const sistema: SystemMessage = {
    role: 'system',
    content: prompt,
    sections: secoes,
    toolsAdded: ferramentas.map((f) => f.definicao),
    timestamp: Date.now(),
  };
  return [sistema];
}

export function usoVazio(): Uso {
  return { entrada: 0, cache: 0, saida: 0, custo: 0, chamadas: 0 };
}

export function somarEm(total: Uso, parte: Uso): void {
  total.entrada += parte.entrada;
  total.cache += parte.cache;
  total.saida += parte.saida;
  total.custo += parte.custo;
  total.chamadas += parte.chamadas;
}

export async function rodarCiclo(historico: Message[], opcoes: OpcoesCiclo): Promise<ResultadoCiclo> {
  const { models, modelo, sessionId, ferramentas, tetoPassos, observador: obs } = opcoes;
  if (tetoPassos < 1) throw new Error(`teto de passos tem que ser >= 1, veio ${tetoPassos}`);
  const uso = usoVazio();

  for (let passo = 1; passo <= tetoPassos; passo++) {
    const fluxo = models.stream(modelo, { messages: historico }, { sessionId });
    for await (const ev of fluxo) {
      if (ev.type === 'text_delta') obs?.aoTexto?.(ev.delta);
      else if (ev.type === 'thinking_start') obs?.aoPensar?.();
    }
    const msg = await fluxo.result();
    somarUso(uso, msg);

    // Mensagem com erro não entra no histórico: reenviá-la na próxima pergunta só confundiria o modelo
    if (msg.stopReason === 'error' || msg.stopReason === 'aborted') {
      return { texto: textoDe(msg), fim: 'erro', erro: msg.errorMessage ?? msg.stopReason, passos: passo, uso };
    }
    historico.push(msg);

    const chamadas = msg.content.filter((b): b is ToolCall => b.type === 'toolCall');
    if (chamadas.length === 0) return { texto: textoDe(msg), fim: 'resposta', passos: passo, uso };

    for (const chamada of chamadas) {
      obs?.aoChamar?.(chamada);
      const resultado = await executarChamada(ferramentas, chamada);
      obs?.aoResultado?.(chamada, resultado);
      historico.push({
        role: 'toolResult',
        toolCallId: chamada.id,
        toolName: chamada.name,
        content: [{ type: 'text', text: resultado.texto }],
        isError: resultado.erro,
        timestamp: Date.now(),
      });
    }
  }
  return { texto: '', fim: 'teto', passos: tetoPassos, uso };
}

async function executarChamada(ferramentas: Ferramenta[], chamada: ToolCall): Promise<ResultadoFerramenta> {
  const ferramenta = ferramentas.find((f) => f.definicao.name === chamada.name);
  if (!ferramenta) {
    const nomes = ferramentas.map((f) => f.definicao.name).join(', ');
    return { texto: `Ferramenta desconhecida: ${chamada.name}. Existem: ${nomes}.`, erro: true };
  }
  // Falha de ferramenta (rede, argumento errado, fonte que não existe) volta pro modelo como erro
  // visível no terminal: ele pode corrigir o argumento ou mudar de caminho. Nada é engolido.
  try {
    const args = validateToolArguments(ferramenta.definicao, chamada) as Record<string, unknown>;
    return await ferramenta.executar(args);
  } catch (e) {
    return { texto: e instanceof Error ? e.message : String(e), erro: true };
  }
}

function somarUso(uso: Uso, msg: AssistantMessage): void {
  uso.entrada += msg.usage.input;
  uso.cache += msg.usage.cacheRead;
  uso.saida += msg.usage.output;
  uso.custo += msg.usage.cost.total;
  uso.chamadas += 1;
}

function textoDe(msg: AssistantMessage): string {
  return msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}
