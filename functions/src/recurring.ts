import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { FieldValue } from 'firebase-admin/firestore';
import { db, APP_ID } from './config';
import type { RecurringTransaction } from './types';
import { validateRule, calculateNextRun, parseISO } from './recurringHelpers';

/**
 * Scheduled function to process recurring transactions.
 * Runs every day at 00:00 UTC.
 */
export const processRecurringTransactions = onSchedule(
    { schedule: 'every day 00:00', timeZone: 'UTC' },
    async () => {
        logger.info('Processing recurring transactions...');
        const now = new Date();
        const nowIso = now.toISOString();
        const recurringRef = db.collection('artifacts').doc(APP_ID).collection('recurring_transactions');

        const snapshot = await recurringRef
            .where('status', '==', 'active')
            .where('nextRunAt', '<=', nowIso)
            .get();

        if (snapshot.empty) {
            logger.info('No recurring transactions to process.');
            return;
        }

        logger.info(`Found ${snapshot.size} recurring transactions to process.`);

        const MAX_BATCH_OPS = 450;
        let batch = db.batch();
        let pendingOps = 0;
        let processedRules = 0;
        let failedRules = 0;

        const commitBatchIfNeeded = async (force = false) => {
            if (!force && pendingOps < MAX_BATCH_OPS) return;
            if (pendingOps === 0) return;
            await batch.commit();
            batch = db.batch();
            pendingOps = 0;
        };

        for (const ruleDoc of snapshot.docs) {
            const rule = { id: ruleDoc.id, ...ruleDoc.data() } as RecurringTransaction;

            try {
                const validationError = validateRule(rule);
                if (validationError) {
                    logger.error(`[Recurring] Rule ${rule.id} failed validation: ${validationError}. Pausing.`);
                    batch.update(ruleDoc.ref, { status: 'paused', failureReason: validationError });
                    pendingOps += 1;
                    failedRules += 1;
                    await commitBatchIfNeeded();
                    continue;
                }

                const userRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(rule.userId);
                const accountRef = userRef.collection('accounts').doc(rule.accountId);
                const accountDoc = await accountRef.get();

                if (!accountDoc.exists) {
                    logger.warn(`[Recurring] Account ${rule.accountId} not found for rule ${rule.id}. Pausing rule.`);
                    batch.update(ruleDoc.ref, {
                        status: 'paused',
                        failureReason: 'Account not found',
                    });
                    pendingOps += 1;
                    failedRules += 1;
                    await commitBatchIfNeeded();
                    continue;
                }

                const accountData = accountDoc.data() || {};
                const accountOwnerId = accountData.ownerId || rule.userId;
                const accountCurrency = accountData.currency || 'USD';
                const accountScope = accountData.scope || 'personal';

                const ownerUserRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(accountOwnerId);
                const transactionsRef = ownerUserRef.collection('finance');
                const txRef = transactionsRef.doc();

                const accountShares = accountData.sharedWith && typeof accountData.sharedWith === 'object'
                    ? Object.keys(accountData.sharedWith).reduce<Record<string, true>>((acc, uid) => {
                        acc[uid] = true;
                        return acc;
                    }, {})
                    : {};

                batch.set(txRef, {
                    id: txRef.id,
                    title: rule.title,
                    amountCents: rule.amountCents,
                    type: rule.type,
                    category: rule.category,
                    accountId: rule.accountId,
                    accountName: accountData.name || rule.accountName || 'Recurring',
                    currency: accountCurrency,
                    scope: accountScope,
                    date: nowIso,
                    createdAt: nowIso,
                    createdBy: 'system',
                    accountOwnerId,
                    recurringTransactionId: rule.id,
                    isSoftDeleted: false,
                    accountShares,
                });
                pendingOps += 1;

                const balanceChange = rule.type === 'expense'
                    ? -rule.amountCents
                    : rule.type === 'income'
                        ? rule.amountCents
                        : 0;
                if (balanceChange !== 0) {
                    batch.update(accountRef, { balanceCents: FieldValue.increment(balanceChange) });
                    pendingOps += 1;
                }

                const nextDate = calculateNextRun(parseISO(rule.nextRunAt), rule.frequency, rule.interval);
                batch.update(ruleDoc.ref, { lastRunAt: nowIso, nextRunAt: nextDate.toISOString() });
                pendingOps += 1;

                processedRules += 1;
                await commitBatchIfNeeded();
            } catch (error) {
                failedRules += 1;
                logger.error(`[Recurring] Error processing rule ${rule.id}`, error);
            }
        }

        await commitBatchIfNeeded(true);
        logger.info(`[Recurring] Complete. processed=${processedRules}, failed=${failedRules}`);
    },
);
