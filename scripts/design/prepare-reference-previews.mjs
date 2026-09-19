#!/usr/bin/env node
/**
 * prepare-reference-previews.mjs
 *
 * Downscales design-reference screenshots (Mobbin / App Store captures) into a
 * preview directory so they can be read inside the per-session image budget.
 *
 * Why this exists: the image reader has a *cumulative* media budget per session.
 * Originals are 1500-3000px web captures at 0.4-1.8MB; a 900-1500px re-encode is
 * 4-10x smaller and keeps the UI legible. Downscaling does not lift the cumulative
 * cap, but it lets a full set be read across a couple of passes.
 *
 * Usage:
 *   node scripts/design/prepare-reference-previews.mjs
 *   node scripts/design/prepare-reference-previews.mjs --width 900
 *   node scripts/design/prepare-reference-previews.mjs --force
 *
 * Reads from docs/audits/2026-09-whole-product/references/mobbin/ by default.
 * Reference images are gitignored (third-party UI) - previews go to /tmp and are
 * never committed either.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULTS = {
  dir: path.join(REPO_ROOT, 'docs/audits/2026-09-whole-product/references/mobbin'),
  out: '/tmp/anchor-ref-previews',
  width: 1500,
};

function parseArgs(argv) {
  const opts = { ...DEFAULTS, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--force') opts.force = true;
    else if (arg === '--dir') opts.dir = path.resolve(argv[(i += 1)]);
    else if (arg === '--out') opts.out = path.resolve(argv[(i += 1)]);
    else if (arg === '--width') opts.width = Number(argv[(i += 1)]);
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }
  if (!Number.isFinite(opts.width) || opts.width < 200) {
    console.error(`--width must be a number >= 200 (got ${opts.width})`);
    process.exit(1);
  }
  return opts;
}

const SHOT_RE = /\.(png|jpe?g|webp)$/i;
const mimeFor = (file) =>
  /\.jpe?g$/i.test(file) ? 'image/jpeg' : /\.webp$/i.test(file) ? 'image/webp' : 'image/png';

async function loadChromium() {
  try {
    const mod = await import('playwright');
    const chromium = mod.chromium ?? mod.default?.chromium;
    if (chromium) return chromium;
  } catch {
    /* fall through to the explicit path below */
  }
  // Scripts may run outside the package's module resolution; try the repo install.
  const fallback = path.join(REPO_ROOT, 'node_modules/playwright/index.js');
  if (fs.existsSync(fallback)) {
    const mod = await import(fallback);
    const chromium = mod.chromium ?? mod.default?.chromium;
    if (chromium) return chromium;
  }
  throw new Error('playwright is not installed; run `npm install` before preparing previews');
}

const opts = parseArgs(process.argv.slice(2));
if (!fs.existsSync(opts.dir)) {
  console.error(`No such reference directory: ${opts.dir}`);
  process.exit(1);
}
const shots = fs.readdirSync(opts.dir).filter((f) => SHOT_RE.test(f)).sort();
if (shots.length === 0) {
  console.error(`No images found in ${opts.dir}`);
  process.exit(1);
}
fs.mkdirSync(opts.out, { recursive: true });

const chromium = await loadChromium();
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
let converted = 0;
let skipped = 0;

for (const file of shots) {
  const src = path.join(opts.dir, file);
  const dest = path.join(opts.out, file);
  const srcStat = fs.statSync(src);
  if (!opts.force && fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= srcStat.mtimeMs) {
    skipped += 1;
    console.log(`skip  ${file} (preview up to date)`);
    continue;
  }
  const b64 = fs.readFileSync(src).toString('base64');
  const mime = mimeFor(file);
  const rendered = await page.evaluate(
    async ({ b64: data, mime: type, target }) => {
      const img = new Image();
      img.src = `data:${type};base64,${data}`;
      await img.decode();
      const scale = Math.min(1, target / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      return { url: canvas.toDataURL('image/png'), w, h };
    },
    { b64, mime, target: opts.width },
  );
  const buf = Buffer.from(rendered.url.split(',')[1], 'base64');
  fs.writeFileSync(dest, buf);
  converted += 1;
  const before = Math.round(srcStat.size / 1024);
  const after = Math.round(buf.length / 1024);
  console.log(
    `ok    ${file} ${rendered.w}x${rendered.h} ${before}KB -> ${after}KB (${Math.round((1 - after / before) * 100)}% smaller)`,
  );
}

await browser.close();
console.log(`\n${converted} converted, ${skipped} skipped -> ${opts.out}`);
