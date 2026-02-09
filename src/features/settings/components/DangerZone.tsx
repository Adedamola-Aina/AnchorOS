import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { captureError } from '../../../utils/error';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';

interface DangerZoneProps {
    onDeleteAccount: () => Promise<void>;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
    const { confirm, showToast } = useNotifications();
    const { reauthenticate } = useAuth();
    const [password, setPassword] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Account?',
            message: 'This will permanently delete your user profile, all accounts, transactions, and cancel all family connections. There is no going back.',
            confirmText: 'Permanently Delete',
            type: 'danger'
        });
        if (!confirmed) return;
        setShowPasswordPrompt(true);
    };

    const handleConfirmDelete = async () => {
        if (!password) { showToast('Password required.', 'error'); return; }
        setIsDeleting(true);
        try {
            await reauthenticate(password);
            await onDeleteAccount();
        } catch (err: unknown) {
            captureError(err, 'DangerZone.deleteAccount');
            const msg = err instanceof Error ? err.message : String(err);
            showToast(msg.includes('wrong-password') ? 'Incorrect password.' : 'Error: ' + msg, 'error');
        } finally {
            setIsDeleting(false);
            setPassword('');
            setShowPasswordPrompt(false);
        }
    };

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
                        onClick={handleDelete}
                        variant="primary"
                        className="bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 h-11 px-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                    >
                        Delete Account
                    </Button>
                </div>

                {showPasswordPrompt && (
                    <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-sm font-bold text-rose-900 dark:text-rose-300 mb-3">Confirm your password to proceed</p>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password" autoComplete="current-password"
                            className="w-full p-3 border border-rose-200 dark:border-rose-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 outline-none mb-3"
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmDelete()} />
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => { setShowPasswordPrompt(false); setPassword(''); }}>Cancel</Button>
                            <Button variant="primary" size="sm" isLoading={isDeleting} onClick={handleConfirmDelete}
                                className="bg-rose-500 hover:bg-rose-600">Confirm Deletion</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
