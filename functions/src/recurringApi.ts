import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import { enforceRateLimit } from './rateLimit';
import { createFinanceAuditLog } from './helpers';
import {
    validateRecurringInput,
    calcNextRun,
    type RecurringInput,
    type RecurringTransaction,
} from './recurringValidation';

export const createRecurringTransaction = secureOnCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required');
    const uid = request.auth.uid;
    await enforceRateLimit('recurringCreate', uid);

    const data = request.data as RecurringInput & { status?: string };
    const validationError = validateRecurringInput(data);
    if (validationError) throw new HttpsError('invalid-argument', validationError);

    const recurringRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions');

    const newDoc: Omit<RecurringTransaction, 'id'> = {
        userId: uid,
        title: (data.title as string).trim(),
        amountCents: data.amountCents as number,
        type: data.type as RecurringTransaction['type'],
        category: (data.category as string) || 'General',
        accountId: data.accountId as string,
        frequency: data.frequency as RecurringTransaction['frequency'],
        interval: data.interval as number,
        nextRunAt: data.nextRunAt as string,
        status: 'active',
        createdAt: new Date().toISOString(),
    };

    const docRef = await recurringRef.add(newDoc);

    await createFinanceAuditLog('recurring_transaction_created', uid, {
        recurringId: docRef.id,
        title: newDoc.title,
        amountCents: newDoc.amountCents,
        type: newDoc.type,
        frequency: newDoc.frequency,
    });

    return { id: docRef.id };
});

export const updateRecurringTransaction = secureOnCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required');
    const uid = request.auth.uid;
    await enforceRateLimit('recurringUpdate', uid);

    const { id, ...updates } = request.data as RecurringInput & { id?: unknown };
    if (!id || typeof id !== 'string') throw new HttpsError('invalid-argument', 'id is required');

    const docRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Recurring rule not found');

    const existing = snap.data() as RecurringTransaction;
    if (existing.userId !== uid) throw new HttpsError('permission-denied', 'Not authorised');

    const merged: RecurringInput = {
        title: updates.title ?? existing.title,
        amountCents: updates.amountCents ?? existing.amountCents,
        type: updates.type ?? existing.type,
        category: updates.category ?? existing.category,
        accountId: updates.accountId ?? existing.accountId,
        frequency: updates.frequency ?? existing.frequency,
        interval: updates.interval ?? existing.interval,
        nextRunAt: updates.nextRunAt ?? existing.nextRunAt,
    };

    const validationError = validateRecurringInput(merged);
    if (validationError) throw new HttpsError('invalid-argument', validationError);

    const safeUpdates: Partial<RecurringTransaction> = {};
    if (updates.title !== undefined) safeUpdates.title = (merged.title as string).trim();
    if (updates.amountCents !== undefined) safeUpdates.amountCents = merged.amountCents as number;
    if (updates.type !== undefined) safeUpdates.type = merged.type as RecurringTransaction['type'];
    if (updates.category !== undefined) safeUpdates.category = merged.category as string;
    if (updates.accountId !== undefined) safeUpdates.accountId = merged.accountId as string;
    if (updates.frequency !== undefined) safeUpdates.frequency = merged.frequency as RecurringTransaction['frequency'];
    if (updates.interval !== undefined) safeUpdates.interval = merged.interval as number;
    if (updates.nextRunAt !== undefined) safeUpdates.nextRunAt = merged.nextRunAt as string;

    if (updates.frequency !== undefined || updates.interval !== undefined) {
        const base = new Date();
        safeUpdates.nextRunAt = calcNextRun(
            base,
            (safeUpdates.frequency ?? existing.frequency) as string,
            (safeUpdates.interval ?? existing.interval) as number
        ).toISOString();
    }

    await docRef.update({ ...safeUpdates, updatedAt: FieldValue.serverTimestamp() });

    await createFinanceAuditLog('recurring_transaction_updated', uid, {
        recurringId: id,
        changedFields: Object.keys(safeUpdates),
    });

    return { id };
});

export const deleteRecurringTransaction = secureOnCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required');
    const uid = request.auth.uid;
    await enforceRateLimit('recurringDelete', uid);

    const { id } = request.data as { id?: unknown };
    if (!id || typeof id !== 'string') throw new HttpsError('invalid-argument', 'id is required');

    const docRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Recurring rule not found');

    const existing = snap.data() as RecurringTransaction;
    if (existing.userId !== uid) throw new HttpsError('permission-denied', 'Not authorised');

    await docRef.delete();

    await createFinanceAuditLog('recurring_transaction_deleted', uid, {
        recurringId: id,
        title: existing.title,
    });

    return { success: true };
});

export const toggleRecurringTransaction = secureOnCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Authentication required');
    const uid = request.auth.uid;
    await enforceRateLimit('recurringUpdate', uid);

    const { id, status } = request.data as { id?: unknown; status?: unknown };
    if (!id || typeof id !== 'string') throw new HttpsError('invalid-argument', 'id is required');
    if (status !== 'active' && status !== 'paused')
        throw new HttpsError('invalid-argument', 'status must be "active" or "paused"');

    const docRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Recurring rule not found');

    const existing = snap.data() as RecurringTransaction;
    if (existing.userId !== uid) throw new HttpsError('permission-denied', 'Not authorised');

    const updates: Record<string, unknown> = { status };
    if (status === 'active' && existing.status === 'paused') {
        updates.nextRunAt = calcNextRun(new Date(), existing.frequency, existing.interval).toISOString();
    }

    await docRef.update(updates);

    await createFinanceAuditLog('recurring_transaction_toggled', uid, {
        recurringId: id,
        newStatus: status,
    });

    return { id, status };
});
