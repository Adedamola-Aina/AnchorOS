import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AnchorAISettings } from './AnchorAISettings';

vi.mock('../../../components/shared', () => ({
  ToggleSwitch: ({ enabled, onToggle, disabled, label }: { enabled: boolean; onToggle: () => void; disabled?: boolean; label?: string }) => (
    <button
      type="button"
      data-testid="anchor-ai-toggle"
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
    >
      {enabled ? 'ON' : 'OFF'}
    </button>
  ),
}));

const getDocument = vi.fn();
const setDocument = vi.fn();

vi.mock('../../../utils/secureDb', () => ({
  secureDb: {
    getDocument: (...args: unknown[]) => getDocument(...args),
    setDocument: (...args: unknown[]) => setDocument(...args),
  },
}));

describe('AnchorAISettings', () => {
  const showToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getDocument.mockResolvedValue({
      enabled: false,
      dataCollectionEnabled: false,
    });
    setDocument.mockResolvedValue(undefined);
  });

  const renderSettings = () => render(
    <MemoryRouter>
      <AnchorAISettings userId="user-1" showToast={showToast} />
    </MemoryRouter>
  );

  it('loads and renders persisted toggle state', async () => {
    renderSettings();

    await waitFor(() => {
      expect(getDocument).toHaveBeenCalledWith('user-1', ['fabric_settings', 'state']);
    });

    expect(screen.getByText('Anchor AI')).toBeInTheDocument();
    expect(screen.getByText('OFF')).toBeInTheDocument();
  });

  it('persists enable toggle when clicked', async () => {
    renderSettings();

    await waitFor(() => {
      expect(screen.getByTestId('anchor-ai-toggle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('anchor-ai-toggle'));

    await waitFor(() => {
      expect(setDocument).toHaveBeenCalledWith(
        'user-1',
        ['fabric_settings', 'state'],
        expect.objectContaining({
          enabled: true,
          dataCollectionEnabled: true,
        })
      );
    });
  });

  it('clears fabric behavior data when requested', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderSettings();

    fireEvent.click(await screen.findByRole('button', { name: 'Clear Anchor AI Data' }));

    await waitFor(() => {
      expect(setDocument).toHaveBeenCalledWith(
        'user-1',
        ['fabric_behavior', 'state'],
        expect.objectContaining({
          patterns: [],
          confirmedPatterns: [],
          recentActions: [],
          dismissedPatterns: [],
        })
      );
    });

    expect(confirmSpy).toHaveBeenCalled();
  });
});
