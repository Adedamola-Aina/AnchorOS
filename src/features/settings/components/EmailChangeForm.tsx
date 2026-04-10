/**
 * EmailChangeForm - Inline email change form
 * Reauthenticates with current password then sends a verification link
 * to the new address via Firebase verifyBeforeUpdateEmail.
 */
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
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = () => { setNewEmail(''); setPassword(''); setError(''); };

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
    setSubmitting(true);
    try {
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
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-emerald-500" />
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Verification sent</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Check your inbox at <strong>{newEmail}</strong> and click the link to confirm.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Email Address</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={() => setOpen(true)} className="gap-2 w-full sm:w-auto">
          <Mail className="w-4 h-4" />Change Email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
      <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
        <Mail className="w-4 h-4" />Change Email
      </p>
      {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}
      <input
        type="email"
        autoComplete="email"
        placeholder="New email address"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Current password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <div className="flex gap-3">
        <Button type="submit" isLoading={submitting} disabled={!newEmail || !password} className="font-bold">Send Verification</Button>
        <Button type="button" variant="ghost" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
      </div>
    </form>
  );
};
