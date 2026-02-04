/**
 * Family Settings UI States
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Users, Check, Loader2, UserMinus, ArrowRight } from 'lucide-react';
import { Text, VStack, HStack } from '../../../components/primitives';

interface FamilyConnection {
    id: string; ownerUid: string; memberUid: string; ownerDisplayName: string;
    memberDisplayName: string; status: 'active' | 'disconnected'; connectedAt: string;
}

export const FamilyLoadingState: React.FC = () => (
    <Card>
        <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-warning-500 animate-spin" />
        </CardContent>
    </Card>
);

interface PostConnectionProps { message: string; onGoToFinance: () => void; }
export const FamilyPostConnectionMessage: React.FC<PostConnectionProps> = ({ message, onGoToFinance }) => (
    <Card className="border-finance-200 dark:border-finance-800 bg-finance-50/50 dark:bg-finance-900/10 overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-finance-100 dark:bg-finance-900/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-finance-600 dark:text-finance-400" />
            </div>
            <VStack gap="sm" align="center">
                <Text as="h3" variant="heading" size="lg">🎉 Connected!</Text>
                <Text variant="muted">{message}</Text>
            </VStack>
            <Button onClick={onGoToFinance} className="gap-2">Go to Finance <ArrowRight className="w-4 h-4" /></Button>
        </CardContent>
    </Card>
);

interface ConnectedStateProps { connection: FamilyConnection; currentUserId: string; disconnecting: boolean; onDisconnect: () => void; }
export const FamilyConnectedState: React.FC<ConnectedStateProps> = ({ connection, currentUserId, disconnecting, onDisconnect }) => {
    const isOwner = connection.ownerUid === currentUserId;
    const partnerName = isOwner ? connection.memberDisplayName : connection.ownerDisplayName;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)] bg-finance-50/30 dark:bg-finance-900/10">
                <CardTitle className="text-base font-bold text-finance-900 dark:text-finance-500 flex items-center gap-3">
                    <div className="p-2 bg-finance-500/10 rounded-lg"><Users className="w-5 h-5 text-finance-600 dark:text-finance-500" /></div>
                    Family Connected
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <HStack justify="between" align="center" className="p-4 rounded-2xl border border-finance-100 dark:border-finance-500/20 bg-finance-50/50 dark:bg-finance-500/5">
                    <HStack gap="sm" align="center">
                        <div className="w-10 h-10 bg-finance-500/20 rounded-full flex items-center justify-center"><span className="text-lg">👥</span></div>
                        <VStack gap="xs">
                            <Text weight="semibold">{partnerName}</Text>
                            <Text variant="muted" size="xs" className="text-finance-600/70 dark:text-finance-400/70">{isOwner ? 'Family Member' : 'Household Owner'}</Text>
                        </VStack>
                    </HStack>
                    <HStack gap="xs" align="center" className="text-finance-600 dark:text-finance-400">
                        <Check className="w-4 h-4" /><Text size="xs" weight="bold" className="uppercase tracking-wider">Active</Text>
                    </HStack>
                </HStack>
                <Text variant="muted" size="sm">Connected since {new Date(connection.connectedAt).toLocaleDateString()}</Text>
                <Button variant="secondary" onClick={onDisconnect} disabled={disconnecting} className="w-full text-danger-600 border-danger-200 hover:bg-danger-50 dark:border-danger-900/30 dark:hover:bg-danger-950/30">
                    {disconnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserMinus className="w-4 h-4 mr-2" />}
                    {isOwner ? 'Remove Family Member' : 'Leave Household'}
                </Button>
            </CardContent>
        </Card>
    );
};

interface InviteCardProps { onShowInviteForm: () => void; }
export const FamilyInviteCard: React.FC<InviteCardProps> = ({ onShowInviteForm }) => (
    <Card className="overflow-hidden border-dashed border-2 border-[var(--border)] hover:border-warning-300 dark:hover:border-warning-700 transition-colors">
        <CardContent className="p-6">
            <button onClick={onShowInviteForm} className="w-full flex items-center gap-4 text-left group">
                <div className="p-3 bg-surface-3 dark:bg-surface-3-dark rounded-xl group-hover:bg-warning-100 dark:group-hover:bg-warning-900/30 transition-colors">
                    <Users className="w-6 h-6 text-muted group-hover:text-warning-600 dark:group-hover:text-warning-400 transition-colors" />
                </div>
                <VStack gap="xs" className="flex-1">
                    <Text weight="semibold" className="group-hover:text-warning-900 dark:group-hover:text-warning-400 transition-colors">Invite Family Member</Text>
                    <Text variant="muted" size="sm">Share selected accounts with a spouse or partner</Text>
                </VStack>
                <ArrowRight className="w-5 h-5 text-subtle group-hover:text-warning-500 transition-colors" />
            </button>
        </CardContent>
    </Card>
);

