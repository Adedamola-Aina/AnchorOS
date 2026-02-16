// @ts-nocheck
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

vi.mock('./AnchorContext', () => ({
  useApp: () => ({ navigateTo: vi.fn() }),
}));

vi.mock('../hooks/useHaptic', () => ({
  useHaptic: () => ({ trigger: vi.fn() }),
}));

vi.mock('../hooks/useTaskReminders', () => ({
  useTaskReminders: vi.fn(),
}));

const mockOnCommitmentCompleted = vi.fn();
vi.mock('../hooks/useFabricSuggestions', () => ({
  useFabricSuggestions: () => ({
    suggestions: [],
    onCommitmentCompleted: mockOnCommitmentCompleted,
    dismissSuggestion: vi.fn(),
  }),
}));

describe('TaskContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );

  beforeEach(() => vi.clearAllMocks());

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

  it('wraps toggleTask with suggestion logic', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {
      await result.current.toggleTask('t1', false); // completing
    });
    expect(mockToggleTask).toHaveBeenCalledWith('t1', false);
    expect(mockOnCommitmentCompleted).toHaveBeenCalled();
  });

  it('does not trigger suggestion when uncompleting', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    await act(async () => {
      await result.current.toggleTask('t2', true); // uncompleting
    });
    expect(mockToggleTask).toHaveBeenCalledWith('t2', true);
    expect(mockOnCommitmentCompleted).not.toHaveBeenCalled();
  });

  it('provides fabric suggestions', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    expect(result.current.fabricSuggestions).toEqual([]);
    expect(result.current.dismissFabricSuggestion).toBeDefined();
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useTasks());
    }).toThrow('useTasks must be used within a TaskProvider');
  });
});
