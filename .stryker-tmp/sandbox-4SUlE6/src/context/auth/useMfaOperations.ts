/**
 * MFA (Multi-Factor Authentication) Hook
 * Extracted from AuthContext.tsx per CLAUDE.md §3.2
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
import { useRef, useCallback } from 'react';
import { multiFactor, type User, type MultiFactorResolver, type TotpSecret } from 'firebase/auth';
interface PendingMfaSecret extends TotpSecret {
  codeInterval?: number;
}
interface SerializedMfaSecret {
  secretKey: string;
  hashingAlgorithm: string;
  codeLength: number;
  codeInterval: number;
  timestamp: number;
}
export function useMfaOperations(user: User | null, updateProfile: (updates: {
  mfaEnabled: boolean;
}) => Promise<void>) {
  if (stryMutAct_9fa48("1839")) {
    {}
  } else {
    stryCov_9fa48("1839");
    const pendingMfaSecretRef = useRef<PendingMfaSecret | null>(null);
    const verifyMfa = useCallback(async (resolver: MultiFactorResolver, code: string) => {
      if (stryMutAct_9fa48("1840")) {
        {}
      } else {
        stryCov_9fa48("1840");
        const {
          TotpMultiFactorGenerator
        } = await import(stryMutAct_9fa48("1841") ? "" : (stryCov_9fa48("1841"), 'firebase/auth'));
        const assertion = TotpMultiFactorGenerator.assertionForSignIn(resolver.hints[0].uid, code);
        await resolver.resolveSignIn(assertion);
      }
    }, stryMutAct_9fa48("1842") ? ["Stryker was here"] : (stryCov_9fa48("1842"), []));
    const generateMfaSecret = useCallback(async () => {
      if (stryMutAct_9fa48("1843")) {
        {}
      } else {
        stryCov_9fa48("1843");
        if (stryMutAct_9fa48("1846") ? false : stryMutAct_9fa48("1845") ? true : stryMutAct_9fa48("1844") ? user : (stryCov_9fa48("1844", "1845", "1846"), !user)) throw new Error(stryMutAct_9fa48("1847") ? "" : (stryCov_9fa48("1847"), 'Not logged in'));
        const {
          TotpMultiFactorGenerator
        } = await import(stryMutAct_9fa48("1848") ? "" : (stryCov_9fa48("1848"), 'firebase/auth'));
        const session = await multiFactor(user).getSession();
        const result = await TotpMultiFactorGenerator.generateSecret(session);
        pendingMfaSecretRef.current = result;
        try {
          if (stryMutAct_9fa48("1849")) {
            {}
          } else {
            stryCov_9fa48("1849");
            sessionStorage.setItem(stryMutAct_9fa48("1850") ? "" : (stryCov_9fa48("1850"), 'anchor_mfa_pending'), JSON.stringify(stryMutAct_9fa48("1851") ? {} : (stryCov_9fa48("1851"), {
              secretKey: result.secretKey,
              hashingAlgorithm: result.hashingAlgorithm,
              codeLength: result.codeLength,
              codeInterval: stryMutAct_9fa48("1854") ? (result as PendingMfaSecret).codeInterval && 30 : stryMutAct_9fa48("1853") ? false : stryMutAct_9fa48("1852") ? true : (stryCov_9fa48("1852", "1853", "1854"), (result as PendingMfaSecret).codeInterval || 30),
              timestamp: Date.now()
            })));
          }
        } catch (e) {
          if (stryMutAct_9fa48("1855")) {
            {}
          } else {
            stryCov_9fa48("1855");
            console.warn(stryMutAct_9fa48("1856") ? "" : (stryCov_9fa48("1856"), 'Failed to save MFA secret to storage'), e);
          }
        }
        return stryMutAct_9fa48("1857") ? {} : (stryCov_9fa48("1857"), {
          qrCodeUrl: result.generateQrCodeUrl(stryMutAct_9fa48("1858") ? "" : (stryCov_9fa48("1858"), 'Anchor OS'), stryMutAct_9fa48("1861") ? user.email && 'user' : stryMutAct_9fa48("1860") ? false : stryMutAct_9fa48("1859") ? true : (stryCov_9fa48("1859", "1860", "1861"), user.email || (stryMutAct_9fa48("1862") ? "" : (stryCov_9fa48("1862"), 'user')))),
          manualKey: result.secretKey
        });
      }
    }, stryMutAct_9fa48("1863") ? [] : (stryCov_9fa48("1863"), [user]));
    const enrollMfa = useCallback(async (code: string) => {
      if (stryMutAct_9fa48("1864")) {
        {}
      } else {
        stryCov_9fa48("1864");
        if (stryMutAct_9fa48("1867") ? false : stryMutAct_9fa48("1866") ? true : stryMutAct_9fa48("1865") ? user : (stryCov_9fa48("1865", "1866", "1867"), !user)) throw new Error(stryMutAct_9fa48("1868") ? "" : (stryCov_9fa48("1868"), 'Not logged in'));
        const mfaUser = multiFactor(user);
        if (stryMutAct_9fa48("1872") ? mfaUser.enrolledFactors.length <= 0 : stryMutAct_9fa48("1871") ? mfaUser.enrolledFactors.length >= 0 : stryMutAct_9fa48("1870") ? false : stryMutAct_9fa48("1869") ? true : (stryCov_9fa48("1869", "1870", "1871", "1872"), mfaUser.enrolledFactors.length > 0)) {
          if (stryMutAct_9fa48("1873")) {
            {}
          } else {
            stryCov_9fa48("1873");
            if (stryMutAct_9fa48("1875") ? false : stryMutAct_9fa48("1874") ? true : (stryCov_9fa48("1874", "1875"), import.meta.env.DEV)) console.debug(stryMutAct_9fa48("1876") ? "" : (stryCov_9fa48("1876"), '[useMfaOperations] MFA already enrolled'));
            await updateProfile(stryMutAct_9fa48("1877") ? {} : (stryCov_9fa48("1877"), {
              mfaEnabled: stryMutAct_9fa48("1878") ? false : (stryCov_9fa48("1878"), true)
            }));
            return;
          }
        }
        const {
          TotpMultiFactorGenerator
        } = await import(stryMutAct_9fa48("1879") ? "" : (stryCov_9fa48("1879"), 'firebase/auth'));
        if (stryMutAct_9fa48("1882") ? false : stryMutAct_9fa48("1881") ? true : stryMutAct_9fa48("1880") ? pendingMfaSecretRef.current : (stryCov_9fa48("1880", "1881", "1882"), !pendingMfaSecretRef.current)) {
          if (stryMutAct_9fa48("1883")) {
            {}
          } else {
            stryCov_9fa48("1883");
            const stored = sessionStorage.getItem(stryMutAct_9fa48("1884") ? "" : (stryCov_9fa48("1884"), 'anchor_mfa_pending'));
            if (stryMutAct_9fa48("1886") ? false : stryMutAct_9fa48("1885") ? true : (stryCov_9fa48("1885", "1886"), stored)) {
              if (stryMutAct_9fa48("1887")) {
                {}
              } else {
                stryCov_9fa48("1887");
                try {
                  if (stryMutAct_9fa48("1888")) {
                    {}
                  } else {
                    stryCov_9fa48("1888");
                    const data = JSON.parse(stored) as SerializedMfaSecret;
                    if (stryMutAct_9fa48("1892") ? Date.now() - data.timestamp >= 15 * 60 * 1000 : stryMutAct_9fa48("1891") ? Date.now() - data.timestamp <= 15 * 60 * 1000 : stryMutAct_9fa48("1890") ? false : stryMutAct_9fa48("1889") ? true : (stryCov_9fa48("1889", "1890", "1891", "1892"), (stryMutAct_9fa48("1893") ? Date.now() + data.timestamp : (stryCov_9fa48("1893"), Date.now() - data.timestamp)) < (stryMutAct_9fa48("1894") ? 15 * 60 / 1000 : (stryCov_9fa48("1894"), (stryMutAct_9fa48("1895") ? 15 / 60 : (stryCov_9fa48("1895"), 15 * 60)) * 1000)))) {
                      if (stryMutAct_9fa48("1896")) {
                        {}
                      } else {
                        stryCov_9fa48("1896");
                        pendingMfaSecretRef.current = {
                          ...data,
                          generateQrCodeUrl: () => ''
                        } as unknown as TotpSecret;
                      }
                    }
                  }
                } catch {/* Failed to restore */}
              }
            }
          }
        }
        if (stryMutAct_9fa48("1899") ? false : stryMutAct_9fa48("1898") ? true : stryMutAct_9fa48("1897") ? pendingMfaSecretRef.current : (stryCov_9fa48("1897", "1898", "1899"), !pendingMfaSecretRef.current)) {
          if (stryMutAct_9fa48("1900")) {
            {}
          } else {
            stryCov_9fa48("1900");
            throw new Error(stryMutAct_9fa48("1901") ? "" : (stryCov_9fa48("1901"), 'MFA verification expired. Please regenerate the QR code.'));
          }
        }
        const assertion = TotpMultiFactorGenerator.assertionForEnrollment(pendingMfaSecretRef.current, code);
        await multiFactor(user).enroll(assertion, stryMutAct_9fa48("1902") ? "" : (stryCov_9fa48("1902"), 'Authenticator App'));
        await updateProfile(stryMutAct_9fa48("1903") ? {} : (stryCov_9fa48("1903"), {
          mfaEnabled: stryMutAct_9fa48("1904") ? false : (stryCov_9fa48("1904"), true)
        }));
        pendingMfaSecretRef.current = null;
        sessionStorage.removeItem(stryMutAct_9fa48("1905") ? "" : (stryCov_9fa48("1905"), 'anchor_mfa_pending'));
      }
    }, stryMutAct_9fa48("1906") ? [] : (stryCov_9fa48("1906"), [user, updateProfile]));
    const unenrollMfa = useCallback(async () => {
      if (stryMutAct_9fa48("1907")) {
        {}
      } else {
        stryCov_9fa48("1907");
        if (stryMutAct_9fa48("1910") ? false : stryMutAct_9fa48("1909") ? true : stryMutAct_9fa48("1908") ? user : (stryCov_9fa48("1908", "1909", "1910"), !user)) return;
        const mfaUser = multiFactor(user);
        if (stryMutAct_9fa48("1914") ? mfaUser.enrolledFactors.length <= 0 : stryMutAct_9fa48("1913") ? mfaUser.enrolledFactors.length >= 0 : stryMutAct_9fa48("1912") ? false : stryMutAct_9fa48("1911") ? true : (stryCov_9fa48("1911", "1912", "1913", "1914"), mfaUser.enrolledFactors.length > 0)) {
          if (stryMutAct_9fa48("1915")) {
            {}
          } else {
            stryCov_9fa48("1915");
            await mfaUser.unenroll(mfaUser.enrolledFactors[0]);
          }
        }
        await updateProfile(stryMutAct_9fa48("1916") ? {} : (stryCov_9fa48("1916"), {
          mfaEnabled: stryMutAct_9fa48("1917") ? true : (stryCov_9fa48("1917"), false)
        }));
      }
    }, stryMutAct_9fa48("1918") ? [] : (stryCov_9fa48("1918"), [user, updateProfile]));
    const reauthenticate = useCallback(async (password: string) => {
      if (stryMutAct_9fa48("1919")) {
        {}
      } else {
        stryCov_9fa48("1919");
        if (stryMutAct_9fa48("1922") ? !user && !user.email : stryMutAct_9fa48("1921") ? false : stryMutAct_9fa48("1920") ? true : (stryCov_9fa48("1920", "1921", "1922"), (stryMutAct_9fa48("1923") ? user : (stryCov_9fa48("1923"), !user)) || (stryMutAct_9fa48("1924") ? user.email : (stryCov_9fa48("1924"), !user.email)))) throw new Error(stryMutAct_9fa48("1925") ? "" : (stryCov_9fa48("1925"), 'Not logged in'));
        const {
          EmailAuthProvider,
          reauthenticateWithCredential
        } = await import(stryMutAct_9fa48("1926") ? "" : (stryCov_9fa48("1926"), 'firebase/auth'));
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }
    }, stryMutAct_9fa48("1927") ? [] : (stryCov_9fa48("1927"), [user]));
    const clearPendingSecret = useCallback(() => {
      if (stryMutAct_9fa48("1928")) {
        {}
      } else {
        stryCov_9fa48("1928");
        pendingMfaSecretRef.current = null;
      }
    }, stryMutAct_9fa48("1929") ? ["Stryker was here"] : (stryCov_9fa48("1929"), []));
    return stryMutAct_9fa48("1930") ? {} : (stryCov_9fa48("1930"), {
      verifyMfa,
      generateMfaSecret,
      enrollMfa,
      unenrollMfa,
      reauthenticate,
      clearPendingSecret
    });
  }
}