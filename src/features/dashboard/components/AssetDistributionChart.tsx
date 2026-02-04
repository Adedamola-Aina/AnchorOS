/**
 * AssetDistributionChart - Pie chart showing account distribution
 * DES-002: Migrated to semantic tokens and primitives
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Text, VStack, HStack } from '../../../components/primitives';

interface AssetData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number; // Index signature for Recharts compatibility
}

interface AssetDistributionChartProps {
    accountData: AssetData[];
}

export function AssetDistributionChart({ accountData }: AssetDistributionChartProps) {
    return (
        <div className="glass-card p-6 min-w-0 flex flex-col min-h-[400px]">
            <Text size="xs" weight="bold" variant="muted" className="font-black uppercase tracking-[0.2em] mb-4">Asset Distribution</Text>
            <div className="flex-1 flex flex-col sm:flex-row gap-6 min-h-0">
                <div className="h-48 md:h-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%" debounce={1}>
                        <PieChart>
                            <Pie
                                data={accountData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={false}
                            >
                                {accountData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Balance']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <VStack gap="sm" className="md:w-1/2 overflow-y-auto pr-2 custom-scrollbar">
                    {accountData.map((item, idx) => (
                        <HStack key={idx} justify="between" align="center" className="text-xs group">
                            <HStack gap="sm" align="center" className="pr-2 min-w-0 flex-1">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <Text variant="muted" weight="medium" className="truncate group-hover:text-foreground dark:group-hover:text-foreground-dark transition-colors">
                                    {item.name}
                                </Text>
                            </HStack>
                            <Text weight="bold" className="font-financial shrink-0">
                                {Math.round((item.value / accountData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%
                            </Text>
                        </HStack>
                    ))}
                </VStack>
            </div>
        </div>
    );
}

