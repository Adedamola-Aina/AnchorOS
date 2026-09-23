
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WeeklyView } from './WeeklyView';

describe('WeeklyView', () => {
  const onToggle = vi.fn();
  // The shared spy carries calls between tests; clear it so "did nothing" is real.
  beforeEach(() => onToggle.mockClear());

  it('renders 7 day columns', () => {
    const { container } = render(<WeeklyView tasks={[]} onToggle={onToggle} />);
    // 7 day columns in the grid
    const dayHeaders = container.querySelectorAll('.grid > div');
    expect(dayHeaders.length).toBe(7);
  });

  it('shows daily tasks in each day', () => {
    const tasks = [{ id: 't1', title: 'Exercise', type: 'daily', completed: false }] as any[];
    render(<WeeklyView tasks={tasks} onToggle={onToggle} />);
    // Daily tasks show in all 7 days
    expect(screen.getAllByText('Exercise').length).toBe(7);
  });

  it('allows toggling today tasks', () => {
    const tasks = [{ id: 't1', title: 'Read', type: 'daily', completed: false }] as any[];
    render(<WeeklyView tasks={tasks} onToggle={onToggle} />);
    // Today's column has a clickable button (first column)
    const toggleBtns = screen.getAllByRole('button');
    fireEvent.click(toggleBtns[0]);
    expect(onToggle).toHaveBeenCalledWith('t1', false);
  });

  /**
   * The grid used to be inert: only today's column had a control and every other
   * day rendered a decorative grey dot, so a completed commitment produced no
   * visible feedback anywhere in this view.
   */
  it('makes every day a control, not just today', () => {
    const tasks = [{ id: 't1', title: 'Exercise', type: 'daily', completed: false }] as any[];
    render(<WeeklyView tasks={tasks} onToggle={onToggle} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
    expect(screen.getAllByRole('button', { name: 'Mark Exercise as done' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Open Exercise' })).toHaveLength(6);
  });

  it('opens the commitment from a future day instead of completing it early', () => {
    const onOpen = vi.fn();
    const tasks = [{ id: 't1', title: 'Exercise', type: 'daily', completed: false }] as any[];
    render(<WeeklyView tasks={tasks} onToggle={onToggle} onOpen={onOpen} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Open Exercise' })[0]);

    expect(onOpen).toHaveBeenCalledWith('t1');
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('acknowledges a completed commitment with a struck title and a pressed control', () => {
    const tasks = [{ id: 't1', title: 'Exercise', type: 'daily', completed: true }] as any[];
    render(<WeeklyView tasks={tasks} onToggle={onToggle} />);

    const doneControl = screen.getByRole('button', { name: 'Mark Exercise as not done' });
    expect(doneControl).toHaveAttribute('aria-pressed', 'true');

    const struck = screen.getAllByText('Exercise').filter((el) => el.className.includes('line-through'));
    expect(struck).toHaveLength(1);
    expect(screen.getByTestId('week-today-progress')).toHaveTextContent('1/1 done');
  });

  it('marks only today as done — the other columns are the next occurrence', () => {
    const tasks = [{ id: 't1', title: 'Exercise', type: 'daily', completed: true }] as any[];
    render(<WeeklyView tasks={tasks} onToggle={onToggle} />);

    // Six future columns still show a pending occurrence, so exactly one control
    // may claim to be pressed.
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Open Exercise' })).toHaveLength(6);
  });
});
