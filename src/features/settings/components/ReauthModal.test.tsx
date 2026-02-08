import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ReauthModal } from './ReauthModal';

const defaultProps = {
  show: true,
  password: '',
  isLoading: false,
  onPasswordChange: vi.fn(),
  onConfirm: vi.fn(),
  onClose: vi.fn(),
};

describe('ReauthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when show is false', () => {
    const { container } = render(<ReauthModal {...defaultProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the modal when show is true', () => {
    render(<ReauthModal {...defaultProps} />);
    expect(screen.getByText('Verify Identity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Password')).toBeInTheDocument();
  });

  it('displays the current password value', () => {
    render(<ReauthModal {...defaultProps} password="secret123" />);
    expect(screen.getByDisplayValue('secret123')).toBeInTheDocument();
  });

  it('calls onPasswordChange when typing', () => {
    render(<ReauthModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Your Password');
    fireEvent.change(input, { target: { value: 'newpass' } });
    expect(defaultProps.onPasswordChange).toHaveBeenCalledWith('newpass');
  });

  it('calls onConfirm on Enter key', () => {
    render(<ReauthModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Your Password');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onClose when Cancel clicked', () => {
    render(<ReauthModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onConfirm when Confirm button clicked', () => {
    render(<ReauthModal {...defaultProps} password="pass" />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('disables Confirm when password is empty', () => {
    render(<ReauthModal {...defaultProps} password="" />);
    const confirmBtn = screen.getByText('Confirm');
    expect(confirmBtn).toBeDisabled();
  });

  it('shows description text', () => {
    render(<ReauthModal {...defaultProps} />);
    expect(screen.getByText(/enter your password to confirm/i)).toBeInTheDocument();
  });
});
