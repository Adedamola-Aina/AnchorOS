// @ts-nocheck
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/capacitor.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { UnsavedChangesProvider } from './hooks/useUnsavedChanges'
import { getPlatformClasses } from './utils/platform'
import { initStagingConsoleCapture } from './utils/stagingConsoleCapture'

initStagingConsoleCapture();

const initSentryDeferred = async () => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    const Sentry = await import('@sentry/react');
    const { APP_VERSION } = await import('./version');

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

// Add platform classes to body for native styling
if (document.body) {
    document.body.className = getPlatformClasses();
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
