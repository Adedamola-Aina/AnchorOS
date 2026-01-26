/**
 * Tests for useKeyboardAvoidance hook
 * 
 * Per CLAUDE.md TDD mandate - write tests FIRST
 * BUG-002: iOS keyboard covers input fields
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardAvoidance } from './useKeyboardAvoidance';

// Mock visualViewport API
const createMockVisualViewport = (height: number) => ({
    height,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
});

describe('useKeyboardAvoidance', () => {
    let originalVisualViewport: VisualViewport | null;
    let mockVisualViewport: ReturnType<typeof createMockVisualViewport>;

    beforeEach(() => {
        originalVisualViewport = window.visualViewport;
        mockVisualViewport = createMockVisualViewport(800);
        Object.defineProperty(window, 'visualViewport', {
            value: mockVisualViewport,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'visualViewport', {
            value: originalVisualViewport,
            writable: true,
            configurable: true,
        });
    });

    describe('initialization', () => {
        it('returns initial state with no keyboard visible', () => {
            const { result } = renderHook(() => useKeyboardAvoidance());

            expect(result.current.isKeyboardVisible).toBe(false);
            expect(result.current.keyboardHeight).toBe(0);
        });

        it('registers resize event listener on visualViewport', () => {
            renderHook(() => useKeyboardAvoidance());

            expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith(
                'resize',
                expect.any(Function)
            );
        });

        it('removes event listener on unmount', () => {
            const { unmount } = renderHook(() => useKeyboardAvoidance());
            unmount();

            expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith(
                'resize',
                expect.any(Function)
            );
        });
    });

    describe('keyboard detection', () => {
        it('detects keyboard when visualViewport height decreases significantly', () => {
            const { result } = renderHook(() => useKeyboardAvoidance());

            // Simulate keyboard appearing (viewport shrinks by 300px)
            act(() => {
                mockVisualViewport.height = 500;
                const resizeHandler = mockVisualViewport.addEventListener.mock.calls[0][1];
                resizeHandler();
            });

            expect(result.current.isKeyboardVisible).toBe(true);
            expect(result.current.keyboardHeight).toBe(300);
        });

        it('does not detect keyboard for small viewport changes', () => {
            const { result } = renderHook(() => useKeyboardAvoidance());

            // Simulate small change (e.g., toolbar appearing)
            act(() => {
                mockVisualViewport.height = 750;
                const resizeHandler = mockVisualViewport.addEventListener.mock.calls[0][1];
                resizeHandler();
            });

            expect(result.current.isKeyboardVisible).toBe(false);
            expect(result.current.keyboardHeight).toBe(0);
        });

        it('detects keyboard hidden when viewport returns to normal', () => {
            const { result } = renderHook(() => useKeyboardAvoidance());

            // Keyboard appears
            act(() => {
                mockVisualViewport.height = 500;
                const resizeHandler = mockVisualViewport.addEventListener.mock.calls[0][1];
                resizeHandler();
            });

            expect(result.current.isKeyboardVisible).toBe(true);

            // Keyboard hides
            act(() => {
                mockVisualViewport.height = 800;
                const resizeHandler = mockVisualViewport.addEventListener.mock.calls[0][1];
                resizeHandler();
            });

            expect(result.current.isKeyboardVisible).toBe(false);
            expect(result.current.keyboardHeight).toBe(0);
        });
    });

    describe('scroll behavior', () => {
        it('provides scrollIntoView function for focused element', () => {
            const { result } = renderHook(() => useKeyboardAvoidance());

            expect(typeof result.current.scrollActiveElementIntoView).toBe('function');
        });

        it('handles case when visualViewport is not supported', () => {
            Object.defineProperty(window, 'visualViewport', {
                value: null,
                writable: true,
                configurable: true,
            });

            const { result } = renderHook(() => useKeyboardAvoidance());

            // Should not throw, return safe defaults
            expect(result.current.isKeyboardVisible).toBe(false);
            expect(result.current.keyboardHeight).toBe(0);
        });
    });
});
