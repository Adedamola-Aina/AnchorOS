import { describe, it, expect, vi } from 'vitest';
import {
    applyNavMaterial, isNavMaterial, nextNavMaterial, readNavMaterial, writeNavMaterial,
    NAV_MATERIAL_ATTRIBUTE, NAV_MATERIAL_STORAGE_KEY, NAV_MATERIALS,
    type NavMaterial,
} from './navMaterial';

/** A Storage double that records writes and can be made to fail. */
function fakeStorage(initial?: string | null, options: { throwing?: boolean } = {}) {
    let value = initial ?? null;
    return {
        getItem: (key: string) => {
            if (options.throwing) throw new Error('storage is not available');
            return key === NAV_MATERIAL_STORAGE_KEY ? value : null;
        },
        setItem: (key: string, next: string) => {
            if (options.throwing) throw new Error('storage is not available');
            if (key === NAV_MATERIAL_STORAGE_KEY) value = next;
        },
        get written() { return value; },
    };
}

describe('the navigation surface is a safe default first', () => {
    it('leaves the shipped bar alone when nothing has been chosen', () => {
        expect(readNavMaterial(fakeStorage(null))).toBe('current');
        expect(readNavMaterial(fakeStorage())).toBe('current');
    });

    it('ignores an unrecognised or corrupt stored value', () => {
        expect(readNavMaterial(fakeStorage('glass'))).toBe('current');
        expect(readNavMaterial(fakeStorage(''))).toBe('current');
        // A stored value from an older revision of the experiment must not pick a
        // candidate: 'raised' existed, 'lifted' never did.
        expect(readNavMaterial(fakeStorage('lifted'))).toBe('current');
    });

    it('survives storage that throws (private mode, disabled storage)', () => {
        expect(readNavMaterial(fakeStorage('translucent', { throwing: true }))).toBe('current');
    });

    it('treats a missing storage as "shipped"', () => {
        expect(readNavMaterial(null)).toBe('current');
        expect(readNavMaterial(undefined)).toBe('current');
    });

    it('reads back a stored choice', () => {
        expect(readNavMaterial(fakeStorage('translucent'))).toBe('translucent');
        expect(readNavMaterial(fakeStorage('raised'))).toBe('raised');
    });
});

describe('the state machine', () => {
    it('cycles through every state and returns to the start', () => {
        const seen: NavMaterial[] = [NAV_MATERIALS[0]];
        for (let i = 1; i < NAV_MATERIALS.length; i += 1) seen.push(nextNavMaterial(seen[i - 1]));
        expect(seen).toEqual([...NAV_MATERIALS]);
        expect(nextNavMaterial(seen[seen.length - 1])).toBe(NAV_MATERIALS[0]);
    });

    it('narrows only known states', () => {
        expect(isNavMaterial('current')).toBe(true);
        expect(isNavMaterial('translucent')).toBe(true);
        expect(isNavMaterial('raised')).toBe(true);
        expect(isNavMaterial('opaque-white')).toBe(false);
        expect(isNavMaterial(undefined)).toBe(false);
        expect(isNavMaterial(3)).toBe(false);
    });
});

describe('publishing the choice', () => {
    it('writes the state onto the element the stylesheet selects on', () => {
        const target = { setAttribute: vi.fn() };
        applyNavMaterial('translucent', target);
        expect(target.setAttribute).toHaveBeenCalledWith(NAV_MATERIAL_ATTRIBUTE, 'translucent');
    });

    it('writes "current" as a value that matches no rule, so shipped stays shipped', () => {
        const target = { setAttribute: vi.fn() };
        applyNavMaterial('current', target);
        expect(target.setAttribute).toHaveBeenCalledWith(NAV_MATERIAL_ATTRIBUTE, 'current');
    });

    it('does nothing without a target or a writable storage', () => {
        expect(() => applyNavMaterial('raised', null)).not.toThrow();
        expect(() => writeNavMaterial('raised', null)).not.toThrow();
        expect(() => writeNavMaterial('raised', { getItem: () => null })).not.toThrow();
    });

    it('remembers the choice', () => {
        const storage = fakeStorage();
        writeNavMaterial('raised', storage);
        expect(storage.written).toBe('raised');
        expect(readNavMaterial(storage)).toBe('raised');
    });

    it('swallows a storage write failure rather than breaking the switch', () => {
        expect(() => writeNavMaterial('raised', fakeStorage(null, { throwing: true }))).not.toThrow();
    });
});