import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WeeklyView } from './WeeklyView';

describe('WeeklyView', () => {
  const onToggle = vi.fn();

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
});
