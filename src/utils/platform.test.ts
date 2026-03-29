import { describe, it, expect, beforeEach } from 'vitest';
import { getPlatform, isNative, isIOS, isAndroid, isPluginAvailable } from './platform';

describe('platform utilities', () => {
  beforeEach(() => {
    // Reset window.Capacitor before each test
    delete (window as any).Capacitor;
  });

  describe('getPlatform', () => {
    it('returns "web" when Capacitor is not available', () => {
      expect(getPlatform()).toBe('web');
    });

    it('returns "ios" when running on iOS', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
      };
      expect(getPlatform()).toBe('ios');
    });

    it('returns "android" when running on Android', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'android',
        isNativePlatform: () => true,
      };
      expect(getPlatform()).toBe('android');
    });
  });

  describe('isNative', () => {
    it('returns false when Capacitor is not available', () => {
      expect(isNative()).toBe(false);
    });

    it('returns true when running on native platform', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
      };
      expect(isNative()).toBe(true);
    });

    it('returns false when running on web', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'web',
        isNativePlatform: () => false,
      };
      expect(isNative()).toBe(false);
    });
  });

  describe('isIOS', () => {
    it('returns false when not on iOS', () => {
      expect(isIOS()).toBe(false);
    });

    it('returns true when on iOS', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
      };
      expect(isIOS()).toBe(true);
    });
  });

  describe('isAndroid', () => {
    it('returns false when not on Android', () => {
      expect(isAndroid()).toBe(false);
    });

    it('returns true when on Android', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'android',
        isNativePlatform: () => true,
      };
      expect(isAndroid()).toBe(true);
    });
  });

  describe('isPluginAvailable', () => {
    it('returns false when Capacitor is not available', () => {
      expect(isPluginAvailable('Haptics')).toBe(false);
    });

    it('returns false when plugin is not available', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
        isPluginAvailable: () => false,
      };
      expect(isPluginAvailable('Haptics')).toBe(false);
    });

    it('returns true when plugin is available', () => {
      (window as any).Capacitor = {
        getPlatform: () => 'ios',
        isNativePlatform: () => true,
        isPluginAvailable: () => true,
      };
      expect(isPluginAvailable('Haptics')).toBe(true);
    });
  });
});
