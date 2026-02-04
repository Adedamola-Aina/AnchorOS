/**
 * AuthGate Loading & Gate Components
 * DES-002: Migrated to semantic tokens
 * Extracted from AuthGate.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Mail } from 'lucide-react';
import { AnchorLogo } from '../shared';
import { OnboardingView } from '../../features/onboarding/OnboardingView';
import { Text, VStack } from '../primitives';

export const AuthLoadingScreen: React.FC = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-surface-2 dark:bg-surface-1-dark gap-6">
        <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-foreground dark:border-foreground-dark opacity-20"></div>
            <AnchorLogo className="absolute w-10 h-10 text-foreground dark:text-foreground-dark animate-pulse" />
        </div>
        <Text size="xs" weight="bold" className="tracking-[0.2em] uppercase text-muted animate-pulse">Initializing Anchor OS</Text>
    </div>
);

interface EmailVerificationGateProps { email: string; onResend: () => void; onRefresh: () => void; onLogout: () => void; }
export const EmailVerificationGate: React.FC<EmailVerificationGateProps> = ({ email, onResend, onRefresh, onLogout }) => (
    <div className="h-screen w-full flex items-center justify-center bg-surface-1-dark text-foreground-dark p-4">
        <VStack gap="lg" align="center" className="w-full max-w-md bg-surface-2-dark border border-surface-3-dark p-8 rounded-3xl shadow-2xl text-center">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto text-primary-400"><Mail className="w-8 h-8" /></div>
            <VStack gap="sm" align="center">
                <Text size="xl" weight="bold">Verify your Email</Text>
                <Text variant="muted">We've sent a verification link to <span className="text-foreground-dark font-medium">{email}</span>. Please check your inbox to continue.</Text>
            </VStack>
            <VStack gap="sm" className="w-full">
                <button onClick={onResend} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors">Resend Email</button>
                <button onClick={onRefresh} className="w-full bg-surface-3-dark hover:bg-surface-2-dark text-foreground-dark font-bold py-3 rounded-xl transition-colors">I've Verified It</button>
                <button onClick={onLogout} className="w-full text-muted hover:text-foreground-dark text-sm">Sign Out</button>
            </VStack>
        </VStack>
    </div>
);

interface OnboardingGateProps { show: boolean; }
export const OnboardingGate: React.FC<OnboardingGateProps> = ({ show }) => show ? <OnboardingView /> : null;

