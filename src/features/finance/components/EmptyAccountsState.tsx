/**
 * EmptyAccountsState - Empty state for when no accounts exist
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Landmark, Plus } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack } from '../../../components/primitives';

interface EmptyAccountsStateProps {
    onCreateAccount: () => void;
}

export const EmptyAccountsState = ({ onCreateAccount }: EmptyAccountsStateProps) => {
    return (
        <VStack
            align="center"
            justify="center"
            gap="md"
            className="col-span-full py-16 px-4 border-2 border-dashed border-[var(--border)] rounded-3xl animate-in fade-in zoom-in-95 duration-500"
        >
            <div className="relative mb-2">
                <div className="w-20 h-20 bg-gradient-to-br from-finance-100 to-finance-200 dark:from-finance-900/30 dark:to-finance-800/30 rounded-full flex items-center justify-center">
                    <Landmark className="w-10 h-10 text-finance-500/60 dark:text-finance-400/60" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-primary-500" />
                </div>
            </div>
            <Text as="h3" variant="heading" size="lg">
                No accounts yet
            </Text>
            <Text variant="muted" size="sm" className="text-center max-w-sm">
                Create your first account to start tracking your finances.
            </Text>
            <Button
                variant="secondary"
                onClick={onCreateAccount}
                className="gap-2 text-finance-600 border-finance-200 hover:bg-finance-50 dark:text-finance-400 dark:border-finance-800 dark:hover:bg-finance-950"
            >
                <Landmark className="w-4 h-4" />
                <span>Create your first account</span>
            </Button>
        </VStack>
    );
};

