/**
 * Shared utility functions for Cloud Functions
 * 
 * Common operations: audit logging, notifications, connection lookup,
 * and verification code generation.
 */
// @ts-nocheck


import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import type { FamilyConnection } from './types';

export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAuditLog(
    action: string,
    actorUid: string,
    metadata: Record<string, unknown> = {},
    targetUid?: string
): Promise<void> {
    await db.collection('artifacts').doc(APP_ID).collection('audit_log').add({
        action,
        actorUid,
        targetUid: targetUid || null,
        metadata,
        timestamp: FieldValue.serverTimestamp(),
    });
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
