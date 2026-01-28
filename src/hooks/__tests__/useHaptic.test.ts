/**
 * useHaptic Hook Tests
 * 
 * TDD: Write tests FIRST before implementation (CLAUDE.md Article 2)
 * 
 * Tests haptic feedback patterns for mobile interactions.
 * Note: Navigator.vibrate() is not available in jsdom, so we mock it.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHaptic } from '../useHaptic';
import type { HapticPattern } from '../useHaptic';

describe('useHaptic', () => {
    const mockVibrate = vi.fn();

    beforeEach(() => {
        // Mock navigator.vibrate
        vi.clearAllMocks();
        Object.defineProperty(navigator, 'vibrate', {
            value: mockVibrate,
            configurable: true,
            writable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Pattern Definitions', () => {
        it('provides light pattern for subtle feedback', () => {
            const { result } = renderHook(() => useHaptic());
            
            act(() => {
                result.current.trigger('light');
            });

            expect(mockVibrate).toHaveBeenCalledWith(10);
        });

        it('provides medium pattern for standard feedback', () => {
            const { result } = renderHook(() => useHaptic());
            
            act(() => {
                result.current.trigger('medium');
            });

            expect(mockVibrate).toHaveBeenCalledWith(25);
        });

        it('provides heavy pattern for important actions', () => {
            const { result } = renderHook(() => useHaptic());
            
            act(() => {
                result.current.trigger('heavy');
            });

            expect(mockVibrate).toHaveBeenCalledWith(50);
        });

        it('provides error pattern for failure feedback', () => {
            const { result } = renderHook(() => useHaptic());
            
            act(() => {
                result.current.trigger('error');
            });

            // Error uses a pattern: [short, pause, short, pause, short]
            expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50, 50, 50]);
        });

        it('provides success pattern for completion feedback', () => {
            const { result } = renderHook(() => useHaptic());
            
            act(() => {
                result.current.trigger('success');
            });

            // Success: short double tap
            expect(mockVibrate).toHaveBeenCalledWith([15, 50, 15]);
        });
    });

    describe('Enabled/Disabled State', () => {
        it('respects enabled option', () => {
            const { result } = renderHook(() => useHaptic({ enabled: true }));
            
            act(() => {
                result.current.trigger('medium');
            });

            expect(mockVibrate).toHaveBeenCalled();
        });

        it('does not vibrate when disabled', () => {
            const { result } = renderHook(() => useHaptic({ enabled: false }));
            
            act(() => {
                result.current.trigger('medium');
            });

            expect(mockVibrate).not.toHaveBeenCalled();
        });

        it('is enabled by default', () => {
            const { result } = renderHook(() => useHaptic());
            
            expect(result.current.isEnabled).toBe(true);
        });
    });

    describe('Browser Support', () => {
        it('gracefully handles missing vibrate API', () => {
            // Remove vibrate support
            Object.defineProperty(navigator, 'vibrate', {
                value: undefined,
                configurable: true,
            });

            const { result } = renderHook(() => useHaptic());
            
            // Should not throw
            expect(() => {
                act(() => {
                    result.current.trigger('medium');
                });
            }).not.toThrow();
        });

        it('reports support status correctly', () => {
            const { result } = renderHook(() => useHaptic());
            
            expect(result.current.isSupported).toBe(true);
        });

        it('reports unsupported when vibrate is missing', () => {
            Object.defineProperty(navigator, 'vibrate', {
                value: undefined,
                configurable: true,
            });

            const { result } = renderHook(() => useHaptic());
            
            expect(result.current.isSupported).toBe(false);
        });
    });

    describe('Pattern Types', () => {
        it('accepts all defined pattern types', () => {
            const patterns: HapticPattern[] = ['light', 'medium', 'heavy', 'error', 'success'];
            const { result } = renderHook(() => useHaptic());

            patterns.forEach((pattern) => {
                expect(() => {
                    act(() => {
                        result.current.trigger(pattern);
                    });
                }).not.toThrow();
            });
        });
    });
});
