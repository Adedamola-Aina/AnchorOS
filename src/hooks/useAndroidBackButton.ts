import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAndroid, isNative } from '../utils/platform';
import { captureError } from '../utils/error';

function isDashboardRootPath(pathname: string): boolean {
  return pathname === '/dashboard';
}

function isTopLevelTabPath(pathname: string): boolean {
  return pathname === '/commitments' || pathname === '/fabric' || pathname === '/settings' || pathname === '/finance';
}

export function useAndroidBackButton(): void {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isNative() || !isAndroid()) return;

    let removeListener: (() => void) | null = null;

    void App.addListener('backButton', ({ canGoBack }) => {
      const path = location.pathname;

      if (path.startsWith('/finance/') && path !== '/finance') {
        navigate('/finance');
        return;
      }

      if (isTopLevelTabPath(path)) {
        navigate('/dashboard');
        return;
      }

      if (canGoBack) {
        navigate(-1);
        return;
      }

      if (isDashboardRootPath(path)) {
        void App.exitApp();
      }
    }).then((listener) => {
      removeListener = () => {
        void listener.remove();
      };
    }).catch((error) => {
      captureError(error, 'Platform.backButtonListener');
    });

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [location.pathname, navigate]);
}
