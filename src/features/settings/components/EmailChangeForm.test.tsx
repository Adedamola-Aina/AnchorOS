import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { mockUser, mockShowToast, mockReauthenticate, mockVerifyBeforeUpdateEmail } = vi.hoisted(() => ({
  mockUser: { uid: 'u1', email: 'old@example.com' } as { uid: string; email: string } | null,
  mockShowToast: vi.fn(),
  mockReauthenticate: vi.fn().mockResolvedValue(undefined),
  mockVerifyBeforeUpdateEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    reauthenticate: mockReauthenticate,
  }),
}));
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));
vi.mock('firebase/auth', () => ({
  verifyBeforeUpdateEmail: mockVerifyBeforeUpdateEmail,
}));
vi.mock('../../../utils/error', () => ({ captureError: vi.fn() }));

import { EmailChangeForm } from './EmailChangeForm';

describe('EmailChangeForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders current email and input fields', () => {
    render(<EmailChangeForm />);
    expect(screen.getByText('old@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText(/new email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('validates empty email', async () => {
    render(<EmailChangeForm />);
    fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    await waitFor(() => expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument());
  });

  it('validates invalid email format', async () => {
    render(<EmailChangeForm />);
    fireEvent.change(screen.getByLabelText(/new email/i), { target: { value: 'notanemail' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.submit(screen.getByRole('button', { name: /update email/i }).closest('form')!);
    await waitFor(() => expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument());
  });

  it('prevents same email', async () => {
    render(<EmailChangeForm />);
    fireEvent.change(screen.getByLabelText(/new email/i), { target: { value: 'old@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    await waitFor(() => expect(screen.getByText(/must be different/i)).toBeInTheDocument());
  });

  it('calls reauthenticate then verifyBeforeUpdateEmail on valid submit', async () => {
    render(<EmailChangeForm />);
    fireEvent.change(screen.getByLabelText(/new email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'mypassword' } });
    fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    await waitFor(() => expect(mockReauthenticate).toHaveBeenCalledWith('mypassword'));
    await waitFor(() => expect(mockVerifyBeforeUpdateEmail).toHaveBeenCalled());
    expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('verification'), expect.any(String));
  });

  it('shows error on reauth failure', async () => {
    mockReauthenticate.mockRejectedValueOnce(new Error('Wrong password'));
    render(<EmailChangeForm />);
    fireEvent.change(screen.getByLabelText(/new email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    await waitFor(() => expect(screen.getByText(/password is incorrect/i)).toBeInTheDocument());
  });
});
