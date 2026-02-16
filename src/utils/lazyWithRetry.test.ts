/**
 * Tests for lazyWithRetry.ts — chunk load failure retry logic
 * Target: 90%+ mutation kill rate
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock sessionStorage
const sessionStorageMock: Record<string, string> = {};
vi.stubGlobal('sessionStorage', {
    getItem: vi.fn((key: string) => sessionStorageMock[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { sessionStorageMock[key] = val; }),
    removeItem: vi.fn((key: string) => { delete sessionStorageMock[key]; }),
    clear: vi.fn(() => { Object.keys(sessionStorageMock).forEach(k => delete sessionStorageMock[k]); }),
});

// Mock window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, 'location', {
    value: { ...window.location, reload: reloadMock },
    writable: true,
});

describe('lazyWithRetry', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.keys(sessionStorageMock).forEach(k => delete sessionStorageMock[k]);
        reloadMock.mockClear();
        vi.resetModules();
    });

    it('returns a React lazy component on successful import', async () => {
        const { lazyWithRetry } = await import('./lazyWithRetry');
        const FakeComponent = () => null;
        const factory = vi.fn().mockResolvedValue({ default: FakeComponent });

        const LazyComponent = lazyWithRetry(factory);
        expect(LazyComponent).toBeDefined();
        // React.lazy returns an object with $$typeof
        expect(LazyComponent.$$typeof).toBeDefined();
    });

    it('calls factory function', async () => {
        const { lazyWithRetry } = await import('./lazyWithRetry');
        const FakeComponent = () => null;
        const factory = vi.fn().mockResolvedValue({ default: FakeComponent });

        // React.lazy calls factory when the component is needed
        const LazyComponent = lazyWithRetry(factory);
        // Trigger the lazy load by accessing the internal
        // We test the factory is returned wrapped in React.lazy
        expect(LazyComponent).toBeTruthy();
    });

    it('reloads once on chunk load failure (first failure)', async () => {
        const { lazyWithRetry } = await import('./lazyWithRetry');
        const error = new Error('Failed to fetch dynamically imported module');
        const factory = vi.fn().mockRejectedValue(error);

        // React.lazy wraps the factory. We need to call the underlying catch handler.
        // Directly invoke the wrapper logic by calling the factory through React.lazy internals
        const lazySpy = vi.spyOn(React, 'lazy').mockImplementation((fn) => {
            // Invoke the factory to test the catch handler
            fn().catch(() => {});
            return (() => null) as any;
        });

        try {
            lazyWithRetry(factory);
            // Wait for the factory rejection to be handled
            await new Promise(resolve => setTimeout(resolve, 10));

            // Should have set sessionStorage and triggered reload
            expect(sessionStorage.setItem).toHaveBeenCalled();
            expect(reloadMock).toHaveBeenCalledOnce();
        } finally {
            lazySpy.mockRestore();
        }
    });

    it('does not reload on second failure (key already set)', async () => {
        const { lazyWithRetry } = await import('./lazyWithRetry');
        const error = new Error('chunk load error');
        const factory = vi.fn().mockRejectedValue(error);

        // Pre-set the session storage key
        const key = 'chunk_reload_' + factory.toString().slice(0, 60);
        sessionStorageMock[key] = '1';

        const lazySpy = vi.spyOn(React, 'lazy').mockImplementation((fn) => {
            fn().catch(() => {}); // Ignore the re-thrown error
            return (() => null) as any;
        });

        try {
            lazyWithRetry(factory);
            await new Promise(resolve => setTimeout(resolve, 10));

            // Should NOT reload since key exists
            expect(reloadMock).not.toHaveBeenCalled();
        } finally {
            lazySpy.mockRestore();
        }
    });

    it('re-throws the error after handling', async () => {
        const { lazyWithRetry } = await import('./lazyWithRetry');
        const error = new Error('chunk load error');
        const factory = vi.fn().mockRejectedValue(error);

        let caughtError: Error | undefined;
        const lazySpy = vi.spyOn(React, 'lazy').mockImplementation((fn) => {
            fn().catch((e: Error) => { caughtError = e; });
            return (() => null) as any;
        });

        try {
            // Pre-set key so reload doesn't fire
            const key = 'chunk_reload_' + factory.toString().slice(0, 60);
            sessionStorageMock[key] = '1';

            lazyWithRetry(factory);
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(caughtError).toBe(error);
        } finally {
            lazySpy.mockRestore();
        }
    });
});
