import { Badge } from '@capawesome/capacitor-badge';
import { captureError } from './error';

type NavigatorWithBadge = Navigator & {
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

function getNavigator(): NavigatorWithBadge | null {
  if (typeof navigator === 'undefined') return null;
  return navigator as NavigatorWithBadge;
}

async function applyWebBadge(count: number): Promise<boolean> {
  const nav = getNavigator();
  if (!nav) return false;

  if (count > 0 && typeof nav.setAppBadge === 'function') {
    await nav.setAppBadge(count);
    return true;
  }

  if (count <= 0 && typeof nav.clearAppBadge === 'function') {
    await nav.clearAppBadge();
    return true;
  }

  return false;
}

export async function setAppBadgeCount(count: number): Promise<void> {
  const safeCount = Math.max(0, Math.floor(count));

  try {
    const support = await Badge.isSupported();
    if (support.isSupported) {
      if (safeCount > 0) {
        await Badge.set({ count: safeCount });
      } else {
        await Badge.clear();
      }
      return;
    }
  } catch (error) {
    captureError(error, 'Badge.nativeUpdate');
  }

  try {
    await applyWebBadge(safeCount);
  } catch (error) {
    captureError(error, 'Badge.webUpdate');
  }
}

export async function clearAppBadge(): Promise<void> {
  await setAppBadgeCount(0);
}
