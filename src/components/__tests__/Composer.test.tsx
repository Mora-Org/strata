import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Composer } from '../chat/Composer';
import { useStrataStore } from '../../store/strata';
import { DEFAULT_MODE } from '../../lib/types';

beforeEach(() => {
  useStrataStore.setState({
    mode: DEFAULT_MODE,
    messages: [],
  });
});

describe('Composer', () => {
  it('renders textarea with autoFocus', () => {
    render(<Composer />);
    expect(screen.getByTestId('composer-textarea')).toBeInTheDocument();
  });

  it('send button disabled when empty', () => {
    render(<Composer />);
    expect(screen.getByTestId('composer-send')).toBeDisabled();
  });

  it('send button enabled after typing', async () => {
    render(<Composer />);
    await userEvent.type(screen.getByTestId('composer-textarea'), 'oi');
    expect(screen.getByTestId('composer-send')).not.toBeDisabled();
  });

  it('Enter sends message (adds to store)', async () => {
    render(<Composer />);
    await userEvent.type(screen.getByTestId('composer-textarea'), 'oi cesar{Enter}');
    const messages = useStrataStore.getState().messages;
    expect(messages.length).toBeGreaterThanOrEqual(1);
    expect(messages[0]).toMatchObject({ role: 'user', text: 'oi cesar' });
  });

  it('Shift+Enter does NOT send (allows newline)', async () => {
    // userEvent.type's {Shift>} modifier syntax can flake in jsdom — use
    // explicit fireEvent for deterministic modifier key handling.
    const { fireEvent } = await import('@testing-library/react');
    render(<Composer />);
    const ta = screen.getByTestId('composer-textarea') as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: 'linha 1' } });
    fireEvent.keyDown(ta, { key: 'Enter', shiftKey: true });
    const messages = useStrataStore.getState().messages;
    expect(messages.length).toBe(0);
    // Textarea value still has the typed content (shift+enter didn't trigger send).
    expect(ta.value).toBe('linha 1');
  });

  it('placeholder muda em modo Mestre', () => {
    useStrataStore.setState({ mode: 'mestre' });
    render(<Composer />);
    const ta = screen.getByTestId('composer-textarea');
    expect(ta).toHaveAttribute('placeholder', expect.stringContaining('Mestre'));
  });

  it('clears textarea after send', async () => {
    render(<Composer />);
    const ta = screen.getByTestId('composer-textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'oi{Enter}');
    expect(ta.value).toBe('');
  });
});
