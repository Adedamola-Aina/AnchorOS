import { describe, expect, it } from 'vitest';
import { globSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootVitestConfig, {
  FRONTEND_TEST_INCLUDE,
  FOREIGN_EXCLUDE,
  NODE_INCLUDE,
  NODE_EXCLUDE,
  JSDOM_INCLUDE,
} from '../../config/vitest.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

type ProjectTestConfig = {
  name?: string;
  environment?: string;
  include?: string[];
  exclude?: string[];
};

type RootVitestConfig = {
  test?: {
    projects?: Array<{ test?: ProjectTestConfig }>;
  };
};

/**
 * A deliberately broad net over src/ that matches a test-like file with ANY
 * extension. It proves every test-like file under src/ is owned by the
 * frontend contract, so a newly added `src/**\/*.test.js` (or any other
 * unsupported extension) fails the invariant instead of silently falling
 * outside the suite.
 */
const ANY_TEST_LIKE_IN_SRC = 'src/**/*.{test,spec}.*';

/**
 * Traversal hygiene only, NOT test-ownership excludes: never descend into
 * installed or built trees while scanning. These are independent of the
 * project excludes, so a supported src test can never be hidden by them.
 */
const SCAN_EXCLUDE = ['**/node_modules/**', '**/dist/**'];

/** Normalize to forward slashes so globs match on every platform. */
const normalize = (files: string[]): string[] =>
  files.map((file) => file.split(path.sep).join('/')).sort();

const discover = (include: string | string[], exclude: string[]): string[] =>
  normalize(globSync(include, { cwd: repoRoot, exclude }));

const intersection = (a: string[], b: string[]): string[] => {
  const other = new Set(b);
  return a.filter((file) => other.has(file));
};

const difference = (a: string[], b: string[]): string[] => {
  const other = new Set(b);
  return a.filter((file) => !other.has(file));
};

/** Foreign suites that must never be owned by a frontend project. */
const isForeign = (file: string): boolean =>
  file.startsWith('functions/') ||
  file.startsWith('e2e/') ||
  file.startsWith('tools/') ||
  file.startsWith('dist/') ||
  file.includes('node_modules/') ||
  file.includes('/.stryker-tmp/') ||
  /\.emulator\.(test\.)?ts$/.test(file);

describe('root frontend Vitest runtime ownership', () => {
  const config = rootVitestConfig as unknown as RootVitestConfig;
  const projects = (config.test?.projects ?? []).map((p) => p.test ?? {});
  const node = projects.find((p) => p.name === 'node');
  const jsdom = projects.find((p) => p.name === 'jsdom');

  // The complete supported frontend-test set, ignoring ownership excludes.
  const completeSupported = discover(FRONTEND_TEST_INCLUDE, SCAN_EXCLUDE);

  // What each project actually runs, honouring its include + exclude.
  const nodeOwned = node
    ? discover(node.include ?? [], [...(node.exclude ?? []), ...SCAN_EXCLUDE])
    : [];
  const jsdomOwned = jsdom
    ? discover(jsdom.include ?? [], [...(jsdom.exclude ?? []), ...SCAN_EXCLUDE])
    : [];

  it('defines exactly the node and jsdom frontend projects', () => {
    expect(node, 'missing "node" project').toBeDefined();
    expect(jsdom, 'missing "jsdom" project').toBeDefined();
    expect(projects.map((p) => p.name).sort()).toEqual(['jsdom', 'node']);
  });

  it('binds each project to the correct runtime environment', () => {
    expect(node?.environment).toBe('node');
    expect(jsdom?.environment).toBe('jsdom');
  });

  it('declares the frontend contract as the single supported test surface', () => {
    expect(FRONTEND_TEST_INCLUDE).toBe('src/**/*.{test,spec}.{ts,tsx}');
    expect(completeSupported.length).toBeGreaterThan(0);
  });

  it('node and jsdom ownership sets are disjoint (zero overlap)', () => {
    expect(intersection(nodeOwned, jsdomOwned)).toEqual([]);
  });

  it('node ∪ jsdom equals the complete supported frontend-test set', () => {
    const union = normalize([...nodeOwned, ...jsdomOwned]);
    expect(union).toEqual(completeSupported);
  });

  it('every supported file belongs to exactly one project (no gaps)', () => {
    const union = new Set([...nodeOwned, ...jsdomOwned]);
    const unowned = completeSupported.filter((file) => !union.has(file));
    expect(unowned).toEqual([]);
    // Symmetric: nothing owned lies outside the supported surface.
    expect(difference(nodeOwned, completeSupported)).toEqual([]);
    expect(difference(jsdomOwned, completeSupported)).toEqual([]);
  });

  it('the node project owns no DOM/JSX (.tsx) tests', () => {
    expect(nodeOwned.filter((file) => file.endsWith('.tsx'))).toEqual([]);
    expect(nodeOwned.length).toBeGreaterThan(0);
    expect(jsdomOwned.length).toBeGreaterThan(0);
  });

  it('owns every test-like file under src/ (unsupported extensions cannot slip out)', () => {
    const supported = new Set(completeSupported);
    const testLike = discover(ANY_TEST_LIKE_IN_SRC, SCAN_EXCLUDE);

    expect(testLike.length).toBeGreaterThan(0);
    expect(testLike.filter((file) => !supported.has(file))).toEqual([]);
  });

  it('project includes cannot silently drop a legitimate frontend test', () => {
    // The union of owned sets must equal the contract scanned with only
    // traversal hygiene — i.e. no ownership exclude removed a real test.
    const union = normalize([...nodeOwned, ...jsdomOwned]);
    expect(union).toEqual(completeSupported);
  });

  it('foreign suites remain outside both frontend projects', () => {
    expect(nodeOwned.filter(isForeign)).toEqual([]);
    expect(jsdomOwned.filter(isForeign)).toEqual([]);
    // The exported foreign excludes name every foreign surface.
    for (const pattern of ['e2e/**', 'tools/**', '**/*.emulator.test.ts', '**/*.emulator.ts']) {
      expect(FOREIGN_EXCLUDE).toContain(pattern);
    }
  });

  it('no owned test overrides its project environment via a docblock', () => {
    const mismatches: string[] = [];
    const check = (files: string[], env: string | undefined) => {
      for (const file of files) {
        const match = readFileSync(path.join(repoRoot, file), 'utf8').match(
          /@vitest-environment\s+([\w-]+)/,
        );
        if (match && match[1] !== env) mismatches.push(`${file} -> ${match[1]} (project ${env})`);
      }
    };
    check(nodeOwned, node?.environment);
    check(jsdomOwned, jsdom?.environment);
    expect(mismatches).toEqual([]);
  });

  it('declares the curated node/jsdom ownership globs consistently', () => {
    // Sanity: the exported globs are exactly what the projects consume.
    expect(node?.include).toEqual(NODE_INCLUDE);
    expect(jsdom?.include).toEqual(JSDOM_INCLUDE);
    expect(NODE_EXCLUDE.length).toBeGreaterThan(0);
    expect(JSDOM_INCLUDE).toEqual(
      expect.arrayContaining([
        'src/**/*.{test,spec}.tsx',
        'src/components/**/*.{test,spec}.ts',
        'src/features/**/*.{test,spec}.ts',
        'src/hooks/**/*.{test,spec}.ts',
        'src/context/**/*.{test,spec}.ts',
      ]),
    );
  });
});
