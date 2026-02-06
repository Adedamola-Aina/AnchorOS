/**
 * SettingsView - Main settings page orchestrator
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Notification banners extracted to SettingsBanners.tsx
 * Reauth modal extracted to ReauthModal.tsx
 */

import { useState } from 'react';
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
import { VerifyEmailBanner, EnableMfaBanner } from './components/SettingsBanners';
import { ReauthModal } from './components/ReauthModal';
import { SectionNav } from './components/SectionNav';
import { Button } from '@anchor-os/ui';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { auditSettings } from '../../services/AuditService';

const SettingsView = () => {
  const {
    profile, updateProfile, user, logout,
    accountNotifications, sendVerificationEmail, generateMfaSecret, enrollMfa, unenrollMfa, reauthenticate
  } = useAuth();
  const { navigateTo } = useApp();
  const { connection: familyConnection, disconnectFamily } = useFamilySharing(user?.uid);
  const { showToast, pushPermissionStatus, requestPushPermission } = useNotifications();

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

  const handleResendVerification = async () => {
    setIsResending(true);
    await sendVerificationEmail();
    showToast('Verification email sent!', 'success');
    setIsResending(false);
  };

  const handleGenerateMfaSecret = async () => {
    setIsEnrolling(true); setShow2FASetup(true); setMfaQrUrl(''); setMfaManualKey(''); setMfaError('');
    const timeout = setTimeout(() => { if (isEnrolling && !mfaQrUrl) { setMfaError('Initialization taking too long.'); setIsEnrolling(false); } }, 10000);
    try { const result = await generateMfaSecret(); clearTimeout(timeout); setMfaQrUrl(result.qrCodeUrl); setMfaManualKey(result.manualKey); }
    catch (err) { clearTimeout(timeout); setMfaError((err as Error).message); }
    finally { setIsEnrolling(false); }
  };

  const handleEnrollMfa = async (code: string) => {
    setIsEnrolling(true); setMfaError('');
    try { await enrollMfa(code); setShow2FASetup(false); setMfaCode(''); showToast('2FA enabled successfully!', 'success'); }
    catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('requires-recent-login') || (err as any).code === 'auth/requires-recent-login') { setShowReauthModal(true); }
      else { setMfaError(msg.includes('invalid-verification-code') ? 'Invalid code. Check device Date & Time settings.' : msg); }
    }
    finally { setIsEnrolling(false); }
  };

  const handleWipeData = async () => {
    try {
      const { getDocs, collection, writeBatch, doc } = await import('firebase/firestore');
      const { db, APP_ID } = await import('../../config/firebase');
      const batch = writeBatch(db); let opCount = 0;
      for (const colName of ['accounts', 'finance', 'commitments', 'notifications']) {
        const snap = await getDocs(collection(db, 'artifacts', APP_ID, 'users', user!.uid, colName));
        snap.docs.forEach(d => { batch.delete(doc(db, 'artifacts', APP_ID, 'users', user!.uid, colName, d.id)); opCount++; });
      }
      if (opCount > 0) { await batch.commit(); showToast(`Wiped ${opCount} records.`, 'success'); setTimeout(() => window.location.reload(), 1000); }
      else { showToast('Nothing to wipe.', 'info'); }
    } catch (e) { showToast('Wipe failed: ' + (e as Error).message, 'error'); }
  };

  const handleDeleteAccount = async () => {
    // BUG-038 Fix: Actually delete user data and Firebase Auth account
    try {
      // Step 1: Disconnect from family if connected
      if (familyConnection) await disconnectFamily('leave');

      // Step 2: Delete all Firestore data (same as handleDevWipe)
      const { getDocs, collection, writeBatch, doc } = await import('firebase/firestore');
      const { db, APP_ID } = await import('../../config/firebase');
      const uid = user?.uid;
      if (!uid) throw new Error('No user ID');

      const batch = writeBatch(db);
      for (const colName of ['accounts', 'finance', 'commitments', 'notifications']) {
        const snap = await getDocs(collection(db, 'artifacts', APP_ID, 'users', uid, colName));
        snap.docs.forEach(d => { batch.delete(doc(db, 'artifacts', APP_ID, 'users', uid, colName, d.id)); });
      }
      // Also delete user profile document
      batch.delete(doc(db, 'artifacts', APP_ID, 'users', uid));
      await batch.commit();

      // Step 3: Delete Firebase Auth account
      const { deleteUser } = await import('firebase/auth');
      const currentUser = user;
      if (currentUser) {
        try {
          await deleteUser(currentUser);
          showToast('Account deleted successfully.', 'success');
        } catch (authErr: any) {
          // If requires recent login, just log out and let user know
          if (authErr.code === 'auth/requires-recent-login') {
            showToast('Account data deleted. Sign in again to complete deletion.', 'info');
          } else {
            throw authErr;
          }
        }
      }

      // Logout and redirect (may already be logged out from deleteUser)
      setTimeout(() => logout(), 500);
    } catch (e) {
      showToast('Error: ' + (e as Error).message, 'error');
    }
  };

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    try { await reauthenticate(reauthPassword); setShowReauthModal(false); setReauthPassword(''); showToast('Identity verified. Try enabling 2FA again.', 'success'); }
    catch (error) { showToast('Authentication failed: ' + (error as Error).message, 'error'); }
    finally { setIsReauthenticating(false); }
  };

  return (
    <FeatureErrorBoundary featureName="Settings">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your preferences and environment.</p>
        </div>

        <SectionNav />

        {accountNotifications.length > 0 && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            {accountNotifications.includes('verify_email') && <VerifyEmailBanner isResending={isResending} onResend={handleResendVerification} />}
            {accountNotifications.includes('enable_2fa') && <EnableMfaBanner onEnable={handleGenerateMfaSecret} />}
          </div>
        )}

        <div id="settings-profile"><ProfileSettings name={profile.name} uid={user?.uid || ''} onUpdateName={(name) => { updateProfile({ name }); auditSettings.profileUpdated(['name']); }} /></div>
        <div id="settings-appearance"><AppearanceSettings theme={profile.theme as 'light' | 'dark'} onSetTheme={(theme) => { updateProfile({ theme }); auditSettings.themeChanged(theme); }} /></div>
        <div id="settings-security"><SecuritySettings mfaEnabled={profile.mfaEnabled || false} isEnrolling={isEnrolling} show2FASetup={show2FASetup} mfaQrUrl={mfaQrUrl} mfaManualKey={mfaManualKey}
          mfaCode={mfaCode} mfaError={mfaError} onSetShow2FASetup={setShow2FASetup} onSetMfaCode={setMfaCode} onGenerateMfaSecret={handleGenerateMfaSecret}
          onEnrollMfa={handleEnrollMfa} onUnenrollMfa={unenrollMfa} /></div>
        <div id="settings-notifications"><NotificationSettings emailEnabled={profile.notificationPreferences?.enabled || false} email={profile.notificationPreferences?.email || ''}
          frequency={profile.notificationPreferences?.frequency || 'instant'} userEmail={user?.email || ''} emailVerified={user?.emailVerified || false}
          onUpdatePreferences={(prefs) => updateProfile({ notificationPreferences: { ...(profile.notificationPreferences || {}), ...prefs } })}
          pushPermissionStatus={pushPermissionStatus} requestPushPermission={() => requestPushPermission()} /></div>
        <div id="settings-family"><FamilySettingsV2 onNavigateToFinance={() => navigateTo('finance')} /></div>
        <div id="settings-support"><SupportSettings onOpenContact={() => { setInitialSubject('feedback'); setShowContactModal(true); }} /></div>
        {import.meta.env.VITE_APP_ENV !== 'production' && <DeveloperTools userUid={user?.uid || ''} />}
        <div id="settings-data"><DataManagement userUid={user?.uid || ''} profile={profile} onWipeData={handleWipeData} /></div>
        <div id="settings-danger"><DangerZone onDeleteAccount={handleDeleteAccount} /></div>

        <div className="mt-8 flex justify-center gap-6 pb-8">
          <Button variant="ghost" size="sm" onClick={() => logout()} className="text-rose-500 dark:text-rose-400 font-bold">Sign Out</Button>
        </div>

        {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} currentPage="settings" initialSubject={initialSubject} />}
        <ReauthModal show={showReauthModal} password={reauthPassword} isLoading={isReauthenticating}
          onPasswordChange={setReauthPassword} onConfirm={handleReauthenticate} onClose={() => setShowReauthModal(false)} />
      </div>
    </FeatureErrorBoundary>
  );
};

export default SettingsView;
