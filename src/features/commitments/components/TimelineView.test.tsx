/// <reference types="@testing-library/jest-dom/vitest" />

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TimelineView } from './TimelineView';

vi.mock('@anchor-os/ui', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="timeline-card" className={className}>{children}</div>
  ),
}));

const task = (overrides: Record<string, unknown> = {}) => ({
  id: 't1',
  title: 'Morning prayer',
  type: 'daily',
  completed: false,
  category: 'personal',
  createdAt: new Date(),
  ...overrides,
});

const renderTimeline = (tasks: any[], extra: Record<string, unknown> = {}) => render(
  <TimelineView
    tasks={tasks}
    onToggle={(extra.onToggle as ((id: string, completed: boolean) => void) | undefined) ?? vi.fn()}
    onStartEdit={(extra.onStartEdit as ((id: string) => void) | undefined) ?? vi.fn()}
    onDelete={vi.fn()}
    now={new Date('2026-09-22T08:00:00')}
  />,
);

describe('TimelineView', () => {
  it('says why it is empty instead of showing nothing', () => {
    renderTimeline([]);
    expect(screen.getByTestId('timeline-empty')).toBeInTheDocument();
    expect(screen.getByText('Nothing to lay out yet.')).toBeInTheDocument();
  });

  it('sorts tasks by time of day', () => {
    renderTimeline([
      task({ id: 'evening', title: 'Evening review', timeOfDay: 'evening' }),
      task({ id: 'morning', title: 'Morning prayer', timeOfDay: 'morning' }),
    ]);

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Morning prayer');
    expect(headings[1]).toHaveTextContent('Evening review');
  });

  /**
   * The regression this view shipped with: an automated edit split Tailwind tokens
   * ("p-0" → "p - 0", "overflow-hidden" → "overflow - hidden"), and the stray
   * `hidden` token compiled to `display: none` — so every row of a 16-commitment
   * timeline rendered invisibly and the page looked empty.
   */
  it('renders rows with real layout classes and no stray `hidden` token', () => {
    renderTimeline([task({ id: 'visible', title: 'Visible commitment' })]);

    const card = screen.getByTestId('timeline-card');
    expect(card.className).toContain('p-0');
    expect(card.className).toContain('overflow-hidden');
    // The bare token is what applied `display: none`.
    expect(card.className.split(/\s+/)).not.toContain('hidden');
    // Split tokens (" - ") are the corruption signature.
    expect(card.className).not.toMatch(/\s-\s/);
    expect(screen.getByText('Visible commitment')).toBeInTheDocument();
  });

  it('gives the completion control a name and a 44px target', () => {
    renderTimeline([task({ id: 'a11y', title: 'Stretch' })]);

    const toggle = screen.getByTestId('timeline-toggle');
    expect(toggle).toHaveAttribute('aria-label', 'Mark Stretch as done');
    expect(toggle.className).toContain('h-11');
    expect(toggle.className).toContain('w-11');
  });

  it('completes the commitment from the row control', () => {
    const onToggle = vi.fn();
    renderTimeline([task({ id: 'task-2', title: 'Completed task', completed: true })], { onToggle });

    fireEvent.click(screen.getByTestId('timeline-toggle'));
    expect(onToggle).toHaveBeenCalledWith('task-2', true);
  });

  it('opens the commitment for editing from the row', () => {
    const onStartEdit = vi.fn();
    renderTimeline([task({ id: 'task-1', title: 'Workout' })], { onStartEdit });

    fireEvent.click(screen.getByRole('button', { name: 'Edit Workout' }));
    expect(onStartEdit).toHaveBeenCalledWith('task-1');
  });

  it('shows the domain as a label, never as colour alone', () => {
    renderTimeline([
      task({ id: 'd1', title: 'Health', domain: 'Health' }),
      task({ id: 'd2', title: 'Fitness', domain: 'Fitness' }),
      task({ id: 'd3', title: 'Work', domain: 'Work' }),
      task({ id: 'd4', title: 'Bible', domain: 'Bible' }),
      task({ id: 'd5', title: 'Financial', domain: 'Financial' }),
    ]);

    for (const label of ['Health', 'Fitness', 'Work', 'Bible', 'Financial']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('shows when the commitment next comes round', () => {
    renderTimeline([task({ id: 'next', title: 'Pay rent', type: 'monthly', daysOfMonth: [1] })]);
    expect(screen.getByTestId('timeline-next-due')).toBeInTheDocument();
  });
});
