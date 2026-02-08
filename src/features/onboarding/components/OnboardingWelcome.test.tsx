import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OnboardingWelcome } from './OnboardingWelcome';

vi.mock('../../../components/shared', () => ({
  AnchorLogo: ({ className }: { className?: string }) => <span data-testid="logo" className={className} />,
}));

describe('OnboardingWelcome', () => {
  it('renders welcome with user name', () => {
    render(<OnboardingWelcome userName="Alice" onStart={vi.fn()} onSkip={vi.fn()} />);
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText('Start Setup')).toBeInTheDocument();
  });

  it('calls onStart', () => {
    const onStart = vi.fn();
    render(<OnboardingWelcome userName="Alice" onStart={onStart} onSkip={vi.fn()} />);
    fireEvent.click(screen.getByText('Start Setup'));
    expect(onStart).toHaveBeenCalled();
  });

  it('calls onSkip', () => {
    const onSkip = vi.fn();
    render(<OnboardingWelcome userName="Alice" onStart={vi.fn()} onSkip={onSkip} />);
    fireEvent.click(screen.getByText(/skip for now/i));
    expect(onSkip).toHaveBeenCalled();
  });
});
