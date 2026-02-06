/**
 * SettingsView - Main settings page orchestrator
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Notification banners extracted to SettingsBanners.tsx
 * Reauth modal extracted to ReauthModal.tsx
 */

import { useState, useRef } from 'react';
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
import { handleWipeData, handleDeleteAccount } from './components/SettingsDataActions';
import { Button } from '@anchor-os/ui';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { auditSettings } from '../../services/AuditService';

const SettingsView = () => {
  const {
    profile, updateProfile, user, logout,
    accountNotifications, sendVerificationEmail, generateMfaSecret, enrollMfa, unenrollMfa, reauthenticate
  } = useAuth();
  const { navigateTo } = useApp();
  const { connection: familyConnection, loading: familyLoading, disconnectFamily } = useFamilySharing(user?.uid);
  const { showToast, pushPermissionStatus, requestPushPermission } = useNotifications();

  const [isResending, setIsResending] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [mfaQrUrl, setMfaQrUrl] = useState('');
  const [mfaManualKey, setMfaManualKey] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const mfaCompletedRef = useRef(false); // MFA-001: Track completion to avoid stale closure
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
    mfaCompletedRef.current = false; // MFA-001: Reset ref at start
    setIsEnrolling(true); setShow2FASetup(true); setMfaQrUrl(''); setMfaManualKey(''); setMfaError('');
    const timeout = setTimeout(() => { if (!mfaCompletedRef.current) { setMfaError('Initialization taking too long.'); setIsEnrolling(false); } }, 10000);
    try { const result = await generateMfaSecret(); clearTimeout(timeout); mfaCompletedRef.current = true; setMfaQrUrl(result.qrCodeUrl); setMfaManualKey(result.manualKey); }
    catch (err) { clearTimeout(timeout); mfaCompletedRef.current = true; setMfaError((err as Error).message); }
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

  const onWipeData = () => handleWipeData(user!.uid, showToast);
  const onDeleteAccount = () => handleDeleteAccount(user, familyConnection, disconnectFamily, logout, showToast);

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
        <div id="settings-family"><FamilySettingsV2 onNavigateToFinance={() => navigateTo('finance')} connection={familyConnection} connectionLoading={familyLoading} /></div>
        <div id="settings-support"><SupportSettings onOpenContact={() => { setInitialSubject('feedback'); setShowContactModal(true); }} /></div>
        {import.meta.env.VITE_APP_ENV !== 'production' && <DeveloperTools userUid={user?.uid || ''} />}
        <div id="settings-data"><DataManagement userUid={user?.uid || ''} profile={profile} onWipeData={onWipeData} /></div>
        <div id="settings-danger"><DangerZone onDeleteAccount={onDeleteAccount} /></div>

        <div className="mt-8 flex justify-center gap-6 pb-8">
          <Button variant="ghost" size="sm" onClick={() => logout()} className="min-h-11 text-rose-500 dark:text-rose-400 font-bold">Sign Out</Button>
        </div>

        {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} currentPage="settings" initialSubject={initialSubject} />}
        <ReauthModal show={showReauthModal} password={reauthPassword} isLoading={isReauthenticating}
          onPasswordChange={setReauthPassword} onConfirm={handleReauthenticate} onClose={() => setShowReauthModal(false)} />
      </div>
    </FeatureErrorBoundary>
  );
};

export default SettingsView;
