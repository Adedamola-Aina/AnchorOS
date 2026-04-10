/**
 * AuthEventHistory — unified Devices & Sessions panel
 * AUTH-003 / SEC-009
 *
 * Shows all recorded sign-in sessions. Current device (most recent) is pinned
 * at top with a "This device" badge and no action. All other sessions can be
 * individually signed out (removes the Firestore record via revokeSession).
 * "Sign out all other devices" revokes all refresh tokens and logs the user out.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Monitor, RefreshCw, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import {
    getAuthEvents,
    dismissAuthEvent,
    reportUnrecognisedSignIn,
    type AuthEvent,
} from '../../../services/authEventService';
import { captureError } from '../../../utils/error';
import { AuthSessionList } from './AuthSessionList';

export const AuthEventHistory: React.FC = () => {
    const { user, logout } = useAuth();
    const { showToast, confirm } = useNotifications();
    const [sessions, setSessions] = useState<AuthEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [dismissing, setDismissing] = useState<string | null>(null);
    const [signingOutAll, setSigningOutAll] = useState(false);

    const loadSessions = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getAuthEvents(user.uid);
            setSessions(data.filter(e => !e.reported));
        } catch (err) {
            captureError(err, 'AuthEventHistory.load');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { void loadSessions(); }, [loadSessions]);

    const handleSignOut = async (event: AuthEvent) => {
        if (!event.id) return;
        // Optimistic removal
        setSessions(prev => prev.filter(e => e.id !== event.id));
        setDismissing(event.id);
        try {
            await dismissAuthEvent(event.id);
        } catch (err) {
            captureError(err, 'AuthEventHistory.signOut');
            showToast('Could not sign out that device — please try again.', 'error');
            await loadSessions();
        } finally {
            setDismissing(null);
        }
    };

    const handleSignOutAll = async () => {
        const otherSession = sessions.find((_, i) => i > 0);
        if (!otherSession?.id) return;

        const confirmed = await confirm({
            title: 'Sign out all devices?',
            message: 'This will immediately sign out all sessions on every device, including this one. You will need to sign in again.',
            type: 'danger',
            confirmText: 'Sign out all devices',
            cancelText: 'Cancel',
        });
        if (!confirmed) return;

        try {
            setSigningOutAll(true);
            await reportUnrecognisedSignIn(otherSession.id);
            showToast('All sessions have been signed out.', 'info');
            await logout();
        } catch (err) {
            captureError(err, 'AuthEventHistory.signOutAll');
            showToast('Failed to sign out — please try again.', 'error');
        } finally {
            setSigningOutAll(false);
        }
    };

    const otherSessions = sessions.slice(1);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        Devices & Sessions
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {otherSessions.length > 0 && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="text-rose-500 hover:text-white hover:bg-rose-500 border-rose-200 dark:border-rose-900 gap-2 min-h-[44px]"
                                onClick={handleSignOutAll}
                                isLoading={signingOutAll}
                                aria-label="Sign out all other devices"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline text-xs font-medium">Sign out all other devices</span>
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={loadSessions} title="Refresh">
                            <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {loading && (
                    <div className="space-y-2">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                )}
                {!loading && sessions.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">No active sessions found.</p>
                )}
                {!loading && sessions.length > 0 && (
                    <AuthSessionList
                        sessions={sessions}
                        dismissing={dismissing}
                        onSignOut={handleSignOut}
                    />
                )}
            </CardContent>
        </Card>
    );
};
