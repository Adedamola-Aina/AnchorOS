/**
 * TransferDetails - Transfer-specific form fields
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { AnchorAccount } from '../../../types';
import { Text, HStack, VStack, Badge } from '../../../components/primitives';

interface TransferDetailsProps {
    accounts: AnchorAccount[];
    sourceAccount: AnchorAccount | undefined;
    destinationAccId: string;
    onDestinationChange: (id: string) => void;
    exchangeRate: string;
    onExchangeRateChange: (rate: string) => void;
    amount: string;
    error?: string;
}

export const TransferDetails: React.FC<TransferDetailsProps> = ({
    accounts,
    sourceAccount,
    destinationAccId,
    onDestinationChange,
    exchangeRate,
    onExchangeRateChange,
    amount,
    error
}) => {
    const destAccount = accounts.find(a => a.id === destinationAccId);
    const isDifferentCurrency = sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;
    const filteredAccounts = accounts.filter(a => a.id !== sourceAccount?.id);

    if (accounts.length < 2) {
        return (
            <div className="p-3 bg-warning-bg dark:bg-warning-bgDark border border-warning/20 rounded-lg">
                <Text variant="warning" size="xs" weight="bold" className="mb-1">
                    Transfer Unavailable
                </Text>
                <Text variant="warning" size="xs">
                    Transfers require at least two accounts. Please create another account first, or switch to Expense/Income.
                </Text>
            </div>
        );
    }

    return (
        <VStack gap="sm" className="animate-in fade-in slide-in-from-top-2 duration-200">
            <HStack gap="xs" align="center">
                <ArrowRightLeft className="w-3 h-3 text-muted" />
                <Text variant="muted" size="xs" weight="bold" className="uppercase">
                    To Account
                </Text>
                {error && <Text variant="danger" size="xs">{error}</Text>}
            </HStack>

            <div className="p-3 border border-[var(--border)] rounded-lg bg-surface-3 dark:bg-surface-3-dark flex flex-col gap-2">
                <HStack justify="between" align="center">
                    <Text variant="muted" size="xs">From:</Text>
                    <Text variant="heading" size="xs">{sourceAccount?.name}</Text>
                </HStack>
                <div className="h-px bg-[var(--border)]" />
                <HStack justify="between" align="center">
                    <Text variant="muted" size="xs">To:</Text>
                    <select
                        id="tx-destination"
                        value={destinationAccId}
                        onChange={(e) => onDestinationChange(e.target.value)}
                        className="p-1 rounded bg-transparent text-sm font-bold text-foreground dark:text-foreground-dark border-none focus:ring-0 text-right cursor-pointer"
                    >
                        {filteredAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </HStack>
            </div>

            {isDifferentCurrency && (
                <div className="p-3 bg-info-bg dark:bg-info-bgDark rounded-lg border border-info/20">
                    <HStack justify="between" align="center" className="mb-2">
                        <Text variant="primary" size="xs" weight="bold">Exchange Rate</Text>
                        <Badge variant="info" size="xs">Manual</Badge>
                    </HStack>
                    <HStack gap="sm" align="center">
                        <Text variant="muted" size="xs" mono>1 {sourceAccount?.currency} =</Text>
                        <input
                            type="number"
                            step="0.0001"
                            value={exchangeRate}
                            onChange={(e) => onExchangeRateChange(e.target.value)}
                            className="flex-1 p-1.5 text-right text-sm font-bold rounded border border-primary-200 dark:border-primary-700 bg-surface-2 dark:bg-surface-2-dark focus:outline-none focus:border-primary-500"
                        />
                        <Text variant="muted" size="xs" mono>{destAccount?.currency}</Text>
                    </HStack>
                    <Text variant="muted" size="xs" className="mt-1 text-right">
                        Receives: {formatCurrency(parseFloat(amount || '0') * parseFloat(exchangeRate || '0'), destAccount?.currency || '')}
                    </Text>
                </div>
            )}
        </VStack>
    );
};

