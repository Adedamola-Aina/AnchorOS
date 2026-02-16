/**
 * SharedActivitySection - Activity feed for shared accounts
 * Extracted from AccountDetailsView per CLAUDE.md §3.2
 */
// @ts-nocheck


import { Users } from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';
import type { AccountActivity } from '../../../types/activity';

interface SharedActivitySectionProps {
    activities: AccountActivity[];
    currentUserId?: string;
    loading: boolean;
}

export const SharedActivitySection = ({
    activities,
    currentUserId,
    loading,
}: SharedActivitySectionProps) => (
    <div className="glass-card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary-500" />
            <span>Recent Activity</span>
            <span className="text-[10px] font-black text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Shared
            </span>
        </h3>
        <ActivityFeed
            activities={activities}
            currentUserId={currentUserId}
            loading={loading}
            maxItems={5}
        />
    </div>
);
