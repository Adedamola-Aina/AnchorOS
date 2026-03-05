import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportAccountCsv } from './accountExport';

describe('exportAccountCsv', () => {
    let mockAnchor: { href: string; download: string; click: ReturnType<typeof vi.fn> };
    let lastBlobContent: string;
    const OrigBlob = globalThis.Blob;

    beforeEach(() => {
        lastBlobContent = '';
        globalThis.Blob = class extends OrigBlob {
            constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
                super(parts, options);
                lastBlobContent = typeof parts?.[0] === 'string' ? parts[0] : '';
            }
        } as typeof Blob;

        mockAnchor = { href: '', download: '', click: vi.fn() };
        vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);
        vi.spyOn(document.body, 'appendChild').mockImplementation((n) => n);
        vi.spyOn(document.body, 'removeChild').mockImplementation((n) => n);
        globalThis.URL.createObjectURL = vi.fn(() => 'blob:fake');
        globalThis.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        globalThis.Blob = OrigBlob;
        vi.restoreAllMocks();
    });

    it('generates CSV with headers for transactions', () => {
        const transactions = [{
            id: 'tx-1', title: 'Coffee', amountCents: 450, type: 'expense' as const,
            category: 'Food', date: '2026-03-01', accountId: 'acc-1',
        }];

        exportAccountCsv('My Checking', transactions, 'USD');

        expect(lastBlobContent).toContain('Date,Title,Category,Type,Amount');
        expect(lastBlobContent).toContain('2026-03-01,Coffee,Food,expense,4.50');
    });

    it('formats amount as currency with 2 decimal places', () => {
        const transactions = [{
            id: 'tx-1', title: 'Salary', amountCents: 500000, type: 'income' as const,
            category: 'Work', date: '2026-03-01', accountId: 'acc-1',
        }];

        exportAccountCsv('Savings', transactions, 'NGN');
        expect(lastBlobContent).toContain('5000.00');
        expect(lastBlobContent).toContain('NGN');
    });

    it('escapes commas and quotes in CSV cells', () => {
        const transactions = [{
            id: 'tx-1', title: 'Coffee, Tea & "Snacks"', amountCents: 1200,
            type: 'expense' as const, category: 'Food', date: '2026-03-01', accountId: 'acc-1',
        }];

        exportAccountCsv('Test', transactions, 'USD');
        expect(lastBlobContent).toContain('"Coffee, Tea & ""Snacks"""');
    });

    it('sets download filename with account name and date', () => {
        exportAccountCsv('Savings Account', [], 'USD');
        expect(mockAnchor.download).toMatch(/^anchor-Savings Account-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('handles empty transaction list', () => {
        exportAccountCsv('Empty', [], 'USD');
        expect(lastBlobContent).toContain('Date,Title,Category,Type,Amount,Currency');
        expect(mockAnchor.click).toHaveBeenCalled();
    });

    it('triggers download and cleans up blob URL', () => {
        exportAccountCsv('Test', [], 'USD');
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake');
    });
});
