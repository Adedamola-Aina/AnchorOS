import { collection, getDocs, query } from '../utils/secureDb';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTransaction } from '../types';
import { FieldEncryption, ENCRYPTED_TRANSACTION_FIELDS, ENCRYPTED_ACCOUNT_FIELDS } from '../services/FieldEncryption';
import {
    buildTransactionPageConstraints,
    sliceTransactionPage,
    type TransactionPageCursor,
    type TransactionPageResult
} from './financePagination';

const enc = FieldEncryption.fromEnv();

export async function decryptTransactions(raw: AnchorTransaction[]): Promise<AnchorTransaction[]> {
    if (!enc.isEnabled()) return raw;
    const decrypted = await Promise.all(
        raw.map(t => enc.decryptFields(t as unknown as Record<string, unknown>, ENCRYPTED_TRANSACTION_FIELDS))
    );
    return decrypted as unknown as AnchorTransaction[];
}

export async function decryptAccounts(raw: AnchorAccount[]): Promise<AnchorAccount[]> {
    if (!enc.isEnabled()) return raw;
    const decrypted = await Promise.all(
        raw.map(a => enc.decryptFields(a as unknown as Record<string, unknown>, ENCRYPTED_ACCOUNT_FIELDS))
    );
    return decrypted as unknown as AnchorAccount[];
}

export async function fetchTransactionsPage(
    userId: string,
    start: string,
    end: string,
    pageSize: number,
    cursor?: TransactionPageCursor
): Promise<TransactionPageResult<AnchorTransaction>> {
    const constraints = buildTransactionPageConstraints(start, end, pageSize, cursor);
    const q = query(
        collection(db, 'artifacts', APP_ID, 'users', userId, 'finance'),
        ...constraints
    );

    const snapshot = await getDocs(q);
    const raw = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as AnchorTransaction));
    const decrypted = await decryptTransactions(raw);
    return sliceTransactionPage(decrypted, pageSize);
}
