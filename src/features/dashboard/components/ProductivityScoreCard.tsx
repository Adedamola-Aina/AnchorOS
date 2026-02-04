/**
 * ProductivityScoreCard - Shows commitment completion stats
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Activity } from 'lucide-react';
import { Text, VStack, HStack } from '../../../components/primitives';

interface CommitmentStats {
    total: number;
    completed: number;
    rate: number;
    personal: { total: number; completed: number; rate: number };
    family: { total: number; completed: number; rate: number };
}

interface ProductivityScoreCardProps {
    commitmentStats: CommitmentStats | null;
    navigateTo?: (tab: 'dashboard' | 'commitments' | 'finance' | 'settings') => void;
}

export function ProductivityScoreCard({ commitmentStats, navigateTo }: ProductivityScoreCardProps) {
    if (!commitmentStats) {
        return (
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-6 h-6 text-primary-500" />
                </div>
                <Text as="h3" variant="heading" size="lg" className="mb-1">Boost Productivity</Text>
                <Text variant="muted" size="xs" className="mb-4 max-w-[200px]">
                    Set daily or weekly commitments to track your consistency across life domains.
                </Text>
                <button
                    onClick={() => navigateTo && navigateTo('commitments')}
                    className="text-xs font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest"
                >
                    + Set Commitments
                </button>
            </div>
        );
    }

    return (
        <div className="premium-gradient text-white p-6 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col justify-between group">
            <HStack justify="between" align="start" className="mb-4 relative z-10 transition-transform duration-700 group-hover:-translate-y-1">
                <VStack gap="sm">
                    <Text size="xs" weight="bold" className="font-black text-white/40 uppercase tracking-[0.2em]">Productivity Score</Text>
                    <p className="text-5xl font-bold tracking-tighter">{commitmentStats.rate}% <span className="text-xs font-black uppercase opacity-40 ml-1 tracking-widest">Done</span></p>
                </VStack>
                <Activity className="w-6 h-6 text-white/20" />
            </HStack>

            <VStack gap="sm" className="relative z-10">
                <div>
                    <HStack justify="between" className="text-xs font-bold mb-1">
                        <span className="opacity-70">Personal</span>
                        <span>{commitmentStats.personal.completed}/{commitmentStats.personal.total}</span>
                    </HStack>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 rounded-full transition-all duration-1000" style={{ width: `${commitmentStats.personal.rate}%` }} />
                    </div>
                </div>
                <div>
                    <HStack justify="between" className="text-xs font-bold mb-1">
                        <span className="opacity-70">Family</span>
                        <span>{commitmentStats.family.completed}/{commitmentStats.family.total}</span>
                    </HStack>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/50 rounded-full transition-all duration-1000" style={{ width: `${commitmentStats.family.rate}%` }} />
                    </div>
                </div>
            </VStack>
        </div>
    );
}

