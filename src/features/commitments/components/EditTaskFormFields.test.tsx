// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';

describe('EditTaskFormFields', () => {
  describe('DailyFields', () => {
    it('renders time-of-day options', () => {
      render(<DailyFields editTime="morning" setEditTime={vi.fn()} />);
      expect(screen.getByText(/morning/i)).toBeInTheDocument();
      expect(screen.getByText(/afternoon/i)).toBeInTheDocument();
      expect(screen.getByText(/evening/i)).toBeInTheDocument();
    });

    it('calls setEditTime on selection', () => {
      const setEditTime = vi.fn();
      render(<DailyFields editTime="morning" setEditTime={setEditTime} />);
      fireEvent.click(screen.getByText(/evening/i));
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
    it('renders day-of-month buttons', () => {
      render(<MonthlyFields editDaysOfMonth={[1]} setEditDaysOfMonth={vi.fn()} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('31')).toBeInTheDocument();
    });

    it('toggles day-of-month selection', () => {
      const setEditDaysOfMonth = vi.fn();
      render(<MonthlyFields editDaysOfMonth={[1]} setEditDaysOfMonth={setEditDaysOfMonth} />);
      fireEvent.click(screen.getByText('15'));
      expect(setEditDaysOfMonth).toHaveBeenCalled();
    });
  });
});
