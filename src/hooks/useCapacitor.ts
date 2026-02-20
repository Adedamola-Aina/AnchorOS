/**
 * useCapacitor Hook
 *
 * React hook for accessing Capacitor native features.
 * Handles feature detection and graceful degradation for web.
 */

import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { getPlatformConfig, isPluginAvailable } from '@/utils/platform';

export function useCapacitor() {
  const platform = getPlatformConfig();
  const [networkStatus, setNetworkStatus] = useState<{ connected: boolean; connectionType: string } | null>(null);

  useEffect(() => {

    // Listen to network status changes
    if (isPluginAvailable('Network')) {
      Network.getStatus().then(setNetworkStatus);

      let cleanup: (() => void) | null = null;

      Network.addListener('networkStatusChange', (status) => {
        setNetworkStatus(status);
      }).then((listenerHandle) => {
        cleanup = () => listenerHandle.remove();
      });

      return () => {
        if (cleanup) cleanup();
      };
    }
  }, []);

  return {
    platform,
    networkStatus,

    // Haptic feedback (vibration)
    haptics: {
      impact: async (style: ImpactStyle = ImpactStyle.Medium) => {
        if (platform.hasHaptics) {
          await Haptics.impact({ style });
        }
      },
      notification: async (type: NotificationType = NotificationType.Success) => {
        if (platform.hasHaptics) {
          await Haptics.notification({ type });
        }
      },
      vibrate: async () => {
        if (platform.hasHaptics) {
          await Haptics.vibrate();
        }
      },
    },

    // Status bar control
    statusBar: {
      setStyle: async (style: Style) => {
        if (platform.hasStatusBar) {
          await StatusBar.setStyle({ style });
        }
      },
      hide: async () => {
        if (platform.hasStatusBar) {
          await StatusBar.hide();
        }
      },
      show: async () => {
        if (platform.hasStatusBar) {
          await StatusBar.show();
        }
      },
    },

    // Keyboard control
    keyboard: {
      hide: async () => {
        if (platform.hasKeyboard) {
          await Keyboard.hide();
        }
      },
      show: async () => {
        if (platform.hasKeyboard) {
          await Keyboard.show();
        }
      },
    },

    // App lifecycle
    app: {
      exitApp: async () => {
        if (platform.isAndroid) {
          await App.exitApp();
        }
      },
      getInfo: async () => {
        if (platform.isNative) {
          return await App.getInfo();
        }
        return null;
      },
    },
  };
}
