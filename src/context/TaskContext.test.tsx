import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { TaskProvider, useTasks } from './TaskContext';

const mockTasks = [
  { id: 't1', title: 'Morning run', completed: false, type: 'daily' },
  { id: 't2', title: 'Read Bible', completed: true, type: 'daily' },
];
const mockToggleTask = vi.fn();
const mockAddTask = vi.fn();
const mockDeleteTask = vi.fn();
const mockUpdateTask = vi.fn();

vi.mock('../hooks/useCommitmentService', () => ({
  useCommitmentService: () => ({
    tasks: mockTasks,
    addTask: mockAddTask,
    toggleTask: mockToggleTask,
    deleteTask: mockDeleteTask,
    updateTask: mockUpdateTask,
  }),
}));

vi.mock('./AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'user-1' } }),
}));

vi.mock('../hooks/useHaptic', () => ({
  useHaptic: () => ({ trigger: vi.fn() }),
}));

vi.mock('../hooks/useTaskReminders', () => ({
  useTaskReminders: vi.fn(),
}));

const mockLearnFrom = vi.fn();
vi.mock('./FabricContext', () => ({
  useFabricContext: () => ({ learnFrom: mockLearnFrom }),
}));

describe('TaskContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockToggleTask.mockResolvedValue(undefined);
  });

  it('provides tasks to children', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    expect(result.current.tasks).toEqual(mockTasks);
  });

  it('exposes task CRUD operations', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    expect(result.current.addTask).toBeDefined();
    expect(result.current.deleteTask).toBeDefined();
    expect(result.current.updateTask).toBeDefined();
  });

  it('wraps toggleTask with haptic feedback', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {
      await result.current.toggleTask('t1', false);
    });
    expect(mockToggleTask).toHaveBeenCalledWith('t1', false);
  });

  it('calls learnFrom on commitment completion', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {
      await result.current.toggleTask('t1', false);
    });
    expect(mockLearnFrom).toHaveBeenCalledWith(
      { type: 'commitment_completed', commitmentId: 't1', category: undefined },
      { type: 'check_commitment', commitmentId: 't1' }
    );
  });

  it('does not call learnFrom when uncompleting', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {
      await result.current.toggleTask('t2', true);
    });
    expect(mockToggleTask).toHaveBeenCalledWith('t2', true);
    expect(mockLearnFrom).not.toHaveBeenCalled();
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useTasks());
    }).toThrow('useTasks must be used within a TaskProvider');
  });
});
