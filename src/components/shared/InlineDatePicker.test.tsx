import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineDatePicker } from './InlineDatePicker';

describe('InlineDatePicker', () => {
  it('renders trigger with formatted date', () => {
    render(<InlineDatePicker value="2026-04-05" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Apr 5, 2026');
  });

  it('renders placeholder when no value', () => {
    render(<InlineDatePicker value="" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Select date');
  });

  it('opens calendar on click', () => {
    render(<InlineDatePicker value="2026-04-05" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('date-grid')).toBeInTheDocument();
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('calls onChange with date string on day select', () => {
    const onChange = vi.fn();
    render(<InlineDatePicker value="2026-04-05" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('15'));
    expect(onChange).toHaveBeenCalledWith('2026-04-15');
  });

  it('navigates to previous month', () => {
    render(<InlineDatePicker value="2026-04-05" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('March 2026')).toBeInTheDocument();
  });

  it('navigates to next month', () => {
    render(<InlineDatePicker value="2026-04-05" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('May 2026')).toBeInTheDocument();
  });

  it('has 44px min touch targets', () => {
    render(<InlineDatePicker value="" onChange={() => {}} />);
    expect(screen.getByRole('button').className).toContain('min-h-[44px]');
  });

  it('closes on Escape', () => {
    render(<InlineDatePicker value="2026-04-05" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(<InlineDatePicker value="2026-04-05" onChange={() => {}} disabled />);
    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
  });

  it('selects today on Today button', () => {
    const onChange = vi.fn();
    render(<InlineDatePicker value="2026-04-05" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Today'));
    expect(onChange).toHaveBeenCalled();
  });

  it('supports custom testId', () => {
    render(<InlineDatePicker value="" onChange={() => {}} testId="tx-date" />);
    expect(screen.getByTestId('tx-date')).toBeInTheDocument();
  });
});
