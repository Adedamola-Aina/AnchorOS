import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DangerZone } from './DangerZone';

// Mock context hooks
const mockConfirm = vi.fn();
const mockShowToast = vi.fn();
const mockReauthenticate = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ confirm: mockConfirm, showToast: mockShowToast }),
}));
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ reauthenticate: mockReauthenticate }),
}));

vi.mock('../../../utils/error', () => ({
  captureError: vi.fn(),
}));

describe('DangerZone', () => {
  const mockDelete = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockResolvedValue(true);
    mockReauthenticate.mockResolvedValue(undefined);
  });

  it('renders delete account button', () => {
    render(<DangerZone onDeleteAccount={mockDelete} />);
    expect(screen.getByRole('button', { name: /delete.*account/i })).toBeInTheDocument();
  });

  it('shows confirmation dialog on delete click', async () => {
    render(<DangerZone onDeleteAccount={mockDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete.*account/i }));
    await waitFor(() => expect(mockConfirm).toHaveBeenCalled());
  });

  it('shows password prompt after confirmation', async () => {
    render(<DangerZone onDeleteAccount={mockDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete.*account/i }));
    // Complete name-typing step first (BUG-087 added this step)
    await waitFor(() => screen.getByPlaceholderText('User'));
    fireEvent.change(screen.getByPlaceholderText('User'), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
  });

  it('does not proceed if confirmation is declined', async () => {
    mockConfirm.mockResolvedValue(false);
    render(<DangerZone onDeleteAccount={mockDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete.*account/i }));
    await waitFor(() => expect(mockConfirm).toHaveBeenCalled());
    expect(screen.queryByPlaceholderText(/password/i)).not.toBeInTheDocument();
  });

  it('calls onDeleteAccount after password re-auth', async () => {
    render(<DangerZone onDeleteAccount={mockDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete.*account/i }));
    // Complete name-typing step first (BUG-087 added this step)
    await waitFor(() => screen.getByPlaceholderText('User'));
    fireEvent.change(screen.getByPlaceholderText('User'), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByPlaceholderText(/password/i));

    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'mypass123' } });
    
    // Find the confirm/delete button in the password form
    const confirmBtn = screen.getAllByRole('button').find(b => 
      b.textContent?.toLowerCase().includes('delete') && b !== screen.getByRole('button', { name: /delete.*account/i })
    ) || screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockReauthenticate).toHaveBeenCalledWith('mypass123');
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
