/**
 * GettingStartedSecurity - Step 4: Email verification + MFA recommendation
 * This step replaces the red asterisks in settings by informing users at onboarding.
 */
// @ts-nocheck


import { useState } from 'react';
import { Shield, Mail, CheckCircle2 } from 'lucide-react';

interface GettingStartedSecurityProps {
  emailVerified: boolean;
  mfaEnabled: boolean;
  onVerifyEmail: () => Promise<void>;
  onEnableMfa: () => void;
  onFinish: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function GettingStartedSecurity({
  emailVerified,
  mfaEnabled,
  onVerifyEmail,
  onEnableMfa,
  onFinish,
  onSkip,
  onBack,
}: GettingStartedSecurityProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleVerifyEmail = async () => {
    setSending(true);
    try {
      await onVerifyEmail();
      setEmailSent(true);
    } finally {
      setSending(false);
    }
  };

  const allSecure = emailVerified && mfaEnabled;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">
            Secure Your Account
          </h2>
          <p className="text-slate-500 text-sm">
            Two quick steps to protect your data.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Email Verification */}
        <div className={`p-4 rounded-2xl border transition-all ${emailVerified ? 'bg-finance-50 dark:bg-finance-900/10 border-finance-200 dark:border-finance-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  Verify Email
                </p>
                <p className="text-xs text-slate-500">
                  {emailVerified ? 'Verified' : emailSent ? 'Check your inbox' : 'Confirm your identity'}
                </p>
              </div>
            </div>
            {emailVerified ? (
              <CheckCircle2 className="w-5 h-5 text-finance-500" data-testid="email-verified-icon" />
            ) : (
              <button
                onClick={handleVerifyEmail}
                disabled={sending || emailSent}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl transition-all min-h-11"
              >
                {sending ? 'Sending...' : emailSent ? 'Sent ✓' : 'Send Link'}
              </button>
            )}
          </div>
        </div>

        {/* MFA Recommendation */}
        <div className={`p-4 rounded-2xl border transition-all ${mfaEnabled ? 'bg-finance-50 dark:bg-finance-900/10 border-finance-200 dark:border-finance-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-slate-500">
                  {mfaEnabled ? 'Enabled' : 'Adds an extra layer of protection'}
                </p>
              </div>
            </div>
            {mfaEnabled ? (
              <CheckCircle2 className="w-5 h-5 text-finance-500" data-testid="mfa-enabled-icon" />
            ) : (
              <button
                onClick={onEnableMfa}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all min-h-11"
              >
                Enable
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Finish / Skip */}
      <button
        onClick={onFinish}
        className="w-full mt-4 bg-primary-600 hover:bg-primary-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
      >
        {allSecure ? 'All Set — Enter Anchor OS' : 'Continue to Anchor OS'}
      </button>

      <div className="text-center flex justify-center gap-4">
        <button
          onClick={onBack}
          className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSkip}
          className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          I'll do this later →
        </button>
      </div>
    </div>
  );
}
