/**
 * System Theme Detection Utility (PWA-006)
 * 
 * Detects and monitors system color scheme preference on iOS/Android/Desktop.
 * Uses prefers-color-scheme media query for cross-platform support.
 */

type Theme = 'light' | 'dark';

/**
 * Get the current system theme preference
 * Works on iOS, Android, macOS, Windows
 */
export function getSystemTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
}

/**
 * Get the effective theme to use
 * Priority: localStorage > system preference > 'light' fallback
 */
export function getEffectiveTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    const savedTheme = localStorage.getItem('anchor_theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    // No saved preference - use system theme
    return getSystemTheme();
}

/**
 * Subscribe to system theme changes
 * Useful for updating UI when user changes device settings
 * 
 * @param callback Function called when system theme changes
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToSystemTheme(callback: (theme: Theme) => void): () => void {
    if (typeof window === 'undefined') return () => { };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
        callback(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }

    // Legacy Safari (iOS 13 and earlier)
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
}

/**
 * Check if user has explicitly set a theme preference
 */
export function hasUserThemePreference(): boolean {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('anchor_theme');
    return saved === 'light' || saved === 'dark';
}

/**
 * Clear user's theme preference (revert to system theme)
 */
export function clearThemePreference(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('anchor_theme');
    }
}
