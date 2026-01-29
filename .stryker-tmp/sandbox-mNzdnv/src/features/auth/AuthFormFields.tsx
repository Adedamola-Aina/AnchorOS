/**
 * AuthFormFields - Input fields for auth forms
 * 
 * Handles email, password, and MFA code inputs.
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
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
type AuthMode = 'login' | 'signup' | 'mfa' | 'reset';
interface AuthFormFieldsProps {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  mfaCode: string;
  setMfaCode: (code: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  validationErrors: {
    email?: string;
    password?: string;
  };
  setValidationErrors: (errors: {
    email?: string;
    password?: string;
  }) => void;
}
export function AuthFormFields({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  mfaCode,
  setMfaCode,
  showPassword,
  setShowPassword,
  validationErrors,
  setValidationErrors
}: AuthFormFieldsProps) {
  if (stryMutAct_9fa48("1931")) {
    {}
  } else {
    stryCov_9fa48("1931");
    if (stryMutAct_9fa48("1934") ? authMode !== 'mfa' : stryMutAct_9fa48("1933") ? false : stryMutAct_9fa48("1932") ? true : (stryCov_9fa48("1932", "1933", "1934"), authMode === (stryMutAct_9fa48("1935") ? "" : (stryCov_9fa48("1935"), 'mfa')))) {
      if (stryMutAct_9fa48("1936")) {
        {}
      } else {
        stryCov_9fa48("1936");
        return <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center block">
                    Verification Code
                </label>
                {/* Hidden fields to confuse autofill */}
                <input type="text" name="fakeusernameremembered" style={stryMutAct_9fa48("1937") ? {} : (stryCov_9fa48("1937"), {
            display: stryMutAct_9fa48("1938") ? "" : (stryCov_9fa48("1938"), 'none')
          })} />
                <input type="password" name="fakepasswordremembered" style={stryMutAct_9fa48("1939") ? {} : (stryCov_9fa48("1939"), {
            display: stryMutAct_9fa48("1940") ? "" : (stryCov_9fa48("1940"), 'none')
          })} />
                <div className="relative group w-full max-w-[280px] mx-auto px-4 sm:px-0">
                    <Lock className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <input type="text" id="mfa-code-input" name="otp-code" inputMode="numeric" pattern="[0-9]*" autoFocus autoComplete="one-time-code" autoCorrect="off" autoCapitalize="off" spellCheck={stryMutAct_9fa48("1941") ? true : (stryCov_9fa48("1941"), false)} data-form-type="other" data-lpignore="true" data-1p-ignore="true" placeholder="000000" maxLength={6} value={mfaCode} onChange={e => {
              if (stryMutAct_9fa48("1942")) {
                {}
              } else {
                stryCov_9fa48("1942");
                // Only allow numeric input
                const value = e.target.value.replace(stryMutAct_9fa48("1943") ? /[0-9]/g : (stryCov_9fa48("1943"), /[^0-9]/g), stryMutAct_9fa48("1944") ? "Stryker was here!" : (stryCov_9fa48("1944"), ''));
                setMfaCode(value);
              }
            }} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 dark:focus:border-blue-700 transition-all font-mono font-bold text-2xl tracking-[0.3em] text-center" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Open Authenticator App</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Enter the 6-digit code from Google Authenticator or your preferred app.</p>
                </div>
            </div>;
      }
    }
    return <>
            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className={stryMutAct_9fa48("1945") ? `` : (stryCov_9fa48("1945"), `absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.email ? stryMutAct_9fa48("1946") ? "" : (stryCov_9fa48("1946"), 'text-red-400') : stryMutAct_9fa48("1947") ? "" : (stryCov_9fa48("1947"), 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300')}`)} />
                    <input type="email" name="anchor_email" value={email} onChange={e => {
            if (stryMutAct_9fa48("1948")) {
              {}
            } else {
              stryCov_9fa48("1948");
              setEmail(e.target.value);
              if (stryMutAct_9fa48("1950") ? false : stryMutAct_9fa48("1949") ? true : (stryCov_9fa48("1949", "1950"), validationErrors.email)) setValidationErrors(stryMutAct_9fa48("1951") ? {} : (stryCov_9fa48("1951"), {
                ...validationErrors,
                email: undefined
              }));
            }
          }} placeholder="you@example.com" autoComplete="off" className={stryMutAct_9fa48("1952") ? `` : (stryCov_9fa48("1952"), `w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.email ? stryMutAct_9fa48("1953") ? "" : (stryCov_9fa48("1953"), 'border-red-400 focus:ring-red-500/10 focus:border-red-400') : stryMutAct_9fa48("1954") ? "" : (stryCov_9fa48("1954"), 'border-slate-200 dark:border-slate-800 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-700')}`)} />
                </div>
                {stryMutAct_9fa48("1957") ? validationErrors.email || <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.email}</p> : stryMutAct_9fa48("1956") ? false : stryMutAct_9fa48("1955") ? true : (stryCov_9fa48("1955", "1956", "1957"), validationErrors.email && <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.email}</p>)}
            </div>

            {/* Password Field */}
            {stryMutAct_9fa48("1960") ? authMode !== 'reset' || <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        {authMode === 'login' && <button type="button" onClick={() => setAuthMode('reset')} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors">
                                Forgot?
                            </button>}
                    </div>
                    <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300'}`} />
                        <input type={showPassword ? 'text' : 'password'} name="anchor_password" value={password} onChange={e => {
            setPassword(e.target.value);
            if (validationErrors.password) setValidationErrors({
              ...validationErrors,
              password: undefined
            });
          }} placeholder="••••••••" autoComplete="new-password" className={`w-full pl-12 pr-14 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.password ? 'border-red-400 focus:ring-red-500/10 focus:border-red-400' : 'border-slate-200 dark:border-slate-800 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-700'}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {validationErrors.password && <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.password}</p>}
                    {authMode === 'signup' && password.length > 0 && <PasswordStrengthMeter password={password} />}
                </div> : stryMutAct_9fa48("1959") ? false : stryMutAct_9fa48("1958") ? true : (stryCov_9fa48("1958", "1959", "1960"), (stryMutAct_9fa48("1962") ? authMode === 'reset' : stryMutAct_9fa48("1961") ? true : (stryCov_9fa48("1961", "1962"), authMode !== (stryMutAct_9fa48("1963") ? "" : (stryCov_9fa48("1963"), 'reset')))) && <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        {stryMutAct_9fa48("1966") ? authMode === 'login' || <button type="button" onClick={() => setAuthMode('reset')} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors">
                                Forgot?
                            </button> : stryMutAct_9fa48("1965") ? false : stryMutAct_9fa48("1964") ? true : (stryCov_9fa48("1964", "1965", "1966"), (stryMutAct_9fa48("1968") ? authMode !== 'login' : stryMutAct_9fa48("1967") ? true : (stryCov_9fa48("1967", "1968"), authMode === (stryMutAct_9fa48("1969") ? "" : (stryCov_9fa48("1969"), 'login')))) && <button type="button" onClick={stryMutAct_9fa48("1970") ? () => undefined : (stryCov_9fa48("1970"), () => setAuthMode(stryMutAct_9fa48("1971") ? "" : (stryCov_9fa48("1971"), 'reset')))} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors">
                                Forgot?
                            </button>)}
                    </div>
                    <div className="relative group">
                        <Lock className={stryMutAct_9fa48("1972") ? `` : (stryCov_9fa48("1972"), `absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${validationErrors.password ? stryMutAct_9fa48("1973") ? "" : (stryCov_9fa48("1973"), 'text-red-400') : stryMutAct_9fa48("1974") ? "" : (stryCov_9fa48("1974"), 'text-slate-300 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300')}`)} />
                        <input type={showPassword ? stryMutAct_9fa48("1975") ? "" : (stryCov_9fa48("1975"), 'text') : stryMutAct_9fa48("1976") ? "" : (stryCov_9fa48("1976"), 'password')} name="anchor_password" value={password} onChange={e => {
            if (stryMutAct_9fa48("1977")) {
              {}
            } else {
              stryCov_9fa48("1977");
              setPassword(e.target.value);
              if (stryMutAct_9fa48("1979") ? false : stryMutAct_9fa48("1978") ? true : (stryCov_9fa48("1978", "1979"), validationErrors.password)) setValidationErrors(stryMutAct_9fa48("1980") ? {} : (stryCov_9fa48("1980"), {
                ...validationErrors,
                password: undefined
              }));
            }
          }} placeholder="••••••••" autoComplete="new-password" className={stryMutAct_9fa48("1981") ? `` : (stryCov_9fa48("1981"), `w-full pl-12 pr-14 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all font-medium ${validationErrors.password ? stryMutAct_9fa48("1982") ? "" : (stryCov_9fa48("1982"), 'border-red-400 focus:ring-red-500/10 focus:border-red-400') : stryMutAct_9fa48("1983") ? "" : (stryCov_9fa48("1983"), 'border-slate-200 dark:border-slate-800 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-700')}`)} />
                        <button type="button" onClick={stryMutAct_9fa48("1984") ? () => undefined : (stryCov_9fa48("1984"), () => setShowPassword(stryMutAct_9fa48("1985") ? showPassword : (stryCov_9fa48("1985"), !showPassword)))} className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={showPassword ? stryMutAct_9fa48("1986") ? "" : (stryCov_9fa48("1986"), 'Hide password') : stryMutAct_9fa48("1987") ? "" : (stryCov_9fa48("1987"), 'Show password')}>
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {stryMutAct_9fa48("1990") ? validationErrors.password || <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.password}</p> : stryMutAct_9fa48("1989") ? false : stryMutAct_9fa48("1988") ? true : (stryCov_9fa48("1988", "1989", "1990"), validationErrors.password && <p className="text-xs text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1 duration-200">{validationErrors.password}</p>)}
                    {stryMutAct_9fa48("1993") ? authMode === 'signup' && password.length > 0 || <PasswordStrengthMeter password={password} /> : stryMutAct_9fa48("1992") ? false : stryMutAct_9fa48("1991") ? true : (stryCov_9fa48("1991", "1992", "1993"), (stryMutAct_9fa48("1995") ? authMode === 'signup' || password.length > 0 : stryMutAct_9fa48("1994") ? true : (stryCov_9fa48("1994", "1995"), (stryMutAct_9fa48("1997") ? authMode !== 'signup' : stryMutAct_9fa48("1996") ? true : (stryCov_9fa48("1996", "1997"), authMode === (stryMutAct_9fa48("1998") ? "" : (stryCov_9fa48("1998"), 'signup')))) && (stryMutAct_9fa48("2001") ? password.length <= 0 : stryMutAct_9fa48("2000") ? password.length >= 0 : stryMutAct_9fa48("1999") ? true : (stryCov_9fa48("1999", "2000", "2001"), password.length > 0)))) && <PasswordStrengthMeter password={password} />)}
                </div>)}
        </>;
  }
}