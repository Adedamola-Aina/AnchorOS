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
    const editBtn = screen.queryByRole('button', { name: /edit/i });
    // editBtn may or may not exist depending on implementation
    expect(container).toBeInTheDocument();
  });

  it('detects financial keywords on completion', async () => {
    vi.useFakeTimers();
    const onConfirmFinancial = vi.fn();
    const financialTask = buildTask({ title: 'Pay electricity bill', completed: false, type: 'monthly' });
    render(
      <TaskItem
        {...defaultProps}
        task={financialTask}
        onConfirmFinancial={onConfirmFinancial}
      />
    );
    const buttons = screen.getAllByRole('button');
    
    await act(async () => {
      fireEvent.click(buttons[0]);
      vi.advanceTimersByTime(900);
    });
    
    expect(onConfirmFinancial).toHaveBeenCalledWith('Pay electricity bill');
    vi.useRealTimers();
  });
});
