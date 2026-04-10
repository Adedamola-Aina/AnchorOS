import { useMemo } from 'react';
import { ExperimentService, type ExperimentDefinition, type ExperimentVariant } from '../services/experiments/ExperimentService';

const DEFAULT_EXPERIMENTS: Record<string, ExperimentDefinition> = {};

let serviceInstance: ExperimentService | null = null;

export function configureExperiments(definitions: Record<string, ExperimentDefinition>): void {
  serviceInstance = new ExperimentService(definitions);
}

function getService(): ExperimentService {
  if (!serviceInstance) serviceInstance = new ExperimentService(DEFAULT_EXPERIMENTS);
  return serviceInstance;
}

export function useExperiment(experimentId: string, userId: string | null | undefined): ExperimentVariant {
  return useMemo(() => {
    if (!userId) return 'control' as const;
    return getService().getVariant(experimentId, userId);
  }, [experimentId, userId]);
}

export function useExperimentAssignments(userId: string | null | undefined): Record<string, ExperimentVariant> {
  return useMemo(() => {
    if (!userId) return {};
    return getService().getAllAssignments(userId);
  }, [userId]);
}
