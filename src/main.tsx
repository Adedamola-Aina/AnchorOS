// @ts-nocheck
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/capacitor.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { UnsavedChangesProvider } from './hooks/useUnsavedChanges'
import { initNativeBehavior } from './utils/nativeBehavior'
import { initStagingConsoleCapture } from './utils/stagingConsoleCapture'
import { APP_VERSION } from './version'

initStagingConsoleCapture();

const initSentryDeferred = async () => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    const Sentry = await import('@sentry/react');
    const { APP_VERSION } = await import('./version');
    // SEC-007: scrub PII before events leave the device
    const { sentryBeforeSend } = await import('./utils/sentryPiiScrubber');

    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        release: APP_VERSION,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        tracesSampleRate: __APP_ENV__ === 'production' ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: __APP_ENV__,
        debug: __APP_ENV__ === 'staging',
        // SEC-007: Strip account numbers, balances, Firestore IDs, and emails
        beforeSend: sentryBeforeSend,
    });
};

const initWebVitalsDeferred = async () => {
    const { reportWebVitals } = await import('./utils/webVitals');
    reportWebVitals();
};

if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
        void initSentryDeferred();
        void initWebVitalsDeferred();
    }, { timeout: 1500 });
} else {
    setTimeout(() => {
        void initSentryDeferred();
        void initWebVitalsDeferred();
    }, 500);
}

// SILENCE VERBOSE LOGS IN PRODUCTION
// Keep console.error alive — Sentry uses it for breadcrumbs and stack traces
if (import.meta.env.VITE_APP_ENV === 'production') {
    console.log = () => { };
    console.info = () => { };
    console.debug = () => { };
    // console.warn and console.error are preserved for Sentry breadcrumb capture
}

// Apply platform classes + install native behaviour guards
// (no-op on web; disables long-press menu, drag-out, pinch & double-tap zoom on native)
initNativeBehavior();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`).catch((error) => {
            console.warn('SW registration failed:', error);
        });
    });
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <UnsavedChangesProvider>
                <App />
            </UnsavedChangesProvider>
        </BrowserRouter>
    </StrictMode>,
)

const bootSplash = document.getElementById('boot-splash');
if (bootSplash) {
    requestAnimationFrame(() => {
        bootSplash.remove();
    });
}
