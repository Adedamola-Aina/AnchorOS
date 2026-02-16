import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

vi.mock('../../components/shared', () => ({
  AnchorLogo: ({ className }: { className?: string }) => <span data-testid="anchor-logo" className={className} />,
}));

describe('PasswordStrengthMeter', () => {
  it('shows Weak for empty password', () => {
    render(<PasswordStrengthMeter password="" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('shows Fair for short password', () => {
    render(<PasswordStrengthMeter password="abcdefgh" />);
    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('shows Extra Secure for complex password', () => {
    render(<PasswordStrengthMeter password="MyPass1!" />);
    expect(screen.getByText('Extra Secure')).toBeInTheDocument();
  });

  it('renders requirement badges', () => {
    render(<PasswordStrengthMeter password="Test1!" />);
    expect(screen.getByText('12+ chars')).toBeInTheDocument();
    expect(screen.getByText('Uppercase')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Symbol')).toBeInTheDocument();
  });

  it('shows Ironclad at maximum strength', () => {
    render(<PasswordStrengthMeter password="MyLongPassword123!" />);
    expect(screen.getByText('Ironclad')).toBeInTheDocument();
  });
});
