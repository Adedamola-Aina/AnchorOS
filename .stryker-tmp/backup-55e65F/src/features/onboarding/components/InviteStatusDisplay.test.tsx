import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InviteStatusDisplay } from './InviteStatusDisplay';

describe('InviteStatusDisplay', () => {
  it('shows validating state', () => {
    render(<InviteStatusDisplay status="validating" />);
    expect(screen.getByText('Checking invitation...')).toBeInTheDocument();
  });

  it('shows invalid state with error', () => {
    render(<InviteStatusDisplay status="invalid" error="Invitation expired" />);
    expect(screen.getByText('Invitation Invalid')).toBeInTheDocument();
    expect(screen.getByText('Invitation expired')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('shows locked state', () => {
    render(<InviteStatusDisplay status="locked" />);
    expect(screen.getByText('Invitation Locked')).toBeInTheDocument();
    expect(screen.getByText(/too many failed/i)).toBeInTheDocument();
  });

  it('shows awaiting confirmation with owner name', () => {
    render(<InviteStatusDisplay status="awaiting_confirmation" ownerName="Alice" />);
    expect(screen.getByText("You're All Set!")).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Continue to App')).toBeInTheDocument();
  });
});
