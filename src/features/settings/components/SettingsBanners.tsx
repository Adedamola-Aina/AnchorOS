/**
 * SettingsView Notification Banners
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface VerifyEmailBannerProps {
    isResending: boolean;
    onResend: () => void;
}

export const VerifyEmailBanner: React.FC<VerifyEmailBannerProps> = ({ isResending, onResend }) => (
    <HStack justify="between" align="center" className="flex-col sm:flex-row gap-4 p-5 md:p-6 bg-danger-50 dark:bg-danger-500/10 border border-danger-100 dark:border-danger-500/20 rounded-3xl text-danger-700 dark:text-danger-400">
        <HStack gap="md" align="center" className="text-center sm:text-left">
            <div className="p-2 bg-danger-100 dark:bg-danger-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-danger-500" />
            </div>
            <VStack gap="xs">
                <Text weight="bold" size="xs" className="uppercase tracking-wider">Email Not Verified</Text>
                <Text size="sm" className="opacity-80">Please verify your email to secure your identity and enable full access.</Text>
            </VStack>
        </HStack>
        <Button
            variant="primary"
            onClick={onResend}
            isLoading={isResending}
            className="bg-danger-500 hover:bg-danger-600 shadow-danger-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]"
        >
            Verify Now
        </Button>
    </HStack>
);

interface EnableMfaBannerProps {
    onEnable: () => void;
}

export const EnableMfaBanner: React.FC<EnableMfaBannerProps> = ({ onEnable }) => (
    <HStack justify="between" align="center" className="flex-col sm:flex-row gap-4 p-5 md:p-6 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-3xl text-primary-700 dark:text-primary-400">
        <HStack gap="md" align="center" className="text-center sm:text-left">
            <div className="p-2 bg-primary-100 dark:bg-primary-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-primary-500" />
            </div>
            <VStack gap="xs">
                <Text weight="bold" size="xs" className="uppercase tracking-wider">MFA Recommended</Text>
                <Text size="sm" className="opacity-80">Protect your account with two-factor authentication.</Text>
            </VStack>
        </HStack>
        <Button
            variant="primary"
            onClick={onEnable}
            className="bg-primary-500 hover:bg-primary-600 shadow-primary-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]"
        >
            Enable 2FA
        </Button>
    </HStack>
);

