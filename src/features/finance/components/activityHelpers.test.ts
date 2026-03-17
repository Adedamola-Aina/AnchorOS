// @ts-nocheck
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    Activity,
    Pencil,
    PlusCircle,
    Trash2,
    Type,
    UserMinus,
    UserPlus,
} from 'lucide-react';
import { formatRelativeTime, getActivityIcon } from './activityHelpers';

describe('activityHelpers', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-16T12:00:00.000Z'));
    });

    it('formats relative time for immediate, minute, hour, and day windows', () => {
        expect(formatRelativeTime('2026-03-16T11:59:45.000Z')).toBe('Just now');
        expect(formatRelativeTime('2026-03-16T11:30:00.000Z')).toBe('30m ago');
        expect(formatRelativeTime('2026-03-16T09:00:00.000Z')).toBe('3h ago');
        expect(formatRelativeTime('2026-03-14T12:00:00.000Z')).toBe('2d ago');
    });

    it('falls back to locale date format for older activity', () => {
        const value = formatRelativeTime('2026-03-01T12:00:00.000Z');
        expect(value).toMatch(/Mar|3\/?1|1\/?3/i);
    });

    it('returns action-specific icons and defaults unknown actions to Activity icon', () => {
        expect(getActivityIcon('transaction_added').type).toBe(PlusCircle);
        expect(getActivityIcon('transaction_edited').type).toBe(Pencil);
        expect(getActivityIcon('transaction_deleted').type).toBe(Trash2);
        expect(getActivityIcon('account_renamed').type).toBe(Type);
        expect(getActivityIcon('account_shared').type).toBe(UserPlus);
        expect(getActivityIcon('account_unshared').type).toBe(UserMinus);
        expect(getActivityIcon('unknown_action' as never).type).toBe(Activity);
    });

    it('uses shared icon class size for rendered icon elements', () => {
        const icon = getActivityIcon('transaction_added');
        const element = React.createElement(icon.type, icon.props);
        expect(element.props.className).toContain('w-4 h-4');
    });
});