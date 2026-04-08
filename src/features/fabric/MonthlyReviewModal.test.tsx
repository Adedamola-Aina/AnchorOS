import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthlyReviewModal } from './MonthlyReviewModal';
import type { MonthlyReview } from '../../services/fabric/MonthlyReviewEngine';

const mockReview: MonthlyReview = {
  month: '2026-02',
  financeSummary: {
    totalIncomeCents: 500000,
    totalExpenseCents: 300000,
    savingsRatePercent: 40,
    topCategories: [{ name: 'Food', amountCents: 200000 }],
  },
  commitmentSummary: { completed: 2, total: 3, completionRatePercent: 66.7 },
  generatedAt: '2026-03-05T12:00:00Z',
};

describe('MonthlyReviewModal', () => {
  it('renders monthly review summary', () => {
    render(<MonthlyReviewModal review={mockReview} onSave={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Monthly Review — 2026-02/)).toBeInTheDocument();
    expect(screen.getByText(/Savings rate: 40%/)).toBeInTheDocument();
  });

  it('save button disabled until at least one answer', () => {
    render(<MonthlyReviewModal review={mockReview} onSave={vi.fn()} onDismiss={vi.fn()} />);
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeDisabled();
  });

  it('calls onSave with answers', () => {
    const onSave = vi.fn();
    render(<MonthlyReviewModal review={mockReview} onSave={onSave} onDismiss={vi.fn()} />);
    const textareas = screen.getAllByRole('textbox');
    fireEvent.change(textareas[0], { target: { value: 'Spent less on dining' } });
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).not.toBeDisabled();
    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ 'What went well financially this month?': 'Spent less on dining' }),
    );
  });

  it('calls onDismiss when skip clicked', () => {
    const onDismiss = vi.fn();
    render(<MonthlyReviewModal review={mockReview} onSave={vi.fn()} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
