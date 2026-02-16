/**
 * Tests for csvExport.ts — downloadCsv, escapeCell, toCsv
 * Target: 95%+ coverage, high mutation kill rate
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadCsv } from './csvExport';

/**
 * Capture the raw string content passed to `new Blob([content])`.
 * happy-dom's Blob doesn't support `.text()`, so we intercept the constructor.
 */
let lastBlobContent = '';
const OrigBlob = globalThis.Blob;

describe('downloadCsv', () => {
    let mockAnchor: HTMLAnchorElement;
    let createObjectURLSpy: ReturnType<typeof vi.fn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        lastBlobContent = '';
        // Override Blob to capture content
        globalThis.Blob = class extends OrigBlob {
            constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
                super(parts, options);
                lastBlobContent = typeof parts?.[0] === 'string' ? parts[0] : '';
            }
        } as typeof Blob;

        mockAnchor = {
            href: '',
            download: '',
            click: vi.fn(),
        } as unknown as HTMLAnchorElement;

        vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
        vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
        vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
        createObjectURLSpy = vi.fn(() => 'blob:http://localhost/fake');
        revokeObjectURLSpy = vi.fn();
        globalThis.URL.createObjectURL = createObjectURLSpy;
        globalThis.URL.revokeObjectURL = revokeObjectURLSpy;
    });

    afterEach(() => {
        globalThis.Blob = OrigBlob;
    });

    // ── Empty data ──────────────────────────────────────────────────
    it('creates a download even when all sections are empty', () => {
        downloadCsv({ accounts: [], transactions: [], commitments: [] });
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    // ── Section assembly ────────────────────────────────────────────
    it('includes only non-empty sections', () => {
        let capturedBlob: Blob | null = null;
        globalThis.URL.createObjectURL = vi.fn((blob: Blob) => {
            capturedBlob = blob;
            return 'blob:test';
        });

        downloadCsv({
            accounts: [{ name: 'Checking', balance: 5000 }],
            transactions: [],
            commitments: [{ title: 'Run', done: true }],
        });

        expect(mockAnchor.click).toHaveBeenCalled();
        expect(capturedBlob).toBeInstanceOf(Blob);
        expect(capturedBlob!.type).toBe('text/csv;charset=utf-8');
        expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
        expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
    });

    // ── Download filename ───────────────────────────────────────────
    it('generates filename with current date', () => {
        downloadCsv({ accounts: [{ id: '1' }], transactions: [], commitments: [] });
        const today = new Date().toISOString().split('T')[0];
        expect(mockAnchor.download).toBe(`anchor-data-${today}.csv`);
    });

    // ── Full lifecycle ──────────────────────────────────────────────
    it('creates element, clicks, cleans up, and revokes URL', () => {
        downloadCsv({ accounts: [{ id: '1' }], transactions: [], commitments: [] });

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(mockAnchor.href).toBe('blob:http://localhost/fake');
        expect(mockAnchor.click).toHaveBeenCalledOnce();
        expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://localhost/fake');
    });

    // ── CSV escaping (tested through downloadCsv) ───────────────────
    it('escapes values containing commas', () => {
        // We verify the blob is created — the internal escapeCell handles commas
        downloadCsv({
            accounts: [{ name: 'Main, Backup' }],
            transactions: [],
            commitments: [],
        });
        expect(createObjectURLSpy).toHaveBeenCalled();
        const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
        expect(blob).toBeInstanceOf(Blob);
        expect(blob.type).toBe('text/csv;charset=utf-8');
    });

    it('handles object values in cells', () => {
        downloadCsv({
            accounts: [{ meta: { nested: true } }],
            transactions: [],
            commitments: [],
        });
        expect(mockAnchor.click).toHaveBeenCalled();
    });

    it('handles null/undefined values in cells', () => {
        downloadCsv({
            accounts: [{ name: null, other: undefined }],
            transactions: [],
            commitments: [],
        });
        expect(mockAnchor.click).toHaveBeenCalled();
    });

    it('handles values containing double quotes', () => {
        downloadCsv({
            accounts: [{ name: 'Account "A"' }],
            transactions: [],
            commitments: [],
        });
        expect(mockAnchor.click).toHaveBeenCalled();
    });

    it('handles values containing newlines', () => {
        downloadCsv({
            accounts: [{ note: 'line1\nline2' }],
            transactions: [],
            commitments: [],
        });
        expect(mockAnchor.click).toHaveBeenCalled();
    });

    // ── All three sections ──────────────────────────────────────────
    it('includes all three sections when all have data', () => {
        downloadCsv({
            accounts: [{ name: 'A' }],
            transactions: [{ title: 'T' }],
            commitments: [{ title: 'C' }],
        });
        expect(mockAnchor.click).toHaveBeenCalledOnce();
    });

    // ── CSV content verification ────────────────────────────────────
    it('generates correct CSV headers and rows', () => {
        downloadCsv({
            accounts: [{ name: 'Savings', balance: 5000 }],
            transactions: [],
            commitments: [],
        });

        expect(lastBlobContent).toContain('# Accounts');
        expect(lastBlobContent).toContain('name,balance');
        expect(lastBlobContent).toContain('Savings,5000');
    });

    it('separates sections with double newlines', () => {
        downloadCsv({
            accounts: [{ id: '1' }],
            transactions: [{ id: '2' }],
            commitments: [{ id: '3' }],
        });

        expect(lastBlobContent).toContain('# Accounts');
        expect(lastBlobContent).toContain('# Transactions');
        expect(lastBlobContent).toContain('# Commitments');
        // Sections are separated by double newline
        const sections = lastBlobContent.split('\n\n');
        expect(sections.length).toBe(3);
    });

    it('escapes commas in CSV cell values', () => {
        downloadCsv({
            accounts: [{ name: 'Main, Backup', amount: 100 }],
            transactions: [],
            commitments: [],
        });

        // Comma in value should be wrapped in quotes
        expect(lastBlobContent).toContain('"Main, Backup"');
    });

    it('escapes double quotes in CSV cell values', () => {
        downloadCsv({
            accounts: [{ name: 'Account "A"' }],
            transactions: [],
            commitments: [],
        });

        // Double quotes should be escaped as ""
        expect(lastBlobContent).toContain('"Account ""A"""');
    });

    it('escapes newlines in CSV cell values', () => {
        downloadCsv({
            accounts: [{ note: 'line1\nline2' }],
            transactions: [],
            commitments: [],
        });

        expect(lastBlobContent).toContain('"line1\nline2"');
    });

    it('handles null and undefined values as empty strings', () => {
        downloadCsv({
            accounts: [{ name: null, other: undefined }],
            transactions: [],
            commitments: [],
        });

        // null/undefined should result in empty cells
        expect(lastBlobContent).toContain('name,other');
        expect(lastBlobContent).toContain(','); // empty values
    });

    it('serializes object values as JSON', () => {
        downloadCsv({
            accounts: [{ meta: { nested: true } }],
            transactions: [],
            commitments: [],
        });

        // Object should be JSON.stringify'd; commas trigger CSV quoting with doubled internal quotes
        expect(lastBlobContent).toContain('"{""nested"":true}"');
    });

    it('generates empty content when all sections empty', () => {
        downloadCsv({ accounts: [], transactions: [], commitments: [] });

        expect(lastBlobContent).toBe('');
    });

    it('handles multiple rows in a section', () => {
        downloadCsv({
            accounts: [
                { name: 'A', type: 'checking' },
                { name: 'B', type: 'savings' },
            ],
            transactions: [],
            commitments: [],
        });

        const lines = lastBlobContent.split('\n');
        // # Accounts header, CSV header row, 2 data rows
        expect(lines).toContain('name,type');
        expect(lines).toContain('A,checking');
        expect(lines).toContain('B,savings');
    });

    it('only includes sections with data (skips empty)', () => {
        downloadCsv({
            accounts: [],
            transactions: [{ title: 'Coffee', amount: 5 }],
            commitments: [],
        });

        expect(lastBlobContent).not.toContain('# Accounts');
        expect(lastBlobContent).toContain('# Transactions');
        expect(lastBlobContent).not.toContain('# Commitments');
    });
});
