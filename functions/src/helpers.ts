/**
 * Shared utility functions for Cloud Functions
 * 
 * Common operations: audit logging, notifications, connection lookup,
 * and verification code generation.
 */
// @ts-nocheck


import { FieldValue } from 'firebase-admin/firestore';
import { createHash, randomInt } from 'node:crypto';
import { db, APP_ID } from './config';
import type { FamilyConnection } from './types';

export function generateVerificationCode(): string {
    return randomInt(100000, 999999).toString();
}

export async function createAuditLog(
    action: string,
    actorUid: string,
    metadata: Record<string, unknown> = {},
    targetUid?: string
): Promise<void> {
    const normalizedMetadata = normalizeMetadata(metadata);
    const metadataJson = stableStringify(normalizedMetadata);
    const integrityHash = createHash('sha256')
        .update(`${action}:${actorUid}:${targetUid || ''}:${metadataJson}`)
        .digest('hex');

    const auditRef = db.collection('artifacts').doc(APP_ID).collection('audit_log').doc();
    await auditRef.create({
        eventId: auditRef.id,
        schemaVersion: 1,
        immutable: true,
        action,
        actorUid,
        targetUid: targetUid || null,
        metadata: normalizedMetadata,
        integrityHash,
        timestamp: FieldValue.serverTimestamp(),
    });
}

export async function createFinanceAuditLog(
    action: string,
    actorUid: string,
    metadata: Record<string, unknown> = {},
    targetUid?: string
): Promise<void> {
    await createAuditLog(action, actorUid, { domain: 'finance', ...metadata }, targetUid);
}

function normalizeMetadata(input: Record<string, unknown>): Record<string, unknown> {
    try {
        return JSON.parse(JSON.stringify(input)) as Record<string, unknown>;
    } catch {
        return { _warning: 'metadata_not_serializable' };
    }
}

function stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(',')}]`;
    }

    const objectValue = value as Record<string, unknown>;
    const sortedKeys = Object.keys(objectValue).sort();
    const entries = sortedKeys.map((key) => `${JSON.stringify(key)}:${stableStringify(objectValue[key])}`);
    return `{${entries.join(',')}}`;
}

export async function createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    actorUid: string,
    actorName: string,
    extra: Record<string, unknown> = {}
): Promise<void> {
    await db.collection('artifacts').doc(APP_ID)
        .collection('users').doc(userId)
        .collection('notifications').add({
            type,
            title,
            message,
            actorUid,
            actorName,
            read: false,
            dismissed: false,
            createdAt: FieldValue.serverTimestamp(),
            ...extra,
        });
}

export async function getActiveConnection(userUid: string): Promise<FamilyConnection | null> {
    const connectionsRef = db.collection('artifacts').doc(APP_ID).collection('family_connections');

    // Check as owner
    const ownerQuery = await connectionsRef
        .where('ownerUid', '==', userUid)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (!ownerQuery.empty) {
        return { id: ownerQuery.docs[0].id, ...ownerQuery.docs[0].data() } as FamilyConnection;
    }

    // Check as member
    const memberQuery = await connectionsRef
        .where('memberUid', '==', userUid)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (!memberQuery.empty) {
        return { id: memberQuery.docs[0].id, ...memberQuery.docs[0].data() } as FamilyConnection;
    }

    return null;
}
