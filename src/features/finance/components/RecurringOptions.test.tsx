import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
