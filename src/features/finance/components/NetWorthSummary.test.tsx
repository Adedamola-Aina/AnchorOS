import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('../../../utils/format', () => ({
  formatCurrencyCompact: vi.fn((val: number, cur: string) => `${cur === 'NGN' ? '₦' : '$'}${(val / 100).toLocaleString()}`),
}));

import { NetWorthSummary } from './NetWorthSummary';

describe('NetWorthSummary', () => {
  it('renders both NGN and USD net worth', () => {
    render(<NetWorthSummary netWorth={{ NGN: 500000, USD: 10000 }} />);
    expect(screen.getByText(/net worth \(ngn\)/i)).toBeInTheDocument();
    expect(screen.getByText(/net worth \(usd\)/i)).toBeInTheDocument();
  });

  it('formats currency values', () => {
    render(<NetWorthSummary netWorth={{ NGN: 100000, USD: 5000 }} />);
    expect(screen.getByText(/₦/)).toBeInTheDocument();
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });
});
