/**
 * Lighthouse CI Configuration
 * 
 * Run locally: npm run lighthouse
 * CI integration: lhci autorun
 * 
 * PSE-003: Per-route performance budgets — LCP and CLS targets enforced per screen.
 * Performance budgets aligned with mobile-first requirements (75% mobile users).
 */
// @ts-nocheck

module.exports = {
  ci: {
    collect: {
      staticDistDir: 'dist',
      numberOfRuns: 3,
      url: [
        'http://localhost/',
        'http://localhost/dashboard',
        'http://localhost/finance',
        'http://localhost/commitments',
        'http://localhost/fabric',
        'http://localhost/settings',
      ],
      settings: {
        chromeFlags: '--no-sandbox',
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
    },
    assert: {
      assertMatrix: [
        {
          // Root / Auth gate — lightest route
          matchingUrlPattern: 'http://localhost/$',
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
