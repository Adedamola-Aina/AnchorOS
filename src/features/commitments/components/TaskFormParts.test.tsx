
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DailyTimeField, MonthlyDatesField, reminderOutsidePreferredWindow } from './TaskFormParts';

/**
 * "Preferred time" and "Reminder" were reported as competing: one said Afternoon
 * while the other said 9:00 AM, with nothing saying how they relate. A reminder
 * outside the preferred block is not wrong — you can want a morning nudge about
 * an afternoon commitment — but it should be *stated*.
 */
describe('reminderOutsidePreferredWindow', () => {
  it('flags a reminder outside the preferred block', () => {
    expect(reminderOutsidePreferredWindow('afternoon', '09:00')).toBe(true);
    expect(reminderOutsidePreferredWindow('morning', '20:00')).toBe(true);
    expect(reminderOutsidePreferredWindow('evening', '08:00')).toBe(true);
  });

  it('accepts a reminder inside the preferred block', () => {
    expect(reminderOutsidePreferredWindow('morning', '07:00')).toBe(false);
    expect(reminderOutsidePreferredWindow('afternoon', '14:30')).toBe(false);
    expect(reminderOutsidePreferredWindow('evening', '21:00')).toBe(false);
  });

  it('never flags "any" — there is no block to fall outside of', () => {
    expect(reminderOutsidePreferredWindow('any', '09:00')).toBe(false);
  });

  it('ignores an empty or unparseable time rather than guessing', () => {
    expect(reminderOutsidePreferredWindow('afternoon', '')).toBe(false);
    expect(reminderOutsidePreferredWindow('afternoon', 'not-a-time')).toBe(false);
  });
});

describe('DailyTimeField', () => {
  it('says what the preferred time is for, so it cannot be read as a notification', () => {
    render(<DailyTimeField value="afternoon" onChange={vi.fn()} />);
    expect(screen.getByText(/orders your list — it does not notify you/i)).toBeInTheDocument();
  });

  it('is a pull-down showing the current value', () => {
    render(<DailyTimeField value="afternoon" onChange={vi.fn()} />);
    expect(screen.getByTestId('time-of-day-select')).toHaveTextContent('Afternoon');
  });
});

/**
 * A month picker was a 7x5 grid of 31 buttons rendered inside the form — a full
 * calendar in a composer. It is a row that opens a half sheet now.
 */
describe('MonthlyDatesField', () => {
  it('shows a row that states the selection, not 31 buttons', () => {
    render(<MonthlyDatesField value={[1, 15]} onChange={vi.fn()} />);

    expect(screen.getByTestId('month-days-row')).toHaveTextContent('1, 15');
    expect(screen.queryByTestId('month-days-sheet')).not.toBeInTheDocument();
  });

  it('summarises a long selection instead of listing every date', () => {
    render(<MonthlyDatesField value={[1, 5, 9, 20]} onChange={vi.fn()} />);
    expect(screen.getByTestId('month-days-row')).toHaveTextContent('4 dates');
  });

  it('opens the days in a half sheet', () => {
    render(<MonthlyDatesField value={[]} onChange={vi.fn()} />);
    expect(screen.getByTestId('month-days-row')).toHaveTextContent('Not set');

    fireEvent.click(screen.getByTestId('month-days-row'));
    expect(screen.getByTestId('month-days-sheet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Day 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Day 31' })).toBeInTheDocument();
  });

  it('toggles a day through the sheet', () => {
    const onChange = vi.fn();
    render(<MonthlyDatesField value={[1]} onChange={onChange} />);

    fireEvent.click(screen.getByTestId('month-days-row'));
    fireEvent.click(screen.getByRole('button', { name: 'Day 9' }));
    expect(onChange).toHaveBeenCalledWith([1, 9]);
  });
});