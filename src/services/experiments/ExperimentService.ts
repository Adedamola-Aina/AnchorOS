type ExperimentVariant = 'control' | 'treatment';

export interface ExperimentDefinition {
  id: string;
  enabled: boolean;
  trafficPercent: number; // 0–100
}

function stableBucket(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % 100;
}

export class ExperimentService {
  private definitions: Record<string, ExperimentDefinition>;

  constructor(definitions: Record<string, ExperimentDefinition>) {
    this.definitions = definitions;
  }

  getVariant(experimentId: string, userId: string): ExperimentVariant {
    const def = this.definitions[experimentId];
    if (!def || !def.enabled) return 'control';
    if (def.trafficPercent <= 0) return 'control';
    if (def.trafficPercent >= 100) return 'treatment';

    const bucket = stableBucket(`${experimentId}:${userId}`);
    return bucket < def.trafficPercent ? 'treatment' : 'control';
  }

  getAllAssignments(userId: string): Record<string, ExperimentVariant> {
    const result: Record<string, ExperimentVariant> = {};
    for (const [id, def] of Object.entries(this.definitions)) {
      if (!def.enabled) continue;
      result[id] = this.getVariant(id, userId);
    }
    return result;
  }
}
