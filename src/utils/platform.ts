/**
 * Platform Detection & Capacitor Utilities
 *
 * Provides reliable platform detection for web, iOS, and Android.
 * Use these instead of user agent sniffing for Capacitor apps.
 */

// Capacitor is available at runtime via window.Capacitor
declare global {
  interface Window {
    Capacitor?: {
      getPlatform: () => string;
      isNativePlatform: () => boolean;
      isPluginAvailable: (name: string) => boolean;
    };
  }
}

// Access Capacitor from global - it's available at runtime
const getCapacitor = () => {
  if (typeof window !== 'undefined' && window.Capacitor) {
    return window.Capacitor;
  }
  return undefined;
};

export type Platform = 'web' | 'ios' | 'android';

/**
 * Get the current platform the app is running on
 */
export function getPlatform(): Platform {
  const cap = getCapacitor();
  return (cap?.getPlatform() as Platform) ?? 'web';
}

/**
 * Check if running as a native app (iOS or Android)
 */
export function isNative(): boolean {
  const cap = getCapacitor();
  return cap?.isNativePlatform() ?? false;
}

/**
 * Check if running in a web browser
 */
export function isWeb(): boolean {
  return getPlatform() === 'web';
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return getPlatform() === 'android';
}

/**
 * Check if running as an installed PWA (standalone display mode).
 * True when launched from home-screen on iOS/Android or installed PWA on desktop.
 * Always false inside Capacitor (use isNative() instead).
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  if (isNative()) return false;
  // Standard standalone PWA
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  if (window.matchMedia?.('(display-mode: fullscreen)').matches) return true;
  if (window.matchMedia?.('(display-mode: minimal-ui)').matches) return true;
  // iOS Safari uses a non-standard property
  const navAny = window.navigator as Navigator & { standalone?: boolean };
  return navAny.standalone === true;
}

/**
 * Check if a Capacitor plugin is available
 */
export function isPluginAvailable(pluginName: string): boolean {
  const cap = getCapacitor();
  return cap?.isPluginAvailable(pluginName) ?? false;
}

/**
 * Get platform-specific configuration
 */
export function getPlatformConfig() {
  const platform = getPlatform();

  return {
    platform,
    isNative: isNative(),
    isWeb: isWeb(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    // Safe area insets (will be populated by CSS env() variables)
    hasSafeArea: isNative(),
    // Feature detection
    hasHaptics: isPluginAvailable('Haptics'),
    hasStatusBar: isPluginAvailable('StatusBar'),
    hasKeyboard: isPluginAvailable('Keyboard'),
    hasNetwork: isPluginAvailable('Network'),
  };
}

/**
 * Platform-specific class names for styling
 */
export function getPlatformClasses(): string {
  const platform = getPlatform();
  const classes = [`platform-${platform}`];

  if (isNative()) {
    classes.push('platform-native');
  }
  if (isPWA()) {
    // Installed PWA: apply native-style web-feel suppression too.
    classes.push('platform-pwa', 'platform-app');
  }
  if (isNative()) {
    classes.push('platform-app');
  }

  return classes.join(' ');
}
