import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UpcomingBillsPanel } from './UpcomingBillsPanel';
import type { RecurringTransaction } from '../../../types';

vi.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  AlertCircle: () => <span data-testid="alert-icon" />,
}));

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockBill: RecurringTransaction = {
  id: 'rt-1',
  title: 'Netflix',
  amountCents: 1599,
  type: 'expense',
  category: 'Subscriptions',
  accountId: 'acc-1',
  frequency: 'monthly',
  interval: 1,
  nextRunAt: tomorrow.toISOString(),
  status: 'active',
  userId: 'user-1',
  createdAt: '2025-01-01',
};

describe('UpcomingBillsPanel', () => {
  it('renders nothing when no bills', () => {
    const { container } = render(<UpcomingBillsPanel bills={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders bill title', () => {
    render(<UpcomingBillsPanel bills={[mockBill]} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('renders due date', () => {
    render(<UpcomingBillsPanel bills={[mockBill]} />);
    expect(screen.getByTestId('bill-due-date')).toBeInTheDocument();
  });

  it('renders section header', () => {
    render(<UpcomingBillsPanel bills={[mockBill]} />);
    expect(screen.getByText('Upcoming Bills')).toBeInTheDocument();
  });

  it('shows amount', () => {
    render(<UpcomingBillsPanel bills={[mockBill]} />);
    expect(screen.getByTestId('bill-amount')).toBeInTheDocument();
  });
});
