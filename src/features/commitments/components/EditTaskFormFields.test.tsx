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
      render(<WeeklyFields editDays={['Mon']} setEditDays={vi.fn()} />);
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('toggles day selection', () => {
      const setEditDays = vi.fn();
      render(<WeeklyFields editDays={['Mon']} setEditDays={setEditDays} />);
      fireEvent.click(screen.getByText('Wed'));
      expect(setEditDays).toHaveBeenCalled();
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
