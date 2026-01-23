import React from 'react';
import { AppProvider } from './context/AnchorContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { TaskProvider } from './context/TaskContext';
const DashboardView = React.lazy(() => import('./features/dashboard/DashboardView'));
const CommitmentsView = React.lazy(() => import('./features/commitments/CommitmentsView'));
const FinanceView = React.lazy(() => import('./features/finance/FinanceView'));
const SettingsView = React.lazy(() => import('./features/settings/SettingsView'));
const AcceptInviteView = React.lazy(() => import('./features/onboarding/AcceptInviteView').then(m => ({ default: m.AcceptInviteView })));
const OnboardingView = React.lazy(() => import('./features/onboarding/OnboardingView').then(m => ({ default: m.OnboardingView })));

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthGate from './components/auth/AuthGate';
import MainLayout from './layouts/MainLayout';
import pkg from '../package.json';
const APP_VERSION = (pkg as unknown as { version: string }).version;

import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { OfflineIndicator } from './components/shared/OfflineIndicator';

// Environment Banner - Shows in non-production environments
const EnvironmentBanner = () => {
  const env = import.meta.env.VITE_APP_ENV;
  if (!env || env === 'production') return null;

  const colors = env === 'development'
    ? 'bg-blue-600 text-white'
    : 'bg-yellow-500 text-black'; // staging - yellow banner

  return (
    <div className={`fixed top-0 left-0 right-0 h-6 ${colors} flex items-center justify-center text-xs font-bold tracking-widest uppercase z-50`}>
      {env === 'development' ? 'DEVELOPMENT ENVIRONMENT' : 'STAGING ENVIRONMENT'}
    </div>
  );
};

const AppContent = () => {
  const { user, profile, loading, profileLoaded } = useAuth();
  useLocation();

  // Sync theme to root element
  React.useEffect(() => {
    if (profile?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile?.theme]);

  // Wait for auth AND profile to fully load before making onboarding decision
  // This prevents flash of onboarding screen for users who have already completed it
  if (loading || (user && !profileLoaded)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only show onboarding if user is logged in AND profile loaded AND onboarding is not complete
  if (user && profileLoaded && profile && !profile.onboardingComplete) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
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
          <div className={`${profile?.theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-slate-900 min-h-screen`}>
            <AcceptInviteView />
          </div>
        </ErrorBoundary>
      } />

      <Route path="/*" element={
        <AuthGate>
          <MainLayout version={APP_VERSION}>
            <React.Suspense fallback={
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
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

export default function App() {
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
