/**
 * SettingsView — the Settings hub and its section screens.
 *
 * IA (UX-ST-01, UX-ST-02, UX-ST-06): `/settings` is a grouped, searchable index
 * and every section is its own route (`/settings/<id>`) with a title, a
 * description and a back affordance. The old chip bar — nine anchors that
 * scrolled ten sections in one continuous scroll — is deleted, so nothing
 * scrolls horizontally and no "go to Settings" journey loses its target.
 *
 * The section list lives in `./sections` (single source of truth, reused by the
 * hub, this router branch and any deep-linking call site).
 */


import { useState, lazy, Suspense } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { captureError } from '../../utils/error';
import { useNotifications } from '../../context/NotificationContext';
import { useApp } from '../../context/AnchorContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useFeatureFlag } from '../flags/useFeatureFlag';
import { useMfaEnrollmentUI } from './hooks/useMfaEnrollmentUI';
import ContactModal from '../../components/ContactModal';

import { ProfileSettings } from './components/ProfileSettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { NotificationSettings } from './components/NotificationSettings';
import { AnchorAISettings } from './components/AnchorAISettings';
import { FamilySettingsV2 } from './components/FamilySettingsV2';
import { SupportSettings } from './components/SupportSettings';
import { TechnicalDetails } from './components/TechnicalDetails';
// UX-GL-07: the condition is read *inline*, because Vite replaces
// `import.meta.env.DEV` with `false` in this file during a production build, so
// the whole expression — dynamic import included — folds away and no chunk is
// emitted. A value imported from another module is not folded the same way.
const DeveloperTools = import.meta.env.DEV
  ? lazy(() => import('./components/DeveloperTools').then((module) => ({ default: module.DeveloperTools })))
  : null;
import { DataManagement } from './components/DataManagement';
import { DangerZone } from './components/DangerZone';
import { ReauthModal } from './components/ReauthModal';
import { RecoveryCodesDisplay } from './components/RecoveryCodesDisplay';
import { SettingsHub } from './components/SettingsHub';
import { SettingsSectionShell } from './components/SettingsSectionShell';
import { describeChangeAge, useRecentSettingsChanges } from './recentChanges';
import { isDeveloperToolsEnabled } from '../../utils/devSurface';
import { handleWipeData, handleDeleteAccount } from './components/SettingsDataActions';
import { SETTINGS_ROOT, getSettingsSection } from './sections';
import { Button } from '@anchor-os/ui';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { auditSettings } from '../../services/AuditService';
import { getDisplayVersion } from '../../version';

