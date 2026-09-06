/**
 * Web Vitals reporting — captures CLS, LCP, INP, TTFB
 * and reports to Sentry as breadcrumbs for production monitoring.
 */

import { getSentry } from './lazySentry';
import { onCLS, onLCP, onINP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

function sendToSentry(metric: Metric): void {
    const level = metric.rating === 'good' ? 'info' : 'warning';
    void getSentry().then((Sentry) =>
        Sentry?.addBreadcrumb({
            category: 'web-vital',
        message: `${metric.name}: ${metric.value}`,
        level,
        data: {
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
        },
    }));
}

export function reportWebVitals(): void {
    onCLS(sendToSentry);
    onLCP(sendToSentry);
    onINP(sendToSentry);
    onTTFB(sendToSentry);
}
