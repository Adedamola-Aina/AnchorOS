/**
 * AuthGate - Central authentication orchestrator
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Loading and gate UI components extracted to AuthGateParts.tsx
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
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import AuthView from '../../features/auth/AuthView';
import { getMultiFactorResolver, type MultiFactorResolver } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { mapFirebaseError } from '../../utils/errorUtils';
import { AuthLoadingScreen, EmailVerificationGate, OnboardingGate } from './AuthGateParts';
interface AuthGateProps {
  children: React.ReactNode;
}
const AuthGate: React.FC<AuthGateProps> = ({
  children
}) => {
  if (stryMutAct_9fa48("351")) {
    {}
  } else {
    stryCov_9fa48("351");
    const {
      user,
      loading,
      profile,
      updateProfile,
      signIn,
      signUp,
      verifyMfa,
      logout,
      sendVerificationEmail,
      sendPasswordReset
    } = useAuth();
    const {
      accounts
    } = useFinance();
    const {
      tasks
    } = useTasks();
    const {
      showToast
    } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'mfa' | 'reset'>(stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), 'login'));
    const [email, setEmail] = useState(stryMutAct_9fa48("353") ? "Stryker was here!" : (stryCov_9fa48("353"), ''));
    const [password, setPassword] = useState(stryMutAct_9fa48("354") ? "Stryker was here!" : (stryCov_9fa48("354"), ''));
    const [mfaCode, setMfaCode] = useState(stryMutAct_9fa48("355") ? "Stryker was here!" : (stryCov_9fa48("355"), ''));
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    const [authError, setAuthError] = useState(stryMutAct_9fa48("356") ? "Stryker was here!" : (stryCov_9fa48("356"), ''));
    const [isAuthenticating, setIsAuthenticating] = useState(stryMutAct_9fa48("357") ? true : (stryCov_9fa48("357"), false));
    const [loginAttempts, setLoginAttempts] = useState(() => {
      if (stryMutAct_9fa48("358")) {
        {}
      } else {
        stryCov_9fa48("358");
        const stored = localStorage.getItem(stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), 'anchor_login_attempts'));
        return stored ? parseInt(stored, 10) : 0;
      }
    });
    const [lockoutUntil, setLockoutUntil] = useState(() => {
      if (stryMutAct_9fa48("360")) {
        {}
      } else {
        stryCov_9fa48("360");
        const stored = localStorage.getItem(stryMutAct_9fa48("361") ? "" : (stryCov_9fa48("361"), 'anchor_lockout_until'));
        return stored ? parseInt(stored, 10) : 0;
      }
    });
    React.useEffect(() => {
      if (stryMutAct_9fa48("362")) {
        {}
      } else {
        stryCov_9fa48("362");
        const handleExpiry = stryMutAct_9fa48("363") ? () => undefined : (stryCov_9fa48("363"), (() => {
          const handleExpiry = () => setAuthError(stryMutAct_9fa48("364") ? "" : (stryCov_9fa48("364"), 'Session expired. Please sign in again.'));
          return handleExpiry;
        })());
        window.addEventListener(stryMutAct_9fa48("365") ? "" : (stryCov_9fa48("365"), 'anchor:session_expired'), handleExpiry);
        const sessionActive = sessionStorage.getItem(stryMutAct_9fa48("366") ? "" : (stryCov_9fa48("366"), 'anchor_session_active'));
        if (stryMutAct_9fa48("369") ? sessionActive === 'true' && !user || !loading : stryMutAct_9fa48("368") ? false : stryMutAct_9fa48("367") ? true : (stryCov_9fa48("367", "368", "369"), (stryMutAct_9fa48("371") ? sessionActive === 'true' || !user : stryMutAct_9fa48("370") ? true : (stryCov_9fa48("370", "371"), (stryMutAct_9fa48("373") ? sessionActive !== 'true' : stryMutAct_9fa48("372") ? true : (stryCov_9fa48("372", "373"), sessionActive === (stryMutAct_9fa48("374") ? "" : (stryCov_9fa48("374"), 'true')))) && (stryMutAct_9fa48("375") ? user : (stryCov_9fa48("375"), !user)))) && (stryMutAct_9fa48("376") ? loading : (stryCov_9fa48("376"), !loading)))) {
          if (stryMutAct_9fa48("377")) {
            {}
          } else {
            stryCov_9fa48("377");
            setAuthError(stryMutAct_9fa48("378") ? "" : (stryCov_9fa48("378"), 'Session expired. Please sign in again.'));
            sessionStorage.removeItem(stryMutAct_9fa48("379") ? "" : (stryCov_9fa48("379"), 'anchor_session_active'));
          }
        }
        return stryMutAct_9fa48("380") ? () => undefined : (stryCov_9fa48("380"), () => window.removeEventListener(stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), 'anchor:session_expired'), handleExpiry));
      }
    }, stryMutAct_9fa48("382") ? [] : (stryCov_9fa48("382"), [user, loading]));
    React.useEffect(() => {
      if (stryMutAct_9fa48("383")) {
        {}
      } else {
        stryCov_9fa48("383");
        if (stryMutAct_9fa48("386") ? !user || !loading : stryMutAct_9fa48("385") ? false : stryMutAct_9fa48("384") ? true : (stryCov_9fa48("384", "385", "386"), (stryMutAct_9fa48("387") ? user : (stryCov_9fa48("387"), !user)) && (stryMutAct_9fa48("388") ? loading : (stryCov_9fa48("388"), !loading)))) {
          if (stryMutAct_9fa48("389")) {
            {}
          } else {
            stryCov_9fa48("389");
            setEmail(stryMutAct_9fa48("390") ? "Stryker was here!" : (stryCov_9fa48("390"), ''));
            setPassword(stryMutAct_9fa48("391") ? "Stryker was here!" : (stryCov_9fa48("391"), ''));
            setAuthError(stryMutAct_9fa48("392") ? "Stryker was here!" : (stryCov_9fa48("392"), ''));
            setMfaResolver(null);
            setAuthMode(stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'login'));
            if (stryMutAct_9fa48("396") ? location.pathname !== '/' || location.pathname !== '/accept-invite' : stryMutAct_9fa48("395") ? false : stryMutAct_9fa48("394") ? true : (stryCov_9fa48("394", "395", "396"), (stryMutAct_9fa48("398") ? location.pathname === '/' : stryMutAct_9fa48("397") ? true : (stryCov_9fa48("397", "398"), location.pathname !== (stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), '/')))) && (stryMutAct_9fa48("401") ? location.pathname === '/accept-invite' : stryMutAct_9fa48("400") ? true : (stryCov_9fa48("400", "401"), location.pathname !== (stryMutAct_9fa48("402") ? "" : (stryCov_9fa48("402"), '/accept-invite')))))) navigate(stryMutAct_9fa48("403") ? "" : (stryCov_9fa48("403"), '/'), stryMutAct_9fa48("404") ? {} : (stryCov_9fa48("404"), {
              replace: stryMutAct_9fa48("405") ? false : (stryCov_9fa48("405"), true)
            }));
          }
        }
      }
    }, stryMutAct_9fa48("406") ? [] : (stryCov_9fa48("406"), [user, loading, location.pathname, navigate]));
    if (stryMutAct_9fa48("408") ? false : stryMutAct_9fa48("407") ? true : (stryCov_9fa48("407", "408"), loading)) return <AuthLoadingScreen />;
    if (stryMutAct_9fa48("411") ? false : stryMutAct_9fa48("410") ? true : stryMutAct_9fa48("409") ? user : (stryCov_9fa48("409", "410", "411"), !user)) return <AuthView authMode={mfaResolver ? stryMutAct_9fa48("412") ? "" : (stryCov_9fa48("412"), 'mfa') : authMode} setAuthMode={setAuthMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} mfaCode={mfaCode} setMfaCode={setMfaCode} authError={authError} isAuthenticating={isAuthenticating} theme={stryMutAct_9fa48("415") ? profile?.theme && 'light' : stryMutAct_9fa48("414") ? false : stryMutAct_9fa48("413") ? true : (stryCov_9fa48("413", "414", "415"), (stryMutAct_9fa48("416") ? profile.theme : (stryCov_9fa48("416"), profile?.theme)) || (stryMutAct_9fa48("417") ? "" : (stryCov_9fa48("417"), 'light')))} onSetTheme={stryMutAct_9fa48("418") ? () => undefined : (stryCov_9fa48("418"), theme => updateProfile(stryMutAct_9fa48("419") ? {} : (stryCov_9fa48("419"), {
      theme
    })))} onSubmit={async e => {
      if (stryMutAct_9fa48("420")) {
        {}
      } else {
        stryCov_9fa48("420");
        e.preventDefault();
        setAuthError(stryMutAct_9fa48("421") ? "Stryker was here!" : (stryCov_9fa48("421"), ''));
        if (stryMutAct_9fa48("425") ? Date.now() >= lockoutUntil : stryMutAct_9fa48("424") ? Date.now() <= lockoutUntil : stryMutAct_9fa48("423") ? false : stryMutAct_9fa48("422") ? true : (stryCov_9fa48("422", "423", "424", "425"), Date.now() < lockoutUntil)) {
          if (stryMutAct_9fa48("426")) {
            {}
          } else {
            stryCov_9fa48("426");
            setAuthError(stryMutAct_9fa48("427") ? `` : (stryCov_9fa48("427"), `Too many attempts. Please try again in ${Math.ceil(stryMutAct_9fa48("428") ? (lockoutUntil - Date.now()) * 1000 : (stryCov_9fa48("428"), (stryMutAct_9fa48("429") ? lockoutUntil + Date.now() : (stryCov_9fa48("429"), lockoutUntil - Date.now())) / 1000))}s.`));
            return;
          }
        }
        setIsAuthenticating(stryMutAct_9fa48("430") ? false : (stryCov_9fa48("430"), true));
        try {
          if (stryMutAct_9fa48("431")) {
            {}
          } else {
            stryCov_9fa48("431");
            if (stryMutAct_9fa48("434") ? authMode !== 'reset' : stryMutAct_9fa48("433") ? false : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433", "434"), authMode === (stryMutAct_9fa48("435") ? "" : (stryCov_9fa48("435"), 'reset')))) {
              if (stryMutAct_9fa48("436")) {
                {}
              } else {
                stryCov_9fa48("436");
                await sendPasswordReset(email);
                showToast(stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'Password reset email sent!'), stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), 'success'));
                setAuthMode(stryMutAct_9fa48("439") ? "" : (stryCov_9fa48("439"), 'login'));
                setAuthError(stryMutAct_9fa48("440") ? "Stryker was here!" : (stryCov_9fa48("440"), ''));
                return;
              }
            }
            if (stryMutAct_9fa48("442") ? false : stryMutAct_9fa48("441") ? true : (stryCov_9fa48("441", "442"), mfaResolver)) {
              if (stryMutAct_9fa48("443")) {
                {}
              } else {
                stryCov_9fa48("443");
                await verifyMfa(mfaResolver, mfaCode);
                setLoginAttempts(0);
                localStorage.setItem(stryMutAct_9fa48("444") ? "" : (stryCov_9fa48("444"), 'anchor_login_attempts'), stryMutAct_9fa48("445") ? "" : (stryCov_9fa48("445"), '0'));
              }
            } else {
              if (stryMutAct_9fa48("446")) {
                {}
              } else {
                stryCov_9fa48("446");
                if (stryMutAct_9fa48("449") ? authMode !== 'signup' : stryMutAct_9fa48("448") ? false : stryMutAct_9fa48("447") ? true : (stryCov_9fa48("447", "448", "449"), authMode === (stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), 'signup')))) {
                  if (stryMutAct_9fa48("451")) {
                    {}
                  } else {
                    stryCov_9fa48("451");
                    const matches = stryMutAct_9fa48("452") ? [] : (stryCov_9fa48("452"), [(stryMutAct_9fa48("453") ? /[^A-Z]/ : (stryCov_9fa48("453"), /[A-Z]/)).test(password), (stryMutAct_9fa48("454") ? /[^a-z]/ : (stryCov_9fa48("454"), /[a-z]/)).test(password), (stryMutAct_9fa48("455") ? /[^0-9]/ : (stryCov_9fa48("455"), /[0-9]/)).test(password), (stryMutAct_9fa48("456") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("456"), /[!@#$%^&*(),.?":{}|<>]/)).test(password)]);
                    if (stryMutAct_9fa48("459") ? password.length < 12 && matches.includes(false) : stryMutAct_9fa48("458") ? false : stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457", "458", "459"), (stryMutAct_9fa48("462") ? password.length >= 12 : stryMutAct_9fa48("461") ? password.length <= 12 : stryMutAct_9fa48("460") ? false : (stryCov_9fa48("460", "461", "462"), password.length < 12)) || matches.includes(stryMutAct_9fa48("463") ? true : (stryCov_9fa48("463"), false)))) {
                      if (stryMutAct_9fa48("464")) {
                        {}
                      } else {
                        stryCov_9fa48("464");
                        setAuthError(stryMutAct_9fa48("465") ? "" : (stryCov_9fa48("465"), 'Password requirements not met.'));
                        setIsAuthenticating(stryMutAct_9fa48("466") ? true : (stryCov_9fa48("466"), false));
                        return;
                      }
                    }
                    await signUp(email, password);
                  }
                } else {
                  if (stryMutAct_9fa48("467")) {
                    {}
                  } else {
                    stryCov_9fa48("467");
                    await signIn(email, password);
                  }
                }
                setLoginAttempts(0);
                localStorage.setItem(stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), 'anchor_login_attempts'), stryMutAct_9fa48("469") ? "" : (stryCov_9fa48("469"), '0'));
              }
            }
          }
        } catch (err: unknown) {
          if (stryMutAct_9fa48("470")) {
            {}
          } else {
            stryCov_9fa48("470");
            if (stryMutAct_9fa48("473") ? (err as any).code !== 'auth/multi-factor-auth-required' : stryMutAct_9fa48("472") ? false : stryMutAct_9fa48("471") ? true : (stryCov_9fa48("471", "472", "473"), (err as any).code === (stryMutAct_9fa48("474") ? "" : (stryCov_9fa48("474"), 'auth/multi-factor-auth-required')))) {
              if (stryMutAct_9fa48("475")) {
                {}
              } else {
                stryCov_9fa48("475");
                setMfaResolver(getMultiFactorResolver(auth, err as any));
                setMfaCode(stryMutAct_9fa48("476") ? "Stryker was here!" : (stryCov_9fa48("476"), ''));
                setLoginAttempts(0);
              }
            } else {
              if (stryMutAct_9fa48("477")) {
                {}
              } else {
                stryCov_9fa48("477");
                const newAttempts = stryMutAct_9fa48("478") ? loginAttempts - 1 : (stryCov_9fa48("478"), loginAttempts + 1);
                setLoginAttempts(newAttempts);
                localStorage.setItem(stryMutAct_9fa48("479") ? "" : (stryCov_9fa48("479"), 'anchor_login_attempts'), newAttempts.toString());
                if (stryMutAct_9fa48("483") ? newAttempts < 5 : stryMutAct_9fa48("482") ? newAttempts > 5 : stryMutAct_9fa48("481") ? false : stryMutAct_9fa48("480") ? true : (stryCov_9fa48("480", "481", "482", "483"), newAttempts >= 5)) {
                  if (stryMutAct_9fa48("484")) {
                    {}
                  } else {
                    stryCov_9fa48("484");
                    const lockoutTime = stryMutAct_9fa48("485") ? Date.now() - 60000 : (stryCov_9fa48("485"), Date.now() + 60000);
                    setLockoutUntil(lockoutTime);
                    localStorage.setItem(stryMutAct_9fa48("486") ? "" : (stryCov_9fa48("486"), 'anchor_lockout_until'), lockoutTime.toString());
                    setAuthError(stryMutAct_9fa48("487") ? "" : (stryCov_9fa48("487"), 'Too many failed attempts. Login locked for 1 minute.'));
                  }
                } else {
                  if (stryMutAct_9fa48("488")) {
                    {}
                  } else {
                    stryCov_9fa48("488");
                    let msg = mapFirebaseError(err);
                    if (stryMutAct_9fa48("490") ? false : stryMutAct_9fa48("489") ? true : (stryCov_9fa48("489", "490"), msg.includes(stryMutAct_9fa48("491") ? "" : (stryCov_9fa48("491"), 'Incorrect email or password')))) {
                      if (stryMutAct_9fa48("492")) {
                        {}
                      } else {
                        stryCov_9fa48("492");
                        msg = (stryMutAct_9fa48("495") ? import.meta.env.VITE_APP_ENV !== 'production' : stryMutAct_9fa48("494") ? false : stryMutAct_9fa48("493") ? true : (stryCov_9fa48("493", "494", "495"), import.meta.env.VITE_APP_ENV === (stryMutAct_9fa48("496") ? "" : (stryCov_9fa48("496"), 'production')))) ? stryMutAct_9fa48("497") ? "" : (stryCov_9fa48("497"), 'Incorrect email or password.') : stryMutAct_9fa48("498") ? "" : (stryCov_9fa48("498"), 'Incorrect email or password. Remember: Non-production accounts are separate.');
                      }
                    }
                    setAuthError(msg);
                  }
                }
              }
            }
          }
        } finally {
          if (stryMutAct_9fa48("499")) {
            {}
          } else {
            stryCov_9fa48("499");
            setIsAuthenticating(stryMutAct_9fa48("500") ? true : (stryCov_9fa48("500"), false));
          }
        }
      }
    }} />;

    // Gates
    const env = import.meta.env.VITE_APP_ENV;
    const isDevOrStaging = stryMutAct_9fa48("503") ? env === 'development' && env === 'staging' : stryMutAct_9fa48("502") ? false : stryMutAct_9fa48("501") ? true : (stryCov_9fa48("501", "502", "503"), (stryMutAct_9fa48("505") ? env !== 'development' : stryMutAct_9fa48("504") ? false : (stryCov_9fa48("504", "505"), env === (stryMutAct_9fa48("506") ? "" : (stryCov_9fa48("506"), 'development')))) || (stryMutAct_9fa48("508") ? env !== 'staging' : stryMutAct_9fa48("507") ? false : (stryCov_9fa48("507", "508"), env === (stryMutAct_9fa48("509") ? "" : (stryCov_9fa48("509"), 'staging')))));
    const isTestUser = stryMutAct_9fa48("512") ? user.email === 'test@anchor-os.com' && user.email?.endsWith('@anchor-os.com') : stryMutAct_9fa48("511") ? false : stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510", "511", "512"), (stryMutAct_9fa48("514") ? user.email !== 'test@anchor-os.com' : stryMutAct_9fa48("513") ? false : (stryCov_9fa48("513", "514"), user.email === (stryMutAct_9fa48("515") ? "" : (stryCov_9fa48("515"), 'test@anchor-os.com')))) || (stryMutAct_9fa48("517") ? user.email.endsWith('@anchor-os.com') : stryMutAct_9fa48("516") ? user.email?.startsWith('@anchor-os.com') : (stryCov_9fa48("516", "517"), user.email?.endsWith(stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), '@anchor-os.com')))));
    if (stryMutAct_9fa48("521") ? !user.emailVerified && !isDevOrStaging || !isTestUser : stryMutAct_9fa48("520") ? false : stryMutAct_9fa48("519") ? true : (stryCov_9fa48("519", "520", "521"), (stryMutAct_9fa48("523") ? !user.emailVerified || !isDevOrStaging : stryMutAct_9fa48("522") ? true : (stryCov_9fa48("522", "523"), (stryMutAct_9fa48("524") ? user.emailVerified : (stryCov_9fa48("524"), !user.emailVerified)) && (stryMutAct_9fa48("525") ? isDevOrStaging : (stryCov_9fa48("525"), !isDevOrStaging)))) && (stryMutAct_9fa48("526") ? isTestUser : (stryCov_9fa48("526"), !isTestUser)))) return <EmailVerificationGate email={user.email!} onResend={async () => {
      if (stryMutAct_9fa48("527")) {
        {}
      } else {
        stryCov_9fa48("527");
        await sendVerificationEmail();
        showToast(stryMutAct_9fa48("528") ? "" : (stryCov_9fa48("528"), 'Verification email sent!'), stryMutAct_9fa48("529") ? "" : (stryCov_9fa48("529"), 'success'));
      }
    }} onRefresh={stryMutAct_9fa48("530") ? () => undefined : (stryCov_9fa48("530"), () => window.location.reload())} onLogout={logout} />;
    const isBrandNew = stryMutAct_9fa48("533") ? accounts.length === 0 || tasks.length === 0 : stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533"), (stryMutAct_9fa48("535") ? accounts.length !== 0 : stryMutAct_9fa48("534") ? true : (stryCov_9fa48("534", "535"), accounts.length === 0)) && (stryMutAct_9fa48("537") ? tasks.length !== 0 : stryMutAct_9fa48("536") ? true : (stryCov_9fa48("536", "537"), tasks.length === 0)));
    const showOnboarding = stryMutAct_9fa48("540") ? !isTestUser || profile.onboardingComplete === false || isBrandNew && profile.onboardingComplete !== true : stryMutAct_9fa48("539") ? false : stryMutAct_9fa48("538") ? true : (stryCov_9fa48("538", "539", "540"), (stryMutAct_9fa48("541") ? isTestUser : (stryCov_9fa48("541"), !isTestUser)) && (stryMutAct_9fa48("543") ? profile.onboardingComplete === false && isBrandNew && profile.onboardingComplete !== true : stryMutAct_9fa48("542") ? true : (stryCov_9fa48("542", "543"), (stryMutAct_9fa48("545") ? profile.onboardingComplete !== false : stryMutAct_9fa48("544") ? false : (stryCov_9fa48("544", "545"), profile.onboardingComplete === (stryMutAct_9fa48("546") ? true : (stryCov_9fa48("546"), false)))) || (stryMutAct_9fa48("548") ? isBrandNew || profile.onboardingComplete !== true : stryMutAct_9fa48("547") ? false : (stryCov_9fa48("547", "548"), isBrandNew && (stryMutAct_9fa48("550") ? profile.onboardingComplete === true : stryMutAct_9fa48("549") ? true : (stryCov_9fa48("549", "550"), profile.onboardingComplete !== (stryMutAct_9fa48("551") ? false : (stryCov_9fa48("551"), true)))))))));
    if (stryMutAct_9fa48("553") ? false : stryMutAct_9fa48("552") ? true : (stryCov_9fa48("552", "553"), showOnboarding)) return <OnboardingGate show={stryMutAct_9fa48("554") ? false : (stryCov_9fa48("554"), true)} />;
    return <>{children}</>;
  }
};
export default AuthGate;