import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

/**
 * Regression: OnboardingShell must nest FabricProvider outside Finance/Task.
 *
 * FinanceContext and TaskContext both call `useFabricContext()` and throw
 * "useFabricContext must be used within FabricProvider" when it is missing.
 * AuthGate renders this shell for every account whose onboarding is not yet
 * complete — i.e. immediately after sign-up — so a missing provider crashed
 * the whole onboarding flow (PERF-101 regression).
 *
 * The Finance/Task providers are mocked to reproduce the real coupling (call
 * useFabricContext) without pulling the heavy real implementations.
 */

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: { uid: 'user-1' } }),
}));

vi.mock('../../services/fabric/FabricService', () => ({
    FabricService: {
        getInstance: () => ({
            getContext: () => ({}),
            getPatterns: () => [],
            getConfirmedPatterns: () => [],
            getPredictions: () => [],
            getInsightsFor: () => [],
            isEnabled: () => false,
            getBriefing: () => null,
            getProactiveQuestion: () => null,
            learnFrom: vi.fn(),
            dismissPattern: vi.fn(),
            deletePattern: vi.fn(),
            dismissPrediction: vi.fn(),
            query: vi.fn(),
            generateWeeklyReport: vi.fn(),
            clearAllData: vi.fn(),
            markQuestionShown: vi.fn(),
        }),
    },
}));

vi.mock('../../context/fabric/useFabricInitialization', () => ({
    useFabricInitialization: vi.fn(),
}));

vi.mock('../../context/fabric/useFabricLiveSync', () => ({
    useFabricLiveSync: vi.fn(),
}));

vi.mock('../../utils/secureDb', () => ({
    secureDb: {
        getDocument: vi.fn().mockResolvedValue(null),
        setDocument: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('../../context/FinanceContext', async () => {
    const { useFabricContext } = await import('../../context/FabricContext');
    return {
        FinanceProvider: ({ children }: { children: React.ReactNode }) => {
            useFabricContext();
            return <>{children}</>;
        },
    };
});

vi.mock('../../context/TaskContext', async () => {
    const { useFabricContext } = await import('../../context/FabricContext');
    return {
        TaskProvider: ({ children }: { children: React.ReactNode }) => {
            useFabricContext();
            return <>{children}</>;
        },
    };
});

vi.mock('../../features/onboarding/OnboardingView', () => ({
    OnboardingView: () => <div data-testid="onboarding-view">onboarding</div>,
}));

import { OnboardingShell } from './OnboardingShell';

describe('OnboardingShell', () => {
    it('provides Fabric context to the Finance/Task provider tree', async () => {
        render(<OnboardingShell />);

        expect(await screen.findByTestId('onboarding-view')).toBeTruthy();
    });
});
