import { describe, expect, it } from 'vitest';
import { globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootVitestConfig from '../../config/vitest.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

type RootVitestConfig = {
  test?: {
    include?: string[];
    exclude?: string[];
  };
};

/**
 * The single, exact ownership contract for the root/frontend Vitest project.
 * `npm run test:run` (the root frontend Vitest config) may discover only these
 * files. Widening it -- or removing it, which re-exposes Vitest's default `**`
 * glob -- leaks `functions/**` into this run; narrowing it risks silently
 * dropping a frontend test from the suite. Both regressions fail below.
 *
 * The other suites are owned elsewhere: functions tests by
 * functions/vitest.config.ts, emulator tests by functions/vitest.emulator.config.ts
 * and config/vitest.rules.config.ts, and E2E by config/playwright.config.ts.
 */
const FRONTEND_TEST_INCLUDE = 'src/**/*.{test,spec}.{ts,tsx}';

/**
 * A deliberately broad net over src/ that matches a test-like file with ANY
 * extension. It proves every test-like file under src/ is covered by the
 * contract above, so a newly added `src/**\/*.test.js` (or any other
 * unsupported extension) fails the invariant instead of silently falling
 * outside the suite.
 */
const ANY_TEST_LIKE_IN_SRC = 'src/**/*.{test,spec}.*';

/**
 * Traversal hygiene only, NOT test-ownership excludes: never descend into
 * installed or built trees while scanning. These are independent of the root
 * config's `exclude`, so a supported src test can never be hidden by them.
 */
const SCAN_EXCLUDE = ['**/node_modules/**', '**/dist/**'];

/** Normalize to forward slashes so globs match on every platform. */
const normalize = (files: string[]): string[] =>
  files.map((file) => file.split(path.sep).join('/')).sort();

const discover = (include: string, exclude: string[]): string[] =>
  normalize(globSync(include, { cwd: repoRoot, exclude }));

describe('root frontend Vitest test ownership', () => {
  const config = rootVitestConfig as unknown as RootVitestConfig;
  const include = config.test?.include ?? [];
  const exclude = config.test?.exclude ?? [];

  // What the real root config actually runs, root excludes included.
  const discovered = discover(FRONTEND_TEST_INCLUDE, exclude);
  // The complete supported frontend-test set, ignoring the root excludes.
  const supportedIgnoringRootExcludes = discover(FRONTEND_TEST_INCLUDE, SCAN_EXCLUDE);

  it('declares the exact include ownership contract', () => {
    expect(include).toEqual([FRONTEND_TEST_INCLUDE]);
  });

  it('discovers only src frontend tests and never functions/** or e2e/**', () => {
    expect(discovered.length).toBeGreaterThan(0);

    const leaked = discovered.filter(
      (file) => file.startsWith('functions/') || file.startsWith('e2e/'),
    );
    expect(leaked).toEqual([]);

    const offContract = discovered.filter((file) => !file.startsWith('src/'));
    expect(offContract).toEqual([]);
  });

  it('owns every test-like file under src/ (unsupported extensions cannot slip out)', () => {
    const supported = new Set(supportedIgnoringRootExcludes);
    const testLike = discover(ANY_TEST_LIKE_IN_SRC, SCAN_EXCLUDE);

    expect(testLike.length).toBeGreaterThan(0);

    const unowned = testLike.filter((file) => !supported.has(file));
    expect(unowned).toEqual([]);
  });

  it('does not let a root exclude silently drop a supported src test', () => {
    expect(discovered).toEqual(supportedIgnoringRootExcludes);
  });
});
