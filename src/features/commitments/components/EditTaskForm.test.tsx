// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';

// Mock the heavy shared field primitives. The editor renders the SAME
// `CommitmentForm` the composer does, so these are the composer's testids.
vi.mock('./TaskFormParts', () => ({
  DailyTimeField: () => <div data-testid="time-of-day-select" />,
  WeeklyDaysField: () => <div data-testid="weekday-selector" />,
  MonthlyDatesField: () => <div data-testid="month-days-row" />,
  RepeatFields: () => <div data-testid="repeat-fields" />,
  reminderOutsidePreferredWindow: () => false,
}));

vi.mock('../../../components/shared', () => ({
  PopoverMenu: ({ items, value, onChange, label, testId }: any) => (
    <div data-testid={testId}>
      {label && <span>{label}</span>}
      <select value={value} onChange={(e: any) => onChange(e.target.value)}>
        {items.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </div>
  ),
  // CM-17: the schedule model uses the inline date picker.
  InlineDatePicker: ({ value, onChange, testId, label }: any) => (
    <div data-testid={testId}>
      {label && <span>{label}</span>}
      <input type="date" value={value || ''} onChange={(e: any) => onChange(e.target.value)} />
    </div>
  ),
  SegmentedControl: ({ options, value, onChange, label, testId }: any) => (
    <div data-testid={testId}>
      {label && <span>{label}</span>}
      {options.map((opt: any) => (
        <button key={opt.value} onClick={() => onChange(opt.value)} data-selected={value === opt.value}>
          {opt.label}
        </button>
      ))}
    </div>
  ),
  // The reminder row (the shared CommitmentForm renders it in both modes).
  TimeWheelPicker: ({ label, value, onChange, testId }: any) => (
    <div data-testid={testId}>
      {label && <span>{label}</span>}
      <input type="time" value={value || ''} onChange={(e: any) => onChange(e.target.value)} data-testid="reminder-time-input" />
    </div>
  ),
}));

import { EditTaskForm } from './EditTaskForm';

const baseTask: any = {
  id: 't1',
  title: 'Read Bible',
  type: 'daily',
  domain: 'Bible',
  category: 'personal',
  timeOfDay: 'morning',
  daysOfWeek: [],
  daysOfMonth: [],
};

describe('EditTaskForm', () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders the title pre-filled with a pinned action bar, not a modal', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);

    expect(screen.getByDisplayValue('Read Bible')).toBeInTheDocument();

    // The editor is a page (`/commitments/:id/edit`), so the actions live in a bar
    // pinned to the bottom of that page — not in a sheet.
    const actions = screen.getByTestId('edit-actions');
    expect(within(actions).getByText('Cancel')).toBeInTheDocument();
    expect(within(actions).getByText('Save Changes')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the time of day for daily tasks', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('time-of-day-select')).toBeInTheDocument();
  });

  it('shows the weekday selector for weekly tasks', () => {
    render(<EditTaskForm task={{ ...baseTask, type: 'weekly' }} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('weekday-selector')).toBeInTheDocument();
  });

  it('shows the day-of-month row for monthly tasks', () => {
    render(<EditTaskForm task={{ ...baseTask, type: 'monthly' }} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('month-days-row')).toBeInTheDocument();
  });

  /**
   * The cadence is part of the stored document, so the editor states it read-only
   * rather than offering a control that would silently rewrite the schedule.
   */
  it('states the cadence without offering to change it', () => {
    render(<EditTaskForm task={{ ...baseTask, type: 'weekly' }} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('cadence-locked')).toHaveTextContent('Weekly');
    expect(screen.queryByTestId('cadence-selector')).not.toBeInTheDocument();
  });

  it('shows scope selector when hasFamilyActive', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={true} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('scope-selector')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('hides scope selector when no family', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.queryByTestId('scope-selector')).not.toBeInTheDocument();
  });

  /** Edit had no validation at all: a nameless commitment could be saved. */
  it('refuses to save without a name, and says why', () => {
    render(<EditTaskForm task={{ ...baseTask, title: '' }} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Save Changes'));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByTestId('commitment-name-error')).toBeInTheDocument();
  });

  it('calls onCancel', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSave with updates', async () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });
    expect(onSave).toHaveBeenCalledWith('t1', expect.objectContaining({
      title: 'Read Bible',
      domain: 'Bible',
      category: 'personal',
      timeOfDay: 'morning',
    }));
  });
});
