import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthCalendarView } from './MonthCalendarView';
import type { AnchorTask } from '../../../types';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left" />,
  ChevronRight: () => <span data-testid="chevron-right" />,
  Circle: () => <span data-testid="circle" />,
  CheckCircle2: () => <span data-testid="check-circle" />,
}));

const baseTask: AnchorTask = {
  id: '1',
  title: 'Morning Gym',
  type: 'daily',
  completed: false,
  category: 'personal',
  createdAt: new Date(),
};

describe('MonthCalendarView', () => {
  it('renders current month name', () => {
    render(<MonthCalendarView tasks={[baseTask]} onToggle={vi.fn()} />);
    const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(screen.getByText(monthName)).toBeInTheDocument();
  });

  it('renders day-of-week headers', () => {
    render(<MonthCalendarView tasks={[]} onToggle={vi.fn()} />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('highlights today', () => {
    render(<MonthCalendarView tasks={[]} onToggle={vi.fn()} />);
    const today = new Date().getDate().toString();
    const todayEl = screen.getByTestId('calendar-today');
    expect(todayEl).toBeInTheDocument();
  });

  it('navigates to next month', () => {
    render(<MonthCalendarView tasks={[]} onToggle={vi.fn()} />);
    const nextBtn = screen.getByTestId('calendar-next');
    fireEvent.click(nextBtn);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const expected = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('navigates to previous month', () => {
    render(<MonthCalendarView tasks={[]} onToggle={vi.fn()} />);
    const prevBtn = screen.getByTestId('calendar-prev');
    fireEvent.click(prevBtn);
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const expected = prevMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('shows daily tasks on every day', () => {
    render(<MonthCalendarView tasks={[baseTask]} onToggle={vi.fn()} />);
    const dots = screen.getAllByTestId('task-dot');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('shows weekly tasks only on matching days', () => {
    const weeklyTask: AnchorTask = {
      ...baseTask,
      id: '2',
      type: 'weekly',
      daysOfWeek: ['Monday'],
    };
    render(<MonthCalendarView tasks={[weeklyTask]} onToggle={vi.fn()} />);
    const dots = screen.getAllByTestId('task-dot');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('shows selected day detail panel', () => {
    render(<MonthCalendarView tasks={[baseTask]} onToggle={vi.fn()} />);
    const todayEl = screen.getByTestId('calendar-today');
    fireEvent.click(todayEl);
    expect(screen.getByText('Morning Gym')).toBeInTheDocument();
  });
});
