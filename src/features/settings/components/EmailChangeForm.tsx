// @ts-nocheck
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { captureError } from '../../../utils/error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailChangeForm: React.FC = () => {
  const { user, reauthenticate } = useAuth();
  const { showToast } = useNotifications();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newEmail || !EMAIL_RE.test(newEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (newEmail === user?.email) {
      setError('New email must be different from current.');
      return;
    }
    if (!password) {
      setError('Password is required to change email.');
      return;
    }
    try {
      setSubmitting(true);
      await reauthenticate(password);
    } catch {
      setError('Password is incorrect. Please try again.');
      setSubmitting(false);
      return;
    }
    try {
      await verifyBeforeUpdateEmail(user, newEmail);
      setSent(true);
      showToast('A verification link has been sent to your new email.', 'info');
    } catch (err) {
      captureError(err, 'EmailChangeForm.update');
      setError('Could not update email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Verification sent</p>
        </div>
        <p className="text-xs text-slate-500">Check your inbox at <strong>{newEmail}</strong> and click the link to confirm.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Mail className="w-4 h-4 text-slate-400" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</p>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300">{user?.email}</p>
      <div>
        <label htmlFor="new-email" className="text-xs font-medium text-slate-500 block mb-1">New email</label>
        <input
          id="new-email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]"
          placeholder="new@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="email-change-password" className="text-xs font-medium text-slate-500 block mb-1">Password</label>
        <input
          id="email-change-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]"
          placeholder="Current password"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-xs text-rose-500 font-medium" role="alert">{error}</p>}
      <Button type="submit" isLoading={submitting} className="w-full sm:w-auto gap-2 min-h-[44px]">
        Update email
      </Button>
    </form>
  );
};
