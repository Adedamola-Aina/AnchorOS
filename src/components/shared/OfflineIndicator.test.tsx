// @ts-nocheck
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { OfflineIndicator } from './OfflineIndicator';

describe('OfflineIndicator', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders nothing when online', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it('shows offline banner when offline event fires', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    render(<OfflineIndicator />);
    act(() => { window.dispatchEvent(new Event('offline')); });
    expect(screen.getByText('Offline Mode')).toBeInTheDocument();
  });

  it('shows back online banner when online event fires', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    render(<OfflineIndicator />);
    act(() => { window.dispatchEvent(new Event('offline')); });
    act(() => { window.dispatchEvent(new Event('online')); });
    expect(screen.getByText('Back Online')).toBeInTheDocument();
  });
});
