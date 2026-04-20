import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeWheelPicker } from './TimeWheelPicker';

describe('TimeWheelPicker — wheel interactions', () => {
  it('updates the displayed time when hour/minute/period are selected', () => {
    const onChange = vi.fn();
    render(<TimeWheelPicker value="09:00" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /9:00 AM/i }));
    // Select hour 11
    fireEvent.click(screen.getByRole('button', { name: '11' }));
    // Select minute 45
    fireEvent.click(screen.getByRole('button', { name: '45' }));
    // Switch to PM
    fireEvent.click(screen.getByRole('button', { name: 'PM' }));

    fireEvent.click(screen.getByText('Done'));
    expect(onChange).toHaveBeenCalledWith('23:45');
  });

  it('sets midnight (00:00) when hour=12 and period=AM', () => {
    const onChange = vi.fn();
    render(<TimeWheelPicker value="09:00" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /9:00 AM/i }));
    fireEvent.click(screen.getByRole('button', { name: '12' }));
    fireEvent.click(screen.getByText('Done'));
    expect(onChange).toHaveBeenCalledWith('00:00');
  });
});
