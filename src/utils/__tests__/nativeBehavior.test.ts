import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('nativeBehavior', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.resetModules();
    document.documentElement.className = '';
    document.body.className = '';
  });

  afterEach(() => {
    // Restore window.Capacitor if tests modified it
    if ('Capacitor' in window) {
      delete (window as { Capacitor?: unknown }).Capacitor;
    }
    // @ts-expect-error — restore for next test
    globalThis.window = originalWindow;
  });

  describe('applyPlatformClasses', () => {
    it('adds platform-web class to html and body on web', async () => {
      const { applyPlatformClasses } = await import('../nativeBehavior');
      applyPlatformClasses();
      expect(document.documentElement.className).toContain('platform-web');
      expect(document.body.className).toContain('platform-web');
    });

    it('adds platform-ios + platform-native when Capacitor reports iOS', async () => {
      (window as unknown as { Capacitor: unknown }).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
        isPluginAvailable: () => false,
      };
      const { applyPlatformClasses } = await import('../nativeBehavior');
      applyPlatformClasses();
      expect(document.documentElement.className).toContain('platform-ios');
      expect(document.documentElement.className).toContain('platform-native');
      expect(document.body.className).toContain('platform-ios');
      expect(document.body.className).toContain('platform-native');
    });
  });

  describe('initNativeBehavior', () => {
    it('is a no-op listener setup on web (context menu still fires)', async () => {
      const { initNativeBehavior } = await import('../nativeBehavior');
      initNativeBehavior();

      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      document.body.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('prevents contextmenu on native (long-press / right-click)', async () => {
      (window as unknown as { Capacitor: unknown }).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
        isPluginAvailable: () => false,
      };
      const { initNativeBehavior } = await import('../nativeBehavior');
      initNativeBehavior();

      const div = document.createElement('div');
      document.body.appendChild(div);
      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      div.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('allows contextmenu on editable inputs on native', async () => {
      (window as unknown as { Capacitor: unknown }).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
        isPluginAvailable: () => false,
      };
      const { initNativeBehavior } = await import('../nativeBehavior');
      initNativeBehavior();

      const input = document.createElement('input');
      document.body.appendChild(input);
      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      input.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('allows contextmenu inside .selectable regions on native', async () => {
      (window as unknown as { Capacitor: unknown }).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
        isPluginAvailable: () => false,
      };
      const { initNativeBehavior } = await import('../nativeBehavior');
      initNativeBehavior();

      const wrap = document.createElement('div');
      wrap.className = 'selectable';
      const inner = document.createElement('span');
      wrap.appendChild(inner);
      document.body.appendChild(wrap);

      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      inner.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('prevents dragstart on native', async () => {
      (window as unknown as { Capacitor: unknown }).Capacitor = {
        getPlatform: () => 'android',
        isNativePlatform: () => true,
        isPluginAvailable: () => false,
      };
      const { initNativeBehavior } = await import('../nativeBehavior');
      initNativeBehavior();

      const img = document.createElement('img');
      document.body.appendChild(img);
      const ev = new Event('dragstart', { bubbles: true, cancelable: true });
      img.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(true);
    });
  });
});
