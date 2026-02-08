import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('bg-slate-900');
  });

  it('renders secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText('Secondary');
    expect(badge).toHaveClass('bg-slate-100');
  });

  it('renders destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-rose-500');
  });

  it('renders outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).not.toHaveClass('bg-slate-900');
  });

  it('renders success variant', () => {
    render(<Badge variant="success">OK</Badge>);
    const badge = screen.getByText('OK');
    expect(badge).toHaveClass('bg-emerald-500');
  });

  it('renders warning variant', () => {
    render(<Badge variant="warning">Warn</Badge>);
    const badge = screen.getByText('Warn');
    expect(badge).toHaveClass('bg-amber-500');
  });

  it('accepts custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('rounded-full');
  });

  it('passes additional HTML attributes', () => {
    render(<Badge data-testid="test-badge">Test</Badge>);
    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });
});
