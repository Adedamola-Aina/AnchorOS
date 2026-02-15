import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const initSentryDeferred = async () => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    const Sentry = await import('@sentry/react');
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: import.meta.env.VITE_APP_ENV || 'development',
        debug: import.meta.env.VITE_APP_ENV === 'staging',
    });
};

if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
        void initSentryDeferred();
    }, { timeout: 1500 });
} else {
    setTimeout(() => {
        void initSentryDeferred();
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

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)

const bootSplash = document.getElementById('boot-splash');
if (bootSplash) {
    requestAnimationFrame(() => {
        bootSplash.remove();
    });
}
