/**
 * SettingsView - Main settings page orchestrator
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Notification banners extracted to SettingsBanners.tsx
 * Reauth modal extracted to ReauthModal.tsx
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
import { Button } from '@anchor-os/ui';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
const SettingsView = () => {
  if (stryMutAct_9fa48("5435")) {
    {}
  } else {
    stryCov_9fa48("5435");
    const {
      profile,
      updateProfile,
      user,
      logout,
      accountNotifications,
      sendVerificationEmail,
      generateMfaSecret,
      enrollMfa,
      unenrollMfa,
      reauthenticate
    } = useAuth();
    const {
      navigateTo
    } = useApp();
    const {
      connection: familyConnection,
      disconnectFamily
    } = useFamilySharing(stryMutAct_9fa48("5436") ? user.uid : (stryCov_9fa48("5436"), user?.uid));
    const {
      showToast,
      pushPermissionStatus,
      requestPushPermission
    } = useNotifications();
    const [isResending, setIsResending] = useState(stryMutAct_9fa48("5437") ? true : (stryCov_9fa48("5437"), false));
    const [show2FASetup, setShow2FASetup] = useState(stryMutAct_9fa48("5438") ? true : (stryCov_9fa48("5438"), false));
    const [mfaQrUrl, setMfaQrUrl] = useState(stryMutAct_9fa48("5439") ? "Stryker was here!" : (stryCov_9fa48("5439"), ''));
    const [mfaManualKey, setMfaManualKey] = useState(stryMutAct_9fa48("5440") ? "Stryker was here!" : (stryCov_9fa48("5440"), ''));
    const [mfaCode, setMfaCode] = useState(stryMutAct_9fa48("5441") ? "Stryker was here!" : (stryCov_9fa48("5441"), ''));
    const [mfaError, setMfaError] = useState(stryMutAct_9fa48("5442") ? "Stryker was here!" : (stryCov_9fa48("5442"), ''));
    const [isEnrolling, setIsEnrolling] = useState(stryMutAct_9fa48("5443") ? true : (stryCov_9fa48("5443"), false));
    const [showContactModal, setShowContactModal] = useState(stryMutAct_9fa48("5444") ? true : (stryCov_9fa48("5444"), false));
    const [initialSubject, setInitialSubject] = useState<'question' | 'feedback' | undefined>(undefined);
    const [showReauthModal, setShowReauthModal] = useState(stryMutAct_9fa48("5445") ? true : (stryCov_9fa48("5445"), false));
    const [reauthPassword, setReauthPassword] = useState(stryMutAct_9fa48("5446") ? "Stryker was here!" : (stryCov_9fa48("5446"), ''));
    const [isReauthenticating, setIsReauthenticating] = useState(stryMutAct_9fa48("5447") ? true : (stryCov_9fa48("5447"), false));
    const handleResendVerification = async () => {
      if (stryMutAct_9fa48("5448")) {
        {}
      } else {
        stryCov_9fa48("5448");
        setIsResending(stryMutAct_9fa48("5449") ? false : (stryCov_9fa48("5449"), true));
        await sendVerificationEmail();
        showToast(stryMutAct_9fa48("5450") ? "" : (stryCov_9fa48("5450"), 'Verification email sent!'), stryMutAct_9fa48("5451") ? "" : (stryCov_9fa48("5451"), 'success'));
        setIsResending(stryMutAct_9fa48("5452") ? true : (stryCov_9fa48("5452"), false));
      }
    };
    const handleGenerateMfaSecret = async () => {
      if (stryMutAct_9fa48("5453")) {
        {}
      } else {
        stryCov_9fa48("5453");
        setIsEnrolling(stryMutAct_9fa48("5454") ? false : (stryCov_9fa48("5454"), true));
        setShow2FASetup(stryMutAct_9fa48("5455") ? false : (stryCov_9fa48("5455"), true));
        setMfaQrUrl(stryMutAct_9fa48("5456") ? "Stryker was here!" : (stryCov_9fa48("5456"), ''));
        setMfaManualKey(stryMutAct_9fa48("5457") ? "Stryker was here!" : (stryCov_9fa48("5457"), ''));
        setMfaError(stryMutAct_9fa48("5458") ? "Stryker was here!" : (stryCov_9fa48("5458"), ''));
        const timeout = setTimeout(() => {
          if (stryMutAct_9fa48("5459")) {
            {}
          } else {
            stryCov_9fa48("5459");
            if (stryMutAct_9fa48("5462") ? isEnrolling || !mfaQrUrl : stryMutAct_9fa48("5461") ? false : stryMutAct_9fa48("5460") ? true : (stryCov_9fa48("5460", "5461", "5462"), isEnrolling && (stryMutAct_9fa48("5463") ? mfaQrUrl : (stryCov_9fa48("5463"), !mfaQrUrl)))) {
              if (stryMutAct_9fa48("5464")) {
                {}
              } else {
                stryCov_9fa48("5464");
                setMfaError(stryMutAct_9fa48("5465") ? "" : (stryCov_9fa48("5465"), 'Initialization taking too long.'));
                setIsEnrolling(stryMutAct_9fa48("5466") ? true : (stryCov_9fa48("5466"), false));
              }
            }
          }
        }, 10000);
        try {
          if (stryMutAct_9fa48("5467")) {
            {}
          } else {
            stryCov_9fa48("5467");
            const result = await generateMfaSecret();
            clearTimeout(timeout);
            setMfaQrUrl(result.qrCodeUrl);
            setMfaManualKey(result.manualKey);
          }
        } catch (err) {
          if (stryMutAct_9fa48("5468")) {
            {}
          } else {
            stryCov_9fa48("5468");
            clearTimeout(timeout);
            setMfaError((err as Error).message);
          }
        } finally {
          if (stryMutAct_9fa48("5469")) {
            {}
          } else {
            stryCov_9fa48("5469");
            setIsEnrolling(stryMutAct_9fa48("5470") ? true : (stryCov_9fa48("5470"), false));
          }
        }
      }
    };
    const handleEnrollMfa = async (code: string) => {
      if (stryMutAct_9fa48("5471")) {
        {}
      } else {
        stryCov_9fa48("5471");
        setIsEnrolling(stryMutAct_9fa48("5472") ? false : (stryCov_9fa48("5472"), true));
        setMfaError(stryMutAct_9fa48("5473") ? "Stryker was here!" : (stryCov_9fa48("5473"), ''));
        try {
          if (stryMutAct_9fa48("5474")) {
            {}
          } else {
            stryCov_9fa48("5474");
            await enrollMfa(code);
            setShow2FASetup(stryMutAct_9fa48("5475") ? true : (stryCov_9fa48("5475"), false));
            setMfaCode(stryMutAct_9fa48("5476") ? "Stryker was here!" : (stryCov_9fa48("5476"), ''));
            showToast(stryMutAct_9fa48("5477") ? "" : (stryCov_9fa48("5477"), '2FA enabled successfully!'), stryMutAct_9fa48("5478") ? "" : (stryCov_9fa48("5478"), 'success'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("5479")) {
            {}
          } else {
            stryCov_9fa48("5479");
            const msg = (err as Error).message;
            if (stryMutAct_9fa48("5482") ? msg.includes('requires-recent-login') && (err as any).code === 'auth/requires-recent-login' : stryMutAct_9fa48("5481") ? false : stryMutAct_9fa48("5480") ? true : (stryCov_9fa48("5480", "5481", "5482"), msg.includes(stryMutAct_9fa48("5483") ? "" : (stryCov_9fa48("5483"), 'requires-recent-login')) || (stryMutAct_9fa48("5485") ? (err as any).code !== 'auth/requires-recent-login' : stryMutAct_9fa48("5484") ? false : (stryCov_9fa48("5484", "5485"), (err as any).code === (stryMutAct_9fa48("5486") ? "" : (stryCov_9fa48("5486"), 'auth/requires-recent-login')))))) {
              if (stryMutAct_9fa48("5487")) {
                {}
              } else {
                stryCov_9fa48("5487");
                setShowReauthModal(stryMutAct_9fa48("5488") ? false : (stryCov_9fa48("5488"), true));
              }
            } else {
              if (stryMutAct_9fa48("5489")) {
                {}
              } else {
                stryCov_9fa48("5489");
                setMfaError(msg.includes(stryMutAct_9fa48("5490") ? "" : (stryCov_9fa48("5490"), 'invalid-verification-code')) ? stryMutAct_9fa48("5491") ? "" : (stryCov_9fa48("5491"), 'Invalid code. Check device Date & Time settings.') : msg);
              }
            }
          }
        } finally {
          if (stryMutAct_9fa48("5492")) {
            {}
          } else {
            stryCov_9fa48("5492");
            setIsEnrolling(stryMutAct_9fa48("5493") ? true : (stryCov_9fa48("5493"), false));
          }
        }
      }
    };
    const handleWipeData = async () => {
      if (stryMutAct_9fa48("5494")) {
        {}
      } else {
        stryCov_9fa48("5494");
        try {
          if (stryMutAct_9fa48("5495")) {
            {}
          } else {
            stryCov_9fa48("5495");
            const {
              getDocs,
              collection,
              writeBatch,
              doc
            } = await import(stryMutAct_9fa48("5496") ? "" : (stryCov_9fa48("5496"), 'firebase/firestore'));
            const {
              db,
              APP_ID
            } = await import(stryMutAct_9fa48("5497") ? "" : (stryCov_9fa48("5497"), '../../config/firebase'));
            const batch = writeBatch(db);
            let opCount = 0;
            for (const colName of stryMutAct_9fa48("5498") ? [] : (stryCov_9fa48("5498"), [stryMutAct_9fa48("5499") ? "" : (stryCov_9fa48("5499"), 'accounts'), stryMutAct_9fa48("5500") ? "" : (stryCov_9fa48("5500"), 'finance'), stryMutAct_9fa48("5501") ? "" : (stryCov_9fa48("5501"), 'commitments'), stryMutAct_9fa48("5502") ? "" : (stryCov_9fa48("5502"), 'notifications')])) {
              if (stryMutAct_9fa48("5503")) {
                {}
              } else {
                stryCov_9fa48("5503");
                const snap = await getDocs(collection(db, stryMutAct_9fa48("5504") ? "" : (stryCov_9fa48("5504"), 'artifacts'), APP_ID, stryMutAct_9fa48("5505") ? "" : (stryCov_9fa48("5505"), 'users'), user!.uid, colName));
                snap.docs.forEach(d => {
                  if (stryMutAct_9fa48("5506")) {
                    {}
                  } else {
                    stryCov_9fa48("5506");
                    batch.delete(doc(db, stryMutAct_9fa48("5507") ? "" : (stryCov_9fa48("5507"), 'artifacts'), APP_ID, stryMutAct_9fa48("5508") ? "" : (stryCov_9fa48("5508"), 'users'), user!.uid, colName, d.id));
                    stryMutAct_9fa48("5509") ? opCount-- : (stryCov_9fa48("5509"), opCount++);
                  }
                });
              }
            }
            if (stryMutAct_9fa48("5513") ? opCount <= 0 : stryMutAct_9fa48("5512") ? opCount >= 0 : stryMutAct_9fa48("5511") ? false : stryMutAct_9fa48("5510") ? true : (stryCov_9fa48("5510", "5511", "5512", "5513"), opCount > 0)) {
              if (stryMutAct_9fa48("5514")) {
                {}
              } else {
                stryCov_9fa48("5514");
                await batch.commit();
                showToast(stryMutAct_9fa48("5515") ? `` : (stryCov_9fa48("5515"), `Wiped ${opCount} records.`), stryMutAct_9fa48("5516") ? "" : (stryCov_9fa48("5516"), 'success'));
                setTimeout(stryMutAct_9fa48("5517") ? () => undefined : (stryCov_9fa48("5517"), () => window.location.reload()), 1000);
              }
            } else {
              if (stryMutAct_9fa48("5518")) {
                {}
              } else {
                stryCov_9fa48("5518");
                showToast(stryMutAct_9fa48("5519") ? "" : (stryCov_9fa48("5519"), 'Nothing to wipe.'), stryMutAct_9fa48("5520") ? "" : (stryCov_9fa48("5520"), 'info'));
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("5521")) {
            {}
          } else {
            stryCov_9fa48("5521");
            showToast((stryMutAct_9fa48("5522") ? "" : (stryCov_9fa48("5522"), 'Wipe failed: ')) + (e as Error).message, stryMutAct_9fa48("5523") ? "" : (stryCov_9fa48("5523"), 'error'));
          }
        }
      }
    };
    const handleDeleteAccount = async () => {
      if (stryMutAct_9fa48("5524")) {
        {}
      } else {
        stryCov_9fa48("5524");
        try {
          if (stryMutAct_9fa48("5525")) {
            {}
          } else {
            stryCov_9fa48("5525");
            if (stryMutAct_9fa48("5527") ? false : stryMutAct_9fa48("5526") ? true : (stryCov_9fa48("5526", "5527"), familyConnection)) await disconnectFamily(stryMutAct_9fa48("5528") ? "" : (stryCov_9fa48("5528"), 'leave'));
            showToast(stryMutAct_9fa48("5529") ? "" : (stryCov_9fa48("5529"), 'Account scheduled for deletion. Signing out...'), stryMutAct_9fa48("5530") ? "" : (stryCov_9fa48("5530"), 'info'));
            setTimeout(stryMutAct_9fa48("5531") ? () => undefined : (stryCov_9fa48("5531"), () => logout()), 2000);
          }
        } catch (e) {
          if (stryMutAct_9fa48("5532")) {
            {}
          } else {
            stryCov_9fa48("5532");
            showToast((stryMutAct_9fa48("5533") ? "" : (stryCov_9fa48("5533"), 'Error: ')) + (e as Error).message, stryMutAct_9fa48("5534") ? "" : (stryCov_9fa48("5534"), 'error'));
          }
        }
      }
    };
    const handleReauthenticate = async () => {
      if (stryMutAct_9fa48("5535")) {
        {}
      } else {
        stryCov_9fa48("5535");
        setIsReauthenticating(stryMutAct_9fa48("5536") ? false : (stryCov_9fa48("5536"), true));
        try {
          if (stryMutAct_9fa48("5537")) {
            {}
          } else {
            stryCov_9fa48("5537");
            await reauthenticate(reauthPassword);
            setShowReauthModal(stryMutAct_9fa48("5538") ? true : (stryCov_9fa48("5538"), false));
            setReauthPassword(stryMutAct_9fa48("5539") ? "Stryker was here!" : (stryCov_9fa48("5539"), ''));
            showToast(stryMutAct_9fa48("5540") ? "" : (stryCov_9fa48("5540"), 'Identity verified. Try enabling 2FA again.'), stryMutAct_9fa48("5541") ? "" : (stryCov_9fa48("5541"), 'success'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5542")) {
            {}
          } else {
            stryCov_9fa48("5542");
            showToast((stryMutAct_9fa48("5543") ? "" : (stryCov_9fa48("5543"), 'Authentication failed: ')) + (error as Error).message, stryMutAct_9fa48("5544") ? "" : (stryCov_9fa48("5544"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("5545")) {
            {}
          } else {
            stryCov_9fa48("5545");
            setIsReauthenticating(stryMutAct_9fa48("5546") ? true : (stryCov_9fa48("5546"), false));
          }
        }
      }
    };
    return <FeatureErrorBoundary featureName="Settings">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your preferences and environment.</p>
        </div>

        {stryMutAct_9fa48("5549") ? accountNotifications.length > 0 || <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            {accountNotifications.includes('verify_email') && <VerifyEmailBanner isResending={isResending} onResend={handleResendVerification} />}
            {accountNotifications.includes('enable_2fa') && <EnableMfaBanner onEnable={handleGenerateMfaSecret} />}
          </div> : stryMutAct_9fa48("5548") ? false : stryMutAct_9fa48("5547") ? true : (stryCov_9fa48("5547", "5548", "5549"), (stryMutAct_9fa48("5552") ? accountNotifications.length <= 0 : stryMutAct_9fa48("5551") ? accountNotifications.length >= 0 : stryMutAct_9fa48("5550") ? true : (stryCov_9fa48("5550", "5551", "5552"), accountNotifications.length > 0)) && <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            {stryMutAct_9fa48("5555") ? accountNotifications.includes('verify_email') || <VerifyEmailBanner isResending={isResending} onResend={handleResendVerification} /> : stryMutAct_9fa48("5554") ? false : stryMutAct_9fa48("5553") ? true : (stryCov_9fa48("5553", "5554", "5555"), accountNotifications.includes(stryMutAct_9fa48("5556") ? "" : (stryCov_9fa48("5556"), 'verify_email')) && <VerifyEmailBanner isResending={isResending} onResend={handleResendVerification} />)}
            {stryMutAct_9fa48("5559") ? accountNotifications.includes('enable_2fa') || <EnableMfaBanner onEnable={handleGenerateMfaSecret} /> : stryMutAct_9fa48("5558") ? false : stryMutAct_9fa48("5557") ? true : (stryCov_9fa48("5557", "5558", "5559"), accountNotifications.includes(stryMutAct_9fa48("5560") ? "" : (stryCov_9fa48("5560"), 'enable_2fa')) && <EnableMfaBanner onEnable={handleGenerateMfaSecret} />)}
          </div>)}

        <ProfileSettings name={profile.name} uid={stryMutAct_9fa48("5563") ? user?.uid && '' : stryMutAct_9fa48("5562") ? false : stryMutAct_9fa48("5561") ? true : (stryCov_9fa48("5561", "5562", "5563"), (stryMutAct_9fa48("5564") ? user.uid : (stryCov_9fa48("5564"), user?.uid)) || (stryMutAct_9fa48("5565") ? "Stryker was here!" : (stryCov_9fa48("5565"), '')))} onUpdateName={stryMutAct_9fa48("5566") ? () => undefined : (stryCov_9fa48("5566"), name => updateProfile(stryMutAct_9fa48("5567") ? {} : (stryCov_9fa48("5567"), {
          name
        })))} />
        <AppearanceSettings theme={profile.theme as 'light' | 'dark'} onSetTheme={stryMutAct_9fa48("5568") ? () => undefined : (stryCov_9fa48("5568"), theme => updateProfile(stryMutAct_9fa48("5569") ? {} : (stryCov_9fa48("5569"), {
          theme
        })))} />
        <SecuritySettings mfaEnabled={stryMutAct_9fa48("5572") ? profile.mfaEnabled && false : stryMutAct_9fa48("5571") ? false : stryMutAct_9fa48("5570") ? true : (stryCov_9fa48("5570", "5571", "5572"), profile.mfaEnabled || (stryMutAct_9fa48("5573") ? true : (stryCov_9fa48("5573"), false)))} isEnrolling={isEnrolling} show2FASetup={show2FASetup} mfaQrUrl={mfaQrUrl} mfaManualKey={mfaManualKey} mfaCode={mfaCode} mfaError={mfaError} onSetShow2FASetup={setShow2FASetup} onSetMfaCode={setMfaCode} onGenerateMfaSecret={handleGenerateMfaSecret} onEnrollMfa={handleEnrollMfa} onUnenrollMfa={unenrollMfa} />
        <NotificationSettings emailEnabled={stryMutAct_9fa48("5576") ? profile.notificationPreferences?.enabled && false : stryMutAct_9fa48("5575") ? false : stryMutAct_9fa48("5574") ? true : (stryCov_9fa48("5574", "5575", "5576"), (stryMutAct_9fa48("5577") ? profile.notificationPreferences.enabled : (stryCov_9fa48("5577"), profile.notificationPreferences?.enabled)) || (stryMutAct_9fa48("5578") ? true : (stryCov_9fa48("5578"), false)))} email={stryMutAct_9fa48("5581") ? profile.notificationPreferences?.email && '' : stryMutAct_9fa48("5580") ? false : stryMutAct_9fa48("5579") ? true : (stryCov_9fa48("5579", "5580", "5581"), (stryMutAct_9fa48("5582") ? profile.notificationPreferences.email : (stryCov_9fa48("5582"), profile.notificationPreferences?.email)) || (stryMutAct_9fa48("5583") ? "Stryker was here!" : (stryCov_9fa48("5583"), '')))} frequency={stryMutAct_9fa48("5586") ? profile.notificationPreferences?.frequency && 'instant' : stryMutAct_9fa48("5585") ? false : stryMutAct_9fa48("5584") ? true : (stryCov_9fa48("5584", "5585", "5586"), (stryMutAct_9fa48("5587") ? profile.notificationPreferences.frequency : (stryCov_9fa48("5587"), profile.notificationPreferences?.frequency)) || (stryMutAct_9fa48("5588") ? "" : (stryCov_9fa48("5588"), 'instant')))} userEmail={stryMutAct_9fa48("5591") ? user?.email && '' : stryMutAct_9fa48("5590") ? false : stryMutAct_9fa48("5589") ? true : (stryCov_9fa48("5589", "5590", "5591"), (stryMutAct_9fa48("5592") ? user.email : (stryCov_9fa48("5592"), user?.email)) || (stryMutAct_9fa48("5593") ? "Stryker was here!" : (stryCov_9fa48("5593"), '')))} emailVerified={stryMutAct_9fa48("5596") ? user?.emailVerified && false : stryMutAct_9fa48("5595") ? false : stryMutAct_9fa48("5594") ? true : (stryCov_9fa48("5594", "5595", "5596"), (stryMutAct_9fa48("5597") ? user.emailVerified : (stryCov_9fa48("5597"), user?.emailVerified)) || (stryMutAct_9fa48("5598") ? true : (stryCov_9fa48("5598"), false)))} onUpdatePreferences={stryMutAct_9fa48("5599") ? () => undefined : (stryCov_9fa48("5599"), prefs => updateProfile(stryMutAct_9fa48("5600") ? {} : (stryCov_9fa48("5600"), {
          notificationPreferences: stryMutAct_9fa48("5601") ? {} : (stryCov_9fa48("5601"), {
            ...(stryMutAct_9fa48("5604") ? profile.notificationPreferences && {} : stryMutAct_9fa48("5603") ? false : stryMutAct_9fa48("5602") ? true : (stryCov_9fa48("5602", "5603", "5604"), profile.notificationPreferences || {})),
            ...prefs
          })
        })))} pushPermissionStatus={pushPermissionStatus} requestPushPermission={stryMutAct_9fa48("5605") ? () => undefined : (stryCov_9fa48("5605"), () => requestPushPermission())} />
        <FamilySettingsV2 onNavigateToFinance={stryMutAct_9fa48("5606") ? () => undefined : (stryCov_9fa48("5606"), () => navigateTo(stryMutAct_9fa48("5607") ? "" : (stryCov_9fa48("5607"), 'finance')))} />
        <SupportSettings onOpenContact={() => {
          if (stryMutAct_9fa48("5608")) {
            {}
          } else {
            stryCov_9fa48("5608");
            setInitialSubject(stryMutAct_9fa48("5609") ? "" : (stryCov_9fa48("5609"), 'feedback'));
            setShowContactModal(stryMutAct_9fa48("5610") ? false : (stryCov_9fa48("5610"), true));
          }
        }} />
        {stryMutAct_9fa48("5613") ? import.meta.env.VITE_APP_ENV !== 'production' || <DeveloperTools userUid={user?.uid || ''} /> : stryMutAct_9fa48("5612") ? false : stryMutAct_9fa48("5611") ? true : (stryCov_9fa48("5611", "5612", "5613"), (stryMutAct_9fa48("5615") ? import.meta.env.VITE_APP_ENV === 'production' : stryMutAct_9fa48("5614") ? true : (stryCov_9fa48("5614", "5615"), import.meta.env.VITE_APP_ENV !== (stryMutAct_9fa48("5616") ? "" : (stryCov_9fa48("5616"), 'production')))) && <DeveloperTools userUid={stryMutAct_9fa48("5619") ? user?.uid && '' : stryMutAct_9fa48("5618") ? false : stryMutAct_9fa48("5617") ? true : (stryCov_9fa48("5617", "5618", "5619"), (stryMutAct_9fa48("5620") ? user.uid : (stryCov_9fa48("5620"), user?.uid)) || (stryMutAct_9fa48("5621") ? "Stryker was here!" : (stryCov_9fa48("5621"), '')))} />)}
        <DataManagement userUid={stryMutAct_9fa48("5624") ? user?.uid && '' : stryMutAct_9fa48("5623") ? false : stryMutAct_9fa48("5622") ? true : (stryCov_9fa48("5622", "5623", "5624"), (stryMutAct_9fa48("5625") ? user.uid : (stryCov_9fa48("5625"), user?.uid)) || (stryMutAct_9fa48("5626") ? "Stryker was here!" : (stryCov_9fa48("5626"), '')))} profile={profile} onWipeData={handleWipeData} />
        <DangerZone onDeleteAccount={handleDeleteAccount} />

        <div className="mt-8 flex justify-center gap-6 pb-8">
          <Button variant="ghost" size="sm" onClick={stryMutAct_9fa48("5627") ? () => undefined : (stryCov_9fa48("5627"), () => logout())} className="text-rose-500 dark:text-rose-400 font-bold">Sign Out</Button>
        </div>

        {stryMutAct_9fa48("5630") ? showContactModal || <ContactModal onClose={() => setShowContactModal(false)} currentPage="settings" initialSubject={initialSubject} /> : stryMutAct_9fa48("5629") ? false : stryMutAct_9fa48("5628") ? true : (stryCov_9fa48("5628", "5629", "5630"), showContactModal && <ContactModal onClose={stryMutAct_9fa48("5631") ? () => undefined : (stryCov_9fa48("5631"), () => setShowContactModal(stryMutAct_9fa48("5632") ? true : (stryCov_9fa48("5632"), false)))} currentPage="settings" initialSubject={initialSubject} />)}
        <ReauthModal show={showReauthModal} password={reauthPassword} isLoading={isReauthenticating} onPasswordChange={setReauthPassword} onConfirm={handleReauthenticate} onClose={stryMutAct_9fa48("5633") ? () => undefined : (stryCov_9fa48("5633"), () => setShowReauthModal(stryMutAct_9fa48("5634") ? true : (stryCov_9fa48("5634"), false)))} />
      </div>
    </FeatureErrorBoundary>;
  }
};
export default SettingsView;