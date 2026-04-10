import { describe, it, expect } from 'vitest';
import { buildTransactionPageConstraints, sliceTransactionPage } from './financePagination';
import { startAfter, limit, orderBy, where, documentId } from '../utils/secureDb';

describe('financePagination', () => {
    it('builds base constraints without cursor', () => {
        const constraints = buildTransactionPageConstraints('2026-04-01', '2026-04-30', 50);

        expect(constraints).toHaveLength(5);
        expect(where).toHaveBeenCalledWith('date', '>=', '2026-04-01');
        expect(where).toHaveBeenCalledWith('date', '<=', '2026-04-30');
        expect(orderBy).toHaveBeenCalledWith('date', 'desc');
        expect(documentId).toHaveBeenCalled();
        expect(limit).toHaveBeenCalledWith(51);
        expect(startAfter).not.toHaveBeenCalled();
    });

    it('adds startAfter constraints when cursor is provided', () => {
        buildTransactionPageConstraints('2026-04-01', '2026-04-30', 25, {
            date: '2026-04-18',
            id: 'tx-099'
        });

        expect(startAfter).toHaveBeenCalledWith('2026-04-18', 'tx-099');
        expect(limit).toHaveBeenCalledWith(26);
    });

    it('slices one extra row and returns next cursor', () => {
        const rows = [
            { id: 'tx-3', date: '2026-04-03' },
            { id: 'tx-2', date: '2026-04-02' },
            { id: 'tx-1', date: '2026-04-01' }
        ];

        const page = sliceTransactionPage(rows, 2);
        expect(page.page.map(item => item.id)).toEqual(['tx-3', 'tx-2']);
        expect(page.hasMore).toBe(true);
        expect(page.nextCursor).toEqual({ date: '2026-04-02', id: 'tx-2' });
    });

    it('returns null cursor for empty page', () => {
        const page = sliceTransactionPage([], 20);
        expect(page.page).toEqual([]);
        expect(page.hasMore).toBe(false);
        expect(page.nextCursor).toBeNull();
    });

    it('returns null cursor when final item has no date', () => {
        const page = sliceTransactionPage([{ id: 'tx-1' }], 20);
        expect(page.hasMore).toBe(false);
        expect(page.nextCursor).toBeNull();
    });
});
