/**
 * OverdraftWarning - Warning banner for overdraft risk
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { fromCents } from '../../../utils/moneyUtils';
import { Text, HStack, VStack } from '../../../components/primitives';

interface OverdraftWarningProps {
    projectedBalance: number;
    amountCents: number;
}

export const OverdraftWarning: React.FC<OverdraftWarningProps> = ({
    projectedBalance,
    amountCents
}) => {
    return (
        <div className="mb-4 p-3 bg-danger-bg dark:bg-danger-bgDark border border-danger/20 rounded-lg animate-in slide-in-from-top-2">
            <HStack gap="sm" align="start">
                <div className="p-1 bg-danger/20 dark:bg-danger-dark/20 rounded-full mt-0.5">
                    <ArrowRightLeft className="w-3 h-3 text-danger dark:text-danger-dark" />
                </div>
                <VStack gap="none">
                    <Text variant="danger" size="xs" weight="bold" className="uppercase">
                        Warning: Overdraft Risk
                    </Text>
                    <Text variant="danger" size="xs" className="mt-0.5">
                        This transaction will take your account balance to{' '}
                        <Text as="span" mono weight="bold">
                            {amountCents > 0 ? '-' : ''}{fromCents(Math.abs(projectedBalance)).toLocaleString()}
                        </Text>.
                    </Text>
                </VStack>
            </HStack>
        </div>
    );
};

