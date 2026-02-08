import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ToggleSwitch } from './ToggleSwitch';

describe('ToggleSwitch', () => {
  it('renders as switch with checked state', () => {
    render(<ToggleSwitch enabled={true} onToggle={vi.fn()} label="Test toggle" />);
    const btn = screen.getByRole('switch');
    expect(btn).toHaveAttribute('aria-checked', 'true');
    expect(btn).toHaveAttribute('aria-label', 'Test toggle');
  });

  it('renders unchecked state', () => {
    render(<ToggleSwitch enabled={false} onToggle={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<ToggleSwitch enabled={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('disables when disabled prop set', () => {
    render(<ToggleSwitch enabled={false} onToggle={vi.fn()} disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
