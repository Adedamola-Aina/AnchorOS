// @ts-nocheck
type AppEnv = 'development' | 'staging' | 'production';

export type FeatureFlagKey = 'fabric_suggestions' | 'anchor_ai_enabled';

type FeatureFlagDefinition = {
    enabledByDefault: Record<AppEnv, boolean>;
    rolloutPercentage: Record<AppEnv, number>;
    forceVariable: string;
    rolloutVariable: string;
};

const FLAG_DEFINITIONS: Record<FeatureFlagKey, FeatureFlagDefinition> = {
    fabric_suggestions: {
        enabledByDefault: {
            development: true,
            staging: true,
            production: true,
        },
        rolloutPercentage: {
            development: 100,
            staging: 100,
            production: 100,
        },
        forceVariable: 'VITE_FLAG_FABRIC_SUGGESTIONS',
        rolloutVariable: 'VITE_FLAG_FABRIC_SUGGESTIONS_ROLLOUT',
    },
    anchor_ai_enabled: {
        enabledByDefault: {
            development: true,
            staging: true,
            production: false,
        },
        rolloutPercentage: {
            development: 100,
            staging: 100,
            production: 0,
        },
        forceVariable: 'VITE_FLAG_ANCHOR_AI_ENABLED',
        rolloutVariable: 'VITE_FLAG_ANCHOR_AI_ROLLOUT',
    },
};

const GLOBAL_DISABLE_VARIABLE = 'VITE_FLAG_DISABLE_ALL';

type EnvVars = Record<string, string | undefined>;

type EvaluateFeatureFlagOptions = {
    userId?: string | null;
    env?: AppEnv;
    envVars?: EnvVars;
};

function toAppEnv(value: string | undefined): AppEnv {
    if (value === 'development' || value === 'staging' || value === 'production') {
        return value;
    }
    return 'production';
}

function parseBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') return false;
    return undefined;
}

function parseRollout(value: string | undefined): number | undefined {
    if (value === undefined || value.trim() === '') return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return undefined;
    return Math.max(0, Math.min(100, Math.floor(parsed)));
}

function stableBucket(seed: string): number {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) % 100;
}

function resolveEnvVars(explicit?: EnvVars): EnvVars {
    if (explicit) return explicit;
    return import.meta.env as unknown as EnvVars;
}

export function evaluateFeatureFlag(flag: FeatureFlagKey, options: EvaluateFeatureFlagOptions = {}): boolean {
    const config = FLAG_DEFINITIONS[flag];
    const envVars = resolveEnvVars(options.envVars);
    const env = options.env ?? toAppEnv(envVars.VITE_APP_ENV);

    if (parseBoolean(envVars[GLOBAL_DISABLE_VARIABLE]) === true) {
        return false;
    }

    const forced = parseBoolean(envVars[config.forceVariable]);
    if (forced !== undefined) {
        return forced;
    }

    if (!config.enabledByDefault[env]) {
        return false;
    }

    const rollout = parseRollout(envVars[config.rolloutVariable]) ?? config.rolloutPercentage[env];
    if (rollout <= 0) return false;
    if (rollout >= 100) return true;

    const bucket = stableBucket(options.userId ?? 'anonymous-user');
    return bucket < rollout;
}
