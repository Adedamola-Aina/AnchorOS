/**
 * EmailVerificationWarning - Shown when email not verified
 * 
 * Displays a warning that email verification is required before inviting.
 */
// @ts-nocheck


import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@anchor-os/ui';

export function EmailVerificationWarning() {
    return (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
            <CardContent className="p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-400">Email Verification Required</p>
                        <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                            Please verify your email address before inviting family members. Check your inbox for a verification link.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
