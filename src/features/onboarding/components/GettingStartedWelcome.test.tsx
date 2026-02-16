/**
 * GettingStartedWelcome tests — TDD
 */
// @ts-nocheck


import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GettingStartedWelcome } from './GettingStartedWelcome';

vi.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
}));

vi.mock('../../../components/shared', () => ({
  AnchorLogo: () => <span data-testid="anchor-logo" />,
}));

describe('GettingStartedWelcome', () => {
  const defaultProps = {
    userName: 'Teeto',
    onStart: vi.fn(),
    onSkip: vi.fn(),
  };

  it('renders welcome heading', () => {
    render(<GettingStartedWelcome {...defaultProps} />);
    expect(screen.getByText('Welcome to Anchor OS.')).toBeInTheDocument();
  });

  it('pre-fills name input with userName', () => {
    render(<GettingStartedWelcome {...defaultProps} />);
    const input = screen.getByDisplayValue('Teeto');
    expect(input).toBeInTheDocument();
  });

  it('allows editing the display name', () => {
    render(<GettingStartedWelcome {...defaultProps} />);
    const input = screen.getByDisplayValue('Teeto');
    fireEvent.change(input, { target: { value: 'Captain' } });
    expect(screen.getByDisplayValue('Captain')).toBeInTheDocument();
  });

  it('calls onStart with edited name on button click', () => {
    const onStart = vi.fn();
    render(<GettingStartedWelcome {...defaultProps} onStart={onStart} />);
    const input = screen.getByDisplayValue('Teeto');
    fireEvent.change(input, { target: { value: 'Captain' } });
    fireEvent.click(screen.getByText("Let's Begin"));
    expect(onStart).toHaveBeenCalledWith('Captain');
  });

  it('falls back to userName if name is cleared', () => {
    const onStart = vi.fn();
    render(<GettingStartedWelcome {...defaultProps} onStart={onStart} />);
    const input = screen.getByDisplayValue('Teeto');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByText("Let's Begin"));
    expect(onStart).toHaveBeenCalledWith('Teeto');
  });

  it('calls onSkip when skip button clicked', () => {
    const onSkip = vi.fn();
    render(<GettingStartedWelcome {...defaultProps} onSkip={onSkip} />);
    fireEvent.click(screen.getByText('Skip for now →'));
    expect(onSkip).toHaveBeenCalled();
  });

  it('shows Anchor logo', () => {
    render(<GettingStartedWelcome {...defaultProps} />);
    expect(screen.getByTestId('anchor-logo')).toBeInTheDocument();
  });
});
