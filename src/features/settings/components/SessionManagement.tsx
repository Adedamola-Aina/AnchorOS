// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { Monitor, Smartphone, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { getAuthEvents, reportUnrecognisedSignIn, type AuthEvent } from '../../../services/authEventService';
import { captureError } from '../../../utils/error';

function DeviceIcon({ os }: { os: string }) {
  const isMobile = /iOS|Android/.test(os);
  return isMobile
    ? <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
    : <Monitor className="w-4 h-4 text-slate-400 shrink-0" />;
}

function formatTime(raw: string): string {
  try {
    return new Date(raw).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return raw; }
}

export const SessionManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast, confirm } = useNotifications();
  const [sessions, setSessions] = useState<AuthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAuthEvents(user.uid);
      setSessions(data.filter(e => !e.reported));
    } catch (err) {
      captureError(err, 'SessionManagement.load');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const handleSignOutAll = async () => {
    const lastOther = sessions.find((_, i) => i > 0);
    if (!lastOther?.id) return;
    const ok = await confirm({
      title: 'Sign out other devices?',
      message: 'All other sessions will be terminated. You will remain signed in on this device but may need to re-authenticate.',
      type: 'danger',
      confirmText: 'Sign out other devices',
      cancelText: 'Cancel',
    });
    if (!ok) return;
    try {
      setSigningOut(true);
      await reportUnrecognisedSignIn(lastOther.id);
      showToast('All other sessions signed out.', 'info');
      await logout();
    } catch (err) {
      captureError(err, 'SessionManagement.signOutAll');
      showToast('Failed to sign out — try again.', 'error');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-900/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Active Sessions
          </CardTitle>
          {sessions.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              className="text-rose-500 hover:text-white hover:bg-rose-500 border-rose-200 dark:border-rose-900 gap-2 min-h-[44px]"
              onClick={handleSignOutAll}
              isLoading={signingOut}
              aria-label="Sign out other devices"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out other devices</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading && (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}
        {!loading && sessions.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No active sessions found.</p>
        )}
        {!loading && sessions.length > 0 && (
          <ul className="space-y-2">
            {sessions.map((s, idx) => (
              <li
                key={s.id ?? idx}
                className="flex items-center gap-3 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
              >
                <DeviceIcon os={s.deviceInfo?.os ?? ''} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {s.deviceInfo?.os ?? 'Unknown'} · {s.deviceInfo?.browser ?? 'Unknown'}
                    {idx === 0 && (
                      <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">This device</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatTime(s.timestamp)} · {s.method ?? 'password'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
