/**
 * PasskeySection — AUTH-002
 *
 * Settings → Security: lets the user register a platform passkey
 * (Touch ID, Face ID, Windows Hello) for future sign-ins.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Fingerprint, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { usePasskeyAuth } from '../../auth/usePasskeyAuth';
import { useNotifications } from '../../../context/NotificationContext';
import { secureDb } from '../../../utils/secureDb';
import { captureError } from '../../../utils/error';

interface PasskeyCredential {
    id: string;
    credentialId: string;
    createdAt?: unknown;
    lastUsed?: unknown;
}

const MAX_PASSKEYS = 2;

export const PasskeySection: React.FC = () => {
    const { user, profile } = useAuth();
    const { isSupported, registerPasskey, removePasskey, loading, error, clearError } = usePasskeyAuth();
    const { showToast } = useNotifications();
    const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const toTimestampLabel = (value: unknown): string => {
        if (!value) return 'Unknown time';
        if (typeof value === 'string') return new Date(value).toLocaleString();
        if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
            return (value as { toDate: () => Date }).toDate().toLocaleString();
        }
        if (value && typeof value === 'object' && 'seconds' in value && typeof (value as { seconds?: number }).seconds === 'number') {
            return new Date((value as { seconds: number }).seconds * 1000).toLocaleString();
        }
        return 'Unknown time';
    };

    const loadPasskeys = useCallback(async () => {
        if (!user) return;
        const rows = await secureDb.queryCollection<PasskeyCredential>(user.uid, 'passkeys', []);
        setPasskeys(rows);
    }, [user]);

    useEffect(() => {
        if (!user) return;
        void loadPasskeys().catch(() => undefined);
    }, [loadPasskeys, user]);

    const handleRegister = async () => {
        if (!user) return;
        clearError();
        const credentialId = await registerPasskey(
            user.uid,
            user.email ?? '',
            profile.name ?? user.email ?? 'User',
        );
        if (!credentialId) return;
        try {
            await loadPasskeys();
            showToast('Passkey registered successfully.', 'success');
        } catch (err) {
            captureError(err, 'PasskeySection.save');
            showToast('Passkey created, but the list could not refresh. Pull to refresh and try again.', 'error');
        }
    };

    const handleRemove = async (credentialId: string) => {
        if (!user) return;
        clearError();
        try {
            setRemovingId(credentialId);
            const success = await removePasskey(credentialId);
            if (!success) return;
            await loadPasskeys();
            showToast('Passkey removed.', 'success');
        } catch (err) {
            captureError(err, 'PasskeySection.remove');
            showToast('Passkey removed on server, but the list could not refresh.', 'error');
        } finally {
            setRemovingId(null);
        }
    };

    if (!isSupported) return null;

    return (
        <>
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:justify-between">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Fingerprint className="w-3.5 h-3.5" />
                    Passkey (Touch ID / Face ID)
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign in without a password using your device biometrics.
                </p>
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>
            <div className="w-full sm:w-auto shrink-0 space-y-2">
                <Button
                    variant="secondary"
                    isLoading={loading}
                    onClick={handleRegister}
                    disabled={passkeys.length >= MAX_PASSKEYS}
                    className="gap-2 w-full sm:w-auto"
                >
                    <Fingerprint className="w-4 h-4" />
                    {passkeys.length >= MAX_PASSKEYS ? 'Passkey limit reached' : 'Register Passkey'}
                </Button>
            </div>
        </div>
        <div className="mt-3 space-y-2">
            {passkeys.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    No passkeys registered yet. You can register up to {MAX_PASSKEYS}.
                </p>
            ) : (
                passkeys.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-3 py-2">
                        <div className="min-w-0">
                            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                Passkey ending {item.credentialId.slice(-6)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Added {toTimestampLabel(item.createdAt)}
                                {item.lastUsed ? ` · Last used ${toTimestampLabel(item.lastUsed)}` : ''}
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            isLoading={removingId === item.credentialId}
                            onClick={() => handleRemove(item.credentialId)}
                            className="gap-1.5 text-red-600 dark:text-red-400 min-h-[44px] px-3"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                        </Button>
                    </div>
                ))
            )}
        </div>
        </>
    );
};
