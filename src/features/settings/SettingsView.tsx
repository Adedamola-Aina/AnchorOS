/**
 * SettingsView - Main settings page orchestrator
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Notification banners extracted to SettingsBanners.tsx
 * Reauth modal extracted to ReauthModal.tsx
 */
// @ts-nocheck


import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { captureError } from '../../utils/error';
import { useNotifications } from '../../context/NotificationContext';
import { useApp } from '../../context/AnchorContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useMfaEnrollmentUI } from './hooks/useMfaEnrollmentUI';
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
// Notification banners removed — onboarding flow now handles email verify + MFA
import { ReauthModal } from './components/ReauthModal';
import { RecoveryCodesDisplay } from './components/RecoveryCodesDisplay';
import { SectionNav } from './components/SectionNav';
import { handleWipeData, handleDeleteAccount } from './components/SettingsDataActions';
import { Button } from '@anchor-os/ui';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { auditSettings } from '../../services/AuditService';
import pkg from '../../../package.json';

const SettingsView = () => {
  const {
    profile, updateProfile, user, logout,
    generateMfaSecret, enrollMfa, unenrollMfa, reauthenticate
  } = useAuth();
  const { navigateTo } = useApp();
  const { connection: familyConnection, loading: familyLoading, disconnectFamily } = useFamilySharing(user?.uid);
  const { showToast, pushPermissionStatus, requestPushPermission } = useNotifications();

  const [showContactModal, setShowContactModal] = useState(false);
  const [initialSubject, setInitialSubject] = useState<'question' | 'feedback' | undefined>(undefined);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [pendingMfaUnenroll, setPendingMfaUnenroll] = useState(false);

  // ARCH-001: MFA enrollment UI state encapsulated in dedicated hook
  const mfa = useMfaEnrollmentUI({
    generateMfaSecret,
    enrollMfa,
    showToast,
    onRequiresReauth: () => setShowReauthModal(true),
    userId: user?.uid,
  });

  const onWipeData = () => handleWipeData(user!.uid, showToast);
  const onDeleteAccount = () => handleDeleteAccount(user, familyConnection, disconnectFamily, logout, showToast);

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    try {
      await reauthenticate(reauthPassword);
      setShowReauthModal(false);
      setReauthPassword('');
      
      // If we were trying to disable MFA, retry now
      if (pendingMfaUnenroll) {
        setPendingMfaUnenroll(false);
        try {
          await unenrollMfa();
          showToast('2FA has been disabled.', 'info');
        } catch (err) {
          captureError(err, 'Settings.unenrollMfa.afterReauth');
          showToast('Error disabling 2FA: ' + (err as Error).message, 'error');
        }
      } else {
        showToast('Identity verified. Try enabling 2FA again.', 'success');
      }
    }
    catch (error) { captureError(error, 'Settings.reauthenticate'); showToast('Authentication failed: ' + (error as Error).message, 'error'); }
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

        <div id="settings-profile"><ProfileSettings name={profile.name} uid={user?.uid || ''} onUpdateName={(name) => { updateProfile({ name }); auditSettings.profileUpdated(['name']); }} /></div>
        <div id="settings-appearance"><AppearanceSettings theme={profile.theme as 'light' | 'dark'} onSetTheme={(theme) => { updateProfile({ theme }); auditSettings.themeChanged(theme); }}
          accessibility={profile.accessibility} onUpdateAccessibility={(prefs) => updateProfile({ accessibility: { ...(profile.accessibility || { fontSize: 'default', highContrast: false, reducedMotion: false }), ...prefs } })} /></div>
        <div id="settings-security"><SecuritySettings mfaEnabled={profile.mfaEnabled || false} isEnrolling={mfa.isEnrolling} show2FASetup={mfa.show2FASetup} mfaQrUrl={mfa.mfaQrUrl} mfaManualKey={mfa.mfaManualKey}
          mfaCode={mfa.mfaCode} mfaError={mfa.mfaError} onSetShow2FASetup={mfa.setShow2FASetup} onSetMfaCode={mfa.setMfaCode} onGenerateMfaSecret={mfa.handleGenerateSecret}
          onEnrollMfa={mfa.handleEnroll} onUnenrollMfa={unenrollMfa} onRequiresReauthForUnenroll={() => { setPendingMfaUnenroll(true); setShowReauthModal(true); }} /></div>
        {mfa.recoveryCodes && <RecoveryCodesDisplay codes={mfa.recoveryCodes} onDone={mfa.clearRecoveryCodes} />}
        <div id="settings-notifications"><NotificationSettings emailEnabled={profile.notificationPreferences?.enabled || false} email={profile.notificationPreferences?.email || ''}
          frequency={profile.notificationPreferences?.frequency || 'instant'} userEmail={user?.email || ''} emailVerified={user?.emailVerified || false}
          categories={profile.notificationPreferences?.categories}
          onUpdatePreferences={(prefs) => updateProfile({ notificationPreferences: { ...(profile.notificationPreferences || { email: '', frequency: 'instant' as const, enabled: false }), ...prefs } })}
          pushPermissionStatus={pushPermissionStatus} requestPushPermission={() => requestPushPermission()} /></div>
        <div id="settings-family"><FamilySettingsV2 onNavigateToFinance={() => navigateTo('finance')} connection={familyConnection} connectionLoading={familyLoading} /></div>
        <div id="settings-support"><SupportSettings onOpenContact={() => { setInitialSubject('feedback'); setShowContactModal(true); }} /></div>
        {import.meta.env.VITE_APP_ENV !== 'production' && <DeveloperTools userUid={user?.uid || ''} />}
        <div id="settings-data"><DataManagement userUid={user?.uid || ''} profile={profile} onWipeData={onWipeData} /></div>
        <div id="settings-danger"><DangerZone onDeleteAccount={onDeleteAccount} /></div>

        <div className="mt-8 flex flex-col items-center gap-4 pb-8">
          <Button variant="ghost" size="sm" onClick={() => logout()} className="min-h-11 text-rose-500 dark:text-rose-400 font-bold">Sign Out</Button>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider">
            Anchor OS v{(pkg as unknown as { version: string }).version}
          </p>
        </div>

        {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} currentPage="settings" initialSubject={initialSubject} />}
        <ReauthModal show={showReauthModal} password={reauthPassword} isLoading={isReauthenticating}
          onPasswordChange={setReauthPassword} onConfirm={handleReauthenticate} onClose={() => setShowReauthModal(false)} />
      </div>
    </FeatureErrorBoundary>
  );
};

export default SettingsView;
