module.exports = {
  ci: {
    collect: {
      staticDistDir: 'dist',
      numberOfRuns: 3,
      url: [
        'http://localhost:4173/',
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
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': ['warn', { minScore: 0.6 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 512000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 102400 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 1048576 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
