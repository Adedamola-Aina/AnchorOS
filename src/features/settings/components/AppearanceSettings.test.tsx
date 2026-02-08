import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AppearanceSettings } from './AppearanceSettings';

vi.mock('../../../components/shared', () => ({
  ThemeToggle: ({ theme, onSetTheme }: { theme: string; onSetTheme: (t: string) => void }) => (
    <button data-testid="theme-toggle" onClick={() => onSetTheme('dark')}>{theme}</button>
  ),
}));

vi.mock('./AccessibilityControls', () => ({
  AccessibilityControls: () => <div data-testid="accessibility-controls" />,
}));

describe('AppearanceSettings', () => {
  it('renders with light theme', () => {
    render(<AppearanceSettings theme="light" onSetTheme={vi.fn()} />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Visual Theme')).toBeInTheDocument();
  });

  it('renders with dark theme', () => {
    render(<AppearanceSettings theme="dark" onSetTheme={vi.fn()} />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('renders with system theme', () => {
    render(<AppearanceSettings theme="system" onSetTheme={vi.fn()} />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('renders accessibility controls when handler provided', () => {
    render(<AppearanceSettings theme="light" onSetTheme={vi.fn()} onUpdateAccessibility={vi.fn()} />);
    expect(screen.getByTestId('accessibility-controls')).toBeInTheDocument();
  });

  it('hides accessibility controls without handler', () => {
    render(<AppearanceSettings theme="light" onSetTheme={vi.fn()} />);
    expect(screen.queryByTestId('accessibility-controls')).not.toBeInTheDocument();
  });
});
