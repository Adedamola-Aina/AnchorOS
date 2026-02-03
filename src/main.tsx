import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.VITE_APP_ENV || 'development',
    debug: import.meta.env.VITE_APP_ENV === 'staging', // Enable debug mode in Staging for diagnosis
});

// SILENCE LOGS IN PRODUCTION
if (import.meta.env.VITE_APP_ENV === 'production') {
    console.log = () => { };
    console.warn = () => { };
    console.info = () => { };
    console.debug = () => { };
    console.error = () => { }; // Also silence error logging to console (Sentry still catches it)
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
