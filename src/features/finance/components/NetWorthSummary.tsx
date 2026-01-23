import React from 'react';
import { DollarSign, Landmark } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

interface NetWorthSummaryProps {
    netWorth: { NGN: number; USD: number };
}

export const NetWorthSummary: React.FC<NetWorthSummaryProps> = ({ netWorth }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Worth (NGN)</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                            {formatCurrency(netWorth.NGN, 'NGN')}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Worth (USD)</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                            {formatCurrency(netWorth.USD, 'USD')}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};
