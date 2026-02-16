// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotificationCategoryToggles, type CategoryPreferences } from './NotificationCategoryToggles';

vi.mock('../../../components/shared', () => ({
  ToggleSwitch: ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <button role="switch" aria-checked={enabled} aria-label={label} onClick={onToggle}>{enabled ? 'ON' : 'OFF'}</button>
  ),
}));

describe('NotificationCategoryToggles', () => {
  const cats: CategoryPreferences = { finance: true, commitments: false, family: true };

  it('renders all 3 categories', () => {
    render(<NotificationCategoryToggles categories={cats} onToggle={vi.fn()} />);
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Commitments')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('toggles a category', () => {
    const onToggle = vi.fn();
    render(<NotificationCategoryToggles categories={cats} onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText('Toggle Commitments notifications'));
    expect(onToggle).toHaveBeenCalledWith('commitments', true);
  });
});
