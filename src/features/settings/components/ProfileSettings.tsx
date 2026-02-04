/**
 * ProfileSettings - User profile display and editing
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Text, VStack } from '../../../components/primitives';

interface ProfileSettingsProps {
    name: string;
    uid: string;
    onUpdateName: (name: string) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ name, uid, onUpdateName }) => {
    const inputClass = "w-full p-3 border border-[var(--border)] rounded-xl bg-surface-3 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark focus:ring-2 focus:ring-primary-500/20 outline-none transition-all";

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)]">
                <CardTitle className="text-base font-bold text-foreground dark:text-foreground-dark flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <User className="w-5 h-5 text-primary-500" />
                    </div>
                    User Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VStack gap="xs">
                        <Text variant="subtle" size="xs" weight="bold" className="uppercase">Display Name</Text>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => onUpdateName(e.target.value)}
                            className={inputClass}
                        />
                    </VStack>
                    <VStack gap="xs" justify="end">
                        <Text variant="subtle" size="xs" weight="bold" className="uppercase">User Identifier</Text>
                        <Text variant="muted" size="xs" className="font-mono select-all">{uid}</Text>
                    </VStack>
                </div>
            </CardContent>
        </Card>
    );
};

