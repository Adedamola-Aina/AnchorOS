/**
 * AwaitingConfirmationCard - Shows when invitee has entered correct code
 * DES-002: Migrated to semantic tokens and primitives
 */

import { Check, X, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface AwaitingConfirmationCardProps {
    inviteeEmail: string;
    showPasswordPrompt: boolean;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    confirmingConnection: boolean;
    onPasswordSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    onConfirm: () => void;
    onReject: () => void;
}

export function AwaitingConfirmationCard({
    inviteeEmail, showPasswordPrompt, password, setPassword, error,
    confirmingConnection, onPasswordSubmit, onBack, onConfirm, onReject,
}: AwaitingConfirmationCardProps) {
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-surface-2 dark:bg-surface-2-dark text-foreground dark:text-foreground-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-finance-500";

    return (
        <Card className="border-finance-200 dark:border-finance-800 bg-finance-50/50 dark:bg-finance-900/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-finance-500 to-teal-500" />
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-finance-900 dark:text-finance-400 flex items-center gap-3">
                    <div className="p-2 bg-finance-500/10 rounded-lg">
                        <Check className="w-5 h-5 text-finance-600 dark:text-finance-400" />
                    </div>
                    Confirm Family Connection
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                {showPasswordPrompt ? (
                    <form onSubmit={onPasswordSubmit} className="space-y-4">
                        <div className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-finance-200 dark:border-finance-800">
                            <Text variant="muted" size="sm">Connecting with: <span className="font-semibold text-foreground dark:text-foreground-dark">{inviteeEmail}</span></Text>
                            <Text size="xs" className="text-finance-600 dark:text-finance-400 mt-1">✓ Verification code confirmed</Text>
                        </div>
                        <VStack gap="sm">
                            <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-wider">Confirm Your Password</Text>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                                    className={inputClass}
                                    autoFocus autoComplete="current-password" />
                            </div>
                        </VStack>
                        {error && (
                            <HStack gap="sm" align="center" className="text-danger-600 dark:text-danger-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </HStack>
                        )}
                        <HStack gap="sm">
                            <Button type="button" variant="secondary" onClick={onBack} className="flex-1">Back</Button>
                            <Button type="submit" disabled={confirmingConnection || !password} className="flex-1 bg-finance-600 hover:bg-finance-700 gap-2">
                                {confirmingConnection ? <><Loader2 className="w-4 h-4 animate-spin" />Confirming...</> : <>Confirm<ArrowRight className="w-4 h-4" /></>}
                            </Button>
                        </HStack>
                    </form>
                ) : (
                    <VStack gap="md">
                        <div className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-finance-200 dark:border-finance-800">
                            <Text variant="muted" size="sm"><span className="font-semibold text-foreground dark:text-foreground-dark">{inviteeEmail}</span> has accepted your invitation and entered the correct verification code.</Text>
                            <Text size="xs" className="text-finance-600 dark:text-finance-400 mt-2">Ready to connect! Confirm to complete the family link.</Text>
                        </div>
                        <HStack gap="sm">
                            <Button variant="secondary" onClick={onReject} disabled={confirmingConnection} className="flex-1 text-danger-600 border-danger-200 hover:bg-danger-50 dark:border-danger-800 dark:hover:bg-danger-900/20">
                                <X className="w-4 h-4 mr-2" />Reject
                            </Button>
                            <Button onClick={onConfirm} disabled={confirmingConnection} className="flex-1 bg-finance-600 hover:bg-finance-700">
                                <Check className="w-4 h-4 mr-2" />Confirm Connection
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </CardContent>
        </Card>
    );
}

