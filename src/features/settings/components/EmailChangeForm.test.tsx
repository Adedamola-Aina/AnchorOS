// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { mockUser, mockShowToast, mockReauthenticate, mockVerifyBeforeUpdateEmail } = vi.hoisted(() => ({
  mockUser: { uid: 'u1', email: 'old@example.com' } as { uid: string; email: string } | null,
  mockShowToast: vi.fn(),
  mockReauthenticate: vi.fn().mockResolvedValue(undefined),
  mockVerifyBeforeUpdateEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, reauthenticate: mockReauthenticate }),
}));
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));
vi.mock('firebase/auth', () => ({
  verifyBeforeUpdateEmail: mockVerifyBeforeUpdateEmail,
}));
vi.mock('../../../utils/error', () => ({ captureError: vi.fn() }));

import { EmailChangeForm } from './EmailChangeForm';

function expand() {
  fireEvent.click(screen.getByRole('button', { name: /change email/i }));
}

describe('EmailChangeForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders collapsed with current email and Change Email button', () => {
    render(<EmailChangeForm />);
    expect(screen.getByText('old@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change email/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/new email/i)).not.toBeInTheDocument();
  });

  it('expands the form when Change Email is clicked', () => {
    render(<EmailChangeForm />);
    expand();
    expect(screen.getByPlaceholderText(/new email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/current password/i)).toBeInTheDocument();
  });

  it('collapses and resets on Cancel', () => {
    render(<EmailChangeForm />);
    expand();
    fireEvent.change(screen.getByPlaceholderText(/new email/i), { target: { value: 'typed@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByPlaceholderText(/new email/i)).not.toBeInTheDocument();
    // Re-expand to verify field was reset
    expand();
    expect(screen.getByPlaceholderText(/new email/i)).toHaveValue('');
  });

  it('disables Send Verification button when fields are empty', () => {
    render(<EmailChangeForm />);
    expand();
    expect(screen.getByRole('button', { name: /send verification/i })).toBeDisabled();
  });

  it('validates invalid email format', async () => {
    render(<EmailChangeForm />);
    expand();
    fireEvent.change(screen.getByPlaceholderText(/new email/i), { target: { value: 'notanemail' } });
    fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'pass123' } });
    fireEvent.submit(screen.getByPlaceholderText(/new email/i).closest('form'));
    await waitFor(() => expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument());
  });

  it('prevents same email', async () => {
    render(<EmailChangeForm />);
    expand();
    fireEvent.change(screen.getByPlaceholderText(/new email/i), { target: { value: 'old@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /send verification/i }));
    await waitFor(() => expect(screen.getByText(/must be different/i)).toBeInTheDocument());
  });

  it('calls reauthenticate then verifyBeforeUpdateEmail on valid submit', async () => {
    render(<EmailChangeForm />);
    expand();
    fireEvent.change(screen.getByPlaceholderText(/new email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'mypassword' } });
    fireEvent.click(screen.getByRole('button', { name: /send verification/i }));
    await waitFor(() => expect(mockReauthenticate).toHaveBeenCalledWith('mypassword'));
    await waitFor(() => expect(mockVerifyBeforeUpdateEmail).toHaveBeenCalled());
    expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('verification'), expect.any(String));
  });

  it('shows success state after verification email is sent', async () => {
    render(<EmailChangeForm />);
    expand();
    fireEvent.change(screen.getByPlaceholderText(/new email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'mypassword' } });
    fireEvent.click(screen.getByRole('button', { name: /send verification/i }));
    await waitFor(() => expect(screen.getByText(/verification sent/i)).toBeInTheDocument());
    expect(screen.getByText(/new@example.com/)).toBeInTheDocument();
  });

  it('shows error on reauth failure', async () => {
    mockReauthenticate.mockRejectedValueOnce(new Error('Wrong password'));
    render(<EmailChangeForm />);
    expand();
    fireEvent.change(screen.getByPlaceholderText(/new email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /send verification/i }));
    await waitFor(() => expect(screen.getByText(/password is incorrect/i)).toBeInTheDocument());
  });
});
