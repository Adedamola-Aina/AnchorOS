/**
 * DeveloperTools
 * 
 * Developer-only tools for seeding data and simulating scenarios.
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Logic extracted to devtools/ subfolder.
 */
// @ts-nocheck


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
        <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-purple-50/20 dark:bg-purple-900/10">
                <CardTitle className="text-base font-bold text-purple-900 dark:text-purple-400 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
