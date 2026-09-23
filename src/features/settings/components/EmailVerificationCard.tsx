/**
 * EmailVerificationCard - Email verification status + resend (RA-11, #167)
 *
 * Settings entry point so a user can see whether their email is verified and
 * request another verification email after onboarding.
 */



import { MailCheck, MailWarning, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@anchor-os/ui';
import { useNotifications } from '../../../context/NotificationContext';
import { useEmailVerificationResend } from '../hooks/useEmailVerificationResend';

export function EmailVerificationCard() {
    const { showToast } = useNotifications();
    const { email, verified, resending, cooldown, canResend, resend, refresh } = useEmailVerificationResend();

    const handleResend = async () => {
        const sent = await resend();
        showToast(
            sent ? 'Verification email sent!' : 'Could not send the verification email. Try again shortly.',
            sent ? 'success' : 'error',
        );
    };

    const handleRefresh = async () => {
        const isVerified = await refresh();
        showToast(
            isVerified ? 'Email verified.' : 'Still not verified — open the link in your inbox first.',
            isVerified ? 'success' : 'info',
        );
    };

    return (
        <Card className={`overflow-hidden mt-6 ${verified ? '' : 'border-amber-200 dark:border-amber-800'}`}>
            <CardHeader className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-slate-500/10 rounded-lg">
                        {verified
                            ? <MailCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            : <MailWarning className="w-5 h-5 text-amber-600 dark:text-amber-500" />}
                    </div>
                    Email Verification
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:justify-between">
                    <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs" data-testid="email-verification-status">
                            {verified ? 'Verified' : 'Not verified'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 break-all">
                            {email ?? 'No email on this account'}
                        </p>
                        {!verified && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Verify your email to secure your account and unlock family invitations.
                            </p>
                        )}
                    </div>
                    {!verified && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button
                                onClick={handleResend}
                                isLoading={resending}
                                disabled={!canResend}
                                className="gap-2 w-full sm:w-auto font-bold"
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleRefresh}
                                className="gap-2 w-full sm:w-auto"
                            >
                                <RefreshCw className="w-4 h-4" />I&apos;ve verified
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}