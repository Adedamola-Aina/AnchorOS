/**
 * Tests for useTaskReminders — interval-based reminder system
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaskReminders } from './useTaskReminders';
import { buildTask } from '../test/factories';

// Mock NotificationContext
const mockShowToast = vi.fn();
vi.mock('../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: mockShowToast }),
}));

describe('useTaskReminders', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();

        // Mock Notification API
        Object.defineProperty(window, 'Notification', {
            value: vi.fn(),
            writable: true,
            configurable: true,
        });
        Object.defineProperty(window.Notification, 'permission', {
            get: () => 'granted',
            configurable: true,
        });
        (window.Notification as any).requestPermission = vi.fn(() => Promise.resolve('granted'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows toast when reminder time matches current time', () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        const tasks = [buildTask({ reminderTime: currentTime, completed: false })];

        renderHook(() => useTaskReminders(tasks));

        // Initial check should fire
        expect(mockShowToast).toHaveBeenCalledWith(
            expect.stringContaining('Reminder'),
            'info'
        );
    });

    it('creates browser Notification when permission granted', () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        const tasks = [buildTask({ reminderTime: currentTime, completed: false, title: 'Workout' })];

        renderHook(() => useTaskReminders(tasks));

        expect(window.Notification).toHaveBeenCalledWith(
            'Anchor: Workout',
            expect.objectContaining({ body: expect.stringContaining('Workout') })
        );
    });

    it('skips completed tasks', () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const tasks = [buildTask({ reminderTime: `${hours}:${minutes}`, completed: true })];

        renderHook(() => useTaskReminders(tasks));

        expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('skips tasks without reminderTime', () => {
        const tasks = [buildTask({ reminderTime: undefined })];

        renderHook(() => useTaskReminders(tasks));

        expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('does not notify twice for same task on same day', () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        const tasks = [buildTask({ reminderTime: currentTime, completed: false })];

        renderHook(() => useTaskReminders(tasks));

        // First call triggers
        expect(mockShowToast).toHaveBeenCalledOnce();

        // Advance one interval (60s)
        vi.advanceTimersByTime(60000);

        // Should not fire again
        expect(mockShowToast).toHaveBeenCalledOnce();
    });

    it('does not notify for non-matching times', () => {
        const tasks = [buildTask({ reminderTime: '23:59', completed: false })];

        // Set time to something != 23:59
        vi.setSystemTime(new Date(2026, 1, 8, 12, 0, 0));

        renderHook(() => useTaskReminders(tasks));

        expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('requests notification permission if default', () => {
        Object.defineProperty(window.Notification, 'permission', {
            get: () => 'default',
            configurable: true,
        });

        renderHook(() => useTaskReminders([]));

        expect(window.Notification.requestPermission).toHaveBeenCalled();
    });

    it('sets up interval and cleans up on unmount', () => {
        const clearSpy = vi.spyOn(global, 'clearInterval');

        const { unmount } = renderHook(() => useTaskReminders([]));
        unmount();

        expect(clearSpy).toHaveBeenCalled();
    });
});
