// @ts-nocheck
import React from 'react';
import { AnchorLoadingSpinner } from './components/shared/AnchorLoadingSpinner';
import { AppProvider } from './context/AnchorContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazyWithRetry } from './utils/lazyWithRetry';

const AuthenticatedAppShell = lazyWithRetry(() => import('./components/app/AuthenticatedAppShell'));
const AcceptInviteView = lazyWithRetry(() => import('./features/onboarding/AcceptInviteView').then(m => ({ default: m.AcceptInviteView })));
const ServerErrorView = lazyWithRetry(() => import('./features/errors/ServerErrorView'));

import { Routes, Route } from 'react-router-dom';
import AuthGate from './components/auth/AuthGate';
import { getSystemTheme, subscribeToSystemTheme } from './utils/systemTheme';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { OfflineIndicator } from './components/shared/OfflineIndicator';
import { EnvironmentBanner } from './components/shared/EnvironmentBanner';
import { useVersionCheck } from './hooks/useVersionCheck';
import { useAccessibility } from './hooks/useAccessibility';
import { useIOSKeyboardFix } from './hooks/useIOSKeyboardFix';
import { useAndroidBackButton } from './hooks/useAndroidBackButton';

const AppContent = () => {
  const { user, profile, loading, profileLoaded } = useAuth();
  useAccessibility(profile?.accessibility);
  useIOSKeyboardFix();
  useAndroidBackButton();

  React.useEffect(() => {
    const userPref = profile?.theme;
    const applyTheme = (targetTheme: 'light' | 'dark') => {
      document.documentElement.classList.remove('dark');
      if (targetTheme === 'dark') document.documentElement.classList.add('dark');
    };

    if (!userPref || userPref === 'system') {
      applyTheme(getSystemTheme());
      return subscribeToSystemTheme(applyTheme);
    }

    applyTheme(userPref);
  }, [profile?.theme]);

  if (loading || (user && !profileLoaded)) {
    return (
      <div className="flex-1 h-full w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <AnchorLoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/500" element={<ServerErrorView />} />

      <Route path="/accept-invite" element={
        <ErrorBoundary componentName="Accept Invite">
          <div className={`flex-1 ${profile?.theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 h-full w-full`}>
            <AcceptInviteView />
          </div>
        </ErrorBoundary>
      } />

      <Route path="/*" element={
        <AuthGate>
          <React.Suspense fallback={
            <div className="flex items-center justify-center p-12 animate-in fade-in duration-300">
              <AnchorLoadingSpinner message="Loading..." />
            </div>
          }>
            <AuthenticatedAppShell />
          </React.Suspense>
        </AuthGate>
      } />
    </Routes>
  );
};

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';
import { createIndexedDBPersister } from './config/persister';

const persister = createIndexedDBPersister();

const shouldDehydrateQuery = (query: { queryKey: readonly unknown[] }) => {
  const key = query.queryKey[0];
  return key !== 'tasks' && key !== 'finance';
};

export default function App() {
  useVersionCheck();

  return (
    <ErrorBoundary>
      <EnvironmentBanner />
      <OfflineIndicator />
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          dehydrateOptions: { shouldDehydrateQuery },
        }}
      >
        <NotificationProvider>
          <AuthProvider>
            <AppProvider>
              <div
                className="flex flex-col flex-1 w-full min-h-0"
                style={{
                  paddingTop: import.meta.env.VITE_APP_ENV && import.meta.env.VITE_APP_ENV !== 'production'
                    ? 'calc(24px + env(safe-area-inset-top, 0px))'
                    : 'env(safe-area-inset-top, 0px)',
                  paddingLeft: 'env(safe-area-inset-left, 0px)',
                  paddingRight: 'env(safe-area-inset-right, 0px)'
                }}
              >
                <AppContent />
              </div>
            </AppProvider>
          </AuthProvider>
        </NotificationProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
}
