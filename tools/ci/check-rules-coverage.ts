#!/usr/bin/env npx tsx
/**
 * ARCH-026: Firestore Rules Coverage Enforcement
 *
 * Fetches the coverage report from the Firebase Emulator Suite and exits
 * with code 1 if any `allow` rule expression has never been evaluated
 * during the test run (count === 0).
 *
 * Called automatically by `npm run test:rules:ci` after vitest finishes while
 * the emulator is still up. Safe to call by hand: `npx tsx tools/ci/check-rules-coverage.ts`
 *
 * Env vars (optional – defaults shown):
 *   FIRESTORE_EMULATOR_HOST  default: localhost:8080
 *   GCLOUD_PROJECT           default: anchor-os-test
 */

const HOST = process.env.FIRESTORE_EMULATOR_HOST ?? 'localhost:8080';
const PROJECT_ID =
  process.env.GCLOUD_PROJECT ??
  process.env.FIREBASE_PROJECT ??
  'anchor-os-test';

const COVERAGE_URL =
  `http://${HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage`;

// ── Types ────────────────────────────────────────────────────────────────────

interface SourcePosition {
  file: string;
  line: number;
  column: number;
}

interface Expression {
  expression?: string;
  debugString?: string;
  count?: number;
  sourcePosition?: SourcePosition;
}

interface RulesFile {
  name?: string;
  expressions?: Expression[];
}

interface CoverageResponse {
  rules?: {
    files?: RulesFile[];
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatLocation(file: RulesFile, expr: Expression): string {
  const pos = expr.sourcePosition;
  if (pos) return `${pos.file}:${pos.line}:${pos.column}`;
  return file.name ?? 'unknown';
}

function formatRule(expr: Expression): string {
  return expr.expression ?? expr.debugString ?? '(unknown expression)';
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let data: CoverageResponse;

  try {
    const res = await fetch(COVERAGE_URL);
    if (!res.ok) {
      console.error(
        `❌ ARCH-026: Could not fetch coverage — HTTP ${res.status}\n  URL: ${COVERAGE_URL}`
      );
      process.exit(1);
    }
    data = (await res.json()) as CoverageResponse;
  } catch (err) {
    console.error(
      `❌ ARCH-026: Firebase emulator unreachable.\n  URL: ${COVERAGE_URL}\n  Start it with: npm run emulator:start`
    );
    if (err instanceof Error) console.error(`  ${err.message}`);
    process.exit(1);
  }

  const files = data?.rules?.files ?? [];
  const uncovered: string[] = [];
  let total = 0;

  for (const file of files) {
    for (const expr of file.expressions ?? []) {
      total++;
      if ((expr.count ?? 0) === 0) {
        const loc = formatLocation(file, expr);
        const rule = formatRule(expr);
        uncovered.push(`  ${loc}  →  ${rule}`);
      }
    }
  }

  if (uncovered.length > 0) {
    console.error(
      `\n❌ ARCH-026: ${uncovered.length}/${total} Firestore rule expression(s) have 0 test hits:\n`
    );
    for (const line of uncovered) {
      console.error(line);
    }
    console.error(
      `\nFix: add Vitest tests in src/__tests__/rules/ that exercise the paths above.\n`
    );
    process.exit(1);
  }

  console.log(`✅ ARCH-026: All ${total} Firestore rule expression(s) covered.`);
}

main();
