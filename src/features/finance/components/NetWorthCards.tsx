/**
 * NetWorthCards - Displays net worth by currency
 * Extracted from FinanceView per CLAUDE.md 200-line rule
 */

import { Landmark, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

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
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <Landmark className="w-16 h-16 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Worth (NGN)</p>
                    <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(netWorth.NGN, 'NGN')}
                    </h2>
                </div>
            )}

            {/* USD Net Worth Card */}
            {hasUSD && (
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-indigo-800">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <DollarSign className="w-16 h-16 text-indigo-300" />
                    </div>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Net Worth (USD)</p>
                    <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(netWorth.USD, 'USD')}
                    </h2>
                </div>
            )}
        </div>
    );
};
