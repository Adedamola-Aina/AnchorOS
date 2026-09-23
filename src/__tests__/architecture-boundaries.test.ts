/**
 * Architecture boundary guardrails.
 *
 * These encode contracts that otherwise live only in prose (ARCHITECTURE.md /
 * AGENTS.md) so drift fails a test instead of accumulating:
 *
 *   1. no source file opts out of TypeScript;
 *   2. Firestore is reached only through `src/utils/secureDb`;
 *   3. any source file — production or test — carrying it.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

/** The opt-out directive, assembled so this file does not match itself. */
const OPT_OUT_DIRECTIVE = ['@ts-', 'nocheck'].join('');

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

describe('architecture boundaries', () => {
    it('no source file opts out of type checking', () => {
        const offenders = allFiles
            .filter((file) => readFileSync(file, 'utf8').includes(OPT_OUT_DIRECTIVE))
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
});