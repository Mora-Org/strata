import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useStrataStore } from './store/strata';
import { DEFAULT_MODE } from './lib/types';

// Zustand store is module-level — reset between tests to avoid bleed-through.
beforeEach(() => {
  useStrataStore.setState({
    mode: DEFAULT_MODE,
    workspace: null,
    vault: null,
    ollamaStatus: 'unknown',
    modelName: null,
    messages: [],
    activeConversationId: null,
  });
});

describe('App (M1.c shell)', () => {
  it('renders AppShell with header + main', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('header shows italic Fraunces wordmark "strata"', () => {
    render(<App />);
    expect(screen.getByText('strata')).toBeInTheDocument();
  });

  it('header shows mode badge with default "vereda"', () => {
    render(<App />);
    expect(screen.getByTestId('mode-badge')).toHaveTextContent('vereda');
  });

  it('sidebar shows the 3 sections (workspace / conversações / vault)', () => {
    render(<App />);
    // "workspace" and "vault" appear in BOTH header masthead AND sidebar
    // section labels (same literal text). Use getAllByText to acknowledge
    // duplication — Sidebar.test.tsx tests sidebar-scope; Header.test.tsx
    // tests header-scope. This test only verifies App.tsx mounts the shell.
    expect(screen.getAllByText('workspace').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('conversações')).toBeInTheDocument(); // sidebar-only label
    expect(screen.getAllByText('vault').length).toBeGreaterThanOrEqual(1);
  });

  it('composer textarea is present with autoFocus and placeholder', () => {
    render(<App />);
    const ta = screen.getByTestId('composer-textarea');
    expect(ta).toBeInTheDocument();
    expect(ta).toHaveAttribute('placeholder', expect.stringContaining('Pergunte'));
  });

  it('renders empty placeholder when there are no messages', () => {
    render(<App />);
    expect(screen.getByText(/Cada sessão é uma camada/)).toBeInTheDocument();
    expect(screen.getByText(/manifesto §III/)).toBeInTheDocument();
  });

  it('footer hints show send / newline / mode marker', () => {
    render(<App />);
    expect(screen.getByText('send')).toBeInTheDocument();
    expect(screen.getByText('newline')).toBeInTheDocument();
    expect(screen.getByText(/explica, não edita/)).toBeInTheDocument();
  });
});
