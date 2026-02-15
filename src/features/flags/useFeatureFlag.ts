import { useMemo } from 'react';
import { evaluateFeatureFlag, type FeatureFlagKey } from './featureFlags';

export function useFeatureFlag(flag: FeatureFlagKey, userId?: string | null): boolean {
    return useMemo(() => evaluateFeatureFlag(flag, { userId }), [flag, userId]);
}
