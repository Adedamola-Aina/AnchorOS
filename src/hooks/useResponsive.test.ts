/**
 * Tests for useResponsive hook
 * 
 * Per MOBILE_OPTIMIZATION_DIRECTIVE.md M1.1: "Write tests for useResponsive FIRST"
 */
// @ts-nocheck


import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useResponsive } from './useResponsive';

// Helper to mock window.innerWidth
const mockWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
};

// Mock matchMedia for breakpoint listeners
const createMatchMediaMock = (matches: boolean) => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    media: '',
    onchange: null,
    dispatchEvent: vi.fn(),
});

describe('useResponsive', () => {
    const originalInnerWidth = window.innerWidth;
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
        // Reset to desktop by default
        mockWindowWidth(1280);
        window.matchMedia = vi.fn().mockImplementation(() => createMatchMediaMock(false));
    });

    afterEach(() => {
        mockWindowWidth(originalInnerWidth);
        window.matchMedia = originalMatchMedia;
    });

    describe('breakpoint detection', () => {
        it('detects mobile breakpoint for width < 768px', () => {
            mockWindowWidth(320);
            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('mobile');
            expect(result.current.isMobile).toBe(true);
            expect(result.current.isTablet).toBe(false);
            expect(result.current.isDesktop).toBe(false);
        });

        it('detects tablet breakpoint for width 768px - 1023px', () => {
            mockWindowWidth(800);
            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('tablet');
            expect(result.current.isMobile).toBe(false);
            expect(result.current.isTablet).toBe(true);
            expect(result.current.isDesktop).toBe(false);
        });

        it('detects desktop breakpoint for width >= 1024px', () => {
            mockWindowWidth(1280);
            const { result } = renderHook(() => useResponsive());

            expect(result.current.breakpoint).toBe('desktop');
            expect(result.current.isMobile).toBe(false);
            expect(result.current.isTablet).toBe(false);
            expect(result.current.isDesktop).toBe(true);
        });
    });

    describe('boundary values', () => {
        it('767px is mobile', () => {
            mockWindowWidth(767);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.breakpoint).toBe('mobile');
        });

        it('768px is tablet', () => {
            mockWindowWidth(768);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.breakpoint).toBe('tablet');
        });

        it('1023px is tablet', () => {
            mockWindowWidth(1023);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.breakpoint).toBe('tablet');
        });

        it('1024px is desktop', () => {
            mockWindowWidth(1024);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.breakpoint).toBe('desktop');
        });
    });

    describe('isTouchDevice flag', () => {
        it('isTouchDevice is true for mobile', () => {
            mockWindowWidth(320);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.isTouchDevice).toBe(true);
        });

        it('isTouchDevice is true for tablet', () => {
            mockWindowWidth(800);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.isTouchDevice).toBe(true);
        });

        it('isTouchDevice is false for desktop', () => {
            mockWindowWidth(1280);
            const { result } = renderHook(() => useResponsive());
            expect(result.current.isTouchDevice).toBe(false);
        });
    });

    describe('event listeners', () => {
        it('sets up matchMedia listeners on mount', () => {
            const mockAddListener = vi.fn();
            window.matchMedia = vi.fn().mockImplementation(() => ({
                ...createMatchMediaMock(false),
                addEventListener: mockAddListener,
            }));

            renderHook(() => useResponsive());

            expect(mockAddListener).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('cleans up listeners on unmount', () => {
            const mockRemoveListener = vi.fn();
            window.matchMedia = vi.fn().mockImplementation(() => ({
                ...createMatchMediaMock(false),
                addEventListener: vi.fn(),
                removeEventListener: mockRemoveListener,
            }));

            const { unmount } = renderHook(() => useResponsive());
            unmount();

            expect(mockRemoveListener).toHaveBeenCalledWith('change', expect.any(Function));
        });
    });
});
