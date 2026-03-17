// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LinkBankAccount } from './LinkBankAccount';

const mockBankState = {
  linkBank: vi.fn(),
  isLinking: false,
  error: null,
  clearError: vi.fn(),
};

const mockShowToast = vi.fn();

vi.mock('../../../hooks/useBankConnection', () => ({
  useBankConnection: () => ({
    linkBank: mockBankState.linkBank,
    isLinking: mockBankState.isLinking,
    error: mockBankState.error,
    clearError: mockBankState.clearError,
  }),
}));

// Mock NotificationContext
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

describe('LinkBankAccount', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockBankState.isLinking = false;
    mockBankState.error = null;
    mockBankState.linkBank.mockResolvedValue({ institutionName: 'GTBank' });
    // Reset import.meta.env
    vi.stubEnv('VITE_MONO_PUBLIC_KEY', 'test_pk_mono_123');
    delete window.MonoConnect;
    document.querySelectorAll('script[src="https://connect.mono.co/connect.js"]').forEach((s) => s.remove());
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

  it('disables button and shows linking text while linking is in progress', () => {
    mockBankState.isLinking = true;
    render(<LinkBankAccount {...defaultProps} />);

    const button = screen.getByRole('button', { name: /linking/i });
    expect(button).toBeDisabled();
  });

  it('uses existing MonoConnect instance when already available', async () => {
    const setup = vi.fn();
    const open = vi.fn();
    const ctor = vi.fn(function MonoConnect(config) {
      expect(config.key).toBe('test_pk_mono_123');
      return { setup, open };
    });
    window.MonoConnect = ctor;

    render(<LinkBankAccount {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /link bank account/i }));

    expect(mockBankState.clearError).toHaveBeenCalledTimes(1);
    expect(ctor).toHaveBeenCalledTimes(1);
    expect(setup).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledTimes(1);

    const config = ctor.mock.calls[0][0];
    await config.onSuccess({ code: 'mono-code' });

    expect(mockBankState.linkBank).toHaveBeenCalledWith('mono-code');
    expect(mockShowToast).toHaveBeenCalledWith('GTBank linked successfully', 'success');
    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
  });

  it('shows toast when bank link callback fails', async () => {
    const setup = vi.fn();
    const open = vi.fn();
    const ctor = vi.fn(function MonoConnect() {
      return { setup, open };
    });
    window.MonoConnect = ctor;
    mockBankState.linkBank.mockRejectedValueOnce(new Error('failed'));

    render(<LinkBankAccount {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /link bank account/i }));

    const config = ctor.mock.calls[0][0];
    await config.onSuccess({ code: 'mono-code' });

    expect(mockShowToast).toHaveBeenCalledWith('Failed to link bank account', 'error');
    expect(defaultProps.onSuccess).not.toHaveBeenCalled();
  });

  it('loads Mono script when widget is not present and opens on load', async () => {
    const setup = vi.fn();
    const open = vi.fn();
    const ctor = vi.fn(function MonoConnect() {
      return { setup, open };
    });

    render(<LinkBankAccount {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /link bank account/i }));

    const script = document.querySelector('script[src="https://connect.mono.co/connect.js"]') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.async).toBe(true);

    window.MonoConnect = ctor;
    script.onload?.(new Event('load'));

    await waitFor(() => {
      expect(ctor).toHaveBeenCalledTimes(1);
      expect(setup).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledTimes(1);
    });
  });

  it('shows widget load error when Mono script fails', () => {
    render(<LinkBankAccount {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /link bank account/i }));

    const script = document.querySelector('script[src="https://connect.mono.co/connect.js"]') as HTMLScriptElement;
    script.onerror?.(new Event('error'));

    expect(mockShowToast).toHaveBeenCalledWith('Failed to load bank connection widget', 'error');
  });
});
