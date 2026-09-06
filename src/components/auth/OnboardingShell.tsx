/**
 * Onboarding shell — lazily loaded so the Finance/Task/Fabric provider tree
 * and the onboarding feature code stay out of the eager startup bundle.
 */
import React from 'react';
import { FinanceProvider } from '../../context/FinanceContext';
import { TaskProvider } from '../../context/TaskContext';

const LazyOnboardingView = React.lazy(() =>
    import('../../features/onboarding/OnboardingView').then((module) => ({ default: module.OnboardingView }))
);

export const OnboardingShell: React.FC = () => (
    <FinanceProvider>
        <TaskProvider>
            <React.Suspense fallback={<div className="h-screen w-full" />}>
                <LazyOnboardingView />
            </React.Suspense>
        </TaskProvider>
    </FinanceProvider>
);