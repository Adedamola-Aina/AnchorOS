import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinanceBillsSection } from './FinanceBillsSection';

const { mockUser, mockBills } = vi.hoisted(() => ({
  mockUser: { uid: 'u1' } as { uid: string } | null,
  mockBills: [] as Array<{ id: string; title: string; amountCents: number; nextRunAt: string; status: string; frequency: string }>,
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));
vi.mock('../../../hooks/useRecurringQueries', () => ({
  useRecurringTransactions: () => ({ data: mockBills }),
}));

describe('FinanceBillsSection', () => {
  it('returns null when no bills', () => {
    mockBills.length = 0;
    const { container } = render(<FinanceBillsSection />);
    expect(container.innerHTML).toBe('');
  });

  it('renders UpcomingBillsPanel when bills exist', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    mockBills.length = 0;
    mockBills.push({
      id: 'b1',
      title: 'Netflix',
      amountCents: 1500,
      nextRunAt: tomorrow.toISOString(),
      status: 'active',
      frequency: 'monthly',
    });
    render(<FinanceBillsSection />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Bills')).toBeInTheDocument();
  });
});
