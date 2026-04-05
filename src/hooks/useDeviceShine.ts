import { useCallback, useEffect, useRef } from 'react';

interface UseDeviceShineOptions {
  enabled: boolean;
}

type DeviceOrientationRequestPermission = (() => Promise<'granted' | 'denied'>) | undefined;

interface DeviceOrientationEventWithPermission extends Event {
  beta?: number | null;
  gamma?: number | null;
}

export function useDeviceShine<T extends HTMLElement>({ enabled }: UseDeviceShineOptions) {
  const ref = useRef<T | null>(null);
  const orientationGrantedRef = useRef(false);

  const updateShine = useCallback((x: number, y: number) => {
    ref.current?.style.setProperty('--shine-x', `${x}%`);
    ref.current?.style.setProperty('--shine-y', `${y}%`);
  }, []);

  const handleOrientation = useCallback((event: Event) => {
    if (!enabled) return;
    const orientationEvent = event as DeviceOrientationEventWithPermission;
    const x = (((orientationEvent.gamma ?? 0) + 90) / 180) * 100;
    const y = (((orientationEvent.beta ?? 0) + 180) / 360) * 100;
    updateShine(x, y);
  }, [enabled, updateShine]);

  const attachOrientationListener = useCallback(() => {
    window.addEventListener('deviceorientation', handleOrientation);
  }, [handleOrientation]);

  const detachOrientationListener = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation);
  }, [handleOrientation]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!orientationGrantedRef.current) return;
      if (document.hidden) {
        detachOrientationListener();
        return;
      }
      attachOrientationListener();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      detachOrientationListener();
    };
  }, [attachOrientationListener, detachOrientationListener]);

  const requestOrientationPermission = useCallback(async () => {
    if (!enabled || typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      return;
    }

    const ctor = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: DeviceOrientationRequestPermission;
    };

    if (typeof ctor.requestPermission === 'function') {
      const result = await ctor.requestPermission();
      if (result !== 'granted') {
        return;
      }
    }

    if (orientationGrantedRef.current) {
      return;
    }

    orientationGrantedRef.current = true;
    attachOrientationListener();
  }, [attachOrientationListener, enabled]);

  const handlePointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (!enabled || !ref.current) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updateShine(x, y);
  }, [enabled, updateShine]);

  const handlePointerLeave = useCallback(() => {
    updateShine(50, 30);
  }, [updateShine]);

  return {
    ref,
    handlePointerMove,
    handlePointerLeave,
    requestOrientationPermission,
  };
}