// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccessibilityControls, type AccessibilityPreferences } from './AccessibilityControls';

vi.mock('../../../components/shared', () => ({
  ToggleSwitch: ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <button role="switch" aria-checked={enabled} aria-label={label} onClick={onToggle}>{enabled ? 'ON' : 'OFF'}</button>
  ),
}));

describe('AccessibilityControls', () => {
  const prefs: AccessibilityPreferences = { fontSize: 'default', highContrast: false, reducedMotion: false };
  const onUpdate = vi.fn();

  it('renders all controls', () => {
    render(<AccessibilityControls preferences={prefs} onUpdate={onUpdate} />);
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Font Size')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
  });

  it('renders font size buttons', () => {
    render(<AccessibilityControls preferences={prefs} onUpdate={onUpdate} />);
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('Extra Large')).toBeInTheDocument();
  });

  it('changes font size', () => {
    render(<AccessibilityControls preferences={prefs} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText('Large'));
    expect(onUpdate).toHaveBeenCalledWith({ fontSize: 'large' });
  });

  it('toggles high contrast', () => {
    render(<AccessibilityControls preferences={prefs} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByLabelText('Toggle high contrast'));
    expect(onUpdate).toHaveBeenCalledWith({ highContrast: true });
  });

  it('toggles reduced motion', () => {
    render(<AccessibilityControls preferences={prefs} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByLabelText('Toggle reduced motion'));
    expect(onUpdate).toHaveBeenCalledWith({ reducedMotion: true });
  });
});
