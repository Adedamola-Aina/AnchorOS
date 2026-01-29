/**
 * AuthContext - Unified authentication state management
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * MFA operations extracted to auth/useMfaOperations.ts
 * Email templates extracted to auth/emailTemplates.ts
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
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, multiFactor, type User, type MultiFactorResolver } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db, APP_ID } from '../config/firebase';
import type { UserProfile } from '../types';
import { useMfaOperations, getWelcomeEmailHtml } from './auth';
interface AuthContextType {
  user: User | null;
  profile: UserProfile;
  loading: boolean;
  profileLoaded: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  accountNotifications: string[];
  verifyMfa: (resolver: MultiFactorResolver, code: string) => Promise<void>;
  generateMfaSecret: () => Promise<{
    qrCodeUrl: string;
    manualKey: string;
  }>;
  enrollMfa: (code: string) => Promise<void>;
  unenrollMfa: () => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  if (stryMutAct_9fa48("1514")) {
    {}
  } else {
    stryCov_9fa48("1514");
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const savedTheme = (stryMutAct_9fa48("1517") ? typeof window === 'undefined' : stryMutAct_9fa48("1516") ? false : stryMutAct_9fa48("1515") ? true : (stryCov_9fa48("1515", "1516", "1517"), typeof window !== (stryMutAct_9fa48("1518") ? "" : (stryCov_9fa48("1518"), 'undefined')))) ? localStorage.getItem('anchor_theme') as 'light' | 'dark' | null : null;
    const [profile, setProfile] = useState<UserProfile>(stryMutAct_9fa48("1519") ? {} : (stryCov_9fa48("1519"), {
      name: stryMutAct_9fa48("1520") ? "" : (stryCov_9fa48("1520"), 'User'),
      theme: stryMutAct_9fa48("1523") ? savedTheme && 'light' : stryMutAct_9fa48("1522") ? false : stryMutAct_9fa48("1521") ? true : (stryCov_9fa48("1521", "1522", "1523"), savedTheme || (stryMutAct_9fa48("1524") ? "" : (stryCov_9fa48("1524"), 'light'))),
      familyMode: stryMutAct_9fa48("1525") ? true : (stryCov_9fa48("1525"), false),
      onboardingComplete: stryMutAct_9fa48("1526") ? true : (stryCov_9fa48("1526"), false)
    }));
    const [loading, setLoading] = useState(stryMutAct_9fa48("1527") ? false : (stryCov_9fa48("1527"), true));
    const [profileLoaded, setProfileLoaded] = useState(stryMutAct_9fa48("1528") ? true : (stryCov_9fa48("1528"), false));
    const [accountNotifications, setAccountNotifications] = useState<string[]>(stryMutAct_9fa48("1529") ? ["Stryker was here"] : (stryCov_9fa48("1529"), []));
    const unsubProfRef = useRef<(() => void) | null>(null);
    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
      if (stryMutAct_9fa48("1530")) {
        {}
      } else {
        stryCov_9fa48("1530");
        if (stryMutAct_9fa48("1533") ? false : stryMutAct_9fa48("1532") ? true : stryMutAct_9fa48("1531") ? user : (stryCov_9fa48("1531", "1532", "1533"), !user)) {
          if (stryMutAct_9fa48("1534")) {
            {}
          } else {
            stryCov_9fa48("1534");
            setProfile(stryMutAct_9fa48("1535") ? () => undefined : (stryCov_9fa48("1535"), prev => stryMutAct_9fa48("1536") ? {} : (stryCov_9fa48("1536"), {
              ...prev,
              ...updates
            })));
            if (stryMutAct_9fa48("1538") ? false : stryMutAct_9fa48("1537") ? true : (stryCov_9fa48("1537", "1538"), updates.theme)) localStorage.setItem(stryMutAct_9fa48("1539") ? "" : (stryCov_9fa48("1539"), 'anchor_theme'), updates.theme);
            return;
          }
        }
        await updateDoc(doc(db, stryMutAct_9fa48("1540") ? "" : (stryCov_9fa48("1540"), 'artifacts'), APP_ID, stryMutAct_9fa48("1541") ? "" : (stryCov_9fa48("1541"), 'users'), user.uid), updates);
      }
    }, stryMutAct_9fa48("1542") ? [] : (stryCov_9fa48("1542"), [user]));

    // Use extracted MFA hook
    const mfaOps = useMfaOperations(user, updateProfile);
    useEffect(() => {
      if (stryMutAct_9fa48("1543")) {
        {}
      } else {
        stryCov_9fa48("1543");
        const unsubAuth = onAuthStateChanged(auth, async u => {
          if (stryMutAct_9fa48("1544")) {
            {}
          } else {
            stryCov_9fa48("1544");
            if (stryMutAct_9fa48("1546") ? false : stryMutAct_9fa48("1545") ? true : (stryCov_9fa48("1545", "1546"), unsubProfRef.current)) {
              if (stryMutAct_9fa48("1547")) {
                {}
              } else {
                stryCov_9fa48("1547");
                unsubProfRef.current();
                unsubProfRef.current = null;
              }
            }
            if (stryMutAct_9fa48("1549") ? false : stryMutAct_9fa48("1548") ? true : (stryCov_9fa48("1548", "1549"), u)) {
              if (stryMutAct_9fa48("1550")) {
                {}
              } else {
                stryCov_9fa48("1550");
                sessionStorage.setItem(stryMutAct_9fa48("1551") ? "" : (stryCov_9fa48("1551"), 'anchor_session_active'), stryMutAct_9fa48("1552") ? "" : (stryCov_9fa48("1552"), 'true'));
              }
            } else {
              if (stryMutAct_9fa48("1553")) {
                {}
              } else {
                stryCov_9fa48("1553");
                const wasActive = stryMutAct_9fa48("1556") ? sessionStorage.getItem('anchor_session_active') !== 'true' : stryMutAct_9fa48("1555") ? false : stryMutAct_9fa48("1554") ? true : (stryCov_9fa48("1554", "1555", "1556"), sessionStorage.getItem(stryMutAct_9fa48("1557") ? "" : (stryCov_9fa48("1557"), 'anchor_session_active')) === (stryMutAct_9fa48("1558") ? "" : (stryCov_9fa48("1558"), 'true')));
                if (stryMutAct_9fa48("1560") ? false : stryMutAct_9fa48("1559") ? true : (stryCov_9fa48("1559", "1560"), wasActive)) {
                  if (stryMutAct_9fa48("1561")) {
                    {}
                  } else {
                    stryCov_9fa48("1561");
                    sessionStorage.removeItem(stryMutAct_9fa48("1562") ? "" : (stryCov_9fa48("1562"), 'anchor_session_active'));
                    window.dispatchEvent(new CustomEvent(stryMutAct_9fa48("1563") ? "" : (stryCov_9fa48("1563"), 'anchor:session_expired')));
                  }
                }
              }
            }
            setUser(u);
            if (stryMutAct_9fa48("1566") ? false : stryMutAct_9fa48("1565") ? true : stryMutAct_9fa48("1564") ? u : (stryCov_9fa48("1564", "1565", "1566"), !u)) {
              if (stryMutAct_9fa48("1567")) {
                {}
              } else {
                stryCov_9fa48("1567");
                setLoading(stryMutAct_9fa48("1568") ? true : (stryCov_9fa48("1568"), false));
                setProfileLoaded(stryMutAct_9fa48("1569") ? true : (stryCov_9fa48("1569"), false));
                mfaOps.clearPendingSecret();
                return;
              }
            }
            const profRef = doc(db, stryMutAct_9fa48("1570") ? "" : (stryCov_9fa48("1570"), 'artifacts'), APP_ID, stryMutAct_9fa48("1571") ? "" : (stryCov_9fa48("1571"), 'users'), u.uid);
            unsubProfRef.current = onSnapshot(profRef, async snap => {
              if (stryMutAct_9fa48("1572")) {
                {}
              } else {
                stryCov_9fa48("1572");
                if (stryMutAct_9fa48("1574") ? false : stryMutAct_9fa48("1573") ? true : (stryCov_9fa48("1573", "1574"), snap.exists())) {
                  if (stryMutAct_9fa48("1575")) {
                    {}
                  } else {
                    stryCov_9fa48("1575");
                    const data = snap.data() as UserProfile;
                    const actualMfaEnrolled = stryMutAct_9fa48("1579") ? multiFactor(u).enrolledFactors.length <= 0 : stryMutAct_9fa48("1578") ? multiFactor(u).enrolledFactors.length >= 0 : stryMutAct_9fa48("1577") ? false : stryMutAct_9fa48("1576") ? true : (stryCov_9fa48("1576", "1577", "1578", "1579"), multiFactor(u).enrolledFactors.length > 0);
                    if (stryMutAct_9fa48("1582") ? actualMfaEnrolled || !data.mfaEnabled : stryMutAct_9fa48("1581") ? false : stryMutAct_9fa48("1580") ? true : (stryCov_9fa48("1580", "1581", "1582"), actualMfaEnrolled && (stryMutAct_9fa48("1583") ? data.mfaEnabled : (stryCov_9fa48("1583"), !data.mfaEnabled)))) {
                      if (stryMutAct_9fa48("1584")) {
                        {}
                      } else {
                        stryCov_9fa48("1584");
                        await updateDoc(profRef, stryMutAct_9fa48("1585") ? {} : (stryCov_9fa48("1585"), {
                          mfaEnabled: stryMutAct_9fa48("1586") ? false : (stryCov_9fa48("1586"), true)
                        }));
                        return;
                      }
                    }
                    if (stryMutAct_9fa48("1589") ? !actualMfaEnrolled || data.mfaEnabled : stryMutAct_9fa48("1588") ? false : stryMutAct_9fa48("1587") ? true : (stryCov_9fa48("1587", "1588", "1589"), (stryMutAct_9fa48("1590") ? actualMfaEnrolled : (stryCov_9fa48("1590"), !actualMfaEnrolled)) && data.mfaEnabled)) {
                      if (stryMutAct_9fa48("1591")) {
                        {}
                      } else {
                        stryCov_9fa48("1591");
                        await updateDoc(profRef, stryMutAct_9fa48("1592") ? {} : (stryCov_9fa48("1592"), {
                          mfaEnabled: stryMutAct_9fa48("1593") ? true : (stryCov_9fa48("1593"), false)
                        }));
                        return;
                      }
                    }
                    setProfile(data);
                    const alerts = stryMutAct_9fa48("1594") ? ["Stryker was here"] : (stryCov_9fa48("1594"), []);
                    if (stryMutAct_9fa48("1597") ? !u.emailVerified || import.meta.env.VITE_APP_ENV === 'production' : stryMutAct_9fa48("1596") ? false : stryMutAct_9fa48("1595") ? true : (stryCov_9fa48("1595", "1596", "1597"), (stryMutAct_9fa48("1598") ? u.emailVerified : (stryCov_9fa48("1598"), !u.emailVerified)) && (stryMutAct_9fa48("1600") ? import.meta.env.VITE_APP_ENV !== 'production' : stryMutAct_9fa48("1599") ? true : (stryCov_9fa48("1599", "1600"), import.meta.env.VITE_APP_ENV === (stryMutAct_9fa48("1601") ? "" : (stryCov_9fa48("1601"), 'production')))))) alerts.push(stryMutAct_9fa48("1602") ? "" : (stryCov_9fa48("1602"), 'verify_email'));
                    if (stryMutAct_9fa48("1605") ? false : stryMutAct_9fa48("1604") ? true : stryMutAct_9fa48("1603") ? actualMfaEnrolled : (stryCov_9fa48("1603", "1604", "1605"), !actualMfaEnrolled)) alerts.push(stryMutAct_9fa48("1606") ? "" : (stryCov_9fa48("1606"), 'enable_2fa'));
                    setAccountNotifications(alerts);
                    setProfileLoaded(stryMutAct_9fa48("1607") ? false : (stryCov_9fa48("1607"), true));
                    setLoading(stryMutAct_9fa48("1608") ? true : (stryCov_9fa48("1608"), false));
                  }
                } else {
                  if (stryMutAct_9fa48("1609")) {
                    {}
                  } else {
                    stryCov_9fa48("1609");
                    if (stryMutAct_9fa48("1611") ? false : stryMutAct_9fa48("1610") ? true : (stryCov_9fa48("1610", "1611"), snap.metadata.fromCache)) {
                      if (stryMutAct_9fa48("1612")) {
                        {}
                      } else {
                        stryCov_9fa48("1612");
                        console.warn(stryMutAct_9fa48("1613") ? "" : (stryCov_9fa48("1613"), '[AuthContext] Profile not found but data is from cache'));
                        return;
                      }
                    }
                    if (stryMutAct_9fa48("1615") ? false : stryMutAct_9fa48("1614") ? true : (stryCov_9fa48("1614", "1615"), import.meta.env.DEV)) console.debug(stryMutAct_9fa48("1616") ? "" : (stryCov_9fa48("1616"), '[AuthContext] Creating new profile'));
                    setDoc(profRef, stryMutAct_9fa48("1617") ? {} : (stryCov_9fa48("1617"), {
                      name: stryMutAct_9fa48("1620") ? u.email?.split('@')[0] && 'User' : stryMutAct_9fa48("1619") ? false : stryMutAct_9fa48("1618") ? true : (stryCov_9fa48("1618", "1619", "1620"), (stryMutAct_9fa48("1621") ? u.email.split('@')[0] : (stryCov_9fa48("1621"), u.email?.split(stryMutAct_9fa48("1622") ? "" : (stryCov_9fa48("1622"), '@'))[0])) || (stryMutAct_9fa48("1623") ? "" : (stryCov_9fa48("1623"), 'User'))),
                      theme: stryMutAct_9fa48("1624") ? "" : (stryCov_9fa48("1624"), 'light'),
                      familyMode: stryMutAct_9fa48("1625") ? true : (stryCov_9fa48("1625"), false),
                      onboardingComplete: stryMutAct_9fa48("1626") ? true : (stryCov_9fa48("1626"), false)
                    }));
                    setProfileLoaded(stryMutAct_9fa48("1627") ? false : (stryCov_9fa48("1627"), true));
                    setLoading(stryMutAct_9fa48("1628") ? true : (stryCov_9fa48("1628"), false));
                  }
                }
              }
            });
          }
        });
        return () => {
          if (stryMutAct_9fa48("1629")) {
            {}
          } else {
            stryCov_9fa48("1629");
            unsubAuth();
            if (stryMutAct_9fa48("1631") ? false : stryMutAct_9fa48("1630") ? true : (stryCov_9fa48("1630", "1631"), unsubProfRef.current)) unsubProfRef.current();
          }
        };
      }
    }, stryMutAct_9fa48("1632") ? [] : (stryCov_9fa48("1632"), [mfaOps]));
    const signIn = async (e: string, p: string) => {
      if (stryMutAct_9fa48("1633")) {
        {}
      } else {
        stryCov_9fa48("1633");
        await signInWithEmailAndPassword(auth, e, p);
      }
    };
    const signUp = async (e: string, p: string) => {
      if (stryMutAct_9fa48("1634")) {
        {}
      } else {
        stryCov_9fa48("1634");
        const cred = await createUserWithEmailAndPassword(auth, e, p);
        const name = e.split(stryMutAct_9fa48("1635") ? "" : (stryCov_9fa48("1635"), '@'))[0];
        await setDoc(doc(db, stryMutAct_9fa48("1636") ? "" : (stryCov_9fa48("1636"), 'artifacts'), APP_ID, stryMutAct_9fa48("1637") ? "" : (stryCov_9fa48("1637"), 'users'), cred.user.uid), stryMutAct_9fa48("1638") ? {} : (stryCov_9fa48("1638"), {
          name,
          theme: stryMutAct_9fa48("1639") ? "" : (stryCov_9fa48("1639"), 'light'),
          familyMode: stryMutAct_9fa48("1640") ? true : (stryCov_9fa48("1640"), false),
          onboardingComplete: stryMutAct_9fa48("1641") ? true : (stryCov_9fa48("1641"), false)
        }));
        try {
          if (stryMutAct_9fa48("1642")) {
            {}
          } else {
            stryCov_9fa48("1642");
            await addDoc(collection(db, stryMutAct_9fa48("1643") ? "" : (stryCov_9fa48("1643"), 'mail')), stryMutAct_9fa48("1644") ? {} : (stryCov_9fa48("1644"), {
              to: stryMutAct_9fa48("1645") ? [] : (stryCov_9fa48("1645"), [e]),
              message: stryMutAct_9fa48("1646") ? {} : (stryCov_9fa48("1646"), {
                subject: stryMutAct_9fa48("1647") ? "" : (stryCov_9fa48("1647"), 'Welcome to Anchor OS!'),
                html: getWelcomeEmailHtml(name)
              })
            }));
          }
        } catch (err) {
          if (stryMutAct_9fa48("1648")) {
            {}
          } else {
            stryCov_9fa48("1648");
            console.error(stryMutAct_9fa48("1649") ? "" : (stryCov_9fa48("1649"), 'Failed to queue welcome email:'), err);
          }
        }
      }
    };
    const logout = async () => {
      if (stryMutAct_9fa48("1650")) {
        {}
      } else {
        stryCov_9fa48("1650");
        sessionStorage.removeItem(stryMutAct_9fa48("1651") ? "" : (stryCov_9fa48("1651"), 'anchor_session_active'));
        await signOut(auth);
        navigate(stryMutAct_9fa48("1652") ? "" : (stryCov_9fa48("1652"), '/'), stryMutAct_9fa48("1653") ? {} : (stryCov_9fa48("1653"), {
          replace: stryMutAct_9fa48("1654") ? false : (stryCov_9fa48("1654"), true)
        }));
      }
    };
    const sendVerificationEmail = async () => {
      if (stryMutAct_9fa48("1655")) {
        {}
      } else {
        stryCov_9fa48("1655");
        if (stryMutAct_9fa48("1657") ? false : stryMutAct_9fa48("1656") ? true : (stryCov_9fa48("1656", "1657"), auth.currentUser)) await sendEmailVerification(auth.currentUser);
      }
    };
    const sendPasswordReset = async (email: string) => {
      if (stryMutAct_9fa48("1658")) {
        {}
      } else {
        stryCov_9fa48("1658");
        const {
          sendPasswordResetEmail
        } = await import(stryMutAct_9fa48("1659") ? "" : (stryCov_9fa48("1659"), 'firebase/auth'));
        await sendPasswordResetEmail(auth, email);
      }
    };
    return <AuthContext.Provider value={stryMutAct_9fa48("1660") ? {} : (stryCov_9fa48("1660"), {
      user,
      profile,
      loading,
      profileLoaded,
      updateProfile,
      signIn,
      signUp,
      logout,
      sendVerificationEmail,
      accountNotifications,
      verifyMfa: mfaOps.verifyMfa,
      generateMfaSecret: mfaOps.generateMfaSecret,
      enrollMfa: mfaOps.enrollMfa,
      unenrollMfa: mfaOps.unenrollMfa,
      reauthenticate: mfaOps.reauthenticate,
      sendPasswordReset
    })}>
            {children}
        </AuthContext.Provider>;
  }
};
export const useAuth = () => {
  if (stryMutAct_9fa48("1661")) {
    {}
  } else {
    stryCov_9fa48("1661");
    const context = useContext(AuthContext);
    if (stryMutAct_9fa48("1664") ? false : stryMutAct_9fa48("1663") ? true : stryMutAct_9fa48("1662") ? context : (stryCov_9fa48("1662", "1663", "1664"), !context)) throw new Error(stryMutAct_9fa48("1665") ? "" : (stryCov_9fa48("1665"), 'useAuth must be used within AuthProvider'));
    return context;
  }
};