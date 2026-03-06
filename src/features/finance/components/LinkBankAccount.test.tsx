// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkBankAccount } from './LinkBankAccount';

// Mock useBankConnection hook
const mockLinkBank = vi.fn();
const mockClearError = vi.fn();
vi.mock('../../../hooks/useBankConnection', () => ({
  useBankConnection: () => ({
    linkBank: mockLinkBank,
    isLinking: false,
    error: null,
    clearError: mockClearError,
  }),
}));

// Mock NotificationContext
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: vi.fn() }),
}));

describe('LinkBankAccount', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset import.meta.env
    vi.stubEnv('VITE_MONO_PUBLIC_KEY', 'test_pk_mono_123');
  });

  it('renders the link bank button', () => {
    render(<LinkBankAccount {...defaultProps} />);
    expect(screen.getByRole('button', { name: /link.*bank/i })).toBeInTheDocument();
  });

  it('shows institution info text', () => {
    render(<LinkBankAccount {...defaultProps} />);
    expect(screen.getByText(/securely connect/i)).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<LinkBankAccount {...defaultProps} />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows warning when VITE_MONO_PUBLIC_KEY is not set', () => {
    vi.stubEnv('VITE_MONO_PUBLIC_KEY', '');
    render(<LinkBankAccount {...defaultProps} />);
    expect(screen.getByText(/not configured/i)).toBeInTheDocument();
  });
});