const SettingsView = () => {
  const { section: sectionParam } = useParams();
  const {
    profile, updateProfile, user, logout,
    generateMfaSecret, enrollMfa, unenrollMfa, reauthenticate
  } = useAuth();
  const { navigateTo } = useApp();
  const { connection: familyConnection, loading: familyLoading, disconnectFamily } = useFamilySharing(user?.uid);
  const isAnchorAIFlagEnabled = useFeatureFlag('anchor_ai_enabled', user?.uid);
  const { showToast, pushPermissionStatus, requestPushPermission } = useNotifications();

  // UX-ST-04: "Recently changed" — derived centrally from profile writes.
  const recentChanges = useRecentSettingsChanges(profile);
  // A single snapshot taken on mount, so rendering stays pure.
  const [nowSnapshot] = useState(() => Date.now());

  const [showContactModal, setShowContactModal] = useState(false);
  const [initialSubject, setInitialSubject] = useState<'question' | 'feedback' | undefined>(undefined);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [pendingMfaUnenroll, setPendingMfaUnenroll] = useState(false);

  const mfa = useMfaEnrollmentUI({
    generateMfaSecret,
    enrollMfa,
    showToast,
    onRequiresReauth: () => setShowReauthModal(true),
    userId: user?.uid,
  });

  const onWipeData = () => handleWipeData(user!.uid, showToast);
  const onDeleteAccount = () => handleDeleteAccount(user, familyConnection, disconnectFamily, logout, showToast);
  const onOpenContact = () => { setInitialSubject('feedback'); setShowContactModal(true); };

  const handleReauthenticate = async () => {
    setIsReauthenticating(true);
    try {
      await reauthenticate(reauthPassword);
      setShowReauthModal(false);
      setReauthPassword('');

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


  const section = getSettingsSection(sectionParam);

  // An unknown (or feature-gated) section must not render a half-empty page.
  if (sectionParam && (!section || (section.id === 'assistant' && !isAnchorAIFlagEnabled))) {
    return <Navigate to={SETTINGS_ROOT} replace />;
  }

  const sectionContent = () => {
    switch (section?.id) {
      case 'profile':
        return (
          <ProfileSettings
            name={profile.name}
            uid={user?.uid || ''}
            onUpdateName={(name) => { updateProfile({ name }); auditSettings.profileUpdated(['name']); }}
          />
        );
      case 'security':
        return (
          <>
            <SecuritySettings
              mfaEnabled={profile.mfaEnabled || false}
              isEnrolling={mfa.isEnrolling}
              show2FASetup={mfa.show2FASetup}
              mfaQrUrl={mfa.mfaQrUrl}
              mfaManualKey={mfa.mfaManualKey}
              mfaCode={mfa.mfaCode}
              mfaError={mfa.mfaError}
              onSetShow2FASetup={mfa.setShow2FASetup}
              onSetMfaCode={mfa.setMfaCode}
              onGenerateMfaSecret={mfa.handleGenerateSecret}
              onEnrollMfa={mfa.handleEnroll}
              onUnenrollMfa={unenrollMfa}
              onRequiresReauthForUnenroll={() => { setPendingMfaUnenroll(true); setShowReauthModal(true); }}
            />
            {mfa.recoveryCodes && <RecoveryCodesDisplay codes={mfa.recoveryCodes} onDone={mfa.clearRecoveryCodes} />}
          </>
        );
      case 'notifications':
        return (
          <NotificationSettings
            emailEnabled={profile.notificationPreferences?.enabled || false}
            email={profile.notificationPreferences?.email || ''}
            frequency={profile.notificationPreferences?.frequency || 'instant'}
            userEmail={user?.email || ''}
            emailVerified={user?.emailVerified || false}
            categories={profile.notificationPreferences?.categories}
            onUpdatePreferences={(prefs) => updateProfile({ notificationPreferences: { ...(profile.notificationPreferences || { email: '', frequency: 'instant' as const, enabled: false }), ...prefs } })}
            pushPermissionStatus={pushPermissionStatus}
            requestPushPermission={() => requestPushPermission()}
          />
        );
      case 'preferences':
        return (
          <AppearanceSettings
            theme={profile.theme as 'light' | 'dark'}
            onSetTheme={(theme) => { updateProfile({ theme }); auditSettings.themeChanged(theme); }}
            accessibility={profile.accessibility}
            onUpdateAccessibility={(prefs) => updateProfile({ accessibility: { ...(profile.accessibility || { fontSize: 'default', highContrast: false, reducedMotion: false }), ...prefs } })}
          />
        );

      case 'assistant':
        return (
          <>
            {/* UX-ST-05: the assistant section is the ONLY place its behaviour and
                data sources are configured, and it mirrors the assistant surface's
                own transparency link (UX-AI-05). */}
            <AnchorAISettings userId={user?.uid} showToast={showToast} />
            {/*
              * CM-30: one entry point is named "What Anchor AI knows" (the disclosure
              * inside AnchorAISettings). This route to the assistant's own transparency
              * page is labelled for what it is, so the same question is not asked twice
              * with two different behaviours.
              */}
            <Link
              to="/fabric/transparency"
              data-testid="assistant-transparency-link"
              className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              See the full transparency page
            </Link>
          </>
        );
      case 'family':
        return (
          <FamilySettingsV2
            onNavigateToFinance={() => navigateTo('finance')}
            connection={familyConnection}
            connectionLoading={familyLoading}
          />
        );
      case 'data':
        return (
          <>
            <DataManagement userUid={user?.uid || ''} profile={profile} onWipeData={onWipeData} />
            <DangerZone onDeleteAccount={onDeleteAccount} />
          </>
        );
      case 'about':
        return (
          <>
            <SupportSettings onOpenContact={onOpenContact} />
            <TechnicalDetails uid={user?.uid || ''} onCopied={() => showToast('Account identifier copied.', 'success')} />
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider" data-testid="settings-version">
              {getDisplayVersion()}
            </p>
            {/* Local development only; never rendered in staging or production. */}
            {/*
              UX-GL-07: two layers, deliberately. The import above is folded away
              in a production build (so the section's code does not ship), and this
              runtime check keeps staging — which is deployed, but must not be
              instrumented — from showing it either.
            */}
            {isDeveloperToolsEnabled() && DeveloperTools && (
              <Suspense fallback={null}>
                <DeveloperTools userUid={user?.uid || ''} />
              </Suspense>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <FeatureErrorBoundary featureName="Settings">
      <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
        {section ? (
          <SettingsSectionShell section={section}>{sectionContent()}</SettingsSectionShell>
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-2">
              <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">Settings</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences.</p>
            </div>

            <SettingsHub hideAssistant={!isAnchorAIFlagEnabled} />

            {/*
              UX-ST-04: the last part of the finding — a change you just made is
              visible, so it is confirmed rather than assumed. Session-scoped, and
              it says so.
            */}
            {recentChanges.length > 0 && (
              <section className="mt-6" data-testid="recently-changed" aria-labelledby="recently-changed-heading">
                <h2 id="recently-changed-heading" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Recently changed
                </h2>
                <ul className="mt-2 space-y-1">
                  {recentChanges.map((change) => (
                    <li key={change.id} className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span>{change.label}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{describeChangeAge(change.at, nowSnapshot)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">While the app has been open.</p>
              </section>
            )}

            <div className="mt-8 flex flex-col items-center gap-4 pb-8">
              <Button variant="ghost" size="sm" onClick={() => logout()} className="min-h-11 text-danger font-bold">Sign Out</Button>
            </div>
          </>
        )}

        {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} currentPage="settings" initialSubject={initialSubject} />}
        <ReauthModal
          show={showReauthModal}
          password={reauthPassword}
          isLoading={isReauthenticating}
          onPasswordChange={setReauthPassword}
          onConfirm={handleReauthenticate}
          onClose={() => setShowReauthModal(false)}
        />
      </div>
    </FeatureErrorBoundary>
  );
};

export default SettingsView;

