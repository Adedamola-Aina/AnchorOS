import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeWheelPicker } from './TimeWheelPicker';

describe('TimeWheelPicker', () => {
  it('renders trigger with formatted time', () => {
    render(<TimeWheelPicker value="14:30" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('2:30 PM');
  });

  it('renders placeholder when no value', () => {
    render(<TimeWheelPicker value="" onChange={() => {}} placeholder="Pick time" />);
    expect(screen.getByRole('button')).toHaveTextContent('Pick time');
  });

  it('opens picker on click', () => {
    render(<TimeWheelPicker value="09:00" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('time-wheel-columns')).toBeInTheDocument();
  });

  it('calls onChange with 24h format on Done', () => {
    const onChange = vi.fn();
    render(<TimeWheelPicker value="09:00" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    // Default will be 9:00 AM from parsed value
    fireEvent.click(screen.getByText('Done'));
    expect(onChange).toHaveBeenCalledWith('09:00');
  });

  it('clears value on Clear', () => {
    const onChange = vi.fn();
    render(<TimeWheelPicker value="14:30" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Clear'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has 44px min touch targets on trigger', () => {
    render(<TimeWheelPicker value="" onChange={() => {}} />);
    expect(screen.getByRole('button').className).toContain('min-h-[44px]');
  });

  it('closes on Escape', () => {
    render(<TimeWheelPicker value="09:00" onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays AM times correctly', () => {
    render(<TimeWheelPicker value="00:00" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('12:00 AM');
  });

  it('displays PM noon correctly', () => {
    render(<TimeWheelPicker value="12:00" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('12:00 PM');
  });

  it('supports custom testId', () => {
    render(<TimeWheelPicker value="" onChange={() => {}} testId="reminder-picker" />);
    expect(screen.getByTestId('reminder-picker')).toBeInTheDocument();
  });
});
