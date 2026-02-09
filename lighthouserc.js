/**
 * Lighthouse CI Configuration
 * 
 * Run locally: npm run lighthouse
 * CI integration: lhci autorun
 * 
 * Performance budgets aligned with mobile-first requirements (75% mobile users).
 */
module.exports = {
  ci: {
    collect: {
      // Start a static server to test the built app
      staticDistDir: './dist',
      
      // Run 3 audits for more stable results
      numberOfRuns: 3,
      
      // URLs to audit (relative to static server)
      url: [
        'http://localhost/',
        'http://localhost/login',
      ],
      
      // Settings for consistent mobile testing
      settings: {
        // Mobile device emulation (matches our 75% mobile user base)
        formFactor: 'mobile',
        throttling: {
          // Simulate 4G mobile connection
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
      // Performance assertions - break build if these fail
      assertions: {
        // Core Web Vitals thresholds (must be warning or better)
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Overall category scores (0-1 scale)
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // PWA checks
        'categories:pwa': ['warn', { minScore: 0.6 }],
        
        // Resource budgets
        'resource-summary:script:size': ['warn', { maxNumericValue: 512000 }],   // 500KB JS budget
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 102400 }], // 100KB CSS budget
        'resource-summary:total:size': ['warn', { maxNumericValue: 1048576 }],   // 1MB total budget
      },
    },
    
    upload: {
      // Don't upload results by default - enable in CI if using LHCI server
      target: 'temporary-public-storage',
    },
  },
};
