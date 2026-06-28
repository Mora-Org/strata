import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../layout/Sidebar';
import { useStrataStore } from '../../store/strata';

beforeEach(() => {
  useStrataStore.setState({
    workspace: null,
    vault: null,
    ollamaStatus: 'unknown',
    modelName: null,
  });
});

describe('Sidebar', () => {
  it('renders the 3 section labels', () => {
    render(<Sidebar />);
    expect(screen.getByText('workspace')).toBeInTheDocument();
    expect(screen.getByText('conversações')).toBeInTheDocument();
    expect(screen.getByText('vault')).toBeInTheDocument();
  });

  it('shows workspace placeholder when not set', () => {
    render(<Sidebar />);
    // appears in workspace section
    expect(screen.getAllByText('— não definido —').length).toBeGreaterThanOrEqual(1);
  });

  it('shows workspace name + path when set', () => {
    useStrataStore.setState({
      workspace: { name: 'strata-cli', path: '/c/code/strata-cli' },
    });
    render(<Sidebar />);
    expect(screen.getByText('strata-cli')).toBeInTheDocument();
    expect(screen.getByText('/c/code/strata-cli')).toBeInTheDocument();
  });

  it('shows empty conversations placeholder', () => {
    render(<Sidebar />);
    expect(screen.getByText('— nenhuma conversa ainda —')).toBeInTheDocument();
  });

  it('shows vault path when configured', () => {
    useStrataStore.setState({ vault: { path: '~/notes/strata', inboxFolder: 'inbox' } });
    render(<Sidebar />);
    expect(screen.getByText('~/notes/strata')).toBeInTheDocument();
  });

  it('shows ollama status row with model name when set', () => {
    useStrataStore.setState({
      ollamaStatus: 'reachable',
      modelName: 'llama3.1:8b',
    });
    render(<Sidebar />);
    expect(screen.getByText('ollama · llama3.1:8b')).toBeInTheDocument();
  });

  it('foot has "nova" button and settings (gear) button', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar-new-chat')).toHaveTextContent('+ nova');
    expect(screen.getByTestId('sidebar-settings')).toBeInTheDocument();
  });
});
