// @ts-nocheck
/**
 * vitest.config.ts — Functions coverage configuration
 *
 * Runs vitest against functions/src only.
 * Output: functions/coverage/coverage-final.json
 * Run: npm run test:coverage:functions (from workspace root)
 */
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'],
        exclude: ['**/node_modules/**', 'lib/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'json-summary', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/*.test.ts',
                'src/**/*.spec.ts',
            ],
            thresholds: {
                statements: 10,
                branches: 10,
                functions: 10,
                lines: 10,
            },
        },
    },
    resolve: {
        alias: {
            // Allow functions tests to resolve root-level types if needed
        },
    },
});
