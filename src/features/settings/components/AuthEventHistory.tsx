/**
 * AuthEventHistory — SEC-009
 *
 * Shows the last 10 sign-in events for the current user with device info.
 * Lets the user report an unrecognised event which force-revokes all sessions.
 */
// @ts-nocheck


import React, { useEffect, useState, useCallback } from 'react';
import { Monitor, Smartphone, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { getAuthEvents, reportUnrecognisedSignIn, dismissAuthEvent, type AuthEvent } from '../../../services/authEventService';
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
    const [events, setEvents] = useState<AuthEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [reporting, setReporting] = useState<string | null>(null);
    const [dismissing, setDismissing] = useState<string | null>(null);

    const loadEvents = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getAuthEvents(user.uid);
            setEvents(data.filter(e => !e.reported));
        } catch (err) {
            captureError(err, 'AuthEventHistory.load');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { void loadEvents(); }, [loadEvents]);

    const handleDismiss = async (event: AuthEvent) => {
        if (!event.id) return;
        // Optimistic removal
        setEvents(prev => prev.filter(e => e.id !== event.id));
        setDismissing(event.id);
        try {
            await dismissAuthEvent(event.id);
        } catch (err) {
            // Roll back optimistic update on failure
            captureError(err, 'AuthEventHistory.dismiss');
            showToast('Could not remove entry — please try again.', 'error');
            await loadEvents();
        } finally {
            setDismissing(null);
        }
    };

    const handleSignOutAll = async (event: AuthEvent) => {
        if (!event.id) return;
        const confirmed = await confirm({
            title: 'Sign out all sessions?',
            message: 'This will immediately sign out ALL active sessions on every device, including this one. You will need to sign in again.',
            type: 'danger',
            confirmText: 'Sign out all sessions',
            cancelText: 'Cancel',
        });
        if (!confirmed) return;
        try {
            setReporting(event.id);
            await reportUnrecognisedSignIn(event.id);
            setEvents(prev => prev.filter(e => e.id !== event.id));
            showToast('All sessions have been signed out. Please sign in again.', 'info');
            await logout();
        } catch (err) {
            captureError(err, 'AuthEventHistory.report');
            showToast('Failed to report — please try again.', 'error');
        } finally {
            setReporting(null);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-400 flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Monitor className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        Recent Sign-Ins
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={loadEvents} title="Refresh">
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {loading && (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                )}
                {!loading && events.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No recent sign-ins recorded.</p>
                )}
                {!loading && events.length > 0 && (
                    <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {events.map((event, idx) => (
                            <li
                                key={event.id ?? idx}
                                className="flex items-center gap-3 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
                            >
                                <DeviceIcon os={event.deviceInfo?.os ?? ''} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {event.deviceInfo?.os ?? 'Unknown'} · {event.deviceInfo?.browser ?? 'Unknown'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-1">
                                        {formatTimestamp(event.timestamp)}
                                        {event.method ? <span>· {event.method}</span> : null}
                                    </p>
                                </div>
                                {idx > 0 && !event.reported && (
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] px-2"
                                            onClick={() => handleDismiss(event)}
                                            isLoading={dismissing === event.id}
                                            title="Remove from history"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 min-h-[44px] px-3"
                                            onClick={() => handleSignOutAll(event)}
                                            isLoading={reporting === event.id}
                                            title="Not you? Sign out all sessions"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            <span className="ml-1.5 text-xs font-medium hidden sm:inline">Sign out all</span>
                                        </Button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-xs text-slate-400 mt-4 text-center">
                    Last 10 sign-ins. <X className="w-3 h-3 inline" /> removes permanently · <AlertTriangle className="w-3 h-3 inline" /> signs out all sessions.
                </p>
            </CardContent>
        </Card>
    );
};
