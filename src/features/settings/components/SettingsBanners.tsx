/**
 * SettingsView Notification Banners
 * Extracted from SettingsView.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface VerifyEmailBannerProps {
    isResending: boolean;
    onResend: () => void;
}

export const VerifyEmailBanner: React.FC<VerifyEmailBannerProps> = ({ isResending, onResend }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-3xl text-red-700 dark:text-red-400">
        <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
                <h4 className="font-black uppercase tracking-wider text-[10px]">Email Not Verified</h4>
                <p className="text-sm opacity-80 mt-1">Please verify your email to secure your identity and enable full access.</p>
            </div>
        </div>
        <Button
            variant="primary"
            onClick={onResend}
            isLoading={isResending}
            className="bg-red-500 hover:bg-red-600 shadow-red-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]"
        >
            Verify Now
        </Button>
    </div>
);

// EnableMfaBanner removed — onboarding flow now handles MFA recommendation via
// the "Secure Your Account" step + Beyond the Basics CompletionRing.
