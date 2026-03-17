/// <reference types="@testing-library/jest-dom/vitest" />
// @ts-nocheck
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TimelineView } from './TimelineView';

vi.mock('@anchor-os/ui', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TimelineView', () => {
  it('renders empty state when no tasks are provided', () => {
    render(
      <TimelineView
        tasks={[]}
        onToggle={vi.fn()}
        onStartFocus={vi.fn()}
        onStartEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('No timeline events available.')).toBeInTheDocument();
  });

  it('sorts tasks by time of day', () => {
    render(
      <TimelineView
        tasks={[
          {
            id: 'evening',
            title: 'Evening review',
            type: 'daily',
            completed: false,
            category: 'personal',
            timeOfDay: 'evening',
            createdAt: new Date(),
          },
          {
            id: 'morning',
            title: 'Morning prayer',
            type: 'daily',
            completed: false,
            category: 'personal',
            timeOfDay: 'morning',
            createdAt: new Date(),
          },
        ]}
        onToggle={vi.fn()}
        onStartFocus={vi.fn()}
        onStartEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Morning prayer');
    expect(headings[1]).toHaveTextContent('Evening review');
  });

  it('calls onStartFocus for upcoming task', () => {
    const onStartFocus = vi.fn();
    render(
      <TimelineView
        tasks={[
          {
            id: 'task-1',
            title: 'Workout',
            type: 'daily',
            completed: false,
            category: 'personal',
            createdAt: new Date(),
          },
        ]}
        onToggle={vi.fn()}
        onStartFocus={onStartFocus}
        onStartEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTitle('Start Task Focus Timer'));
    expect(onStartFocus).toHaveBeenCalledWith('task-1');
  });

  it('calls onToggle with current completed state', () => {
    const onToggle = vi.fn();
    render(
      <TimelineView
        tasks={[
          {
            id: 'task-2',
            title: 'Completed task',
            type: 'daily',
            completed: true,
            category: 'personal',
            createdAt: new Date(),
          },
        ]}
        onToggle={onToggle}
        onStartFocus={vi.fn()}
        onStartEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('task-2', true);
  });

  it('renders domain labels and hides focus button for completed tasks', () => {
    render(
      <TimelineView
        tasks={[
          { id: 'd1', title: 'Health', type: 'daily', completed: true, category: 'personal', domain: 'Health', createdAt: new Date() },
          { id: 'd2', title: 'Fitness', type: 'daily', completed: true, category: 'personal', domain: 'Fitness', createdAt: new Date() },
          { id: 'd3', title: 'Work', type: 'daily', completed: true, category: 'personal', domain: 'Work', createdAt: new Date() },
          { id: 'd4', title: 'Bible', type: 'daily', completed: true, category: 'personal', domain: 'Bible', createdAt: new Date() },
          { id: 'd5', title: 'Financial', type: 'daily', completed: true, category: 'personal', domain: 'Financial', createdAt: new Date() },
          { id: 'd6', title: 'Default', type: 'daily', completed: true, category: 'personal', createdAt: new Date() },
        ]}
        onToggle={vi.fn()}
        onStartFocus={vi.fn()}
        onStartEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getAllByText('Health').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Fitness').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Work').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bible').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Financial').length).toBeGreaterThan(0);
    expect(screen.queryByTitle('Start Task Focus Timer')).not.toBeInTheDocument();
  });
});