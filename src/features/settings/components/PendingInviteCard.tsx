/**
 * PendingInviteCard - Shows when waiting for invitee to accept
 */

import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface PendingInviteCardProps {
    inviteeEmail: string;
    createdAt: string;
    onCancelInvite: () => void;
}

export function PendingInviteCard({ inviteeEmail, createdAt, onCancelInvite }: PendingInviteCardProps) {
    return (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-400 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg animate-pulse">
                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    Invitation Pending
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Waiting for <span className="font-semibold">{inviteeEmail}</span> to accept and enter the verification code.
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Sent {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={onCancelInvite}
                        className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
                    >
                        Cancel Invitation
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
