// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthSubmitButton } from './AuthSubmitButton';

describe('AuthSubmitButton', () => {
  it('renders login mode', () => {
    render(<AuthSubmitButton authMode="login" isAuthenticating={false} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders signup mode', () => {
    render(<AuthSubmitButton authMode="signup" isAuthenticating={false} />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('renders reset mode', () => {
    render(<AuthSubmitButton authMode="reset" isAuthenticating={false} />);
    expect(screen.getByText('Send Link')).toBeInTheDocument();
  });

  it('renders mfa mode', () => {
    render(<AuthSubmitButton authMode="mfa" isAuthenticating={false} />);
    expect(screen.getByText('Verify Securely')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<AuthSubmitButton authMode="login" isAuthenticating={true} />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
