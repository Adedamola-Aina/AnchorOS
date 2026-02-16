/**
 * systemTheme — theme detection and subscription
 * Target: 95%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSystemTheme, getEffectiveTheme, subscribeToSystemTheme, hasUserThemePreference, clearThemePreference } from './systemTheme';

describe('systemTheme', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getSystemTheme', () => {
        it('returns "dark" when prefers-color-scheme: dark matches', () => {
            vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
            expect(getSystemTheme()).toBe('dark');
        });

        it('returns "light" when prefers-color-scheme: dark does not match', () => {
            vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
            expect(getSystemTheme()).toBe('light');
        });
    });

    describe('getEffectiveTheme', () => {
        it('returns saved theme from localStorage when present', () => {
            localStorage.setItem('anchor_theme', 'dark');
            expect(getEffectiveTheme()).toBe('dark');
        });

        it('returns "light" when saved theme is "light"', () => {
            localStorage.setItem('anchor_theme', 'light');
            expect(getEffectiveTheme()).toBe('light');
        });

        it('falls back to system theme when no saved preference', () => {
            vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
            expect(getEffectiveTheme()).toBe('dark');
        });

        it('ignores invalid localStorage values', () => {
            localStorage.setItem('anchor_theme', 'blue');
            vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
            expect(getEffectiveTheme()).toBe('light');
        });
    });

    describe('subscribeToSystemTheme', () => {
        it('subscribes using addEventListener when available', () => {
            const addListenerMock = vi.fn();
            const removeListenerMock = vi.fn();
            vi.spyOn(window, 'matchMedia').mockReturnValue({
                matches: false,
                addEventListener: addListenerMock,
                removeEventListener: removeListenerMock,
            } as any);

            const cb = vi.fn();
            const unsub = subscribeToSystemTheme(cb);

            expect(addListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

            // Trigger the handler
            const handler = addListenerMock.mock.calls[0][1];
            handler({ matches: true } as MediaQueryListEvent);
            expect(cb).toHaveBeenCalledWith('dark');

            handler({ matches: false } as MediaQueryListEvent);
            expect(cb).toHaveBeenCalledWith('light');

            // Cleanup
            unsub();
            expect(removeListenerMock).toHaveBeenCalledWith('change', handler);
        });

        it('falls back to addListener for legacy browsers', () => {
            const addListenerLegacy = vi.fn();
            const removeListenerLegacy = vi.fn();
            vi.spyOn(window, 'matchMedia').mockReturnValue({
                matches: false,
                addEventListener: undefined,
                addListener: addListenerLegacy,
                removeListener: removeListenerLegacy,
            } as any);

            const cb = vi.fn();
            const unsub = subscribeToSystemTheme(cb);

            expect(addListenerLegacy).toHaveBeenCalled();

            unsub();
            expect(removeListenerLegacy).toHaveBeenCalled();
        });
    });

    describe('hasUserThemePreference', () => {
        it('returns true when anchor_theme is "light"', () => {
            localStorage.setItem('anchor_theme', 'light');
            expect(hasUserThemePreference()).toBe(true);
        });

        it('returns true when anchor_theme is "dark"', () => {
            localStorage.setItem('anchor_theme', 'dark');
            expect(hasUserThemePreference()).toBe(true);
        });

        it('returns false when no preference saved', () => {
            expect(hasUserThemePreference()).toBe(false);
        });

        it('returns false for invalid values', () => {
            localStorage.setItem('anchor_theme', 'invalid');
            expect(hasUserThemePreference()).toBe(false);
        });
    });

    describe('clearThemePreference', () => {
        it('removes anchor_theme from localStorage', () => {
            localStorage.setItem('anchor_theme', 'dark');
            clearThemePreference();
            expect(localStorage.getItem('anchor_theme')).toBeNull();
        });
    });
});
