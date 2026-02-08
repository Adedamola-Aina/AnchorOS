/**
 * PasswordChange - Inline password change form
 * Reauthenticates with current password then updates via Firebase Auth.
 */

import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { captureError } from '../../../utils/error';
import { auth } from '../../../config/firebase';
import { auditAuth } from '../../../services/AuditService';

export const PasswordChange: React.FC = () => {
  const { reauthenticate } = useAuth();
  const { showToast } = useNotifications();
  const [open, setOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => { setCurrentPw(''); setNewPw(''); setConfirmPw(''); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPw.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setError('New passwords do not match.'); return; }
    if (newPw === currentPw) { setError('New password must differ from current password.'); return; }

    setIsSubmitting(true);
    try {
      await reauthenticate(currentPw);
      const { updatePassword } = await import('firebase/auth');
      if (!auth.currentUser) throw new Error('No authenticated user');
      await updatePassword(auth.currentUser, newPw);
      auditAuth.passwordChanged();
      showToast('Password updated successfully.', 'success');
      reset();
      setOpen(false);
    } catch (err) {
      captureError(err, 'Settings.changePassword');
      const msg = (err as Error).message;
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Current password is incorrect.');
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Password</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Change your account password.</p>
        </div>
        <Button variant="secondary" onClick={() => setOpen(true)} className="gap-2 w-full sm:w-auto">
          <KeyRound className="w-4 h-4" />Change Password
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
      <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
        <KeyRound className="w-4 h-4" />Change Password
      </p>
      {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}
      <input type="password" autoComplete="current-password" placeholder="Current password" value={currentPw}
        onChange={(e) => setCurrentPw(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      <input type="password" autoComplete="new-password" placeholder="New password (min 8 chars)" value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      <input type="password" autoComplete="new-password" placeholder="Confirm new password" value={confirmPw}
        onChange={(e) => setConfirmPw(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting} disabled={!currentPw || !newPw || !confirmPw} className="font-bold">Update Password</Button>
        <Button type="button" variant="ghost" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
      </div>
    </form>
  );
};
