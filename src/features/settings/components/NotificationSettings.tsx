import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';

interface NotificationSettingsProps {
    emailEnabled: boolean;
    email: string;
    frequency: 'instant' | 'daily' | 'weekly';
    userEmail: string;
    emailVerified: boolean;
    onUpdatePreferences: (prefs: any) => void;
    pushPermissionStatus: NotificationPermission;
    requestPushPermission: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
    emailEnabled,
    email,
    frequency,
    userEmail,
    emailVerified,
    onUpdatePreferences,
    pushPermissionStatus,
    requestPushPermission,
}) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Bell className="w-5 h-5 text-primary-500" />
                    </div>
                    Notifications
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {/* Push Notifications Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Push Notifications</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Real-time alerts for transactions and commitments.
                            </p>
                            {pushPermissionStatus === 'granted' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">ON</span>
                            )}
                            {pushPermissionStatus === 'denied' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">BLOCKED</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (pushPermissionStatus !== 'granted') {
                                requestPushPermission();
                            } else {
                                // In a real app, this would delete the token from the backend
                                // For now we just allow re-requesting/syncing
                                requestPushPermission();
                            }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${pushPermissionStatus === 'granted' ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        disabled={pushPermissionStatus === 'denied'}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushPermissionStatus === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Email Notifications</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive digests or instant alerts for family activity.</p>
                    </div>
                    <button
                        onClick={() => onUpdatePreferences({ enabled: !emailEnabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${emailEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {emailEnabled && (
                    <div className="animate-in slide-in-from-top-2 duration-300 space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Notification Email</label>
                            <input
                                type="email"
                                value={email || userEmail || ''}
                                onChange={(e) => onUpdatePreferences({ email: e.target.value })}
                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-slate-400"
                            />
                            {!emailVerified && (
                                <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3 h-3" /> Email not verified. Notifications may be restricted.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Frequency</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                                    <Button
                                        key={freq}
                                        variant={frequency === freq ? 'primary' : 'secondary'}
                                        size="sm"
                                        onClick={() => onUpdatePreferences({ frequency: freq })}
                                        className={`capitalize ${frequency === freq ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-100 dark:shadow-none' : ''}`}
                                    >
                                        {freq}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
