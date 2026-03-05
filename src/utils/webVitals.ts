/**
 * Web Vitals reporting — captures CLS, LCP, INP, FID, TTFB
 * and reports to Sentry as breadcrumbs for production monitoring.
 */

import * as Sentry from '@sentry/react';
import { onCLS, onLCP, onINP, onFID, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

function sendToSentry(metric: Metric): void {
    const level = metric.rating === 'good' ? 'info' : 'warning';
    Sentry.addBreadcrumb({
        category: 'web-vital',
        message: `${metric.name}: ${metric.value}`,
        level,
        data: {
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
        },
    });
}

export function reportWebVitals(): void {
    onCLS(sendToSentry);
    onLCP(sendToSentry);
    onINP(sendToSentry);
    onFID(sendToSentry);
    onTTFB(sendToSentry);
}
