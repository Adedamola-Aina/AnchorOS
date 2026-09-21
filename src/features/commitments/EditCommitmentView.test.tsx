// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditCommitmentView from './EditCommitmentView';
import { FabProvider } from '../../context/FabContext';

const showToast = vi.fn();
const updateTask = vi.fn().mockResolvedValue(undefined);

const baseTask = {
  id: 'task-1',
  title: 'Read Bible',
  type: 'daily',
  completed: false,
  category: 'personal',
  createdAt: new Date(),
  timeOfDay: 'morning',
};

let taskState = { tasks: [baseTask], updateTask, addTask: vi.fn(), toggleTask: vi.fn(), deleteTask: vi.fn(), loadingTasks: false };

vi.mock('../../context/TaskContext', () => ({ useTasks: () => taskState }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'u1' } }) }));
vi.mock('../../context/NotificationContext', () => ({ useNotifications: () => ({ showToast }) }));
vi.mock('../../hooks/useFamilySharing', () => ({ useFamilySharing: () => ({ connection: null }) }));
vi.mock('../../utils/error', () => ({ captureError: vi.fn() }));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <FabProvider>
        <Routes>
          <Route path="/commitments/:id/edit" element={<EditCommitmentView />} />
          <Route path="/commitments" element={<div data-testid="commitments-route" />} />
        </Routes>
      </FabProvider>
    </MemoryRouter>,
  );

describe('EditCommitmentView — the editor as its own destination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    taskState = { tasks: [baseTask], updateTask, addTask: vi.fn(), toggleTask: vi.fn(), deleteTask: vi.fn(), loadingTasks: false };
  });

  it('loads the commitment named in the URL', () => {
    renderAt('/commitments/task-1/edit');

    expect(screen.getByDisplayValue('Read Bible')).toBeInTheDocument();
    expect(screen.getByText('Edit commitment')).toBeInTheDocument();
  });

  it('saves and returns to the list', async () => {
    renderAt('/commitments/task-1/edit');

    fireEvent.change(screen.getByDisplayValue('Read Bible'), { target: { value: 'Read Bible daily' } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith('task-1', expect.objectContaining({ title: 'Read Bible daily' }));
    });
    expect(await screen.findByTestId('commitments-route')).toBeInTheDocument();
    expect(showToast).toHaveBeenCalledWith('Commitment updated!', 'success');
  });

  it('cancels without saving', async () => {
    renderAt('/commitments/task-1/edit');

    fireEvent.change(screen.getByDisplayValue('Read Bible'), { target: { value: 'Discarded' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(await screen.findByTestId('commitments-route')).toBeInTheDocument();
    expect(updateTask).not.toHaveBeenCalled();
  });

  it('reports a deleted or unknown commitment instead of rendering an empty form', () => {
    renderAt('/commitments/does-not-exist/edit');

    expect(screen.getByTestId('edit-commitment-missing')).toBeInTheDocument();
    expect(screen.getByText('Commitment not found')).toBeInTheDocument();
    // The way back is present even when the target is gone.
    expect(screen.getByText('Commitments')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-actions')).not.toBeInTheDocument();
  });
});