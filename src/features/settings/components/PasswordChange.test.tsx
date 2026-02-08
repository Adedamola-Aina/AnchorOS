import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { PasswordChange } from './PasswordChange';

const mockReauthenticate = vi.fn();
const mockShowToast = vi.fn();
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ reauthenticate: mockReauthenticate }),
}));
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

vi.mock('firebase/auth', () => ({
  updatePassword: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../config/firebase', () => ({
  auth: { currentUser: { uid: 'user-1' } },
}));

vi.mock('../../../utils/error', () => ({
  captureError: vi.fn(),
}));

vi.mock('../../../services/AuditService', () => ({
  auditAuth: { passwordChanged: vi.fn() },
}));

describe('PasswordChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReauthenticate.mockResolvedValue(undefined);
  });

  it('renders change password button', () => {
    render(<PasswordChange />);
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('shows form on button click', () => {
    render(<PasswordChange />);
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));
    expect(screen.getByPlaceholderText('Current password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password (min 8 chars)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
  });

  it('validates minimum password length', async () => {
    render(<PasswordChange />);
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    fireEvent.change(screen.getByPlaceholderText('Current password'), { target: { value: 'oldpass1' } });
    fireEvent.change(screen.getByPlaceholderText('New password (min 8 chars)'), { target: { value: 'short' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), { target: { value: 'short' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/8 char/i)).toBeInTheDocument();
    });
  });

  it('validates passwords match', async () => {
    render(<PasswordChange />);
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    fireEvent.change(screen.getByPlaceholderText('Current password'), { target: { value: 'oldpass1' } });
    fireEvent.change(screen.getByPlaceholderText('New password (min 8 chars)'), { target: { value: 'newpassword1' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), { target: { value: 'different1' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });
  });
});
