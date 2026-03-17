import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const coverageDir = path.join(root, 'coverage');
const summaryPath = path.join(coverageDir, 'coverage-summary.json');
const jsonOutPath = path.join(coverageDir, 'module-coverage-summary.json');
const markdownOutPath = path.join(coverageDir, 'module-coverage-summary.md');

function toPct(covered, total) {
  if (total === 0) return 100;
  return Number(((covered / total) * 100).toFixed(2));
}

function normalize(filePath) {
  return filePath.replace(/\\/g, '/');
}

function moduleKey(filePath) {
  const normalized = normalize(filePath);

  const functionsMatch = normalized.match(/(?:^|\/)functions\/src\/([^/]+)/);
  if (functionsMatch) {
    const candidate = functionsMatch[1];
    return candidate.includes('.') ? 'functions/src' : `functions/src/${candidate}`;
  }

  const featureOrServiceMatch = normalized.match(/(?:^|\/)src\/(features|services)\/([^/]+)/);
  if (featureOrServiceMatch) {
    const section = featureOrServiceMatch[1];
    const candidate = featureOrServiceMatch[2];
    return candidate.includes('.') ? `src/${section}` : `src/${section}/${candidate}`;
  }

  const srcRootMatch = normalized.match(/(?:^|\/)(src\/[^/]+)/);
  if (srcRootMatch) return srcRootMatch[1];

  return 'other';
}

function newMetricBucket() {
  return {
    statements: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
    lines: { covered: 0, total: 0 },
  };
}

if (!fs.existsSync(summaryPath)) {
  console.error(`Coverage summary not found at ${summaryPath}`);
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const rows = Object.entries(summary).filter(([key]) => key !== 'total');
const modules = new Map();

for (const [file, metrics] of rows) {
  const key = moduleKey(file);
  if (!modules.has(key)) {
    modules.set(key, { metrics: newMetricBucket(), files: 0 });
  }

  const moduleEntry = modules.get(key);
  moduleEntry.files += 1;

  for (const metric of ['statements', 'branches', 'functions', 'lines']) {
    moduleEntry.metrics[metric].covered += metrics[metric].covered;
    moduleEntry.metrics[metric].total += metrics[metric].total;
  }
}

const result = Array.from(modules.entries())
  .map(([module, data]) => ({
    module,
    files: data.files,
    statements: toPct(data.metrics.statements.covered, data.metrics.statements.total),
    branches: toPct(data.metrics.branches.covered, data.metrics.branches.total),
    functions: toPct(data.metrics.functions.covered, data.metrics.functions.total),
    lines: toPct(data.metrics.lines.covered, data.metrics.lines.total),
  }))
  .sort((a, b) => a.branches - b.branches || a.statements - b.statements || a.module.localeCompare(b.module));

const outputJson = {
  generatedAt: new Date().toISOString(),
  moduleCount: result.length,
  modules: result,
};

const markdownLines = [
  '# Module Coverage Summary',
  '',
  '| Module | Files | Statements | Branches | Functions | Lines |',
  '| --- | ---: | ---: | ---: | ---: | ---: |',
  ...result.map((entry) =>
    `| ${entry.module} | ${entry.files} | ${entry.statements}% | ${entry.branches}% | ${entry.functions}% | ${entry.lines}% |`,
  ),
  '',
  '_Sorted by lowest branch coverage first._',
];

fs.writeFileSync(jsonOutPath, JSON.stringify(outputJson, null, 2));
fs.writeFileSync(markdownOutPath, `${markdownLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${markdownOutPath}`);

const top = result.slice(0, 10);
if (top.length > 0) {
  console.log('\nLowest branch coverage modules:');
  for (const entry of top) {
    console.log(`- ${entry.module}: ${entry.branches}% branches (${entry.files} files)`);
  }
}
