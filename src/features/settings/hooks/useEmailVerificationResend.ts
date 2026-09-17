import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

/** Cooldown between verification-email resends (matches Firebase anti-abuse expectations). */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * RA-11 (#167): shared email-verification status/resend logic.
 *
 * `sendVerificationEmail` already existed on AuthContext but had no in-app
 * consumer after onboarding, so a user whose verification mail never arrived
 * (or who skipped onboarding step 5) had no way to request another one.
 */
export function useEmailVerificationResend() {
    const { user, sendVerificationEmail } = useAuth();
    // A manual `refresh()` can supersede the auth-context value; scope the
    // override to the email it was read for so an account switch cannot leak it.
    const [override, setOverride] = useState<{ email: string | null; verified: boolean } | null>(null);
    const email = user?.email ?? null;
    const verified = override && override.email === email ? override.verified : (user?.emailVerified ?? false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = window.setInterval(() => {
            setCooldown((current) => (current <= 1 ? 0 : current - 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [cooldown]);

    const resend = useCallback(async (): Promise<boolean> => {
        if (resending || cooldown > 0 || verified) return false;
        setResending(true);
        try {
            await sendVerificationEmail();
            setCooldown(RESEND_COOLDOWN_SECONDS);
            return true;
        } catch {
            return false;
        } finally {
            setResending(false);
        }
    }, [cooldown, resending, sendVerificationEmail, verified]);

    /** Re-read the Firebase user so a freshly-clicked link is reflected without a full page reload. */
    const refresh = useCallback(async (): Promise<boolean> => {
        if (!user?.reload) return false;
        await user.reload();
        const isVerified = user.emailVerified;
        setOverride({ email: user.email ?? null, verified: isVerified });
        return isVerified;
    }, [user]);

    return {
        email,
        verified,
        resending,
        cooldown,
        canResend: !verified && !resending && cooldown === 0,
        resend,
        refresh,
    };
}