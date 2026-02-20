// @ts-nocheck
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnchorLoadingSpinner } from '../shared/AnchorLoadingSpinner';
import { FinanceProvider } from '../../context/FinanceContext';
import { TaskProvider } from '../../context/TaskContext';
import MainLayout from '../../layouts/MainLayout';
import { lazyWithRetry } from '../../utils/lazyWithRetry';
import { useAuth } from '../../context/AuthContext';
import { useFeatureFlag } from '../../features/flags/useFeatureFlag';
import { APP_VERSION } from '../../version';

const DashboardView = lazyWithRetry(() => import('../../features/dashboard/DashboardView'));
const CommitmentsView = lazyWithRetry(() => import('../../features/commitments/CommitmentsView'));
const FinanceView = lazyWithRetry(() => import('../../features/finance/FinanceView'));
const SettingsView = lazyWithRetry(() => import('../../features/settings/SettingsView'));
const NotFoundView = lazyWithRetry(() => import('../../features/errors/NotFoundView'));


export default function AuthenticatedAppShell() {
  const { user } = useAuth();


  return (
    <FinanceProvider>
      <TaskProvider>
        <MainLayout version={APP_VERSION}>
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center p-12 animate-in fade-in duration-300">
                <AnchorLoadingSpinner message="Loading..." />
              </div>
            }
          >
            <Routes>
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="commitments" element={<CommitmentsView />} />
              <Route path="finance" element={<FinanceView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFoundView />} />
            </Routes>
          </React.Suspense>

        </MainLayout>
      </TaskProvider>
    </FinanceProvider>
  );
}
