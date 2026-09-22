// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RecurringOptions } from './RecurringOptions';

describe('RecurringOptions', () => {
  const defaultProps = {
    isRecurring: false,
    onChange: vi.fn(),
    frequency: 'monthly' as const,
    onFrequencyChange: vi.fn(),
    interval: 1,
    onIntervalChange: vi.fn(),
  };

  it('renders toggle for recurring', () => {
    const { container } = render(<RecurringOptions {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('hides frequency options when not recurring', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={false} />);
    expect(screen.queryByText(/weekly/i)).not.toBeInTheDocument();
  });

  it('shows frequency select when recurring', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} />);
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
  });

  it('shows interval input when recurring', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1);
  });

  it('calls onChange when the switch is toggled', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={false} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(true);
  });

  it('calls onFrequencyChange when frequency selected', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} />);
    // SegmentedControl renders radio buttons — click "Weekly" to change frequency
    const weeklyBtn = screen.getByRole('radio', { name: /weekly/i });
    fireEvent.click(weeklyBtn);
    expect(defaultProps.onFrequencyChange).toHaveBeenCalledWith('weekly');
  });

  it('calls onIntervalChange when interval typed', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
    expect(defaultProps.onIntervalChange).toHaveBeenCalledWith(3);
  });

  it('shows correct frequency label', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} frequency="weekly" />);
    expect(screen.getByText('week')).toBeInTheDocument();
  });

  /**
   * UX-FN-21: the toggle is a real switch, so its state is announced and it can
   * be operated from the keyboard — the old hand-rolled div could do neither.
   */
  it('exposes the recurring state as a switch', () => {
    const { rerender } = render(<RecurringOptions {...defaultProps} isRecurring={false} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<RecurringOptions {...defaultProps} isRecurring={true} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
