import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface DangerZoneProps {
    onDeleteAccount: () => Promise<void>;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
    const { confirm } = useNotifications();

    return (
        <Card className="overflow-hidden border-2 border-rose-100 dark:border-rose-900/20">
            <CardHeader className="p-6 border-b border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10">
                <CardTitle className="text-base font-bold text-rose-900 dark:text-rose-400 flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    Danger Zone
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Delete Account</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        onClick={async () => {
                            if (await confirm({
                                title: 'Delete Account?',
                                message: 'This will permanently delete your user profile, all accounts, transactions, and cancel all family connections. There is no going back.',
                                confirmText: 'Permanently Delete',
                                type: 'danger'
                            })) {
                                await onDeleteAccount();
                            }
                        }}
                        variant="primary"
                        className="bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 h-11 px-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
