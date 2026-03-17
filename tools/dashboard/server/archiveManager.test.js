// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fs = require('fs');
const archiveManager = require('./archiveManager');

describe('archiveManager', () => {
    let existsSpy;
    let readSpy;
    let writeSpy;

    beforeEach(() => {
        vi.restoreAllMocks();
        existsSpy = vi.spyOn(fs, 'existsSync');
        readSpy = vi.spyOn(fs, 'readFileSync');
        writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
    });

    it('returns empty completed items when roadmap is missing', () => {
        existsSpy.mockImplementation((p) => p.includes('ROADMAP.md') ? false : true);

        const items = archiveManager.detectCompletedItems();
        expect(items).toEqual([]);
    });

    it('detects completed roadmap items and completion dates', () => {
        existsSpy.mockImplementation((p) => p.includes('ROADMAP.md'));
        readSpy.mockReturnValue([
            '# ROADMAP',
            '- [x] Finished item (2026-01-20)',
            '- [x] Another item Completed: 2026-01-21',
            '- [ ] Not completed'
        ].join('\n'));

        const items = archiveManager.detectCompletedItems();

        expect(items).toHaveLength(2);
        expect(items[0].completionDate).toBe('2026-01-20');
        expect(items[1].completionDate).toBe('2026-01-21');
    });

    it('supports dry-run archiving without writing roadmap changes', () => {
        existsSpy.mockImplementation((p) => p.includes('ROADMAP.md') || p.includes('ROADMAP_ARCHIVE.md'));
        readSpy.mockReturnValue('- [x] Old item Completed: 2024-01-01\n');

        const result = archiveManager.archiveOldItems(30, true);

        expect(result.success).toBe(true);
        expect(result.archivedCount).toBe(1);
        expect(result.message).toContain('dry run');
        expect(writeSpy).not.toHaveBeenCalled();
    });

    it('returns no-op when nothing is old enough to archive', () => {
        existsSpy.mockImplementation((p) => p.includes('ROADMAP.md') || p.includes('ROADMAP_ARCHIVE.md'));
        readSpy.mockReturnValue('- [x] Fresh item Completed: 2030-01-01\n');

        const result = archiveManager.archiveOldItems(30, false);

        expect(result.success).toBe(true);
        expect(result.archivedCount).toBe(0);
        expect(result.message).toContain('No items old enough');
    });

    it('archives items and removes them from roadmap', () => {
        existsSpy.mockImplementation((p) => p.includes('ROADMAP.md') || p.includes('ROADMAP_ARCHIVE.md'));
        readSpy.mockImplementation((p) => {
            if (p.includes('ROADMAP_ARCHIVE.md')) {
                return '# ROADMAP Archive\n';
            }
            return '- [x] Legacy item Completed: 2024-01-05\n- [ ] Pending item\n';
        });

        const result = archiveManager.archiveOldItems(30, false);

        expect(result.success).toBe(true);
        expect(result.archivedCount).toBe(1);
        expect(writeSpy).toHaveBeenCalledTimes(2);
        const archiveWrite = writeSpy.mock.calls.find(([p]) => p.includes('ROADMAP_ARCHIVE.md'));
        const roadmapWrite = writeSpy.mock.calls.find(([p]) => p.includes('ROADMAP.md'));
        expect(archiveWrite[1]).toContain('Legacy item');
        expect(roadmapWrite[1]).not.toContain('Legacy item Completed');
    });

    it('parses archived items grouped by month and week headers', () => {
        existsSpy.mockReturnValue(true);
        readSpy.mockReturnValue([
            '## January 2026',
            '### Week 2 (2026-01-06 to 2026-01-12)',
            '- [x] Completed migration (Archived: 2026-01-13)'
        ].join('\n'));

        const items = archiveManager.getArchivedItems();
        expect(items).toEqual([
            {
                text: '- [x] Completed migration (Archived: 2026-01-13)',
                month: 'January 2026',
                week: 'Week 2 (2026-01-06 to 2026-01-12)'
            }
        ]);
    });

    it('fails restore when archive or roadmap is missing', () => {
        existsSpy.mockReturnValue(false);
        const result = archiveManager.restoreItem('Task text');
        expect(result.success).toBe(false);
    });

    it('fails restore when item is not found in archive', () => {
        existsSpy.mockReturnValue(true);
        readSpy.mockImplementation((p) => p.includes('ROADMAP_ARCHIVE.md') ? '# ROADMAP Archive\n' : '## Completed\n');

        const result = archiveManager.restoreItem('Missing item');
        expect(result.success).toBe(false);
        expect(result.message).toContain('not found');
    });

    it('restores item to completed section and strips archived tag', () => {
        existsSpy.mockReturnValue(true);
        readSpy.mockImplementation((p) => {
            if (p.includes('ROADMAP_ARCHIVE.md')) {
                return [
                    '# ROADMAP Archive',
                    '- [x] Ship feature (Archived: 2026-02-15)'
                ].join('\n');
            }
            return [
                '# ROADMAP',
                '## Completed',
                '- [x] Existing done item'
            ].join('\n');
        });

        const result = archiveManager.restoreItem('Ship feature');

        expect(result.success).toBe(true);
        const roadmapWrite = writeSpy.mock.calls.find(([p]) => p.includes('ROADMAP.md'));
        expect(roadmapWrite[1]).toContain('Ship feature');
        expect(roadmapWrite[1]).not.toContain('(Archived:');
    });
});
