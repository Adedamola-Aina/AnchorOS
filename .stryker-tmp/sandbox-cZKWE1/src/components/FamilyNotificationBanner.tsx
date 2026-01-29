/**
 * Family Mode v2 - Notification Banner
 * 
 * Displays in-app notifications for family activities like
 * new connections, shared accounts, and transaction updates.
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
import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { db, APP_ID } from '../config/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { getNotificationIcon, getNotificationBgColor, getNotificationIconColor } from './notificationStyles';
interface FamilyNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  actorUid: string;
  actorName: string;
  read: boolean;
  dismissed: boolean;
  createdAt: {
    seconds: number;
  };
  accountId?: string;
  accountName?: string;
}
interface FamilyNotificationBannerProps {
  onNavigate?: (path: string) => void;
}
export function FamilyNotificationBanner({
  onNavigate
}: FamilyNotificationBannerProps) {
  if (stryMutAct_9fa48("247")) {
    {}
  } else {
    stryCov_9fa48("247");
    const {
      user
    } = useAuth();
    const [notifications, setNotifications] = useState<FamilyNotification[]>(stryMutAct_9fa48("248") ? ["Stryker was here"] : (stryCov_9fa48("248"), []));
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
      if (stryMutAct_9fa48("249")) {
        {}
      } else {
        stryCov_9fa48("249");
        if (stryMutAct_9fa48("252") ? false : stryMutAct_9fa48("251") ? true : stryMutAct_9fa48("250") ? user : (stryCov_9fa48("250", "251", "252"), !user)) return;
        const notificationsRef = collection(db, stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), 'artifacts'), APP_ID, stryMutAct_9fa48("254") ? "" : (stryCov_9fa48("254"), 'users'), user.uid, stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), 'notifications'));
        const q = query(notificationsRef, where(stryMutAct_9fa48("256") ? "" : (stryCov_9fa48("256"), 'dismissed'), stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), '=='), stryMutAct_9fa48("258") ? true : (stryCov_9fa48("258"), false)), where(stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), 'read'), stryMutAct_9fa48("260") ? "" : (stryCov_9fa48("260"), '=='), stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261"), false)), orderBy(stryMutAct_9fa48("262") ? "" : (stryCov_9fa48("262"), 'createdAt'), stryMutAct_9fa48("263") ? "" : (stryCov_9fa48("263"), 'desc')), limit(5));
        const unsubscribe = onSnapshot(q, snapshot => {
          if (stryMutAct_9fa48("264")) {
            {}
          } else {
            stryCov_9fa48("264");
            const notifs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as FamilyNotification[];
            setNotifications(notifs);
          }
        });
        return stryMutAct_9fa48("265") ? () => undefined : (stryCov_9fa48("265"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("266") ? [] : (stryCov_9fa48("266"), [user]));
    const handleDismiss = async (notificationId: string) => {
      if (stryMutAct_9fa48("267")) {
        {}
      } else {
        stryCov_9fa48("267");
        if (stryMutAct_9fa48("270") ? false : stryMutAct_9fa48("269") ? true : stryMutAct_9fa48("268") ? user : (stryCov_9fa48("268", "269", "270"), !user)) return;
        const notifRef = doc(db, stryMutAct_9fa48("271") ? "" : (stryCov_9fa48("271"), 'artifacts'), APP_ID, stryMutAct_9fa48("272") ? "" : (stryCov_9fa48("272"), 'users'), user.uid, stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'notifications'), notificationId);
        await updateDoc(notifRef, stryMutAct_9fa48("274") ? {} : (stryCov_9fa48("274"), {
          dismissed: stryMutAct_9fa48("275") ? false : (stryCov_9fa48("275"), true)
        }));

        // Move to next notification or remove
        if (stryMutAct_9fa48("279") ? currentIndex < notifications.length - 1 : stryMutAct_9fa48("278") ? currentIndex > notifications.length - 1 : stryMutAct_9fa48("277") ? false : stryMutAct_9fa48("276") ? true : (stryCov_9fa48("276", "277", "278", "279"), currentIndex >= (stryMutAct_9fa48("280") ? notifications.length + 1 : (stryCov_9fa48("280"), notifications.length - 1)))) {
          if (stryMutAct_9fa48("281")) {
            {}
          } else {
            stryCov_9fa48("281");
            setCurrentIndex(stryMutAct_9fa48("282") ? Math.min(0, notifications.length - 2) : (stryCov_9fa48("282"), Math.max(0, stryMutAct_9fa48("283") ? notifications.length + 2 : (stryCov_9fa48("283"), notifications.length - 2))));
          }
        }
      }
    };
    const handleMarkRead = async (notificationId: string) => {
      if (stryMutAct_9fa48("284")) {
        {}
      } else {
        stryCov_9fa48("284");
        if (stryMutAct_9fa48("287") ? false : stryMutAct_9fa48("286") ? true : stryMutAct_9fa48("285") ? user : (stryCov_9fa48("285", "286", "287"), !user)) return;
        const notifRef = doc(db, stryMutAct_9fa48("288") ? "" : (stryCov_9fa48("288"), 'artifacts'), APP_ID, stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), 'users'), user.uid, stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), 'notifications'), notificationId);
        await updateDoc(notifRef, stryMutAct_9fa48("291") ? {} : (stryCov_9fa48("291"), {
          read: stryMutAct_9fa48("292") ? false : (stryCov_9fa48("292"), true)
        }));
      }
    };
    const handleAction = (notification: FamilyNotification) => {
      if (stryMutAct_9fa48("293")) {
        {}
      } else {
        stryCov_9fa48("293");
        handleMarkRead(notification.id);

        // Navigate based on notification type
        if (stryMutAct_9fa48("296") ? notification.type.includes('account') && notification.type.includes('transaction') : stryMutAct_9fa48("295") ? false : stryMutAct_9fa48("294") ? true : (stryCov_9fa48("294", "295", "296"), notification.type.includes(stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), 'account')) || notification.type.includes(stryMutAct_9fa48("298") ? "" : (stryCov_9fa48("298"), 'transaction')))) {
          if (stryMutAct_9fa48("299")) {
            {}
          } else {
            stryCov_9fa48("299");
            stryMutAct_9fa48("300") ? onNavigate('finance') : (stryCov_9fa48("300"), onNavigate?.(stryMutAct_9fa48("301") ? "" : (stryCov_9fa48("301"), 'finance')));
          }
        } else if (stryMutAct_9fa48("304") ? notification.type === 'family_connected' && notification.type === 'invitation_accepted' : stryMutAct_9fa48("303") ? false : stryMutAct_9fa48("302") ? true : (stryCov_9fa48("302", "303", "304"), (stryMutAct_9fa48("306") ? notification.type !== 'family_connected' : stryMutAct_9fa48("305") ? false : (stryCov_9fa48("305", "306"), notification.type === (stryMutAct_9fa48("307") ? "" : (stryCov_9fa48("307"), 'family_connected')))) || (stryMutAct_9fa48("309") ? notification.type !== 'invitation_accepted' : stryMutAct_9fa48("308") ? false : (stryCov_9fa48("308", "309"), notification.type === (stryMutAct_9fa48("310") ? "" : (stryCov_9fa48("310"), 'invitation_accepted')))))) {
          if (stryMutAct_9fa48("311")) {
            {}
          } else {
            stryCov_9fa48("311");
            stryMutAct_9fa48("312") ? onNavigate('settings') : (stryCov_9fa48("312"), onNavigate?.(stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'settings')));
          }
        }
      }
    };
    if (stryMutAct_9fa48("316") ? notifications.length !== 0 : stryMutAct_9fa48("315") ? false : stryMutAct_9fa48("314") ? true : (stryCov_9fa48("314", "315", "316"), notifications.length === 0)) return null;
    const notification = notifications[currentIndex];
    if (stryMutAct_9fa48("319") ? false : stryMutAct_9fa48("318") ? true : stryMutAct_9fa48("317") ? notification : (stryCov_9fa48("317", "318", "319"), !notification)) return null;
    const Icon = getNotificationIcon(notification.type);
    const bgColor = getNotificationBgColor(notification.type);
    const iconColor = getNotificationIconColor(notification.type);
    return <div className={stryMutAct_9fa48("320") ? `` : (stryCov_9fa48("320"), `mb-6 p-4 rounded-2xl border ${bgColor} animate-in slide-in-from-top-2 duration-300`)}>
            <div className="flex items-start gap-3">
                <div className={stryMutAct_9fa48("321") ? `` : (stryCov_9fa48("321"), `p-2 rounded-xl shrink-0 ${iconColor}`)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {notification.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <button onClick={stryMutAct_9fa48("322") ? () => undefined : (stryCov_9fa48("322"), () => handleAction(notification))} className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                            View <ArrowRight className="w-3 h-3" />
                        </button>
                        {stryMutAct_9fa48("325") ? notifications.length > 1 || <span className="text-xs text-slate-400">
                                {currentIndex + 1} of {notifications.length}
                            </span> : stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : (stryCov_9fa48("323", "324", "325"), (stryMutAct_9fa48("328") ? notifications.length <= 1 : stryMutAct_9fa48("327") ? notifications.length >= 1 : stryMutAct_9fa48("326") ? true : (stryCov_9fa48("326", "327", "328"), notifications.length > 1)) && <span className="text-xs text-slate-400">
                                {stryMutAct_9fa48("329") ? currentIndex - 1 : (stryCov_9fa48("329"), currentIndex + 1)} of {notifications.length}
                            </span>)}
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {stryMutAct_9fa48("332") ? notifications.length > 1 || <>
                            <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                                ←
                            </button>
                            <button onClick={() => setCurrentIndex(Math.min(notifications.length - 1, currentIndex + 1))} disabled={currentIndex === notifications.length - 1} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                                →
                            </button>
                        </> : stryMutAct_9fa48("331") ? false : stryMutAct_9fa48("330") ? true : (stryCov_9fa48("330", "331", "332"), (stryMutAct_9fa48("335") ? notifications.length <= 1 : stryMutAct_9fa48("334") ? notifications.length >= 1 : stryMutAct_9fa48("333") ? true : (stryCov_9fa48("333", "334", "335"), notifications.length > 1)) && <>
                            <button onClick={stryMutAct_9fa48("336") ? () => undefined : (stryCov_9fa48("336"), () => setCurrentIndex(stryMutAct_9fa48("337") ? Math.min(0, currentIndex - 1) : (stryCov_9fa48("337"), Math.max(0, stryMutAct_9fa48("338") ? currentIndex + 1 : (stryCov_9fa48("338"), currentIndex - 1)))))} disabled={stryMutAct_9fa48("341") ? currentIndex !== 0 : stryMutAct_9fa48("340") ? false : stryMutAct_9fa48("339") ? true : (stryCov_9fa48("339", "340", "341"), currentIndex === 0)} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                                ←
                            </button>
                            <button onClick={stryMutAct_9fa48("342") ? () => undefined : (stryCov_9fa48("342"), () => setCurrentIndex(stryMutAct_9fa48("343") ? Math.max(notifications.length - 1, currentIndex + 1) : (stryCov_9fa48("343"), Math.min(stryMutAct_9fa48("344") ? notifications.length + 1 : (stryCov_9fa48("344"), notifications.length - 1), stryMutAct_9fa48("345") ? currentIndex - 1 : (stryCov_9fa48("345"), currentIndex + 1)))))} disabled={stryMutAct_9fa48("348") ? currentIndex !== notifications.length - 1 : stryMutAct_9fa48("347") ? false : stryMutAct_9fa48("346") ? true : (stryCov_9fa48("346", "347", "348"), currentIndex === (stryMutAct_9fa48("349") ? notifications.length + 1 : (stryCov_9fa48("349"), notifications.length - 1)))} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                                →
                            </button>
                        </>)}
                    <button onClick={stryMutAct_9fa48("350") ? () => undefined : (stryCov_9fa48("350"), () => handleDismiss(notification.id))} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors" title="Dismiss">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>;
  }
}