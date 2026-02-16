// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { EmailVerificationWarning } from './EmailVerificationWarning';

describe('EmailVerificationWarning', () => {
  it('renders warning message', () => {
    render(<EmailVerificationWarning />);
    expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
  });

  it('mentions verification link in inbox', () => {
    render(<EmailVerificationWarning />);
    expect(screen.getByText(/verify your email address/)).toBeInTheDocument();
    expect(screen.getByText(/verification link/)).toBeInTheDocument();
  });
});
