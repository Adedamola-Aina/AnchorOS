import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { OverdraftWarning } from './OverdraftWarning';

vi.mock('../../../utils/moneyUtils', () => ({
  fromCents: (c: number) => c / 100,
}));

describe('OverdraftWarning', () => {
  it('renders overdraft warning text', () => {
    render(<OverdraftWarning projectedBalance={-5000} amountCents={10000} />);
    expect(screen.getByText(/warning: overdraft risk/i)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('shows projected negative balance', () => {
    render(<OverdraftWarning projectedBalance={-15000} amountCents={20000} />);
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });
});
