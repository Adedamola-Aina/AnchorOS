// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

import { AppProvider, useApp } from './AnchorContext';

// Test consumer component
const TestConsumer = () => {
  const { activeTab, navigateTo } = useApp();
  return (
    <div>
      <span data-testid="tab">{activeTab}</span>
      <button onClick={() => navigateTo('finance')}>Go Finance</button>
      <button onClick={() => navigateTo('settings', { section: 'security' })}>Go Settings</button>
    </div>
  );
};

describe('AnchorContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('provides default dashboard tab', () => {
    render(
      <AppProvider><TestConsumer /></AppProvider>
    );
    expect(screen.getByTestId('tab').textContent).toBe('dashboard');
  });

  it('reads saved tab from localStorage', () => {
    localStorage.setItem('anchor_active_tab', 'finance');
    render(
      <AppProvider><TestConsumer /></AppProvider>
    );
    expect(screen.getByTestId('tab').textContent).toBe('finance');
  });

  it('navigateTo updates tab and calls navigate', async () => {
    const { getByText } = render(
      <AppProvider><TestConsumer /></AppProvider>
    );
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(getByText('Go Finance'));
    expect(mockNavigate).toHaveBeenCalledWith('/finance');
    expect(localStorage.getItem('anchor_active_tab')).toBe('finance');
  });

  it('navigateTo appends query params', async () => {
    const { getByText } = render(
      <AppProvider><TestConsumer /></AppProvider>
    );
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(getByText('Go Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings?section=security');
  });

  it('throws when useApp used outside provider', () => {
    const Bad = () => { useApp(); return null; };
    expect(() => render(<Bad />)).toThrow('useApp must be used within AppProvider');
  });
});
