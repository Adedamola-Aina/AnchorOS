import { describe, it, expect, vi, beforeEach } from 'vitest';

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

describe('nativeBehavior', () => {
  beforeEach(() => {
    vi.resetModules();
    document.documentElement.className = '';
    document.body.className = '';
  });

  describe('applyPlatformClasses', () => {
    it('adds platform-web class to html and body in a browser tab', async () => {
      setBrowserTab();
      const { applyPlatformClasses } = await import('../nativeBehavior');
      applyPlatformClasses();
      expect(document.documentElement.className).toContain('platform-web');
      expect(document.body.className).toContain('platform-web');
    });

    it('adds platform-pwa + platform-app classes when installed', async () => {
      setInstalled();
      const { applyPlatformClasses } = await import('../nativeBehavior');
      applyPlatformClasses();
      expect(document.documentElement.className).toContain('platform-pwa');
      expect(document.documentElement.className).toContain('platform-app');
      expect(document.body.className).toContain('platform-pwa');
    });
  });

  describe('initAppShellBehavior', () => {
    it('is a no-op in a browser tab (context menu still fires)', async () => {
      setBrowserTab();
      const { initAppShellBehavior } = await import('../nativeBehavior');
      initAppShellBehavior();

      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      document.body.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('prevents contextmenu when installed (long-press / right-click)', async () => {
      setInstalled();
      const { initAppShellBehavior } = await import('../nativeBehavior');
      initAppShellBehavior();

      const div = document.createElement('div');
      document.body.appendChild(div);
      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      div.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('allows contextmenu on editable inputs when installed', async () => {
      setInstalled();
      const { initAppShellBehavior } = await import('../nativeBehavior');
      initAppShellBehavior();

      const input = document.createElement('input');
      document.body.appendChild(input);
      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      input.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('allows contextmenu inside .selectable regions when installed', async () => {
      setInstalled();
      const { initAppShellBehavior } = await import('../nativeBehavior');
      initAppShellBehavior();

      const wrap = document.createElement('div');
      wrap.className = 'selectable';
      const inner = document.createElement('span');
      wrap.appendChild(inner);
      document.body.appendChild(wrap);

      const ev = new Event('contextmenu', { bubbles: true, cancelable: true });
      inner.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('prevents dragstart when installed', async () => {
      setInstalled();
      const { initAppShellBehavior } = await import('../nativeBehavior');
      initAppShellBehavior();

      const img = document.createElement('img');
      document.body.appendChild(img);
      const ev = new Event('dragstart', { bubbles: true, cancelable: true });
      img.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(true);
    });
  });
});