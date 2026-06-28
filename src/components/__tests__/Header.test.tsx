import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../layout/Header';
import { useStrataStore } from '../../store/strata';
import { DEFAULT_MODE } from '../../lib/types';

beforeEach(() => {
  useStrataStore.setState({
    mode: DEFAULT_MODE,
    workspace: null,
    vault: null,
    modelName: null,
  });
});

describe('Header', () => {
  it('renders wordmark "strata" (italic Fraunces)', () => {
    render(<Header />);
    expect(screen.getByText('strata')).toBeInTheDocument();
  });

  it('shows masthead labels: workspace / vault / model', () => {
    render(<Header />);
    expect(screen.getByText('workspace')).toBeInTheDocument();
    expect(screen.getByText('vault')).toBeInTheDocument();
    expect(screen.getByText('model')).toBeInTheDocument();
  });

  it('shows mode badge with current mode', () => {
    render(<Header />);
    expect(screen.getByTestId('mode-badge')).toHaveTextContent('vereda');
  });

  it('clicking mode badge toggles vereda ↔ mestre (no modal in M1.c)', async () => {
    render(<Header />);
    expect(useStrataStore.getState().mode).toBe('vereda');
    await userEvent.click(screen.getByTestId('mode-badge'));
    expect(useStrataStore.getState().mode).toBe('mestre');
    await userEvent.click(screen.getByTestId('mode-badge'));
    expect(useStrataStore.getState().mode).toBe('vereda');
  });

  it('shows workspace name when set', () => {
    useStrataStore.setState({ workspace: { name: 'strata-cli', path: '/tmp' } });
    render(<Header />);
    expect(screen.getByText('strata-cli')).toBeInTheDocument();
  });

  it('shows em-dash placeholder when workspace not set', () => {
    render(<Header />);
    // Three cols, all empty — each shows em-dash
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it('shows model name when set', () => {
    useStrataStore.setState({ modelName: 'llama3.1:8b' });
    render(<Header />);
    expect(screen.getByText('llama3.1:8b')).toBeInTheDocument();
  });
});
