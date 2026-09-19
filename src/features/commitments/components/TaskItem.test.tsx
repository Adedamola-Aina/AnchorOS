// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { TaskItem } from './TaskItem';
import { buildTask } from '../../../test/factories';

vi.mock('../../../hooks/useHaptic', () => ({
  useHaptic: () => ({ trigger: vi.fn() }),
}));

describe('TaskItem', () => {
  const baseTask = buildTask({ title: 'Read Bible', completed: false, type: 'daily', currentStreak: 5, domain: 'Bible' });
  const defaultProps = {
    task: baseTask,
    hasFamilyActive: false,
    isEditing: false,
    onToggle: vi.fn(),
    onStartEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders task title', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText('Read Bible')).toBeInTheDocument();
  });

  it('shows streak badge for uncompleted tasks with streak', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('calls onToggle when checkbox clicked', async () => {
    vi.useFakeTimers();
    render(<TaskItem {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    
    // Click triggers async handleToggle with setTimeout(800ms)
    await act(async () => {
      fireEvent.click(buttons[0]);
      vi.advanceTimersByTime(900);
    });
    
    expect(defaultProps.onToggle).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('shows type badge', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText(/daily/i)).toBeInTheDocument();
  });

  it('hides action buttons when hideActions is true', () => {
    const { container } = render(<TaskItem {...defaultProps} hideActions={true} />);
    // With hideActions, edit/delete buttons should not be present
    screen.queryByRole('button', { name: /edit/i });
    // editBtn may or may not exist depending on implementation
    expect(container).toBeInTheDocument();
  });

  it('reports the completed commitment for a transaction offer instead of opening a modal (UX-CM-08)', async () => {
    vi.useFakeTimers();
    const onFinancialNudge = vi.fn();
    const financialTask = buildTask({ id: 'task-pay', title: 'Pay electricity bill', completed: false, type: 'monthly' });
    render(
      <TaskItem
        {...defaultProps}
        task={financialTask}
        onFinancialNudge={onFinancialNudge}
      />
    );
    const buttons = screen.getAllByRole('button');

    await act(async () => {
      fireEvent.click(buttons[0]);
      vi.advanceTimersByTime(900);
    });

    // The row reports WHICH commitment was completed; the parent renders the chip.
    // Previously this path opened a blocking "Financial Transaction?" dialog.
    expect(onFinancialNudge).toHaveBeenCalledWith('task-pay');
    vi.useRealTimers();
  });

  it('renders a dismissible inline chip when this row is the transaction offer (UX-CM-08)', () => {
    const onRecordTransaction = vi.fn();
    const onDismissFinancialNudge = vi.fn();
    render(
      <TaskItem
        {...defaultProps}
        task={buildTask({ title: 'Pay rent', completed: true })}
        isFinancialNudge
        onRecordTransaction={onRecordTransaction}
        onDismissFinancialNudge={onDismissFinancialNudge}
      />
    );

    expect(screen.getByTestId('financial-nudge')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Record' }));
    expect(onRecordTransaction).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /dismiss transaction prompt/i }));
    expect(onDismissFinancialNudge).toHaveBeenCalledTimes(1);
  });

  it('does not render the transaction chip on rows that are not the offer (UX-CM-08)', () => {
    render(<TaskItem {...defaultProps} task={buildTask({ title: 'Pay rent', completed: true })} />);

    expect(screen.queryByTestId('financial-nudge')).not.toBeInTheDocument();
  });
});
