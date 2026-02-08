/**
 * useOnboardingProgress - Read/write onboarding progress to profile
 * Manages the granular tracking of Getting Started + Beyond the Basics steps.
 */

import { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import type { OnboardingProgress } from '../../../types';

const DEFAULT_PROGRESS: OnboardingProgress = {
  gettingStartedStep: 0,
  securityStepSeen: false,
  beyondBasicsComplete: false,
  completedItems: [],
};

export function useOnboardingProgress() {
  const { profile, updateProfile } = useAuth();

  const progress: OnboardingProgress = profile.onboardingProgress ?? DEFAULT_PROGRESS;

  const updateProgress = useCallback(
    async (updates: Partial<OnboardingProgress>) => {
      const merged = { ...progress, ...updates };
      await updateProfile({ onboardingProgress: merged });
    },
    [progress, updateProfile],
  );

  const markGettingStartedStep = useCallback(
    async (step: number) => {
      if (step > progress.gettingStartedStep) {
        await updateProgress({ gettingStartedStep: step });
      }
    },
    [progress.gettingStartedStep, updateProgress],
  );

  const markSecuritySeen = useCallback(
    async () => {
      await updateProgress({ securityStepSeen: true });
    },
    [updateProgress],
  );

  const completeItem = useCallback(
    async (item: string) => {
      if (progress.completedItems.includes(item)) return;
      const next = [...progress.completedItems, item];
      await updateProgress({ completedItems: next });
    },
    [progress.completedItems, updateProgress],
  );

  const completionCount = progress.completedItems.length;

  return {
    progress,
    updateProgress,
    markGettingStartedStep,
    markSecuritySeen,
    completeItem,
    completionCount,
  };
}
