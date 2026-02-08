/**
 * CompletionRing tests — TDD
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompletionRing } from './CompletionRing';

describe('CompletionRing', () => {
  const defaultProps = {
    completed: 2,
    total: 5,
    onClick: vi.fn(),
  };

  it('renders the ring button with progress text', () => {
    render(<CompletionRing {...defaultProps} />);
    expect(screen.getByTestId('completion-ring')).toBeInTheDocument();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('has proper ARIA label', () => {
    render(<CompletionRing {...defaultProps} />);
    const btn = screen.getByTestId('completion-ring');
    expect(btn).toHaveAttribute('aria-label', 'Onboarding progress: 2 of 5 complete');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<CompletionRing {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('completion-ring'));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies ring-glow animation when not all complete', () => {
    render(<CompletionRing {...defaultProps} />);
    const btn = screen.getByTestId('completion-ring');
    expect(btn.style.animation).toContain('ring-glow');
  });

  it('returns null when all complete', () => {
    const { container } = render(<CompletionRing completed={5} total={5} onClick={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders SVG with progress arc', () => {
    render(<CompletionRing {...defaultProps} />);
    expect(screen.getByTestId('progress-arc')).toBeInTheDocument();
  });

  it('respects custom size prop', () => {
    render(<CompletionRing {...defaultProps} size={56} />);
    const btn = screen.getByTestId('completion-ring');
    expect(btn.style.width).toBe('56px');
    expect(btn.style.height).toBe('56px');
  });

  it('shows rose-colored progress text', () => {
    render(<CompletionRing {...defaultProps} />);
    const label = screen.getByText('2/5');
    expect(label.className).toContain('text-rose-600');
  });

  it('shows 0/5 when nothing completed', () => {
    render(<CompletionRing completed={0} total={5} onClick={vi.fn()} />);
    expect(screen.getByText('0/5')).toBeInTheDocument();
  });
});
