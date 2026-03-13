/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
// @ts-nocheck

export default {
  // Package name for reports
  packageManager: 'npm',
  
  // Use Vitest runner with in-place mutation
  testRunner: 'vitest',
  vitest: {
    configFile: 'config/vitest.config.ts',
  },
  
  // Run mutations in-place (avoids sandbox file resolution issues with Vite)
  inPlace: true,
  
  // TypeScript type checking
  checkers: ['typescript'],
  tsconfigFile: 'config/tsconfig.app.json',
  
  // Files to mutate (incremental expansion to hooks/utils)
  mutate: [
    'src/services/**/*.ts',
    'src/hooks/use*Service.ts',
    'src/hooks/useAccessibility.ts',
    'src/hooks/useVersionCheck.ts',
    'src/utils/**/*.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/utils/seeder.ts',      // Dev-only Firestore seeder — requires emulators, not production code
  ],
  
  // Reporters
  reporters: ['html', 'clear-text', 'progress', 'json'],
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },
  jsonReporter: {
    fileName: 'reports/mutation/mutation-report.json',
  },
  
  // Thresholds for quality gates
  thresholds: {
    high: 80,
    low: 60,
    break: 40,  // Temporary baseline alignment; raise after targeted mutation hardening.
  },
  
  // Performance settings
  concurrency: 2,
  timeoutMS: 120000,
  timeoutFactor: 2.5,
  
  // Disable incremental for now (can enable after first successful run)
  incremental: false,
  
  // Temp directory
  tempDirName: '.stryker-tmp',
  
  // Clean on each run
  cleanTempDir: 'always',
  
  // Allow console output
  allowConsoleColors: true,
  
  // Suppress unknown option warnings
  warnings: {
    unknownOptions: false,
  },
};
