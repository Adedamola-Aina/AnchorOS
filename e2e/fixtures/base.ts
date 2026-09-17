// @ts-nocheck
import { test as base } from '@playwright/test';
import { loginWithSeededIdentity } from '../helpers';
import { TEST_USER } from './test-data';

export type TestOptions = {
    authedPage: void;
};

export const test = base.extend<TestOptions>({
    // Deterministic login through the real UI for every test that imports this
    // fixture. loginWithSeededIdentity asserts that authentication actually
    // succeeded (and fails fast with non-secret diagnostics otherwise) — a
    // failed login must never surface as a 60s beforeEach timeout, and nothing
    // here signs up, skips onboarding, retries credentials, or navigates away
    // to hide the failure. Playwright keeps a trace + screenshot on failure;
    // the same diagnostic payload is attached as JSON.
    authedPage: [async ({ page }, use, testInfo) => {
        await loginWithSeededIdentity(page, TEST_USER, {
            attach: (name, body, contentType) => testInfo.attach(name, { body, contentType }),
        });
        await use();
    }, { auto: true }], // 'auto: true' enables it for all tests importing this fixture
});

export { expect } from '@playwright/test';
