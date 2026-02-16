// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AwaitingConfirmationCard } from './AwaitingConfirmationCard';

describe('AwaitingConfirmationCard', () => {
  const defaultProps = {
    inviteeEmail: 'partner@test.com',
    showPasswordPrompt: false,
    password: '',
    setPassword: vi.fn(),
    error: '',
    confirmingConnection: false,
    onPasswordSubmit: vi.fn(),
    onBack: vi.fn(),
    onConfirm: vi.fn(),
    onReject: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('shows invitee email', () => {
    render(<AwaitingConfirmationCard {...defaultProps} />);
    expect(screen.getByText('partner@test.com')).toBeInTheDocument();
  });

  it('shows confirm and reject buttons when no password prompt', () => {
    render(<AwaitingConfirmationCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm clicked', () => {
    render(<AwaitingConfirmationCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onReject when reject clicked', () => {
    render(<AwaitingConfirmationCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    expect(defaultProps.onReject).toHaveBeenCalled();
  });

  it('disables buttons while confirming', () => {
    render(<AwaitingConfirmationCard {...defaultProps} confirmingConnection={true} />);
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /reject/i })).toBeDisabled();
  });

  it('shows password form when showPasswordPrompt is true', () => {
    render(<AwaitingConfirmationCard {...defaultProps} showPasswordPrompt={true} />);
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('calls setPassword on password input', () => {
    render(<AwaitingConfirmationCard {...defaultProps} showPasswordPrompt={true} />);
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secret123' } });
    expect(defaultProps.setPassword).toHaveBeenCalledWith('secret123');
  });

  it('disables submit when password is empty', () => {
    render(<AwaitingConfirmationCard {...defaultProps} showPasswordPrompt={true} password="" />);
    const submitBtn = screen.getByRole('button', { name: /submit|confirm/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows error when provided', () => {
    render(<AwaitingConfirmationCard {...defaultProps} showPasswordPrompt={true} error="Wrong password" />);
    expect(screen.getByText('Wrong password')).toBeInTheDocument();
  });
});
