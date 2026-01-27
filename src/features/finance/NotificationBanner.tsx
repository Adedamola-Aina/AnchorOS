import { useEffect } from 'react';
import { X, Bell, Mail } from 'lucide-react';
import { useAccountNotifications } from '../../hooks/useAccountNotifications';
import { useAuth } from '../../context/AuthContext'; // for Preferences
import { useNotifications } from '../../context/NotificationContext'; // For Toast (Email sim)
import { formatDistanceToNow } from 'date-fns';
import type { AnchorNotification } from '../../types';

interface NotificationBannerProps {
    accountId: string;
}

// Helper to group notifications
const groupNotifications = (notifications: AnchorNotification[]) => {
    const groups: { [key: string]: AnchorNotification[] } = {};

    notifications.forEach(n => {
        // Group by Actor + Date (Day) + Type
        // Actually, requirement says "Sarah added 5 transactions...". Type might mix? 
        // "added 5 transactions" implies adding. If mixed add/delete, hard to summarize easily.
        // Let's group by Actor + Day for now as primary key.
        const dateKey = new Date(n.date).toDateString();
        const key = `${n.actorName}-${dateKey}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(n);
    });

    return Object.values(groups).sort((a, b) => new Date(b[0].date).getTime() - new Date(a[0].date).getTime());
};

export const NotificationBanner = ({ accountId }: NotificationBannerProps) => {
    const { notifications, markAsRead } = useAccountNotifications(accountId);
    const { profile } = useAuth();
    const { showToast } = useNotifications();

    // Only unread
    const unread = notifications.filter(n => !n.read);

    // Group them
    const grouped = groupNotifications(unread);

    // Display limit (Max 4 GROUPS inline)
    const visibleGroups = grouped.slice(0, 4);
    const overflowGroups = grouped.slice(4);
    const overflowCount = overflowGroups.reduce((acc, group) => acc + group.length, 0);

    // Email Simulation Effect
    useEffect(() => {
        if (overflowCount > 0 && profile.notificationPreferences?.enabled) {
            // Check Frequency? For 'instant', we trigger if we hit overflow immediately.
            // For others, we assume a scheduled job, but for SIMULATION, we trigger if > 4.
            // Debounce or just trigger once per session/mount?
            // Real implementation would be backend. Here we simulate "Sending Digest".

            const timer = setTimeout(() => {
                // Only simulate if not recently done (mocked by session storage or just once component life)
                const hasSent = sessionStorage.getItem(`email_sent_${accountId}_${overflowCount}`);
                if (!hasSent) {
                    // Email digest simulation (real implementation would be backend)
                    showToast(`📧 Digest sent to ${profile.notificationPreferences?.email} (${overflowCount} more updates)`, 'info');
                    sessionStorage.setItem(`email_sent_${accountId}_${overflowCount}`, 'true');
                }
            }, 5000); // Delay to let user see UI first

            return () => clearTimeout(timer);
        }
    }, [overflowCount, profile.notificationPreferences, accountId, overflowGroups, showToast]);

    if (visibleGroups.length === 0) return null;

    return (
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2 animate-in slide-in-from-top-4 duration-500 pointer-events-none">
            {visibleGroups.map(group => {
                const latest = group[0];
                const count = group.length;
                const isGroup = count > 1;

                return (
                    <div
                        key={latest.id} // Use latest ID as key for group
                        className="pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-primary-100 dark:border-primary-500/30 p-3 rounded-2xl shadow-lg shadow-primary-500/10 flex items-center gap-3 max-w-2xl mx-auto w-full group transition-all hover:scale-[1.01]"
                    >
                        <div className={`p-2 rounded-xl shrink-0 ${isGroup ? 'bg-primary-500 text-white' : 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'}`}>
                            {isGroup ? <span className="font-bold text-xs">{count}x</span> : <Bell className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            {isGroup ? (
                                <p className="text-sm text-slate-700 dark:text-slate-200">
                                    <span className="font-bold text-slate-900 dark:text-white">{latest.actorName}</span> added {count} transactions today.
                                </p>
                            ) : (
                                <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                                    <span className="font-bold text-slate-900 dark:text-white">{latest.actorName}:</span> {latest.message}
                                </p>
                            )}
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                {formatDistanceToNow(new Date(latest.date), { addSuffix: true })}
                            </p>
                        </div>

                        <button
                            onClick={() => group.forEach(n => markAsRead(n.id))}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}

            {overflowCount > 0 && (
                <div className="pointer-events-auto bg-primary-600 text-white p-2 rounded-xl shadow-lg mx-auto flex items-center gap-2 px-4 animate-in fade-in slide-in-from-top-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold">{overflowCount} more notifications sent to your email.</span>
                </div>
            )}
        </div>
    );
};
