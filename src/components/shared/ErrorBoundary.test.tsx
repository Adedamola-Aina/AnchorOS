// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
