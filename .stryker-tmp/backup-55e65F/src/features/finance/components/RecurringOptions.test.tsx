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

  it('calls onChange when toggle clicked', () => {
    const { container } = render(<RecurringOptions {...defaultProps} isRecurring={false} />);
    const toggle = container.querySelector('[class*="cursor-pointer"]');
    if (toggle) fireEvent.click(toggle);
    expect(defaultProps.onChange).toHaveBeenCalledWith(true);
  });

  it('calls onFrequencyChange when frequency selected', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} />);
    fireEvent.change(screen.getByDisplayValue('Monthly'), { target: { value: 'weekly' } });
    expect(defaultProps.onFrequencyChange).toHaveBeenCalledWith('weekly');
  });

  it('calls onIntervalChange when interval typed', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
    expect(defaultProps.onIntervalChange).toHaveBeenCalledWith(3);
  });

  it('shows correct frequency label', () => {
    render(<RecurringOptions {...defaultProps} isRecurring={true} frequency="weekly" />);
    expect(screen.getByText(/week\(s\)/)).toBeInTheDocument();
  });
});
