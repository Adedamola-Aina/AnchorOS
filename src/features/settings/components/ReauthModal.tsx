/**
 * Reauthentication Modal
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface ReauthModalProps {
    show: boolean;
    password: string;
    isLoading: boolean;
    onPasswordChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
}

export const ReauthModal: React.FC<ReauthModalProps> = ({
    show, password, isLoading, onPasswordChange, onConfirm, onClose
}) => {
    if (!show) return null;

    const inputClass = "w-full p-4 bg-surface-3 dark:bg-surface-3-dark rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-muted text-foreground dark:text-foreground-dark";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 dark:bg-foreground-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl">
                <VStack gap="xs">
                    <Text as="h3" variant="heading" size="lg">Verify Identity</Text>
                    <Text variant="muted" size="sm">Please enter your password to confirm this security change.</Text>
                </VStack>
                <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
                    className={inputClass}
                />
                <HStack gap="sm" className="pt-2">
                    <Button variant="secondary" onClick={onClose} className="flex-1 h-12 font-bold">
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={!password}
                        className="flex-1 h-12 bg-primary-500 hover:bg-primary-600 shadow-primary-500/20 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        Confirm
                    </Button>
                </HStack>
            </Card>
        </div>
    );
};

