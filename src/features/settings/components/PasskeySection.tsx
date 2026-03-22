/**
 * PasskeySection — AUTH-002
 *
 * Settings → Security: lets the user register a platform passkey
 * (Touch ID, Face ID, Windows Hello) for future sign-ins.
 */

import React, { useEffect, useState } from 'react';
import { Fingerprint, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { usePasskeyAuth } from '../../auth/usePasskeyAuth';
import { useNotifications } from '../../../context/NotificationContext';
import { secureDb } from '../../../utils/secureDb';
import { captureError } from '../../../utils/error';

export const PasskeySection: React.FC = () => {
    const { user, profile } = useAuth();
    const { isSupported, registerPasskey, removePasskey, loading, error, clearError } = usePasskeyAuth();
    const { showToast } = useNotifications();
    const [hasPasskey, setHasPasskey] = useState(false);
    const [credentialId, setCredentialId] = useState<string | null>(null);

    // Check if user already has a passkey credentialId stored
    useEffect(() => {
        if (!user) return;
        void secureDb.getDocument<{ passkeyCredentialId?: string }>(user.uid, [])
            .then(data => {
                if (data && typeof data.passkeyCredentialId === 'string') {
                    setHasPasskey(true);
                    setCredentialId(data.passkeyCredentialId);
                }
            })
            .catch(() => undefined);
    }, [user]);

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
            await secureDb.updateDocument(user.uid, [], { passkeyCredentialId: credentialId });
            setHasPasskey(true);
            showToast('Passkey registered successfully.', 'success');
        } catch (err) {
            captureError(err, 'PasskeySection.save');
            showToast('Passkey created but could not be saved. Please try again.', 'error');
        }
    };

    const handleRemove = async () => {
        if (!user || !credentialId) return;
        clearError();
        const success = await removePasskey(credentialId);
        if (!success) return;
        try {
            await secureDb.updateDocument(user.uid, [], { passkeyCredentialId: '' });
            setHasPasskey(false);
            setCredentialId(null);
            showToast('Passkey removed.', 'success');
        } catch (err) {
            captureError(err, 'PasskeySection.remove');
            showToast('Passkey removed from server but local state failed to update.', 'error');
        }
    };

    if (!isSupported) return null;

    return (
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
            {hasPasskey ? (
                <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Registered
                    </span>
                    <Button
                        variant="secondary"
                        isLoading={loading}
                        onClick={handleRemove}
                        className="gap-1.5 text-red-600 dark:text-red-400 min-h-[44px]"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                    </Button>
                </div>
            ) : (
                <Button
                    variant="secondary"
                    isLoading={loading}
                    onClick={handleRegister}
                    className="gap-2 w-full sm:w-auto shrink-0"
                >
                    <Fingerprint className="w-4 h-4" />
                    Register Passkey
                </Button>
            )}
        </div>
    );
};
