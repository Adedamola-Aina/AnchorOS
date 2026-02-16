/**
 * Test User Credentials and Data
 * 
 * These are test accounts for E2E testing.
 * In staging/dev environments, these users should exist.
 */
// @ts-nocheck


export const TEST_USER = {
    email: 'test@anchor-os.com',
    password: 'TestPass123!',
    name: 'Test User',
};

export const TEST_USER_2 = {
    email: 'test2@anchor-os.com',
    password: 'TestPass123!',
    name: 'Test User 2',
};

export const INVALID_USER = {
    email: 'invalid@anchor-os.com',
    password: 'wrongpassword',
};

export const TEST_ACCOUNT = {
    name: 'Test Checking',
    type: 'checking',
    currency: 'NGN',
    balance: '10000',
};

export const TEST_TRANSACTION = {
    title: 'Test Salary',
    amount: '50000',
    type: 'income',
    category: 'Salary',
};

export const TEST_TASK = {
    title: 'Test Daily Task',
    type: 'daily',
};
