// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeatureErrorBoundary } from './FeatureErrorBoundary';

// Component that throws an error for testing
const ErrorThrowingComponent = () => {
    throw new Error('Test error');
};

// Component that works normally
const WorkingComponent = () => <div>Working content</div>;

describe('FeatureErrorBoundary', () => {
    // Suppress console.error for these tests
    const originalError = console.error;
    beforeAll(() => {
        console.error = vi.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    it('renders children when no error occurs', () => {
        render(
            <FeatureErrorBoundary featureName="Finance">
                <WorkingComponent />
            </FeatureErrorBoundary>
        );

        expect(screen.getByText('Working content')).toBeInTheDocument();
    });

    it('catches errors and shows error UI', () => {
        render(
            <FeatureErrorBoundary featureName="Finance">
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        expect(screen.getByText('Unable to load Finance')).toBeInTheDocument();
        expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });

    it('displays feature name in error message', () => {
        render(
            <FeatureErrorBoundary featureName="Commitments">
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        expect(screen.getByText('Unable to load Commitments')).toBeInTheDocument();
    });

    it('shows "Try Again" and "Report Issue" buttons', () => {
        render(
            <FeatureErrorBoundary featureName="Finance">
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        expect(screen.getByRole('button', { name: /Retry loading Finance/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Report this issue/i })).toBeInTheDocument();
    });

    it('calls onReset callback when "Try Again" is clicked', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();

        render(
            <FeatureErrorBoundary featureName="Finance" onReset={onReset}>
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        const tryAgainButton = screen.getByRole('button', { name: /Retry loading Finance/i });
        await user.click(tryAgainButton);

        expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('resets error state when "Try Again" is clicked', async () => {
        const user = userEvent.setup();
        let shouldThrow = true;

        const ConditionalErrorComponent = () => {
            if (shouldThrow) {
                throw new Error('Test error');
            }
            return <div>Recovered content</div>;
        };

        render(
            <FeatureErrorBoundary featureName="Finance">
                <ConditionalErrorComponent />
            </FeatureErrorBoundary>
        );

        // Error UI should be visible
        expect(screen.getByText('Unable to load Finance')).toBeInTheDocument();

        // Fix the error
        shouldThrow = false;

        // Click retry
        const tryAgainButton = screen.getByRole('button', { name: /Retry loading Finance/i });
        await user.click(tryAgainButton);

        // Should show recovered content
        expect(screen.getByText('Recovered content')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        const customFallback = <div>Custom error message</div>;

        render(
            <FeatureErrorBoundary featureName="Finance" fallback={customFallback}>
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        expect(screen.getByText('Custom error message')).toBeInTheDocument();
        expect(screen.queryByText('Unable to load Finance')).not.toBeInTheDocument();
    });

    it('has accessible button labels', () => {
        render(
            <FeatureErrorBoundary featureName="Finance">
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        const tryAgainButton = screen.getByRole('button', { name: /Retry loading Finance/i });
        const reportButton = screen.getByRole('button', { name: /Report this issue/i });

        expect(tryAgainButton).toBeInTheDocument();
        expect(reportButton).toBeInTheDocument();
    });

    it('opens mailto link when "Report Issue" is clicked', async () => {
        const user = userEvent.setup();

        // Mock window.location.href
        const originalLocation = window.location;
        delete (window as any).location;
        window.location = { ...originalLocation, href: '' } as any;

        render(
            <FeatureErrorBoundary featureName="Finance">
                <ErrorThrowingComponent />
            </FeatureErrorBoundary>
        );

        const reportButton = screen.getByRole('button', { name: /Report this issue/i });
        await user.click(reportButton);

        expect(window.location.href).toContain('mailto:workmail@adedamola.us');
        expect(window.location.href).toContain('subject=%5BBug%5D%20Finance%20Error');

        // Restore
        Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
    });
});
