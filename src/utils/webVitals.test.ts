import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('reportWebVitals', () => {
    let reportWebVitals: typeof import('./webVitals').reportWebVitals;
    let mockSentry: { addBreadcrumb: ReturnType<typeof vi.fn> };

    // Sentry is lazy-loaded in the app — enable a test DSN so the SDK mock
    // resolves, and flush a macrotask before asserting on breadcrumbs.
    const flushSentry = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

    beforeEach(async () => {
        vi.resetModules();
        // @ts-expect-error test env wiring
        import.meta.env.VITE_SENTRY_DSN = 'test-dsn';

        mockSentry = { addBreadcrumb: vi.fn() };
        vi.doMock('@sentry/react', () => mockSentry);

        // Mock web-vitals to call handler immediately
        vi.doMock('web-vitals', () => ({
            onCLS: vi.fn((cb) => cb({ name: 'CLS', value: 0.05, rating: 'good', id: 'v1-1' })),
            onLCP: vi.fn((cb) => cb({ name: 'LCP', value: 1200, rating: 'good', id: 'v1-2' })),
            onINP: vi.fn((cb) => cb({ name: 'INP', value: 150, rating: 'needs-improvement', id: 'v1-3' })),
            onTTFB: vi.fn((cb) => cb({ name: 'TTFB', value: 300, rating: 'good', id: 'v1-4' })),
        }));

        const mod = await import('./webVitals');
        reportWebVitals = mod.reportWebVitals;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('registers all 4 web vital metrics', async () => {
        const webVitals = await import('web-vitals');
        reportWebVitals();

        expect(webVitals.onCLS).toHaveBeenCalled();
        expect(webVitals.onLCP).toHaveBeenCalled();
        expect(webVitals.onINP).toHaveBeenCalled();
        expect(webVitals.onTTFB).toHaveBeenCalled();
    });

    it('reports metrics as sentry breadcrumbs', async () => {
        reportWebVitals();
        await flushSentry();

        expect(mockSentry.addBreadcrumb).toHaveBeenCalledTimes(4);
        expect(mockSentry.addBreadcrumb).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'web-vital',
                message: expect.stringContaining('CLS'),
                data: expect.objectContaining({ value: 0.05, rating: 'good' }),
            })
        );
    });

    it('sets warning level for needs-improvement metrics', async () => {
        reportWebVitals();
        await flushSentry();

        const inpCall = mockSentry.addBreadcrumb.mock.calls.find(
            (c: unknown[]) => (c[0] as { message: string }).message.includes('INP')
        );
        expect(inpCall).toBeDefined();
        expect(inpCall![0].level).toBe('warning');
    });

    it('sets info level for good metrics', async () => {
        reportWebVitals();
        await flushSentry();

        const clsCall = mockSentry.addBreadcrumb.mock.calls.find(
            (c: unknown[]) => (c[0] as { message: string }).message.includes('CLS')
        );
        expect(clsCall![0].level).toBe('info');
    });
});
