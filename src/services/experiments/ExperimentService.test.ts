import { describe, it, expect } from 'vitest';
import { ExperimentService } from './ExperimentService';
import type { ExperimentDefinition } from './ExperimentService';

const TEST_EXPERIMENTS: Record<string, ExperimentDefinition> = {
  'exp-onboarding-v2': {
    id: 'exp-onboarding-v2',
    enabled: true,
    trafficPercent: 50,
  },
  'exp-disabled': {
    id: 'exp-disabled',
    enabled: false,
    trafficPercent: 50,
  },
  'exp-full-rollout': {
    id: 'exp-full-rollout',
    enabled: true,
    trafficPercent: 100,
  },
  'exp-zero-traffic': {
    id: 'exp-zero-traffic',
    enabled: true,
    trafficPercent: 0,
  },
};

describe('ExperimentService', () => {
  it('assigns control or treatment deterministically', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    const v1 = service.getVariant('exp-onboarding-v2', 'user-abc');
    const v2 = service.getVariant('exp-onboarding-v2', 'user-abc');
    expect(v1).toBe(v2); // stable
    expect(['control', 'treatment']).toContain(v1);
  });

  it('returns control for disabled experiments', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    expect(service.getVariant('exp-disabled', 'user-abc')).toBe('control');
  });

  it('returns treatment for 100% rollout', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    expect(service.getVariant('exp-full-rollout', 'user-abc')).toBe('treatment');
  });

  it('returns control for 0% traffic', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    expect(service.getVariant('exp-zero-traffic', 'user-abc')).toBe('control');
  });

  it('returns control for unknown experiment', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    expect(service.getVariant('exp-nonexistent', 'user-abc')).toBe('control');
  });

  it('distributes users across control/treatment', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    const variants = new Set<string>();
    for (let i = 0; i < 100; i++) {
      variants.add(service.getVariant('exp-onboarding-v2', `user-${i}`));
    }
    // with 50% traffic over 100 users, both variants should appear
    expect(variants.has('control')).toBe(true);
    expect(variants.has('treatment')).toBe(true);
  });

  it('getAllAssignments returns all active experiments for a user', () => {
    const service = new ExperimentService(TEST_EXPERIMENTS);
    const assignments = service.getAllAssignments('user-abc');
    // Should have entries for enabled experiments only
    expect(assignments).toHaveProperty('exp-onboarding-v2');
    expect(assignments).toHaveProperty('exp-full-rollout');
    expect(assignments).not.toHaveProperty('exp-disabled');
  });
});
