// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';

describe('EditTaskFormFields', () => {
  describe('DailyFields', () => {
    /**
     * The composer uses a pull-down for this field; the editor used to render four
     * buttons for the same choice. Two controls for one field was the drift.
     */
    it('offers the time of day as a pull-down', () => {
      render(<DailyFields editTime="morning" setEditTime={vi.fn()} />);
      expect(screen.getByTestId('edit-time-of-day-select')).toHaveTextContent('Morning');
    });

    it('calls setEditTime on selection', () => {
      const setEditTime = vi.fn();
      render(<DailyFields editTime="morning" setEditTime={setEditTime} />);
      fireEvent.click(screen.getByTestId('edit-time-of-day-select'));
      fireEvent.click(screen.getByRole('option', { name: 'Evening' }));
      expect(setEditTime).toHaveBeenCalledWith('evening');
    });
  });

  describe('WeeklyFields', () => {
    it('renders all 7 days', () => {
      // CM-18: two-letter labels — a single letter cannot distinguish Tue/Thu or
      // Sat/Sun, which is how the collision reached the UI.
      render(<WeeklyFields editDays={[1]} setEditDays={vi.fn()} />);
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('toggles day selection by weekday index', () => {
      const setEditDays = vi.fn();
      render(<WeeklyFields editDays={[1]} setEditDays={setEditDays} />);
      fireEvent.click(screen.getByText('We'));
      expect(setEditDays).toHaveBeenCalled();
      // Wednesday is index 3, and the existing Monday (1) is kept.
      const updater = setEditDays.mock.calls[0]?.[0] as (prev: number[]) => number[];
      expect(updater([1])).toEqual([1, 3]);
    });
  });

  describe('MonthlyFields', () => {
    /**
     * The composer opens a half sheet for this; the editor used to render its own
     * inline 7x5 grid of 31 buttons — a second full calendar in a form.
     */
    it('opens the day-of-month picker in a half sheet', () => {
      render(<MonthlyFields editDaysOfMonth={[1]} setEditDaysOfMonth={vi.fn()} />);

      expect(screen.getByTestId('month-days-row')).toHaveTextContent('1');
      expect(screen.queryByTestId('month-days-sheet')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('month-days-row'));
      expect(screen.getByTestId('month-days-sheet')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Day 31' })).toBeInTheDocument();
    });

    it('toggles day-of-month selection', () => {
      const setEditDaysOfMonth = vi.fn();
      render(<MonthlyFields editDaysOfMonth={[1]} setEditDaysOfMonth={setEditDaysOfMonth} />);

      fireEvent.click(screen.getByTestId('month-days-row'));
      fireEvent.click(screen.getByRole('button', { name: 'Day 15' }));
      expect(setEditDaysOfMonth).toHaveBeenCalled();
    });
  });
});
