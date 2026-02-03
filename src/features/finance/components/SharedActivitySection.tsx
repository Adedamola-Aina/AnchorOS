/**
 * SharedActivitySection - Activity feed for shared accounts
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Users } from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';
import type { AccountActivity } from '../../../types/activity';
import { Text, HStack, Badge } from '../../../components/primitives';

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
        <HStack gap="sm" align="center" className="mb-4">
            <Users className="w-4 h-4 text-primary-500" />
            <Text variant="heading" weight="bold">Recent Activity</Text>
            <Badge variant="primary" size="xs">Shared</Badge>
        </HStack>
        <ActivityFeed
            activities={activities}
            currentUserId={currentUserId}
            loading={loading}
            maxItems={5}
        />
    </div>
);

