/**
 * AccountSelector - Grid of account cards for selection
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import type { AnchorAccount } from '../../../types';
import { Text, VStack } from '../../../components/primitives';

interface AccountSelectorProps {
    accounts: AnchorAccount[];
    selectedId: string;
    onSelect: (id: string) => void;
    label: string;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
    accounts,
    selectedId,
    onSelect,
    label
}) => {
    return (
        <VStack gap="xs">
            <Text as="label" variant="muted" size="xs" weight="bold" className="uppercase">
                {label}
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {accounts.map(acc => (
                    <button
                        key={acc.id}
                        type="button"
                        onClick={() => onSelect(acc.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${selectedId === acc.id
                            ? 'border-finance-500 bg-finance-50 dark:bg-finance-900/20 ring-1 ring-finance-500'
                            : 'border-[var(--border)] hover:border-[var(--border-subtle)]'
                            }`}
                    >
                        <Text variant="heading" size="sm" truncate as="div">
                            {acc.name}
                        </Text>
                        <Text variant="muted" size="xs" as="div">
                            {acc.currency} • {acc.type}
                        </Text>
                    </button>
                ))}
            </div>
        </VStack>
    );
};

