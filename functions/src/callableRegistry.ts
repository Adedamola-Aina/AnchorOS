/**
 * Callable API Registry — ARCH-025
 *
 * Centralized catalog of all Cloud Function callable APIs with
 * version metadata, type contracts, and deprecation tracking.
 *
 * Every callable exported from index.ts MUST have an entry here.
 * The registry test enforces completeness.
 *
 * Domain data lives in ./registries/ — one file per domain.
 */

/** Trigger type for a Cloud Function */
export type FunctionTrigger = 'callable' | 'scheduled' | 'trigger' | 'webhook';

/** Auth requirement for a callable */
export type AuthRequirement = 'required' | 'none';

/** API lifecycle status */
export type ApiStatus = 'stable' | 'beta' | 'deprecated' | 'internal';

/** Registry entry for a single callable */
export interface CallableRegistryEntry {
    /** Function name as exported from index.ts */
    readonly name: string;
    /** Current API version */
    readonly version: number;
    /** Human-readable description */
    readonly description: string;
    /** Function trigger type */
    readonly trigger: FunctionTrigger;
    /** Authentication requirement */
    readonly auth: AuthRequirement;
    /** Rate limit bucket (from rateLimit.ts) or null */
    readonly rateLimit: string | null;
    /** API lifecycle status */
    readonly status: ApiStatus;
    /** Domain grouping */
    readonly domain: string;
    /** Deprecation notice (if status is 'deprecated') */
    readonly deprecationNotice?: string;
    /** Version that replaces this one (if deprecated) */
    readonly replacedBy?: string;
}

import { authRegistry } from './registries/auth';
import { bankRegistry } from './registries/bank';
import { fabricRegistry } from './registries/fabric';
import { familyRegistry } from './registries/family';
import { financeRegistry } from './registries/finance';
import { infraRegistry } from './registries/infra';
import { notificationsRegistry } from './registries/notifications';
import { passkeyRegistry } from './registries/passkey';
import { securityRegistry } from './registries/security';

/**
 * Complete callable registry — source of truth for all Cloud Functions.
 * Assembled from domain-specific sub-registries in ./registries/
 */
export const CALLABLE_REGISTRY: ReadonlyArray<CallableRegistryEntry> = [
    ...authRegistry,
    ...bankRegistry,
    ...fabricRegistry,
    ...familyRegistry,
    ...financeRegistry,
    ...infraRegistry,
    ...notificationsRegistry,
    ...passkeyRegistry,
    ...securityRegistry,
];

/** Get a registry entry by function name. */
export function getCallableEntry(name: string): CallableRegistryEntry | undefined {
    return CALLABLE_REGISTRY.find((e) => e.name === name);
}

/** Get all entries for a domain. */
export function getCallablesByDomain(domain: string): ReadonlyArray<CallableRegistryEntry> {
    return CALLABLE_REGISTRY.filter((e) => e.domain === domain);
}

/** Get all unique domain names. */
export function getCallableDomains(): string[] {
    return [...new Set(CALLABLE_REGISTRY.map((e) => e.domain))].sort();
}
