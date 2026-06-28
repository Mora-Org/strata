import { useState, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useStrataStore } from '../../store/strata';

/**
 * Composer inline na parte de baixo do main. Não flutua. Tem textarea
 * auto-grow (mín 64px, máx 240px) e botão send `[↵]` à direita.
 *
 * Em M1.c, send só adiciona uma user-message no store + uma strata-message
 * mock (sem hit em Pi/Ollama real). M1.d wireia chamada real.
 */
export function Composer() {
  const [text, setText] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, mode } = useStrataStore();

  const placeholder =
    mode === 'vereda'
      ? 'Pergunte sobre seu código. Uma nota será proposta — nada é escrito sem seu OK.'
      : 'Em Mestre: o agente vai propor mudanças. Cada destrutivo pede confirmação extra.';

  const send = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage({ id: `u${Date.now()}`, role: 'user', text: trimmed });
    // M1.c mock: echo back a placeholder strata message. Real Pi/Ollama
    // integration comes in M1.d.
    setTimeout(() => {
      addMessage({
        id: `s${Date.now()}`,
        role: 'strata',
        text: '(M1.c shell — chat real chega em M1.d, com Ollama wired)',
      });
    }, 160);
    setText('');
    taRef.current?.focus();
  }, [text, addMessage]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const disabled = text.trim().length === 0;

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-stretch gap-2 bg-surface border border-border-1 rounded-1 p-2">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-fg-1 text-sm resize-none outline-none placeholder:text-fg-3 min-h-[40px] max-h-[200px]"
          data-testid="composer-textarea"
          autoFocus
        />
        <button
          type="button"
          onClick={send}
          disabled={disabled}
          aria-label="Enviar"
          className={`self-end h-8 w-8 flex items-center justify-center rounded-1 font-mono text-sm transition-opacity ${
            disabled
              ? 'text-fg-4 opacity-40 cursor-not-allowed'
              : 'text-accent-fg bg-accent hover:opacity-90'
          }`}
          data-testid="composer-send"
        >
          ↵
        </button>
      </div>
    </div>
  );
}
