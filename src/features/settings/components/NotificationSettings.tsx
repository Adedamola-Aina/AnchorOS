/**
 * NotificationSettings - Push and email notification preferences
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

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
    emailEnabled, email, frequency, userEmail, emailVerified,
    onUpdatePreferences, pushPermissionStatus, requestPushPermission,
}) => {
    const toggleClass = (enabled: boolean) => `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-1-dark ${enabled ? 'bg-primary-500' : 'bg-surface-3 dark:bg-surface-3-dark'}`;
    const inputClass = "w-full p-3 border border-[var(--border)] rounded-xl bg-surface-3 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-muted";

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-[var(--border-subtle)] bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-foreground dark:text-foreground-dark flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Bell className="w-5 h-5 text-primary-500" />
                    </div>
                    Notifications
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {/* Push Notifications */}
                <HStack justify="between" align="center" className="flex-col sm:flex-row gap-3">
                    <VStack gap="xs" className="flex-1 min-w-0">
                        <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Push Notifications</Text>
                        <HStack gap="sm" align="center" className="flex-wrap">
                            <Text variant="muted" size="sm">Real-time alerts for transactions and commitments.</Text>
                            {pushPermissionStatus === 'granted' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-finance-100 text-finance-700 dark:bg-finance-900/30 dark:text-finance-400">ON</span>
                            )}
                            {pushPermissionStatus === 'denied' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">BLOCKED</span>
                            )}
                        </HStack>
                    </VStack>
                    <button
                        onClick={() => requestPushPermission()}
                        className={toggleClass(pushPermissionStatus === 'granted')}
                        disabled={pushPermissionStatus === 'denied'}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushPermissionStatus === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </HStack>

                <div className="h-px bg-[var(--border-subtle)]" />

                {/* Email Notifications */}
                <HStack justify="between" align="center" className="flex-col sm:flex-row gap-3">
                    <VStack gap="xs" className="flex-1 min-w-0">
                        <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Email Notifications</Text>
                        <Text variant="muted" size="sm">Receive digests or instant alerts for family activity.</Text>
                    </VStack>
                    <button onClick={() => onUpdatePreferences({ enabled: !emailEnabled })} className={toggleClass(emailEnabled)}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </HStack>

                {emailEnabled && (
                    <VStack gap="lg" className="animate-in slide-in-from-top-2 duration-300 pt-6 border-t border-[var(--border-subtle)]">
                        <VStack gap="xs">
                            <Text variant="subtle" size="xs" weight="bold" className="uppercase">Notification Email</Text>
                            <input
                                type="email"
                                value={email || userEmail || ''}
                                onChange={(e) => onUpdatePreferences({ email: e.target.value })}
                                className={inputClass}
                            />
                            {!emailVerified && (
                                <HStack gap="xs" align="center" className="text-warning-500 text-[10px] font-bold mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Email not verified. Notifications may be restricted.</span>
                                </HStack>
                            )}
                        </VStack>

                        <VStack gap="xs">
                            <Text variant="subtle" size="xs" weight="bold" className="uppercase">Frequency</Text>
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
                        </VStack>
                    </VStack>
                )}
            </CardContent>
        </Card>
    );
};

