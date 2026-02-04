/**
 * AssetAllocationWidget - Asset distribution visualization
 * DES-002: Migrated to semantic tokens and primitives
 */

import { useState } from 'react';
import { PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import type { AssetClass } from '../../../utils/financeInsights';
import type { Currency } from '../../../types';
import { Text, VStack, HStack } from '../../../components/primitives';

interface AssetAllocationWidgetProps {
    assets: AssetClass[];
}

export const AssetAllocationWidget = ({ assets }: AssetAllocationWidgetProps) => {
    const [expanded, setExpanded] = useState(false);

    // Sort by percentage desc
    const sortedAssets = [...assets].sort((a, b) => b.percent - a.percent);

    // Colors for visualization
    const COLORS = [
        'bg-primary-500',
        'bg-finance-500',
        'bg-primary-500',
        'bg-task-500',
        'bg-warning-500',
        'bg-danger-500',
        'bg-info-500',
        'bg-muted'
    ];

    const getColor = (i: number) => COLORS[i % COLORS.length];

    return (
        <div className={`glass-card p-6 transition-all duration-300 ${expanded ? 'row-span-2' : ''}`}>
            <HStack justify="between" align="center" className="mb-4">
                <HStack gap="sm" align="center">
                    <div className="p-1.5 bg-surface-3 dark:bg-surface-3-dark rounded-lg">
                        <PieChart className="w-4 h-4 text-muted" />
                    </div>
                    <Text size="xs" weight="bold" variant="muted" className="font-black uppercase tracking-widest">Asset Split</Text>
                </HStack>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-muted hover:text-foreground dark:hover:text-foreground-dark transition-colors"
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </HStack>

            {/* Bar Chart Visualization */}
            <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5 mb-6">
                {sortedAssets.map((asset, i) => (
                    <div
                        key={asset.id}
                        style={{ width: `${asset.percent}%` }}
                        className={`h-full ${getColor(i)} hover:opacity-80 transition-opacity cursor-help`}
                        title={`${asset.name}: ${asset.percent.toFixed(1)}%`}
                    />
                ))}
            </div>

            {/* Detailed Legend */}
            <VStack gap="sm">
                {(expanded ? sortedAssets : sortedAssets.slice(0, 4)).map((asset, i) => (
                    <HStack key={asset.id} justify="between" align="center" className="group">
                        <HStack gap="sm" align="center">
                            <div className={`w-3 h-3 rounded-full ${getColor(i)} ring-2 ring-white dark:ring-[var(--surface-1-dark)] shadow-sm`} />
                            <VStack gap="none">
                                <Text size="sm" weight="bold" className="text-muted dark:text-muted-dark">{asset.name}</Text>
                                {expanded && <Text size="xs" variant="muted" className="font-mono mt-0.5">{asset.type}</Text>}
                            </VStack>
                        </HStack>
                        <VStack gap="none" align="end">
                            <Text size="xs" weight="bold" className="font-mono tabular-nums">
                                {formatCurrencyCompact(asset.amount, asset.currency as Currency)}
                            </Text>
                            <Text size="xs" variant="muted" weight="bold" className="tabular-nums">
                                {asset.percent.toFixed(1)}%
                            </Text>
                        </VStack>
                    </HStack>
                ))}

                {!expanded && sortedAssets.length > 4 && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary-500 mt-2 py-2 border-t border-dashed border-border-subtle"
                    >
                        View {sortedAssets.length - 4} More
                    </button>
                )}
            </VStack>
        </div>
    );
};

