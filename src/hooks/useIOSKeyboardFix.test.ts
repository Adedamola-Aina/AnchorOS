// @ts-nocheck
import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIOSKeyboardFix } from './useIOSKeyboardFix';

describe('useIOSKeyboardFix', () => {
  const originalUserAgent = navigator.userAgent;
  const originalPlatform = navigator.platform;

  const setIOS = () => {
    Object.defineProperty(navigator, 'userAgent', { value: 'iPhone', configurable: true });
    Object.defineProperty(navigator, 'platform', { value: 'iPhone', configurable: true });
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
  };

  const setDesktop = () => {
    Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0 (X11; Linux x86_64)', configurable: true });
    Object.defineProperty(navigator, 'platform', { value: 'Linux x86_64', configurable: true });
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
  };

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
    Object.defineProperty(navigator, 'platform', { value: originalPlatform, configurable: true });
    document.documentElement.classList.remove('is-ios');
  });

  it('adds is-ios class on iOS devices', () => {
    setIOS();
    const { unmount } = renderHook(() => useIOSKeyboardFix());
    expect(document.documentElement.classList.contains('is-ios')).toBe(true);
    unmount();
    expect(document.documentElement.classList.contains('is-ios')).toBe(false);
  });

  it('does not add is-ios class on non-iOS devices', () => {
    setDesktop();
    renderHook(() => useIOSKeyboardFix());
    expect(document.documentElement.classList.contains('is-ios')).toBe(false);
  });

  it('sets autocomplete=off on focused inputs without explicit autocomplete', () => {
    setIOS();
    renderHook(() => useIOSKeyboardFix());

    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.getAttribute('autocorrect')).toBe('off');

    document.body.removeChild(input);
  });

  it('preserves explicit autocomplete values like current-password', () => {
    setIOS();
    renderHook(() => useIOSKeyboardFix());

    const input = document.createElement('input');
    input.type = 'password';
    input.setAttribute('autocomplete', 'current-password');
    document.body.appendChild(input);

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.getAttribute('autocomplete')).toBe('current-password');

    document.body.removeChild(input);
  });

  it('ignores non-input elements', () => {
    setIOS();
    renderHook(() => useIOSKeyboardFix());

    const div = document.createElement('div');
    document.body.appendChild(div);
    // Should not throw
    div.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(div.getAttribute('autocomplete')).toBeNull();

    document.body.removeChild(div);
  });
});
