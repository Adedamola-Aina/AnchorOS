// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

// Suppress console.error from React + ErrorBoundary during tests
const originalError = console.error;
beforeEach(() => {
    console.error = vi.fn();
});
afterEach(() => {
    console.error = originalError;
});

// Component that throws on render
const ThrowingChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) throw new Error('Test explosion');
    return <div>All good</div>;
};

describe('ErrorBoundary', () => {
    const originalConfirm = window.confirm;
    const originalIndexedDb = window.indexedDB;

    beforeEach(() => {
        window.confirm = originalConfirm;
        Object.defineProperty(window, 'indexedDB', {
            value: originalIndexedDb,
            configurable: true,
        });
    });

    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Hello World</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('displays fallback UI when child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });

    it('renders Reload Application button in error state', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Reload Application')).toBeInTheDocument();
    });

    it('renders Reset App Data button in error state', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Reset App Data')).toBeInTheDocument();
    });

    it('shows error details in dev mode', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );
        // import.meta.env.DEV is true in test environment
        expect(screen.getByText(/Test explosion/)).toBeInTheDocument();
    });

    it('calls componentDidCatch with error info', () => {
        const spy = vi.spyOn(ErrorBoundary.prototype, 'componentDidCatch');
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Test explosion' }),
            expect.objectContaining({ componentStack: expect.any(String) })
        );
        spy.mockRestore();
    });

    it('getDerivedStateFromError returns error state', () => {
        const err = new Error('test');
        const result = ErrorBoundary.getDerivedStateFromError(err);
        expect(result).toEqual({ hasError: true, error: err });
    });

    it('accepts optional componentName prop', () => {
        render(
            <ErrorBoundary componentName="TestWidget">
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('reload button can be clicked from error UI', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(() => fireEvent.click(screen.getByRole('button', { name: /reload application/i }))).not.toThrow();
    });

    it('does not clear data when reset is canceled', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        const clearLocalSpy = vi.spyOn(window.localStorage, 'clear');
        const clearSessionSpy = vi.spyOn(window.sessionStorage, 'clear');

        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /reset app data/i }));

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalledTimes(1);
        });
        expect(clearLocalSpy).not.toHaveBeenCalled();
        expect(clearSessionSpy).not.toHaveBeenCalled();
    });

    it('clears storage and deletes indexed databases when reset is confirmed', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
        const deleteDatabase = vi.fn();
        const databases = vi.fn().mockResolvedValue([{ name: 'db1' }, { name: undefined }, { name: 'db2' }]);

        window.localStorage.setItem('key', 'value');
        window.sessionStorage.setItem('skey', 'svalue');

        Object.defineProperty(window, 'indexedDB', {
            value: { databases, deleteDatabase },
            configurable: true,
        });

        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /reset app data/i }));

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
            expect(window.localStorage.getItem('key')).toBeNull();
            expect(window.sessionStorage.getItem('skey')).toBeNull();
            expect(databases).toHaveBeenCalledTimes(1);
            expect(deleteDatabase).toHaveBeenCalledWith('db1');
            expect(deleteDatabase).toHaveBeenCalledWith('db2');
        });
    });
});
