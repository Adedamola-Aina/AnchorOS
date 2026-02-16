/**
 * OnboardingProgress tests — TDD
 */
// @ts-nocheck


import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OnboardingProgress } from './OnboardingProgress';

describe('OnboardingProgress', () => {
  it('renders step count text', () => {
    render(<OnboardingProgress currentStep={2} totalSteps={4} />);
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
  });

  it('renders correct number of pill dots', () => {
    const { container } = render(<OnboardingProgress currentStep={1} totalSteps={4} />);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots).toHaveLength(4);
  });

  it('applies active styles to completed steps', () => {
    const { container } = render(<OnboardingProgress currentStep={2} totalSteps={4} />);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots[0].className).toContain('bg-primary-500');
    expect(dots[1].className).toContain('bg-primary-500');
    expect(dots[2].className).toContain('bg-slate-200');
    expect(dots[3].className).toContain('bg-slate-200');
  });

  it('has proper ARIA progressbar role', () => {
    render(<OnboardingProgress currentStep={3} totalSteps={4} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(bar).toHaveAttribute('aria-label', 'Step 3 of 4');
  });
});
