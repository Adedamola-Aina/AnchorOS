/**
 * EmailVerificationWarning - Shown when email not verified
 * 
 * Displays a warning that email verification is required before inviting.
 */



import { AlertCircle } from 'lucide-react';
import { Card, CardContent, Button } from '@anchor-os/ui';
import { useNotifications } from '../../../context/NotificationContext';
import { useEmailVerificationResend } from '../hooks/useEmailVerificationResend';

export function EmailVerificationWarning() {
    const { showToast } = useNotifications();
    const { resending, cooldown, canResend, resend } = useEmailVerificationResend();

    const handleResend = async () => {
        const sent = await resend();
        showToast(
            sent ? 'Verification email sent!' : 'Could not send the verification email. Try again shortly.',
            sent ? 'success' : 'error',
        );
    };

    return (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="font-semibold text-amber-900 dark:text-amber-400">Email Verification Required</p>
                        <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                            Please verify your email address before inviting family members. Check your inbox for a verification link.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleResend}
                            isLoading={resending}
                            disabled={!canResend}
                            className="mt-4 w-full sm:w-auto"
                        >
                            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
