/**
 * @anchor-os/types
 *
 * Shared TypeScript type definitions for Anchor OS.
 * Used by both the web application (src/) and Cloud Functions (functions/src/).
 *
 * ─── Consumers ──────────────────────────────────────────────────────────────
 * Web app:       import type { ... } from '@anchor-os/types'
 * Functions:     import type { ... } from '@anchor-os/types'
 */

// ============================================================================
// Finance domain
// ============================================================================

export type TransactionType = 'income' | 'expense' | 'transfer';
export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';
export type RecurringStatus = 'active' | 'paused';
export type Currency = 'NGN' | 'USD';
export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'salary';

export interface MoneyAmount {
    amountCents: number;
    currency: Currency;
}

// ============================================================================
// Family Mode domain
// ============================================================================

export type InvitationStatus =
    | 'pending'
    | 'awaiting_confirmation'
    | 'accepted'
    | 'rejected'
    | 'expired'
    | 'revoked'
    | 'locked';

export interface FamilyInvitation {
    id: string;
    ownerUid: string;
    ownerEmail: string;
    ownerDisplayName: string;
    inviteeEmail: string;
    inviteeUid?: string;
    status: InvitationStatus;
    verificationCodeHash: string;
    verificationAttempts: number;
    createdAt: string;
    expiresAt: string;
    acceptedAt?: string;
    confirmedAt?: string;
    revokedAt?: string;
    lockedAt?: string;
}

export interface FamilyConnection {
    id: string;
    ownerUid: string;
    memberUid: string;
    ownerDisplayName: string;
    memberDisplayName: string;
    status: 'active' | 'disconnected';
    connectedAt: string;
    disconnectedAt?: string;
    disconnectedBy?: string;
}

// ============================================================================
// Audit domain
// ============================================================================

export type AuditEventDomain = 'auth' | 'finance' | 'settings' | 'commitments' | 'family';

export interface AuditEvent {
    eventId: string;
    schemaVersion: number;
    action: string;
    actorUid: string;
    targetUid?: string;
    metadata: Record<string, unknown>;
    integrityHash: string;
    timestamp: string;
}

// ============================================================================
// Rate Limiting
// ============================================================================

export interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs: number;
}

// ============================================================================
// Ledger domain (ARCH-022)
// ============================================================================

export type LedgerAction =
    | 'transaction_created'
    | 'transaction_updated'
    | 'transaction_deleted'
    | 'account_created'
    | 'account_archived'
    | 'balance_changed';

export interface LedgerEntry {
    ledgerDocId: string;
    actorUid: string;
    action: LedgerAction;
    entityId: string;
    entityType: 'transaction' | 'account';
    amountCentsDelta: number;
    snapshotBefore?: Record<string, unknown> | null;
    snapshotAfter: Record<string, unknown> | null;
    timestamp: string;
    integrityHash: string;
}
