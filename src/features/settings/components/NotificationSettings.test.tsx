import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotificationSettings } from './NotificationSettings';

// Mock child components to isolate this test
vi.mock('./NotificationCategoryToggles', () => ({
  NotificationCategoryToggles: ({ categories: _categories, onToggle }: any) => (
    <div data-testid="category-toggles">
      <button onClick={() => onToggle('finance', false)}>toggle-finance</button>
    </div>
  ),
}));

vi.mock('./QuietHoursSettings', () => ({
  QuietHoursSettings: ({ preferences: _preferences, onUpdate }: any) => (
    <div data-testid="quiet-hours">
      <button onClick={() => onUpdate({ enabled: true })}>toggle-quiet</button>
    </div>
  ),
}));

vi.mock('../../../components/shared', () => ({
  ToggleSwitch: ({ enabled, onToggle, disabled, label }: any) => (
    <button
      data-testid={`toggle-${label?.replace(/\s+/g, '-')}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={enabled}
    >
      {enabled ? 'ON' : 'OFF'}
    </button>
  ),
}));

const defaultProps = {
  emailEnabled: false,
  email: '',
  frequency: 'daily' as const,
  userEmail: 'test@test.com',
  emailVerified: true,
  onUpdatePreferences: vi.fn(),
  pushPermissionStatus: 'default' as NotificationPermission,
  requestPushPermission: vi.fn(),
};

describe('NotificationSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Notifications header', () => {
    render(<NotificationSettings {...defaultProps} />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('shows push notification toggle', () => {
    render(<NotificationSettings {...defaultProps} />);
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
  });

  it('shows ON badge when push is granted', () => {
    render(<NotificationSettings {...defaultProps} pushPermissionStatus="granted" />);
    // The span with the ON badge (not the toggle button text)
    const onBadges = screen.getAllByText('ON');
    expect(onBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows BLOCKED badge when push is denied', () => {
    render(<NotificationSettings {...defaultProps} pushPermissionStatus="denied" />);
    expect(screen.getByText('BLOCKED')).toBeInTheDocument();
  });

  it('calls requestPushPermission when push toggle clicked', () => {
    render(<NotificationSettings {...defaultProps} />);
    fireEvent.click(screen.getByTestId('toggle-Toggle-push-notifications'));
    expect(defaultProps.requestPushPermission).toHaveBeenCalled();
  });

  it('toggles email notifications', () => {
    render(<NotificationSettings {...defaultProps} />);
    fireEvent.click(screen.getByTestId('toggle-Toggle-email-notifications'));
    expect(defaultProps.onUpdatePreferences).toHaveBeenCalledWith({ enabled: true });
  });

  it('shows email input when emailEnabled is true', () => {
    render(<NotificationSettings {...defaultProps} emailEnabled={true} />);
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
  });

  it('does not show email input when emailEnabled is false', () => {
    render(<NotificationSettings {...defaultProps} emailEnabled={false} />);
    expect(screen.queryByDisplayValue('test@test.com')).not.toBeInTheDocument();
  });

  it('shows unverified email warning', () => {
    render(
      <NotificationSettings
        {...defaultProps}
        emailEnabled={true}
        emailVerified={false}
      />
    );
    expect(screen.getByText(/Email not verified/)).toBeInTheDocument();
  });

  it('renders frequency buttons when email enabled', () => {
    render(<NotificationSettings {...defaultProps} emailEnabled={true} />);
    expect(screen.getByText('instant')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
    expect(screen.getByText('weekly')).toBeInTheDocument();
  });

  it('calls onUpdatePreferences when frequency changed', () => {
    render(<NotificationSettings {...defaultProps} emailEnabled={true} />);
    fireEvent.click(screen.getByText('instant'));
    expect(defaultProps.onUpdatePreferences).toHaveBeenCalledWith({ frequency: 'instant' });
  });

  it('calls onUpdatePreferences when email changed', () => {
    render(<NotificationSettings {...defaultProps} emailEnabled={true} />);
    const input = screen.getByDisplayValue('test@test.com');
    fireEvent.change(input, { target: { value: 'new@email.com' } });
    expect(defaultProps.onUpdatePreferences).toHaveBeenCalledWith({ email: 'new@email.com' });
  });

  it('renders category toggles', () => {
    render(<NotificationSettings {...defaultProps} />);
    expect(screen.getByTestId('category-toggles')).toBeInTheDocument();
  });

  it('renders quiet hours settings', () => {
    render(<NotificationSettings {...defaultProps} />);
    expect(screen.getByTestId('quiet-hours')).toBeInTheDocument();
  });

  it('passes category toggle callbacks', () => {
    render(<NotificationSettings {...defaultProps} />);
    fireEvent.click(screen.getByText('toggle-finance'));
    expect(defaultProps.onUpdatePreferences).toHaveBeenCalledWith({
      categories: expect.objectContaining({ finance: false }),
    });
  });

  it('passes quiet hours update callback', () => {
    render(<NotificationSettings {...defaultProps} />);
    fireEvent.click(screen.getByText('toggle-quiet'));
    expect(defaultProps.onUpdatePreferences).toHaveBeenCalledWith({
      quietHours: expect.objectContaining({ enabled: true }),
    });
  });
});
