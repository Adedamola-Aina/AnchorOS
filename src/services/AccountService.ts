/**
 * AccountService — account management operations (create, archive, rename).
 * Personalization ops: see AccountPersonalizationService.ts
 */

import { collection, doc, addDoc, writeBatch, query, where, getDocs, type Firestore } from '../utils/secureDb';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import { checkRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from '../utils/rateLimit';
import { auditFinance } from './AuditService';
import type { AnchorAccount } from '../types';
import { canManageAccount } from '../features/finance/utils/permissions';
import type { CreateAccountPayload } from './financeTypes';
import { FieldEncryption, ENCRYPTED_ACCOUNT_FIELDS } from './FieldEncryption';
import { updateAccountPersonalization as updatePersonalization } from './AccountPersonalizationService';
import { enforceServerRateLimit } from './serverRateLimit';

/**
 * AccountService providing account management operations
 */
export class AccountService {
    private firestore: Firestore;

    constructor(firestore: Firestore = db) {
        this.firestore = firestore;
    }

    /** Add a new account */
    async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
        await enforceServerRateLimit('accountCreate', userId);

        // Rate limit: 10 accounts per 24 hours
        const rateCheck = checkRateLimit(`accountCreate:${userId}`, RATE_LIMIT_CONFIGS.accountCreate);
        if (rateCheck.isLimited) {
            throw new AnchorError(
                `Too many accounts created. Please try again in ${formatRetryTime(rateCheck.retryAfterMs || 0)}.`,
                'RATE_LIMIT'
            );
        }

        try {
            // SEC-005: Encrypt balanceCents before storage.
            // Note: subsequent balance updates use Firestore increment() which requires
            // a numeric field — so rebalancing ops bypass encryption by design.
            const enc = FieldEncryption.fromEnv();
            const dataToStore = enc.isEnabled()
                ? await enc.encryptFields(
                    { ...payload, ownerId: userId, isArchived: false, shares: {} },
                    ENCRYPTED_ACCOUNT_FIELDS
                  )
                : { ...payload, ownerId: userId, isArchived: false, shares: {} };

            const docRef = await addDoc(
                collection(this.firestore, 'artifacts', APP_ID, 'users', userId, 'accounts'),
                dataToStore
            );

            // AUDIT: Log account creation
            auditFinance.accountCreated(docRef.id, payload.name, payload.type);

            return docRef.id;
        } catch (error) {
            void auditFinance.operationFailed('account_create', {
                accountName: payload.name,
                type: payload.type,
                reason: error instanceof Error ? error.message : String(error),
            });
            throw new AnchorError('Failed to add account', 'DATABASE', error);
        }
    }

    /** Delete (archive) an account */
    async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
        if (!canManageAccount(account, userId)) {
            throw new AnchorError('Permission denied: You cannot delete this account.', 'PERMISSION');
        }

        try {
            const batch = writeBatch(this.firestore);
            const timestamp = new Date().toISOString();

            const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', userId, 'accounts', account.id);
            batch.update(accRef, { isArchived: true });

            if (account.shares) {
                Object.keys(account.shares).forEach(uid => {
                    if (uid !== userId) {
                        const notifRef = doc(collection(this.firestore, 'artifacts', APP_ID, 'users', uid, 'notifications'));
                        batch.set(notifRef, {
                            type: 'system', date: timestamp, read: false,
                            message: `The account "${account.name}" has been deleted by the owner. You no longer have access.`,
                            title: 'Account Deleted', actorId: userId, actorName: userName
                        });
                    }
                });
            }
            await batch.commit();

            // AUDIT: Log account archival
            auditFinance.accountArchived(account.id, account.name);
        } catch (error) {
            void auditFinance.operationFailed('account_archive', {
                accountId: account.id,
                accountName: account.name,
                reason: error instanceof Error ? error.message : String(error),
            });
            throw new AnchorError('Failed to delete account', 'DATABASE', error);
        }
    }

    /**
     * Rename an account, or repair transaction labels left divergent by an
     * earlier partial failure. Handles large transaction sets by chunking batch
     * writes (Firestore limit: 500 ops).
     *
     * Recovery-safe ordering (FEAT-142): every divergent transaction label is
     * committed BEFORE the account document (name + history). A failure in any
     * transaction batch therefore leaves the account name unchanged, so the
     * operation can be retried — with the intended name, or, to roll labels back
     * to the persisted name, by re-submitting the current account name.
     *
     * Two intents, distinguished by the whitespace-normalized submitted name:
     * - Genuine rename: commits the new name plus exactly one history entry LAST.
     * - Label repair (normalized equal to the account name): converges divergent
     *   labels onto the persisted name and appends no history entry (no rename
     *   occurred, so a "Checking -> Checking" entry is impossible). Divergence is
     *   detected in Firestore, not from a date-filtered client view, so recovery
     *   works after a reload and for transactions outside the visible month.
     *   Returns { labelsRepaired: false } without writing when nothing diverged,
     *   so callers can avoid reporting a false success.
     */
    async renameAccount(
        userId: string,
        userName: string,
        account: AnchorAccount,
        newName: string
    ): Promise<{ labelsRepaired: boolean }> {
        if (!canManageAccount(account, userId)) {
            throw new AnchorError('Permission denied: You cannot rename this account.', 'PERMISSION');
        }
        if (!newName.trim()) {
            throw new AnchorError('Account name cannot be empty.', 'VALIDATION');
        }

        const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');
        const isLabelRepair = normalize(newName) === normalize(account.name);
        // A repair converges labels onto the PERSISTED account name; a rename
        // writes the submitted name.
        const targetName = isLabelRepair ? account.name : newName;

        try {
            const timestamp = new Date().toISOString();
            const ownerId = account.ownerId || userId;
            const accRef = doc(this.firestore, 'artifacts', APP_ID, 'users', ownerId, 'accounts', account.id);
            const historyEntry = { date: timestamp, oldName: account.name, newName, actorId: userId, actorName: userName };
            const currentHistory = account.nameHistory || [];

            const txQuery = query(collection(this.firestore, 'artifacts', APP_ID, 'users', ownerId, 'finance'), where('accountId', '==', account.id));
            const txSnap = await getDocs(txQuery);

            const BATCH_CHUNK_SIZE = 400;

            // Rewrite only documents whose label actually differs from the target.
            // A repair with nothing to fix therefore performs no writes.
            const convergeLabels = async (txDocs: typeof txSnap.docs): Promise<number> => {
                const divergent = txDocs.filter(d => d.data()?.accountName !== targetName);
                for (let i = 0; i < divergent.length; i += BATCH_CHUNK_SIZE) {
                    const batch = writeBatch(this.firestore);
                    divergent.slice(i, i + BATCH_CHUNK_SIZE).forEach(d => batch.update(d.ref, { accountName: targetName }));
                    await batch.commit();
                }
                return divergent.length;
            };

            let labelsRepaired = await convergeLabels(txSnap.docs);

            // Sync shared account transactions
            if (account.shares) {
                for (const spouseId of Object.keys(account.shares)) {
                    const spouseTxQuery = query(collection(this.firestore, 'artifacts', APP_ID, 'users', spouseId, 'finance'), where('accountId', '==', account.id));
                    const spouseTxSnap = await getDocs(spouseTxQuery);
                    if (!spouseTxSnap.empty) {
                        labelsRepaired += await convergeLabels(spouseTxSnap.docs);
                    }
                }
            }

            if (isLabelRepair) {
                // The account name is already correct; only labels needed work.
                if (labelsRepaired === 0) {
                    return { labelsRepaired: false };
                }
                auditFinance.accountLabelsRepaired(account.id, account.name);
                return { labelsRepaired: true };
            }

            // Genuine rename: commit the account name + history LAST, only after
            // every required transaction update above has succeeded.
            const accountBatch = writeBatch(this.firestore);
            accountBatch.update(accRef, { name: newName, nameHistory: [...currentHistory, historyEntry] });
            await accountBatch.commit();

            auditFinance.accountRenamed(account.id, account.name, newName);
            return { labelsRepaired: false };
        } catch (error) {
            void auditFinance.operationFailed(isLabelRepair ? 'account_label_repair' : 'account_rename', {
                accountId: account.id,
                oldName: account.name,
                newName,
                reason: error instanceof Error ? error.message : String(error),
            });
            if (error instanceof AnchorError) throw error;
            throw new AnchorError('Failed to rename account', 'DATABASE', error);
        }
    }

    async updateAccountPersonalization(
        userId: string,
        account: AnchorAccount,
        updates: { cardColor?: string; cardArtwork?: string; cardArtworkPath?: string; cardArtworkPreset?: string },
    ): Promise<void> {
        return updatePersonalization(this.firestore, userId, account, updates);
    }
}

