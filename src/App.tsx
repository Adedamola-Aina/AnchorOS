import React from 'react';
import { AnchorLoadingSpinner } from './components/shared/AnchorLoadingSpinner';
import { AppProvider } from './context/AnchorContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { TaskProvider } from './context/TaskContext';
import { lazyWithRetry } from './utils/lazyWithRetry';

const DashboardView = lazyWithRetry(() => import('./features/dashboard/DashboardView'));
// Eager load CommitmentsView to prevent chunk load errors/timeouts in staging
import CommitmentsView from './features/commitments/CommitmentsView';
const FinanceView = lazyWithRetry(() => import('./features/finance/FinanceView'));
const SettingsView = lazyWithRetry(() => import('./features/settings/SettingsView'));
const AcceptInviteView = lazyWithRetry(() => import('./features/onboarding/AcceptInviteView').then(m => ({ default: m.AcceptInviteView })));
const OnboardingView = lazyWithRetry(() => import('./features/onboarding/OnboardingView').then(m => ({ default: m.OnboardingView })));

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthGate from './components/auth/AuthGate';
import MainLayout from './layouts/MainLayout';
import { getSystemTheme, subscribeToSystemTheme } from './utils/systemTheme';
import pkg from '../package.json';
const APP_VERSION = (pkg as unknown as { version: string }).version;

import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { OfflineIndicator } from './components/shared/OfflineIndicator';
import { EnvironmentBanner } from './components/shared/EnvironmentBanner';
import { useVersionCheck } from './hooks/useVersionCheck';
import { useAccessibility } from './hooks/useAccessibility';

const AppContent = () => {
  const { user, profile, loading, profileLoaded } = useAuth();
  useLocation();
  useAccessibility(profile?.accessibility);

  // Sync theme to root element with System support (PWA-006)
  React.useEffect(() => {
    // 1. Determine base preference
    const userPref = profile?.theme; // 'light' | 'dark' | 'system' | undefined

    // 2. Helper to apply theme
    const applyTheme = (targetTheme: 'light' | 'dark') => {
      document.documentElement.classList.remove('dark');
      if (targetTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };

    // 3. Handle 'system' or undefined preference
    if (!userPref || userPref === 'system') {
      // Initial apply
      applyTheme(getSystemTheme());

      // Subscribe to OS changes
      const unsubscribe = subscribeToSystemTheme((newSystemTheme) => {
        applyTheme(newSystemTheme);
      });
      return unsubscribe;
    }

    // 4. Handle explicit 'light'/'dark' preference
    applyTheme(userPref);

  }, [profile?.theme]);

  // Wait for auth AND profile to fully load before making onboarding decision
  // This prevents flash of onboarding screen for users who have already completed it
  if (loading || (user && !profileLoaded)) {
    return (
      <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <AnchorLoadingSpinner size="lg" />
      </div>
    );
  }

  // Only show onboarding if user is logged in AND profile loaded AND onboarding is not complete
  if (user && profileLoaded && profile && !profile.onboardingComplete) {
    return (
      <React.Suspense fallback={<div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><AnchorLoadingSpinner size="lg" /></div>}>
        <Routes>
          <Route path="/accept-invite" element={
            <ErrorBoundary componentName="Accept Invite">
              <AcceptInviteView />
            </ErrorBoundary>
          } />
          <Route path="*" element={<OnboardingView />} />
        </Routes>
      </React.Suspense>
    );
  }

  return (
    <Routes>
      <Route path="/accept-invite" element={
        <ErrorBoundary componentName="Accept Invite">
          <div className={`${profile?.theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 min-h-dvh`}>
            <AcceptInviteView />
          </div>
        </ErrorBoundary>
      } />

      <Route path="/*" element={
        <AuthGate>
          <MainLayout version={APP_VERSION}>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-12">
                <AnchorLoadingSpinner />
              </div>
            }>
              <Routes>
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="commitments" element={<CommitmentsView />} />
                <Route path="finance" element={<FinanceView />} />
                <Route path="settings" element={<SettingsView />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </React.Suspense>
          </MainLayout>
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

// Exclude real-time queries from persistence - they use onSnapshot for live updates
const shouldDehydrateQuery = (query: { queryKey: readonly unknown[] }) => {
  const key = query.queryKey[0];
  // Don't persist tasks or finance - they use real-time Firestore listeners
  if (key === 'tasks' || key === 'finance') {
    return false;
  }
  return true;
};

import { FabricSuggestionManager } from './features/fabric/FabricSuggestionManager';

export default function App() {
  // Auto-refresh when new version is deployed (production only)
  useVersionCheck();

  return (
    <ErrorBoundary>
      <EnvironmentBanner />
      <OfflineIndicator />
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          dehydrateOptions: {
            shouldDehydrateQuery,
          },
        }}
      >
        <NotificationProvider>
          <AuthProvider>
            <AppProvider>
              <FinanceProvider>
                <TaskProvider>
                  <AppContent />
                  {/* Fabric v1.5: Smart suggestions when completing financial tasks */}
                  <FabricSuggestionManager />
                </TaskProvider>
              </FinanceProvider>
            </AppProvider>
          </AuthProvider>
        </NotificationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
}
