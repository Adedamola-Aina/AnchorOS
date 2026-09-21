// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';

// Mock child components
vi.mock('./EditTaskFormFields', () => ({
  DailyFields: ({ editTime, setEditTime }: any) => (
    <select data-testid="daily-fields" value={editTime} onChange={e => setEditTime(e.target.value)}>
      <option value="morning">Morning</option>
      <option value="evening">Evening</option>
    </select>
  ),
  WeeklyFields: () => <div data-testid="weekly-fields" />,
  MonthlyFields: () => <div data-testid="monthly-fields" />,
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

  it('renders as a sheet with the title pre-filled and a pinned action bar', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);

    expect(screen.getByDisplayValue('Read Bible')).toBeInTheDocument();

    // It is a modal sheet, not a Card in the page flow: that is what keeps the
    // actions reachable and stops the shell's FAB covering the fields.
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit commitment')).toBeInTheDocument();

    // Cancel / Save live in the modal footer, outside the scrollable body.
    const footer = screen.getByTestId('modal-footer');
    expect(within(footer).getByText('Cancel')).toBeInTheDocument();
    expect(within(footer).getByText('Save Changes')).toBeInTheDocument();
  });

  it('shows DailyFields for daily tasks', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('daily-fields')).toBeInTheDocument();
  });

  it('shows WeeklyFields for weekly tasks', () => {
    render(<EditTaskForm task={{ ...baseTask, type: 'weekly' }} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('weekly-fields')).toBeInTheDocument();
  });

  it('shows MonthlyFields for monthly tasks', () => {
    render(<EditTaskForm task={{ ...baseTask, type: 'monthly' }} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('monthly-fields')).toBeInTheDocument();
  });

  it('shows scope selector when hasFamilyActive', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={true} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByTestId('edit-scope-control')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('hides scope selector when no family', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.queryByTestId('edit-scope-control')).not.toBeInTheDocument();
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
