/**
 * useVersionCheck - Automatic version checking and cache busting
 * 
 * This hook periodically checks if a new version of the app is available.
 * When detected, it automatically refreshes the page to load the new version.
 * 
 * How it works:
 * 1. On build, Vite generates index.html with unique asset hashes
 * 2. Every 60 seconds, we fetch the latest index.html from the server
 * 3. If the asset hashes have changed, a new version is available
 * 4. We show a brief toast and auto-reload after 2 seconds
 */

import { useEffect, useRef, useCallback } from 'react';

const CHECK_INTERVAL_MS = 60 * 1000; // Check every 60 seconds
const RELOAD_DELAY_MS = 2000; // Show notification for 2 seconds before reload

// Extract the main JS bundle hash from HTML content
function extractBundleHash(html: string): string | null {
    // Match the index-*.js file which has a unique hash per build
    const match = html.match(/assets\/index-([a-zA-Z0-9]+)\.js/);
    return match ? match[1] : null;
}

export function useVersionCheck(enabled: boolean = true) {
    const currentHashRef = useRef<string | null>(null);
    const isCheckingRef = useRef(false);

    const checkForUpdate = useCallback(async () => {
        if (isCheckingRef.current) return;
        isCheckingRef.current = true;

        try {
            // Fetch the latest index.html with cache-busting
            const response = await fetch('/', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                isCheckingRef.current = false;
                return;
            }

            const html = await response.text();
            const latestHash = extractBundleHash(html);

            if (!latestHash) {
                isCheckingRef.current = false;
                return;
            }

            // First run - store the current hash
            if (currentHashRef.current === null) {
                currentHashRef.current = latestHash;
                isCheckingRef.current = false;
                return;
            }

            // Check if hash has changed
            if (latestHash !== currentHashRef.current) {
                console.log('[VersionCheck] New version detected! Reloading...');

                // Brief notification before reload
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-[9999] animate-pulse font-bold text-sm';
                toast.textContent = '🚀 New version available! Refreshing...';
                document.body.appendChild(toast);

                // Reload after brief delay
                setTimeout(() => {
                    window.location.reload();
                }, RELOAD_DELAY_MS);
            }
        } catch (error) {
            // Silently fail - network issues shouldn't break the app
            console.debug('[VersionCheck] Check failed:', error);
        } finally {
            isCheckingRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        // Don't run in development mode
        if (import.meta.env.DEV) {
            console.debug('[VersionCheck] Disabled in development mode');
            return;
        }

        // Initial check after 5 seconds (to not block initial load)
        const initialTimeout = setTimeout(checkForUpdate, 5000);

        // Periodic checks
        const interval = setInterval(checkForUpdate, CHECK_INTERVAL_MS);

        // Also check when tab becomes visible (user returns to app)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkForUpdate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled, checkForUpdate]);
}
