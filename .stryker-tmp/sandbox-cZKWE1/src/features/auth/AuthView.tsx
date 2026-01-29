/**
 * AuthView - Main authentication page
 * 
 * Orchestrates the login, signup, MFA, and reset password flows.
 * 
 * Refactored per CLAUDE.md 200-line rule.
 * Extracted: AuthLeftPanel, AuthFormFields, PasswordStrengthMeter, AuthSubmitButton
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
import { AnchorLogo, ThemeToggle } from '../../components/shared';
import { AuthLeftPanel } from './AuthLeftPanel';
import { AuthFormFields } from './AuthFormFields';
import { AuthSubmitButton } from './AuthSubmitButton';
export type Theme = 'light' | 'dark';
interface AuthViewProps {
  authMode: 'login' | 'signup' | 'mfa' | 'reset';
  setAuthMode: (mode: 'login' | 'signup' | 'mfa' | 'reset') => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  mfaCode: string;
  setMfaCode: (code: string) => void;
  authError: string;
  isAuthenticating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  theme?: Theme;
  onSetTheme?: (theme: Theme) => void;
}
const titles = stryMutAct_9fa48("2014") ? {} : (stryCov_9fa48("2014"), {
  login: stryMutAct_9fa48("2015") ? "" : (stryCov_9fa48("2015"), 'Welcome back'),
  signup: stryMutAct_9fa48("2016") ? "" : (stryCov_9fa48("2016"), 'Create your account'),
  mfa: stryMutAct_9fa48("2017") ? "" : (stryCov_9fa48("2017"), 'Security Challenge'),
  reset: stryMutAct_9fa48("2018") ? "" : (stryCov_9fa48("2018"), 'Reset Password')
});
const subtitles = stryMutAct_9fa48("2019") ? {} : (stryCov_9fa48("2019"), {
  login: stryMutAct_9fa48("2020") ? "" : (stryCov_9fa48("2020"), 'Sign into your world'),
  signup: stryMutAct_9fa48("2021") ? "" : (stryCov_9fa48("2021"), 'Start tracking habits and finances'),
  mfa: stryMutAct_9fa48("2022") ? "" : (stryCov_9fa48("2022"), 'Please enter your 2FA verification code'),
  reset: stryMutAct_9fa48("2023") ? "" : (stryCov_9fa48("2023"), "We'll send you a recovery link")
});
const AuthView: React.FC<AuthViewProps> = ({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  mfaCode,
  setMfaCode,
  authError,
  isAuthenticating,
  onSubmit,
  theme = stryMutAct_9fa48("2024") ? "" : (stryCov_9fa48("2024"), 'light'),
  onSetTheme
}) => {
  if (stryMutAct_9fa48("2025")) {
    {}
  } else {
    stryCov_9fa48("2025");
    const [showPassword, setShowPassword] = useState(stryMutAct_9fa48("2026") ? true : (stryCov_9fa48("2026"), false));
    const [validationErrors, setValidationErrors] = useState<{
      email?: string;
      password?: string;
    }>({});
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);
    const attemptsRef = React.useRef<{
      count: number;
      firstAttempt: number;
    }>(stryMutAct_9fa48("2027") ? {} : (stryCov_9fa48("2027"), {
      count: 0,
      firstAttempt: 0
    }));
    React.useEffect(() => {
      if (stryMutAct_9fa48("2028")) {
        {}
      } else {
        stryCov_9fa48("2028");
        if (stryMutAct_9fa48("2030") ? false : stryMutAct_9fa48("2029") ? true : (stryCov_9fa48("2029", "2030"), email.includes(stryMutAct_9fa48("2031") ? "" : (stryCov_9fa48("2031"), 'test.mfa@anchor-os.dev')))) {
          if (stryMutAct_9fa48("2032")) {
            {}
          } else {
            stryCov_9fa48("2032");
            setEmail(email.replace(stryMutAct_9fa48("2033") ? "" : (stryCov_9fa48("2033"), 'test.mfa@anchor-os.dev'), stryMutAct_9fa48("2034") ? "Stryker was here!" : (stryCov_9fa48("2034"), '')));
          }
        }
      }
    }, stryMutAct_9fa48("2035") ? [] : (stryCov_9fa48("2035"), [email, setEmail]));
    const handleRateLimitedSubmit = (e: React.FormEvent) => {
      if (stryMutAct_9fa48("2036")) {
        {}
      } else {
        stryCov_9fa48("2036");
        e.preventDefault();
        const now = Date.now();
        const windowMs = 60000;
        const maxAttempts = 5;
        if (stryMutAct_9fa48("2040") ? now - attemptsRef.current.firstAttempt <= windowMs : stryMutAct_9fa48("2039") ? now - attemptsRef.current.firstAttempt >= windowMs : stryMutAct_9fa48("2038") ? false : stryMutAct_9fa48("2037") ? true : (stryCov_9fa48("2037", "2038", "2039", "2040"), (stryMutAct_9fa48("2041") ? now + attemptsRef.current.firstAttempt : (stryCov_9fa48("2041"), now - attemptsRef.current.firstAttempt)) > windowMs)) {
          if (stryMutAct_9fa48("2042")) {
            {}
          } else {
            stryCov_9fa48("2042");
            attemptsRef.current = stryMutAct_9fa48("2043") ? {} : (stryCov_9fa48("2043"), {
              count: 0,
              firstAttempt: now
            });
            setRateLimitError(null);
          }
        }
        if (stryMutAct_9fa48("2047") ? attemptsRef.current.count < maxAttempts : stryMutAct_9fa48("2046") ? attemptsRef.current.count > maxAttempts : stryMutAct_9fa48("2045") ? false : stryMutAct_9fa48("2044") ? true : (stryCov_9fa48("2044", "2045", "2046", "2047"), attemptsRef.current.count >= maxAttempts)) {
          if (stryMutAct_9fa48("2048")) {
            {}
          } else {
            stryCov_9fa48("2048");
            const waitSeconds = Math.ceil(stryMutAct_9fa48("2049") ? (windowMs - (now - attemptsRef.current.firstAttempt)) * 1000 : (stryCov_9fa48("2049"), (stryMutAct_9fa48("2050") ? windowMs + (now - attemptsRef.current.firstAttempt) : (stryCov_9fa48("2050"), windowMs - (stryMutAct_9fa48("2051") ? now + attemptsRef.current.firstAttempt : (stryCov_9fa48("2051"), now - attemptsRef.current.firstAttempt)))) / 1000));
            setRateLimitError(stryMutAct_9fa48("2052") ? `` : (stryCov_9fa48("2052"), `Too many attempts. Please wait ${waitSeconds}s.`));
            return;
          }
        }
        stryMutAct_9fa48("2053") ? attemptsRef.current.count-- : (stryCov_9fa48("2053"), attemptsRef.current.count++);
        onSubmit(e);
      }
    };
    const handleFormSubmit = (e: React.FormEvent) => {
      if (stryMutAct_9fa48("2054")) {
        {}
      } else {
        stryCov_9fa48("2054");
        e.preventDefault();
        if (stryMutAct_9fa48("2057") ? false : stryMutAct_9fa48("2056") ? true : stryMutAct_9fa48("2055") ? email.trim() : (stryCov_9fa48("2055", "2056", "2057"), !(stryMutAct_9fa48("2058") ? email : (stryCov_9fa48("2058"), email.trim())))) {
          if (stryMutAct_9fa48("2059")) {
            {}
          } else {
            stryCov_9fa48("2059");
            setValidationErrors(stryMutAct_9fa48("2060") ? {} : (stryCov_9fa48("2060"), {
              email: stryMutAct_9fa48("2061") ? "" : (stryCov_9fa48("2061"), 'Email is required')
            }));
            return;
          }
        }
        if (stryMutAct_9fa48("2064") ? false : stryMutAct_9fa48("2063") ? true : stryMutAct_9fa48("2062") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : (stryCov_9fa48("2062", "2063", "2064"), !(stryMutAct_9fa48("2075") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("2074") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("2073") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("2072") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("2071") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2070") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("2069") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2068") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2067") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2066") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("2065") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("2065", "2066", "2067", "2068", "2069", "2070", "2071", "2072", "2073", "2074", "2075"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(email))) {
          if (stryMutAct_9fa48("2076")) {
            {}
          } else {
            stryCov_9fa48("2076");
            setValidationErrors(stryMutAct_9fa48("2077") ? {} : (stryCov_9fa48("2077"), {
              email: stryMutAct_9fa48("2078") ? "" : (stryCov_9fa48("2078"), 'Please enter a valid email')
            }));
            return;
          }
        }
        if (stryMutAct_9fa48("2081") ? authMode === 'reset' : stryMutAct_9fa48("2080") ? false : stryMutAct_9fa48("2079") ? true : (stryCov_9fa48("2079", "2080", "2081"), authMode !== (stryMutAct_9fa48("2082") ? "" : (stryCov_9fa48("2082"), 'reset')))) {
          if (stryMutAct_9fa48("2083")) {
            {}
          } else {
            stryCov_9fa48("2083");
            if (stryMutAct_9fa48("2086") ? false : stryMutAct_9fa48("2085") ? true : stryMutAct_9fa48("2084") ? password : (stryCov_9fa48("2084", "2085", "2086"), !password)) {
              if (stryMutAct_9fa48("2087")) {
                {}
              } else {
                stryCov_9fa48("2087");
                setValidationErrors(stryMutAct_9fa48("2088") ? {} : (stryCov_9fa48("2088"), {
                  password: stryMutAct_9fa48("2089") ? "" : (stryCov_9fa48("2089"), 'Password is required')
                }));
                return;
              }
            }
            if (stryMutAct_9fa48("2092") ? authMode === 'signup' || password.length < 8 : stryMutAct_9fa48("2091") ? false : stryMutAct_9fa48("2090") ? true : (stryCov_9fa48("2090", "2091", "2092"), (stryMutAct_9fa48("2094") ? authMode !== 'signup' : stryMutAct_9fa48("2093") ? true : (stryCov_9fa48("2093", "2094"), authMode === (stryMutAct_9fa48("2095") ? "" : (stryCov_9fa48("2095"), 'signup')))) && (stryMutAct_9fa48("2098") ? password.length >= 8 : stryMutAct_9fa48("2097") ? password.length <= 8 : stryMutAct_9fa48("2096") ? true : (stryCov_9fa48("2096", "2097", "2098"), password.length < 8)))) {
              if (stryMutAct_9fa48("2099")) {
                {}
              } else {
                stryCov_9fa48("2099");
                setValidationErrors(stryMutAct_9fa48("2100") ? {} : (stryCov_9fa48("2100"), {
                  password: stryMutAct_9fa48("2101") ? "" : (stryCov_9fa48("2101"), 'Password must be at least 8 characters')
                }));
                return;
              }
            }
          }
        }
        setValidationErrors({});
        handleRateLimitedSubmit(e);
      }
    };
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
            <AuthLeftPanel />

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 z-10 relative">
                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                    {/* Header */}
                    <div className="mb-10 flex flex-col items-center lg:items-start">
                        <div className="flex items-center gap-3 mb-8">
                            <AnchorLogo className="w-10 h-10 text-slate-900 dark:text-white" />
                            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">Anchor</span>
                        </div>
                        <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white transition-colors font-light">{titles[authMode]}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm transition-colors">{subtitles[authMode]}</p>
                    </div>

                    {/* Errors */}
                    {stryMutAct_9fa48("2104") ? authError || <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {authError}
                        </div> : stryMutAct_9fa48("2103") ? false : stryMutAct_9fa48("2102") ? true : (stryCov_9fa48("2102", "2103", "2104"), authError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {authError}
                        </div>)}
                    {stryMutAct_9fa48("2107") ? rateLimitError || <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl text-orange-600 dark:text-orange-400 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {rateLimitError}
                        </div> : stryMutAct_9fa48("2106") ? false : stryMutAct_9fa48("2105") ? true : (stryCov_9fa48("2105", "2106", "2107"), rateLimitError && <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl text-orange-600 dark:text-orange-400 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {rateLimitError}
                        </div>)}

                    {/* Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-5" autoComplete="off" noValidate>
                        <AuthFormFields authMode={authMode} setAuthMode={setAuthMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} mfaCode={mfaCode} setMfaCode={setMfaCode} showPassword={showPassword} setShowPassword={setShowPassword} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                        <AuthSubmitButton authMode={authMode} isAuthenticating={isAuthenticating} />
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center flex flex-col items-center gap-8">
                        {(stryMutAct_9fa48("2110") ? authMode === 'mfa' : stryMutAct_9fa48("2109") ? false : stryMutAct_9fa48("2108") ? true : (stryCov_9fa48("2108", "2109", "2110"), authMode !== (stryMutAct_9fa48("2111") ? "" : (stryCov_9fa48("2111"), 'mfa')))) ? <button onClick={stryMutAct_9fa48("2112") ? () => undefined : (stryCov_9fa48("2112"), () => setAuthMode((stryMutAct_9fa48("2115") ? authMode !== 'login' : stryMutAct_9fa48("2114") ? false : stryMutAct_9fa48("2113") ? true : (stryCov_9fa48("2113", "2114", "2115"), authMode === (stryMutAct_9fa48("2116") ? "" : (stryCov_9fa48("2116"), 'login')))) ? stryMutAct_9fa48("2117") ? "" : (stryCov_9fa48("2117"), 'signup') : stryMutAct_9fa48("2118") ? "" : (stryCov_9fa48("2118"), 'login')))} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group">
                                {(stryMutAct_9fa48("2121") ? authMode !== 'login' : stryMutAct_9fa48("2120") ? false : stryMutAct_9fa48("2119") ? true : (stryCov_9fa48("2119", "2120", "2121"), authMode === (stryMutAct_9fa48("2122") ? "" : (stryCov_9fa48("2122"), 'login')))) ? <>Don't have an account? <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign up</span></> : (stryMutAct_9fa48("2125") ? authMode !== 'signup' : stryMutAct_9fa48("2124") ? false : stryMutAct_9fa48("2123") ? true : (stryCov_9fa48("2123", "2124", "2125"), authMode === (stryMutAct_9fa48("2126") ? "" : (stryCov_9fa48("2126"), 'signup')))) ? <>Already have an account? <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign in</span></> : <>Back to <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign In</span></>}
                            </button> : <button onClick={stryMutAct_9fa48("2127") ? () => undefined : (stryCov_9fa48("2127"), () => window.location.reload())} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group">
                                Back to <span className="text-slate-900 dark:text-white group-hover:underline underline-offset-4">Sign In</span>
                            </button>}

                        <div className="mt-auto pt-8 flex flex-col items-center animate-in fade-in duration-1000 delay-500">
                            <ThemeToggle variant="minimal" theme={theme} onSetTheme={stryMutAct_9fa48("2128") ? () => undefined : (stryCov_9fa48("2128"), t => stryMutAct_9fa48("2129") ? onSetTheme(t) : (stryCov_9fa48("2129"), onSetTheme?.(t)))} />
                            <p className="mt-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-50">&copy; 2026 Anchor OS</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
  }
};
export default AuthView;