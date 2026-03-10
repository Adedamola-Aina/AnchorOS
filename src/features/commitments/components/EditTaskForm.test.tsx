// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('renders with task title pre-filled', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByDisplayValue('Read Bible')).toBeInTheDocument();
    expect(screen.getByText(/editing daily commitment/i)).toBeInTheDocument();
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
    expect(screen.getByDisplayValue('Personal')).toBeInTheDocument();
  });

  it('hides scope selector when no family', () => {
    render(<EditTaskForm task={baseTask} hasFamilyActive={false} onSave={onSave} onCancel={onCancel} />);
    expect(screen.queryByDisplayValue('Personal')).not.toBeInTheDocument();
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
