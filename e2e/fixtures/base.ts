import { test as base } from '@playwright/test';
import { loginOrSignup } from '../helpers';
import { TEST_USER } from './test-data';

export type TestOptions = {
    authedPage: void;
};

export const test = base.extend<TestOptions>({
    authedPage: [async ({ page }, use) => {
        // Auto-login before test
        await loginOrSignup(page, TEST_USER, true);
        await use();
    }, { auto: true }], // 'auto: true' enables it for all tests importing this fixture
});

export { expect } from '@playwright/test';
