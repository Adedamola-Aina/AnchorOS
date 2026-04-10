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
import { Monitor, Smartphone, RefreshCw, LogOut, ShieldAlert } from 'lucide-react';
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

function DeviceIcon({ os }: { os: string }) {
    const isMobile = /iOS|Android/.test(os);
    return isMobile
        ? <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
        : <Monitor className="w-4 h-4 text-slate-400 shrink-0" />;
}

function formatTimestamp(raw: string): string {
    try {
        return new Date(raw).toLocaleString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return raw;
    }
}

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
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {sessions.map((session, idx) => {
                            const isCurrent = idx === 0;
                            return (
                                <li
                                    key={session.id ?? idx}
                                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
                                >
                                    <DeviceIcon os={session.deviceInfo?.os ?? ''} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                                                {session.deviceInfo?.os ?? 'Unknown'} · {session.deviceInfo?.browser ?? 'Unknown'}
                                            </p>
                                            {isCurrent && (
                                                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-1.5 py-px shrink-0">
                                                    This device
                                                </span>
                                            )}
                                            {!isCurrent && session.newDevice && (
                                                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full px-1.5 py-px shrink-0">
                                                    <ShieldAlert className="w-2.5 h-2.5" />
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-tight">
                                            {formatTimestamp(session.timestamp)}
                                            {session.method ? <span> · {session.method}</span> : null}
                                        </p>
                                    </div>
                                    {!isCurrent && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 min-h-[44px] px-2 shrink-0"
                                            onClick={() => handleSignOut(session)}
                                            isLoading={dismissing === session.id}
                                            title="Sign out this device"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};
