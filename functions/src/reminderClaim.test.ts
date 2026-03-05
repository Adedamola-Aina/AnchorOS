import { describe, expect, it } from 'vitest';
import {
    buildClaimExpiryDate,
    buildReminderClaimId,
    canClaimReminderSlot,
} from './reminderClaim';

describe('reminderClaim', () => {
    it('builds stable claim IDs for same user and key', () => {
        const idA = buildReminderClaimId('user-1', '2026-03-05|08:30|Walk');
        const idB = buildReminderClaimId('user-1', '2026-03-05|08:30|Walk');

        expect(idA).toBe(idB);
    });

    it('returns false when another run still owns an active lease', () => {
        const allowed = canClaimReminderSlot({
            existingRunId: 'run-a',
            existingLeaseUntilMs: Date.parse('2026-03-05T08:35:00.000Z'),
            nowMs: Date.parse('2026-03-05T08:34:00.000Z'),
            nextRunId: 'run-b',
        });

        expect(allowed).toBe(false);
    });

    it('returns true when lease expired', () => {
        const allowed = canClaimReminderSlot({
            existingRunId: 'run-a',
            existingLeaseUntilMs: Date.parse('2026-03-05T08:30:00.000Z'),
            nowMs: Date.parse('2026-03-05T08:34:00.000Z'),
            nextRunId: 'run-b',
        });

        expect(allowed).toBe(true);
    });

    it('returns true when same run reclaims current lease', () => {
        const allowed = canClaimReminderSlot({
            existingRunId: 'run-a',
            existingLeaseUntilMs: Date.parse('2026-03-05T08:35:00.000Z'),
            nowMs: Date.parse('2026-03-05T08:34:00.000Z'),
            nextRunId: 'run-a',
        });

        expect(allowed).toBe(true);
    });

    it('builds expiry date using TTL offset', () => {
        const expiresAt = buildClaimExpiryDate({
            nowMs: Date.parse('2026-03-05T10:00:00.000Z'),
            ttlMs: 60 * 1000,
        });

        expect(expiresAt.toISOString()).toBe('2026-03-05T10:01:00.000Z');
    });
});
