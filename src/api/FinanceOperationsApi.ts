// @ts-nocheck
import { collection, doc, increment, writeBatch } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, TransactionType } from '../types';

export async function restoreSoftDeletedTransaction(
    targetUserId: string,
    transactionId: string,
    accountId: string,
    amountCents: number,
    type: TransactionType
): Promise<void> {
    const batch = writeBatch(db);

    const transactionRef = doc(db, 'artifacts', APP_ID, 'users', targetUserId, 'finance', transactionId);
    batch.update(transactionRef, { isSoftDeleted: false, deletedBy: null, deletedAt: null });

    const accountRef = doc(db, 'artifacts', APP_ID, 'users', targetUserId, 'accounts', accountId);
    batch.update(accountRef, { balanceCents: increment(type === 'income' ? amountCents : -amountCents) });

    await batch.commit();
}

export async function convertCurrencyAcrossAccounts(
    userUid: string,
    fromAcc: AnchorAccount,
    toAcc: AnchorAccount,
    amountCents: number,
    rate: number
): Promise<void> {
    const batch = writeBatch(db);
    const linkId = crypto.randomUUID();
    const now = new Date().toISOString();

    const fromOwnerId = fromAcc.ownerId || userUid;
    const outRef = doc(collection(db, 'artifacts', APP_ID, 'users', fromOwnerId, 'finance'));
    batch.set(outRef, {
        title: `Conversion to ${toAcc.currency}`,
        amountCents,
        type: 'expense',
        category: 'Conversion',
        accountId: fromAcc.id,
        accountName: fromAcc.name,
        currency: fromAcc.currency,
        scope: 'family',
        date: now,
        createdBy: userUid,
        linkId,
        conversionRate: rate,
    });
    batch.update(doc(db, 'artifacts', APP_ID, 'users', fromOwnerId, 'accounts', fromAcc.id), {
        balanceCents: increment(-amountCents),
    });

    const toOwnerId = toAcc.ownerId || userUid;
    const convertedAmountCents = Math.round(amountCents * rate);
    const inRef = doc(collection(db, 'artifacts', APP_ID, 'users', toOwnerId, 'finance'));
    batch.set(inRef, {
        title: `Conversion from ${fromAcc.currency}`,
        amountCents: convertedAmountCents,
        type: 'income',
        category: 'Conversion',
        accountId: toAcc.id,
        accountName: toAcc.name,
        currency: toAcc.currency,
        scope: 'family',
        date: now,
        createdBy: userUid,
        linkId,
        conversionRate: rate,
    });
    batch.update(doc(db, 'artifacts', APP_ID, 'users', toOwnerId, 'accounts', toAcc.id), {
        balanceCents: increment(convertedAmountCents),
    });

    await batch.commit();
}