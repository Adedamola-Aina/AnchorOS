// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { evaluateFeatureFlag } from './featureFlags';

describe('featureFlags', () => {
    it('honors global disable kill switch', () => {
        const enabled = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {
                VITE_FLAG_DISABLE_ALL: 'true',
            },
        });

        expect(enabled).toBe(false);
    });

    it('honors explicit per-flag override', () => {
        const disabled = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {
                VITE_FLAG_ANCHOR_AI_ENABLED: 'false',
            },
        });

        const enabled = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {
                VITE_FLAG_ANCHOR_AI_ENABLED: 'true',
            },
        });

        expect(disabled).toBe(false);
        expect(enabled).toBe(true);
    });

    it('applies deterministic progressive rollout by user id', () => {
        const envVars = {
            VITE_FLAG_ANCHOR_AI_ROLLOUT: '25',
        };

        const first = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'stable-user-42',
            env: 'production',
            envVars,
        });

        const second = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'stable-user-42',
            env: 'production',
            envVars,
        });

        expect(first).toBe(second);
    });

    it('clamps rollout values to valid range', () => {
        const alwaysOn = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {
                VITE_FLAG_ANCHOR_AI_ROLLOUT: '500',
            },
        });

        const alwaysOff = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {
                VITE_FLAG_ANCHOR_AI_ROLLOUT: '-10',
            },
        });

        expect(alwaysOn).toBe(true);
        expect(alwaysOff).toBe(false);
    });

    it('defaults anchor_ai_enabled on in production', () => {
        const enabled = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {},
        });

        expect(enabled).toBe(true);
    });

    it('defaults anchor_ai_enabled on in development', () => {
        const enabled = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'development',
            envVars: {},
        });

        expect(enabled).toBe(true);
    });

    it('honors explicit anchor_ai_enabled override', () => {
        const forcedOn = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'production',
            envVars: {
                VITE_FLAG_ANCHOR_AI_ENABLED: 'true',
            },
        });

        const forcedOff = evaluateFeatureFlag('anchor_ai_enabled', {
            userId: 'user-1',
            env: 'development',
            envVars: {
                VITE_FLAG_ANCHOR_AI_ENABLED: 'false',
            },
        });

        expect(forcedOn).toBe(true);
        expect(forcedOff).toBe(false);
    });
});
