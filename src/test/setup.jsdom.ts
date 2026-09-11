// @ts-nocheck
// jsdom-only setup: DOM/browser globals and @testing-library/jest-dom matchers.
// Loaded exclusively by the `jsdom` Vitest project, after the shared setup
// (src/test/setup.ts) which provides the Firebase mocks.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver for @tanstack/react-virtual
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
