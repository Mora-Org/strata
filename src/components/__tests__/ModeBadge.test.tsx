import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModeBadge } from '../ui/ModeBadge';

describe('ModeBadge', () => {
  it('renders vereda lowercase', () => {
    render(<ModeBadge mode="vereda" />);
    expect(screen.getByTestId('mode-badge')).toHaveTextContent('vereda');
  });

  it('renders mestre lowercase', () => {
    render(<ModeBadge mode="mestre" />);
    expect(screen.getByTestId('mode-badge')).toHaveTextContent('mestre');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<ModeBadge mode="vereda" onClick={onClick} />);
    await userEvent.click(screen.getByTestId('mode-badge'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has accessible title attribute hinting mode swap', () => {
    render(<ModeBadge mode="vereda" />);
    expect(screen.getByTestId('mode-badge')).toHaveAttribute(
      'title',
      expect.stringContaining('trocar'),
    );
  });
});
