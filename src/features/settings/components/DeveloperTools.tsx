/**
 * DeveloperTools
 * DES-002: Migrated to semantic tokens
 */

import React from 'react';
import { Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import {
    SeedDataAction,
    SimulateFamilyAction,
    FixSharedAccountsAction,
    AutoAcceptInvitationAction
} from './devtools';

interface DeveloperToolsProps {
    userUid: string;
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ userUid }) => {
    return (
        <Card className="overflow-hidden border-l-4 border-l-task-500">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)] bg-task-50/20 dark:bg-task-900/10">
                <CardTitle className="text-base font-bold text-task-900 dark:text-task-400 flex items-center gap-3">
                    <div className="p-2 bg-task-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-task-600 dark:text-task-400" />
                    </div>
                    Developer Tools
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <SeedDataAction userUid={userUid} />
                <SimulateFamilyAction userUid={userUid} />
                <FixSharedAccountsAction />
                <AutoAcceptInvitationAction userUid={userUid} />
            </CardContent>
        </Card>
    );
};

