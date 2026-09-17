/**
 * Onboarding shell — lazily loaded so the Finance/Task/Fabric provider tree
 * and the onboarding feature code stay out of the eager startup bundle.
 *
 * The provider order must mirror AuthenticatedAppShell: FinanceContext and
 * TaskContext both call `useFabricContext()`, so FabricProvider has to be the
 * outermost provider here too (PERF-101 dropped it, which crashed onboarding
 * for every new account).
 */
import React from 'react';
import { FabricProvider } from '../../context/FabricContext';
import { FinanceProvider } from '../../context/FinanceContext';
import { TaskProvider } from '../../context/TaskContext';

const LazyOnboardingView = React.lazy(() =>
    import('../../features/onboarding/OnboardingView').then((module) => ({ default: module.OnboardingView }))
);

export const OnboardingShell: React.FC = () => (
    <FabricProvider>
        <FinanceProvider>
            <TaskProvider>
                <React.Suspense fallback={<div className="h-screen w-full" />}>
                    <LazyOnboardingView />
                </React.Suspense>
            </TaskProvider>
        </FinanceProvider>
    </FabricProvider>
);
