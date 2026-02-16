// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

const mockMarkAsRead = vi.fn();
vi.mock('../../hooks/useAccountNotifications', () => ({
  useAccountNotifications: () => ({
    notifications: mockNotifications,
    markAsRead: mockMarkAsRead,
  }),
}));
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    profile: { notificationPreferences: { enabled: false } },
  }),
}));
vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: vi.fn() }),
}));

let mockNotifications: any[] = [];

import { NotificationBanner } from './NotificationBanner';

describe('NotificationBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNotifications = [];
  });

  it('returns null when no unread notifications', () => {
    mockNotifications = [{ id: '1', read: true, date: new Date().toISOString(), actorName: 'Sarah', message: 'test' }];
    const { container } = render(<NotificationBanner accountId="a1" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a single notification', () => {
    mockNotifications = [{
      id: '1', read: false, date: new Date().toISOString(),
      actorName: 'Sarah', message: 'Added ₦5,000',
    }];
    render(<NotificationBanner accountId="a1" />);
    expect(screen.getByText('Sarah:')).toBeInTheDocument();
    expect(screen.getByText('Added ₦5,000')).toBeInTheDocument();
  });

  it('groups notifications by actor and day', () => {
    const today = new Date().toISOString();
    mockNotifications = [
      { id: '1', read: false, date: today, actorName: 'Sarah', message: 'Tx 1' },
      { id: '2', read: false, date: today, actorName: 'Sarah', message: 'Tx 2' },
      { id: '3', read: false, date: today, actorName: 'Sarah', message: 'Tx 3' },
    ];
    render(<NotificationBanner accountId="a1" />);
    expect(screen.getByText(/added 3 transactions today/i)).toBeInTheDocument();
  });

  it('dismiss button calls markAsRead for group', () => {
    mockNotifications = [{
      id: 'n1', read: false, date: new Date().toISOString(),
      actorName: 'Sarah', message: 'test',
    }];
    render(<NotificationBanner accountId="a1" />);
    fireEvent.click(screen.getByTitle('Dismiss'));
    expect(mockMarkAsRead).toHaveBeenCalledWith('n1');
  });

  it('shows overflow message when more than 4 groups', () => {
    const today = new Date().toISOString();
    mockNotifications = [];
    // Create 5 groups (different actors)
    for (let i = 0; i < 5; i++) {
      mockNotifications.push({
        id: `n${i}`, read: false, date: today,
        actorName: `User${i}`, message: `Msg ${i}`,
      });
    }
    render(<NotificationBanner accountId="a1" />);
    expect(screen.getByText(/more notifications sent to your email/i)).toBeInTheDocument();
  });
});
