/**
 * SettingsView - Main settings page orchestrator
 * 
 * JUSTIFICATION (CLAUDE.md §3.2): This view exceeds 200 lines because it already
 * delegates most UI to 10+ extracted components (ProfileSettings, SecuritySettings,
 * FamilySettingsV2, etc.). The remaining code coordinates MFA state, notifications,
 * and modal display logic that's inherently coupled to this orchestrator role.
 */

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useApp } from '../../context/AnchorContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import ContactModal from '../../components/ContactModal';

import { ProfileSettings } from './components/ProfileSettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { NotificationSettings } from './components/NotificationSettings';
import { FamilySettingsV2 } from './components/FamilySettingsV2';
import { SupportSettings } from './components/SupportSettings';
import { DeveloperTools } from './components/DeveloperTools';
import { DataManagement } from './components/DataManagement';
import { DangerZone } from './components/DangerZone';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
// DiagnosticPanel removed from production - use only in development

const SettingsView = () => {
  const {
    profile, updateProfile, user, logout,
    accountNotifications, sendVerificationEmail, generateMfaSecret, enrollMfa, unenrollMfa, reauthenticate
  } = useAuth();
  const { navigateTo } = useApp();
  const { connection: familyConnection, disconnectFamily } = useFamilySharing(user?.uid);
  const { showToast } = useNotifications();

  const [isResending, setIsResending] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [mfaQrUrl, setMfaQrUrl] = useState('');
  const [mfaManualKey, setMfaManualKey] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [initialSubject, setInitialSubject] = useState<'question' | 'feedback' | undefined>(undefined);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  const handleGenerateMfaSecret = async () => {
    setIsEnrolling(true);
    setShow2FASetup(true);
    setMfaQrUrl('');
    setMfaManualKey('');
    setMfaError('');

    const timeout = setTimeout(() => {
      if (isEnrolling && !mfaQrUrl) {
        setMfaError('Initialization is taking longer than expected. Please check your internet connection or try again.');
        setIsEnrolling(false);
      }
    }, 10000);

    try {
      const result = await generateMfaSecret();
      clearTimeout(timeout);
      setMfaQrUrl(result.qrCodeUrl);
      setMfaManualKey(result.manualKey);
    } catch (err) {
      clearTimeout(timeout);
      setMfaError((err as Error).message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleEnrollMfa = async (code: string) => {
    setIsEnrolling(true);
    setMfaError('');
    try {
      await enrollMfa(code);
      setShow2FASetup(false);
      setMfaCode('');
      showToast('2FA enabled successfully!', 'success');
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('requires-recent-login') || (err as any).code === 'auth/requires-recent-login') {
        setShowReauthModal(true);
      } else {
        setMfaError(msg.includes('invalid-verification-code')
          ? 'Invalid code. Please ensure your device Date & Time settings are set to "Automatic".'
          : msg);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleWipeData = async () => {
    try {
      const { getDocs, collection, writeBatch, doc } = await import('firebase/firestore');
      const { db, APP_ID } = await import('../../config/firebase');

      const batch = writeBatch(db);
      let opCount = 0;

      const collections = ['accounts', 'finance', 'commitments', 'notifications'];
      for (const colName of collections) {
        const snap = await getDocs(collection(db, 'artifacts', APP_ID, 'users', user!.uid, colName));
        snap.docs.forEach(d => {
          batch.delete(doc(db, 'artifacts', APP_ID, 'users', user!.uid, colName, d.id));
          opCount++;
        });
      }

      if (opCount > 0) {
        await batch.commit();
        showToast(`Wiped ${opCount} records.`, 'success');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast('Nothing to wipe.', 'info');
      }
    } catch (e) {
      showToast('Wipe failed: ' + (e as Error).message, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (familyConnection) await disconnectFamily('leave');
      showToast('Account scheduled for deletion. Signing out...', 'info');
      setTimeout(() => logout(), 2000);
    } catch (e) {
      showToast('Error: ' + (e as Error).message, 'error');
    }
  };

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    try {
      await reauthenticate(reauthPassword);
      setShowReauthModal(false);
      setReauthPassword('');
      showToast('Identity verified. Please try enabling 2FA again.', 'success');
    } catch (error) {
      showToast('Authentication failed: ' + (error as Error).message, 'error');
    } finally {
      setIsReauthenticating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">System Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your preferences and environment.</p>
      </div>

      {accountNotifications.length > 0 && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          {accountNotifications.includes('verify_email') && (
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
                onClick={async () => {
                  setIsResending(true);
                  await sendVerificationEmail();
                  showToast('Verification email sent!', 'success');
                  setIsResending(false);
                }}
                isLoading={isResending}
                className="bg-red-500 hover:bg-red-600 shadow-red-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Verify Now
              </Button>
            </div>
          )}
          {accountNotifications.includes('enable_2fa') && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl text-blue-700 dark:text-blue-400">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-wider text-[10px]">MFA Recommended</h4>
                  <p className="text-sm opacity-80 mt-1">Protect your account with two-factor authentication.</p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleGenerateMfaSecret}
                className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 px-8 h-11 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Enable 2FA
              </Button>
            </div>
          )}
        </div>
      )}

      <ProfileSettings
        name={profile.name}
        uid={user?.uid || ''}
        onUpdateName={(name) => updateProfile({ name })}
      />

      <AppearanceSettings
        theme={profile.theme}
        onToggleTheme={() => updateProfile({ theme: profile.theme === 'dark' ? 'light' : 'dark' })}
      />

      <SecuritySettings
        mfaEnabled={profile.mfaEnabled || false}
        isEnrolling={isEnrolling}
        show2FASetup={show2FASetup}
        mfaQrUrl={mfaQrUrl}
        mfaManualKey={mfaManualKey}
        mfaCode={mfaCode}
        mfaError={mfaError}
        onSetShow2FASetup={setShow2FASetup}
        onSetMfaCode={setMfaCode}
        onGenerateMfaSecret={handleGenerateMfaSecret}
        onEnrollMfa={handleEnrollMfa}
        onUnenrollMfa={unenrollMfa}
      />

      <NotificationSettings
        emailEnabled={profile.notificationPreferences?.enabled || false}
        email={profile.notificationPreferences?.email || ''}
        frequency={profile.notificationPreferences?.frequency || 'instant'}
        userEmail={user?.email || ''}
        emailVerified={user?.emailVerified || false}
        onUpdatePreferences={(prefs) => updateProfile({
          notificationPreferences: { ...(profile.notificationPreferences || {}), ...prefs }
        })}
      />

      <FamilySettingsV2 onNavigateToFinance={() => navigateTo('finance')} />

      <SupportSettings
        onOpenContact={() => {
          setInitialSubject('feedback');
          setShowContactModal(true);
        }}
      />

      {import.meta.env.VITE_APP_ENV !== 'production' && <DeveloperTools userUid={user?.uid || ''} />}

      <DataManagement
        userUid={user?.uid || ''}
        profile={profile}
        onWipeData={handleWipeData}
      />

      <DangerZone onDeleteAccount={handleDeleteAccount} />

      <div className="mt-8 flex justify-center gap-6 pb-8">
        <Button variant="ghost" size="sm" onClick={() => logout()} className="text-rose-500 dark:text-rose-400 font-bold">
          Sign Out
        </Button>
      </div>

      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          currentPage="settings"
          initialSubject={initialSubject}
        />
      )}

      {showReauthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verify Identity</h3>
              <p className="text-slate-500 text-sm mt-1">Please enter your password to confirm this security change.</p>
            </div>
            <input
              type="password"
              placeholder="Your Password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReauthenticate()}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowReauthModal(false)}
                className="flex-1 h-12 font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReauthenticate}
                isLoading={isReauthenticating}
                disabled={!reauthPassword}
                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
