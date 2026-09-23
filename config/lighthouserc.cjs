// @ts-nocheck
// PSE-003: Per-route performance budgets — LCP and CLS targets enforced per screen
//
// The budgets are unchanged. What changed is that they are now measured against the
// screens they name: the audited server is a production-shaped bundle wired to the
// local emulator (scripts/ci/lighthouse-server.mjs) and the audit signs in with the
// disposable fixture identity first (scripts/ci/lighthouse-auth.cjs). Before this, every
// authenticated route was audited with no session — the app showed its boot splash and
// redirected — so "/settings: LCP ≤ 2800ms" was asserted against a page that was never
// /settings, and the gate could not pass on any commit.
module.exports = {
  ci: {
    collect: {
      // Serve a production-shaped build against the local emulator (SPA fallback for
      // deep routes is handled by vite preview). The pinned emulator env comes from
      // scripts/ci/emulator-harness.mjs — one definition, shared with the E2E suite.
      startServerCommand: 'node scripts/ci/lighthouse-server.mjs',
      startServerReadyPattern: 'Local:',
      // Sign in before each URL, so the budgets describe the screen rather than the
      // splash. Refuses a non-loopback target by design.
      puppeteerScript: 'scripts/ci/lighthouse-auth.cjs',
      numberOfRuns: 3,
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/dashboard',
        'http://localhost:4173/finance',
        'http://localhost:4173/commitments',
        'http://localhost:4173/fabric',
        'http://localhost:4173/settings',
      ],
      settings: {
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 812,
          deviceScaleFactor: 2,
        },
      },
      // The launch flags live here, not in `settings.chromeFlags`: LHCI IGNORES
      // `chromeFlags` as soon as a `puppeteerScript` is configured (it warns about
      // exactly this), which silently dropped `--no-sandbox` and made the browser fail
      // to launch as root. Same flag, the place that is actually read.
      puppeteerLaunchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      },
    },
    assert: {
      assertMatrix: [
        {
          // Root / Auth gate — lightest route
          matchingUrlPattern: 'http://localhost:4173/$',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'interactive': ['error', { maxNumericValue: 4000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 250 }],
            'categories:performance': ['error', { minScore: 0.8 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // Dashboard — charts, widgets
          matchingUrlPattern: '.*/dashboard$',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
            'interactive': ['error', { maxNumericValue: 5000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // Finance — transaction lists, account cards (heaviest route)
          matchingUrlPattern: '.*/finance$',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 3500 }],
            'interactive': ['error', { maxNumericValue: 5500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],
            'total-blocking-time': ['error', { maxNumericValue: 350 }],
            'categories:performance': ['error', { minScore: 0.65 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // Commitments — task list
          matchingUrlPattern: '.*/commitments$',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
            'interactive': ['error', { maxNumericValue: 5000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // Fabric AI — insights, predictions
          matchingUrlPattern: '.*/fabric$',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
            'interactive': ['error', { maxNumericValue: 5000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // Settings — forms, toggles
          matchingUrlPattern: '.*/settings$',
          assertions: {
            'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2800 }],
            'interactive': ['error', { maxNumericValue: 4500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 250 }],
            'categories:performance': ['error', { minScore: 0.75 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
