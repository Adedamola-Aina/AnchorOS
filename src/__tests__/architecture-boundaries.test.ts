/**
 * Architecture boundary guardrails.
 *
 * These encode contracts that otherwise live only in prose (ARCHITECTURE.md /
 * AGENTS.md) so drift fails a test instead of accumulating:
 *
 *   1. production code never opts out of TypeScript (`@ts-nocheck`);
 *   2. Firestore is reached only through `src/utils/secureDb`;
 *   3. test-file `@ts-nocheck` debt can only shrink (a ratchet).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

const SRC = join(process.cwd(), 'src');

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory() ? walk(full) : [full];
    });
}

const allFiles = walk(SRC).filter((file) => /\.(ts|tsx)$/.test(file));
const rel = (file: string): string => file.slice(SRC.length + 1);
const isTestFile = (file: string): boolean =>
    /\.(test|spec)\.tsx?$/.test(file) || file.includes('__tests__') || file.endsWith('.emulator.ts');

const productionFiles = allFiles.filter((file) => !isTestFile(file));

/** Files permitted to import `firebase/firestore` directly (the secureDb layer). */
const FIRESTORE_ALLOWED = new Set([
    'utils/secureDb.ts',
    'utils/secureDbCore.ts',
    'config/firebase.ts',
]);

/** Test-file @ts-nocheck count when the ratchet was introduced. Only ever lower it. */
const TEST_TS_NOCHECK_BASELINE = 212;

describe('architecture boundaries', () => {
    it('production code never opts out of type checking (@ts-nocheck)', () => {
        const offenders = productionFiles
            .filter((file) => readFileSync(file, 'utf8').includes('@ts-nocheck'))
            .map(rel);
        expect(offenders).toEqual([]);
    });

    it('Firestore is reached only through secureDb', () => {
        const offenders = productionFiles
            .filter((file) => {
                if (FIRESTORE_ALLOWED.has(rel(file))) return false;
                return /from ['"]firebase\/firestore['"]/.test(readFileSync(file, 'utf8'));
            })
            .map(rel);
        expect(offenders).toEqual([]);
    });

    it('test-file @ts-nocheck debt does not grow (ratchet)', () => {
        const count = allFiles
            .filter((file) => isTestFile(file) && readFileSync(file, 'utf8').includes('@ts-nocheck'))
            .length;
        expect(count).toBeLessThanOrEqual(TEST_TS_NOCHECK_BASELINE);
    });
});