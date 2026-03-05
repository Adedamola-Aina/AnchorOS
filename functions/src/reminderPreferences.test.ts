import { describe, expect, it } from 'vitest';
import {
    isWithinQuietHours,
    shouldSendCommitmentReminder,
    shouldSendReminderForCategory,
} from './reminderPreferences';

describe('reminderPreferences', () => {
    describe('isWithinQuietHours', () => {
        it('returns true when current time is inside same-day quiet window', () => {
            expect(isWithinQuietHours('22:30', '22:00', '23:00')).toBe(true);
            expect(isWithinQuietHours('21:59', '22:00', '23:00')).toBe(false);
        });

        it('handles overnight quiet windows', () => {
            expect(isWithinQuietHours('23:30', '22:00', '07:00')).toBe(true);
            expect(isWithinQuietHours('06:30', '22:00', '07:00')).toBe(true);
            expect(isWithinQuietHours('14:00', '22:00', '07:00')).toBe(false);
        });
    });

    describe('shouldSendCommitmentReminder', () => {
        it('defaults to true when preferences are missing', () => {
            expect(shouldSendCommitmentReminder(undefined, '10:00')).toBe(true);
        });

        it('returns false when notifications are globally disabled', () => {
            expect(shouldSendCommitmentReminder({ enabled: false }, '10:00')).toBe(false);
        });

        it('returns false when commitments category is disabled', () => {
            expect(shouldSendCommitmentReminder({
                enabled: true,
                categories: { commitments: false },
            }, '10:00')).toBe(false);
        });

        it('returns false during quiet hours', () => {
            expect(shouldSendCommitmentReminder({
                enabled: true,
                categories: { commitments: true },
                quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
            }, '23:30')).toBe(false);
        });

        it('returns true when enabled, category enabled, and outside quiet hours', () => {
            expect(shouldSendCommitmentReminder({
                enabled: true,
                categories: { commitments: true },
                quietHours: { enabled: true, startTime: '22:00', endTime: '07:00' },
            }, '14:00')).toBe(true);
        });

        it('supports category-aware checks for family notifications', () => {
            const canSendFamily = shouldSendReminderForCategory(
                {
                    enabled: true,
                    categories: { family: true, commitments: false },
                },
                'family',
                '10:00',
            );

            expect(canSendFamily).toBe(true);
        });

        it('blocks when the selected category is disabled', () => {
            const canSendFinance = shouldSendReminderForCategory(
                {
                    enabled: true,
                    categories: { finance: false },
                },
                'finance',
                '10:00',
            );

            expect(canSendFinance).toBe(false);
        });
    });
});
