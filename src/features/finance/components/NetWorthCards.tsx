/**
 * NetWorthCards - Displays net worth by currency
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Landmark, DollarSign } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import { Text } from '../../../components/primitives';

interface NetWorthCardsProps {
    netWorth: {
        NGN: number;
        USD: number;
    };
}

export const NetWorthCards = ({ netWorth }: NetWorthCardsProps) => {
    const hasNGN = netWorth.NGN > 0;
    const hasUSD = netWorth.USD > 0;

    if (!hasNGN && !hasUSD) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* NGN Net Worth Card */}
            {hasNGN && (
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-surface-3-dark to-surface-2-dark dark:from-slate-800 dark:to-slate-900">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <Landmark className="w-16 h-16 text-muted" />
                    </div>
                    <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-widest mb-1">
                        Net Worth (NGN)
                    </Text>
                    <Text as="h2" variant="heading" size="3xl" weight="extrabold" mono className="text-white tracking-tight">
                        {formatCurrencyCompact(netWorth.NGN, 'NGN')}
                    </Text>
                </div>
            )}

            {/* USD Net Worth Card */}
            {hasUSD && (
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary-600 to-primary-800">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <DollarSign className="w-16 h-16 text-primary-300" />
                    </div>
                    <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-widest mb-1 text-primary-200">
                        Net Worth (USD)
                    </Text>
                    <Text as="h2" variant="heading" size="3xl" weight="extrabold" mono className="text-white tracking-tight">
                        {formatCurrencyCompact(netWorth.USD, 'USD')}
                    </Text>
                </div>
            )}
        </div>
    );
};

