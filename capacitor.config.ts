import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anchor.app',
  appName: 'Anchor',
  webDir: 'dist',
  bundledWebRuntime: false,
  // No `server.hostname` — load bundled `dist/` assets so the app runs as a
  // true native shell (offline-capable, native navigation, plugin-mediated
  // network). Use `androidScheme: 'https'` so localStorage/IndexedDB/cookies
  // share the same origin as web (required for Firebase Auth persistence).
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#020617',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#020617',
    },
    Keyboard: {
      resize: 'native',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
