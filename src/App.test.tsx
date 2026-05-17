import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App (M1.a smoke)', () => {
  it('renders heading "Strata"', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Strata');
  });

  it('shows M1.a iteration marker', () => {
    render(<App />);
    expect(screen.getByText(/M1\.a/)).toBeInTheDocument();
  });

  it('mounts inside <main> landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
