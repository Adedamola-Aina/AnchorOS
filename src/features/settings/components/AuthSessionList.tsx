import React from 'react';
import { LogOut, Monitor, ShieldAlert, Smartphone } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import type { AuthEvent } from '../../../services/authEventService';

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

interface AuthSessionListProps {
  sessions: AuthEvent[];
  dismissing: string | null;
  onSignOut: (event: AuthEvent) => void;
}

export const AuthSessionList: React.FC<AuthSessionListProps> = ({ sessions, dismissing, onSignOut }) => {
  return (
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
                onClick={() => onSignOut(session)}
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
  );
};
