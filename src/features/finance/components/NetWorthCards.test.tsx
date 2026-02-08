import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { NetWorthCards } from './NetWorthCards';

vi.mock('../../../utils/format', () => ({
  formatCurrencyCompact: (a: number, c: string) => `${c}${a}`,
}));

describe('NetWorthCards', () => {
  it('returns null when both currencies are 0', () => {
    const { container } = render(<NetWorthCards netWorth={{ NGN: 0, USD: 0 }} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows NGN card', () => {
    render(<NetWorthCards netWorth={{ NGN: 500000, USD: 0 }} />);
    expect(screen.getByText('Net Worth (NGN)')).toBeInTheDocument();
    expect(screen.getByText('NGN500000')).toBeInTheDocument();
  });

  it('shows USD card', () => {
    render(<NetWorthCards netWorth={{ NGN: 0, USD: 12000 }} />);
    expect(screen.getByText('Net Worth (USD)')).toBeInTheDocument();
  });

  it('shows both cards', () => {
    render(<NetWorthCards netWorth={{ NGN: 100, USD: 200 }} />);
    expect(screen.getByText('Net Worth (NGN)')).toBeInTheDocument();
    expect(screen.getByText('Net Worth (USD)')).toBeInTheDocument();
  });
});
