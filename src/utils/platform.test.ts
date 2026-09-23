import { describe, it, expect, afterEach } from 'vitest';
import { getPlatformClasses, isPWA } from './platform';

const setInstalled = () => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({ matches: query.includes('standalone') }),
  });
};

const setBrowserTab = () => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({ matches: false }),
  });
  Object.defineProperty(navigator, 'standalone', { configurable: true, value: false });
};

describe('platform utilities', () => {
  afterEach(() => {
    document.documentElement.className = '';
  });

  it('detects an installed PWA from display-mode: standalone', () => {
    setInstalled();
    expect(isPWA()).toBe(true);
  });

  it('does not detect a normal browser tab as an installed PWA', () => {
    setBrowserTab();
    expect(isPWA()).toBe(false);
  });

  it('exposes platform classes for CSS', () => {
    setInstalled();
    expect(getPlatformClasses()).toBe('platform-pwa platform-app');

    setBrowserTab();
    expect(getPlatformClasses()).toBe('platform-web');
  });
});