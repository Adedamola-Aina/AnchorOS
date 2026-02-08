import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QuietHoursSettings, type QuietHoursPreferences } from './QuietHoursSettings';

vi.mock('../../../components/shared', () => ({
  ToggleSwitch: ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <button role="switch" aria-checked={enabled} aria-label={label} onClick={onToggle} data-testid="toggle">
      {enabled ? 'ON' : 'OFF'}
    </button>
  ),
}));

describe('QuietHoursSettings', () => {
  const defaultPrefs: QuietHoursPreferences = { enabled: false, startTime: '22:00', endTime: '07:00' };
  const onUpdate = vi.fn();

  it('renders quiet hours title and description', () => {
    render(<QuietHoursSettings preferences={defaultPrefs} onUpdate={onUpdate} />);
    expect(screen.getByText('Quiet Hours')).toBeInTheDocument();
    expect(screen.getByText(/suppress push notifications/i)).toBeInTheDocument();
  });

  it('toggles enabled state', () => {
    render(<QuietHoursSettings preferences={defaultPrefs} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId('toggle'));
    expect(onUpdate).toHaveBeenCalledWith({ enabled: true });
  });

  it('hides time inputs when disabled', () => {
    render(<QuietHoursSettings preferences={defaultPrefs} onUpdate={onUpdate} />);
    expect(screen.queryByText('From')).not.toBeInTheDocument();
  });

  it('shows time inputs when enabled', () => {
    render(<QuietHoursSettings preferences={{ ...defaultPrefs, enabled: true }} onUpdate={onUpdate} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('Until')).toBeInTheDocument();
  });

  it('updates start time', () => {
    render(<QuietHoursSettings preferences={{ ...defaultPrefs, enabled: true }} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByDisplayValue('22:00'), { target: { value: '23:00' } });
    expect(onUpdate).toHaveBeenCalledWith({ startTime: '23:00' });
  });

  it('updates end time', () => {
    render(<QuietHoursSettings preferences={{ ...defaultPrefs, enabled: true }} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByDisplayValue('07:00'), { target: { value: '08:00' } });
    expect(onUpdate).toHaveBeenCalledWith({ endTime: '08:00' });
  });
});
