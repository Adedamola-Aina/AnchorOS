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
import React, { useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { NotificationContext, type ConfirmOptions, type NotificationType } from './NotificationContextDefinition';
export { NotificationContext };
interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}
import { messaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
export const NotificationProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  if (stryMutAct_9fa48("1675")) {
    {}
  } else {
    stryCov_9fa48("1675");
    const [notifications, setNotifications] = useState<Notification[]>(stryMutAct_9fa48("1676") ? ["Stryker was here"] : (stryCov_9fa48("1676"), []));
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>((stryMutAct_9fa48("1679") ? typeof Notification === 'undefined' : stryMutAct_9fa48("1678") ? false : stryMutAct_9fa48("1677") ? true : (stryCov_9fa48("1677", "1678", "1679"), typeof Notification !== (stryMutAct_9fa48("1680") ? "" : (stryCov_9fa48("1680"), 'undefined')))) ? Notification.permission : stryMutAct_9fa48("1681") ? "" : (stryCov_9fa48("1681"), 'default'));
    const [confirmDialog, setConfirmDialog] = useState<{
      options: ConfirmOptions;
      resolve: (value: boolean) => void;
    } | null>(null);
    const showToast = useCallback((message: string, type: NotificationType = stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), 'info')) => {
      if (stryMutAct_9fa48("1683")) {
        {}
      } else {
        stryCov_9fa48("1683");
        const id = stryMutAct_9fa48("1684") ? Math.random().toString(36) : (stryCov_9fa48("1684"), Math.random().toString(36).substring(2, 9));
        setNotifications(stryMutAct_9fa48("1685") ? () => undefined : (stryCov_9fa48("1685"), prev => stryMutAct_9fa48("1686") ? [] : (stryCov_9fa48("1686"), [...prev, stryMutAct_9fa48("1687") ? {} : (stryCov_9fa48("1687"), {
          id,
          message,
          type
        })])));
        setTimeout(() => {
          if (stryMutAct_9fa48("1688")) {
            {}
          } else {
            stryCov_9fa48("1688");
            setNotifications(stryMutAct_9fa48("1689") ? () => undefined : (stryCov_9fa48("1689"), prev => stryMutAct_9fa48("1690") ? prev : (stryCov_9fa48("1690"), prev.filter(stryMutAct_9fa48("1691") ? () => undefined : (stryCov_9fa48("1691"), n => stryMutAct_9fa48("1694") ? n.id === id : stryMutAct_9fa48("1693") ? false : stryMutAct_9fa48("1692") ? true : (stryCov_9fa48("1692", "1693", "1694"), n.id !== id))))));
          }
        }, 5000);
      }
    }, stryMutAct_9fa48("1695") ? ["Stryker was here"] : (stryCov_9fa48("1695"), []));
    const confirm = useCallback((options: ConfirmOptions) => {
      if (stryMutAct_9fa48("1696")) {
        {}
      } else {
        stryCov_9fa48("1696");
        return new Promise<boolean>(resolve => {
          if (stryMutAct_9fa48("1697")) {
            {}
          } else {
            stryCov_9fa48("1697");
            setConfirmDialog(stryMutAct_9fa48("1698") ? {} : (stryCov_9fa48("1698"), {
              options,
              resolve
            }));
          }
        });
      }
    }, stryMutAct_9fa48("1699") ? ["Stryker was here"] : (stryCov_9fa48("1699"), []));
    const requestPushPermission = useCallback(async () => {
      if (stryMutAct_9fa48("1700")) {
        {}
      } else {
        stryCov_9fa48("1700");
        try {
          if (stryMutAct_9fa48("1701")) {
            {}
          } else {
            stryCov_9fa48("1701");
            if (stryMutAct_9fa48("1704") ? typeof Notification !== 'undefined' : stryMutAct_9fa48("1703") ? false : stryMutAct_9fa48("1702") ? true : (stryCov_9fa48("1702", "1703", "1704"), typeof Notification === (stryMutAct_9fa48("1705") ? "" : (stryCov_9fa48("1705"), 'undefined')))) {
              if (stryMutAct_9fa48("1706")) {
                {}
              } else {
                stryCov_9fa48("1706");
                console.warn(stryMutAct_9fa48("1707") ? "" : (stryCov_9fa48("1707"), 'Notifications not supported in this environment'));
                return null;
              }
            }
            const permission = await Notification.requestPermission();
            setPushPermissionStatus(permission);
            if (stryMutAct_9fa48("1710") ? permission !== 'granted' : stryMutAct_9fa48("1709") ? false : stryMutAct_9fa48("1708") ? true : (stryCov_9fa48("1708", "1709", "1710"), permission === (stryMutAct_9fa48("1711") ? "" : (stryCov_9fa48("1711"), 'granted')))) {
              if (stryMutAct_9fa48("1712")) {
                {}
              } else {
                stryCov_9fa48("1712");
                if (stryMutAct_9fa48("1715") ? false : stryMutAct_9fa48("1714") ? true : stryMutAct_9fa48("1713") ? messaging : (stryCov_9fa48("1713", "1714", "1715"), !messaging)) {
                  if (stryMutAct_9fa48("1716")) {
                    {}
                  } else {
                    stryCov_9fa48("1716");
                    console.warn(stryMutAct_9fa48("1717") ? "" : (stryCov_9fa48("1717"), 'Firebase Messaging not initialized'));
                    return null;
                  }
                }
                // Get FCM Token
                const token = await getToken(messaging, stryMutAct_9fa48("1718") ? {} : (stryCov_9fa48("1718"), {
                  // Valid VAPID key is required for some browsers, ensuring implicit default is used if none provided
                  vapidKey: stryMutAct_9fa48("1719") ? "" : (stryCov_9fa48("1719"), 'BCV_7sZdb_M-u_S9iAAI3T9F3uT3X7X5d5X5X5X5X5X5') // Example placeholder or remove if relying on default
                })).catch(err => {
                  if (stryMutAct_9fa48("1720")) {
                    {}
                  } else {
                    stryCov_9fa48("1720");
                    console.error(stryMutAct_9fa48("1721") ? "" : (stryCov_9fa48("1721"), 'An error occurred while retrieving token. '), err);
                    return null;
                  }
                });
                if (stryMutAct_9fa48("1723") ? false : stryMutAct_9fa48("1722") ? true : (stryCov_9fa48("1722", "1723"), token)) {
                  if (stryMutAct_9fa48("1724")) {
                    {}
                  } else {
                    stryCov_9fa48("1724");
                    console.log(stryMutAct_9fa48("1725") ? "" : (stryCov_9fa48("1725"), 'FCM Token:'), token);
                    setFcmToken(token);
                    // TODO: In a real app, send this token to your backend (e.g., Firestore User Profile)
                    return token;
                  }
                }
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("1726")) {
            {}
          } else {
            stryCov_9fa48("1726");
            console.error(stryMutAct_9fa48("1727") ? "" : (stryCov_9fa48("1727"), 'Unable to get permission to notify.'), error);
          }
        }
        return null;
      }
    }, stryMutAct_9fa48("1728") ? ["Stryker was here"] : (stryCov_9fa48("1728"), []));

    // Listen for foreground messages
    React.useEffect(() => {
      if (stryMutAct_9fa48("1729")) {
        {}
      } else {
        stryCov_9fa48("1729");
        if (stryMutAct_9fa48("1732") ? false : stryMutAct_9fa48("1731") ? true : stryMutAct_9fa48("1730") ? messaging : (stryCov_9fa48("1730", "1731", "1732"), !messaging)) return;
        const unsubscribe = onMessage(messaging, payload => {
          if (stryMutAct_9fa48("1733")) {
            {}
          } else {
            stryCov_9fa48("1733");
            console.log(stryMutAct_9fa48("1734") ? "" : (stryCov_9fa48("1734"), 'Foreground message received:'), payload);
            if (stryMutAct_9fa48("1736") ? false : stryMutAct_9fa48("1735") ? true : (stryCov_9fa48("1735", "1736"), payload.notification)) {
              if (stryMutAct_9fa48("1737")) {
                {}
              } else {
                stryCov_9fa48("1737");
                showToast(stryMutAct_9fa48("1738") ? `` : (stryCov_9fa48("1738"), `${payload.notification.title}: ${payload.notification.body}`), stryMutAct_9fa48("1739") ? "" : (stryCov_9fa48("1739"), 'info'));
              }
            }
          }
        });
        return stryMutAct_9fa48("1740") ? () => undefined : (stryCov_9fa48("1740"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("1741") ? [] : (stryCov_9fa48("1741"), [showToast]));
    const handleConfirm = (value: boolean) => {
      if (stryMutAct_9fa48("1742")) {
        {}
      } else {
        stryCov_9fa48("1742");
        if (stryMutAct_9fa48("1744") ? false : stryMutAct_9fa48("1743") ? true : (stryCov_9fa48("1743", "1744"), confirmDialog)) {
          if (stryMutAct_9fa48("1745")) {
            {}
          } else {
            stryCov_9fa48("1745");
            confirmDialog.resolve(value);
            setConfirmDialog(null);
          }
        }
      }
    };
    return <NotificationContext.Provider value={stryMutAct_9fa48("1746") ? {} : (stryCov_9fa48("1746"), {
      showToast,
      confirm,
      requestPushPermission,
      fcmToken,
      pushPermissionStatus
    })}>
            {children}
            {createPortal(<div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                    {notifications.map(stryMutAct_9fa48("1747") ? () => undefined : (stryCov_9fa48("1747"), n => <div key={n.id} className={stryMutAct_9fa48("1748") ? `` : (stryCov_9fa48("1748"), `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-8 duration-300 min-w-[300px] max-w-md ${(stryMutAct_9fa48("1751") ? n.type !== 'success' : stryMutAct_9fa48("1750") ? false : stryMutAct_9fa48("1749") ? true : (stryCov_9fa48("1749", "1750", "1751"), n.type === (stryMutAct_9fa48("1752") ? "" : (stryCov_9fa48("1752"), 'success')))) ? stryMutAct_9fa48("1753") ? "" : (stryCov_9fa48("1753"), 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400') : (stryMutAct_9fa48("1756") ? n.type !== 'error' : stryMutAct_9fa48("1755") ? false : stryMutAct_9fa48("1754") ? true : (stryCov_9fa48("1754", "1755", "1756"), n.type === (stryMutAct_9fa48("1757") ? "" : (stryCov_9fa48("1757"), 'error')))) ? stryMutAct_9fa48("1758") ? "" : (stryCov_9fa48("1758"), 'bg-rose-50 dark:bg-rose-800/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-400') : stryMutAct_9fa48("1759") ? "" : (stryCov_9fa48("1759"), 'bg-slate-800 text-white border-slate-700')}`)}>
                            {stryMutAct_9fa48("1762") ? n.type === 'success' || <CheckCircle2 className="w-5 h-5 shrink-0" /> : stryMutAct_9fa48("1761") ? false : stryMutAct_9fa48("1760") ? true : (stryCov_9fa48("1760", "1761", "1762"), (stryMutAct_9fa48("1764") ? n.type !== 'success' : stryMutAct_9fa48("1763") ? true : (stryCov_9fa48("1763", "1764"), n.type === (stryMutAct_9fa48("1765") ? "" : (stryCov_9fa48("1765"), 'success')))) && <CheckCircle2 className="w-5 h-5 shrink-0" />)}
                            {stryMutAct_9fa48("1768") ? n.type === 'error' || <AlertCircle className="w-5 h-5 shrink-0" /> : stryMutAct_9fa48("1767") ? false : stryMutAct_9fa48("1766") ? true : (stryCov_9fa48("1766", "1767", "1768"), (stryMutAct_9fa48("1770") ? n.type !== 'error' : stryMutAct_9fa48("1769") ? true : (stryCov_9fa48("1769", "1770"), n.type === (stryMutAct_9fa48("1771") ? "" : (stryCov_9fa48("1771"), 'error')))) && <AlertCircle className="w-5 h-5 shrink-0" />)}
                            {stryMutAct_9fa48("1774") ? n.type === 'info' || <Info className="w-5 h-5 shrink-0" /> : stryMutAct_9fa48("1773") ? false : stryMutAct_9fa48("1772") ? true : (stryCov_9fa48("1772", "1773", "1774"), (stryMutAct_9fa48("1776") ? n.type !== 'info' : stryMutAct_9fa48("1775") ? true : (stryCov_9fa48("1775", "1776"), n.type === (stryMutAct_9fa48("1777") ? "" : (stryCov_9fa48("1777"), 'info')))) && <Info className="w-5 h-5 shrink-0" />)}
                            <p className="text-sm font-medium pr-4">{n.message}</p>
                            <button onClick={stryMutAct_9fa48("1778") ? () => undefined : (stryCov_9fa48("1778"), () => setNotifications(stryMutAct_9fa48("1779") ? () => undefined : (stryCov_9fa48("1779"), prev => stryMutAct_9fa48("1780") ? prev : (stryCov_9fa48("1780"), prev.filter(stryMutAct_9fa48("1781") ? () => undefined : (stryCov_9fa48("1781"), item => stryMutAct_9fa48("1784") ? item.id === n.id : stryMutAct_9fa48("1783") ? false : stryMutAct_9fa48("1782") ? true : (stryCov_9fa48("1782", "1783", "1784"), item.id !== n.id)))))))} className="ml-auto p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>))}
                </div>, document.body)}

            {stryMutAct_9fa48("1787") ? confirmDialog || createPortal(<div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">{confirmDialog.options.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 whitespace-pre-wrap">{confirmDialog.options.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => handleConfirm(false)} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                {confirmDialog.options.cancelText || 'Cancel'}
                            </button>
                            <button onClick={() => handleConfirm(true)} className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${confirmDialog.options.type === 'danger' ? 'bg-rose-600 shadow-rose-600/20' : 'bg-slate-900 dark:bg-slate-700 shadow-slate-900/20'}`}>
                                {confirmDialog.options.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>, document.body) : stryMutAct_9fa48("1786") ? false : stryMutAct_9fa48("1785") ? true : (stryCov_9fa48("1785", "1786", "1787"), confirmDialog && createPortal(<div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">{confirmDialog.options.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 whitespace-pre-wrap">{confirmDialog.options.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={stryMutAct_9fa48("1788") ? () => undefined : (stryCov_9fa48("1788"), () => handleConfirm(stryMutAct_9fa48("1789") ? true : (stryCov_9fa48("1789"), false)))} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                {stryMutAct_9fa48("1792") ? confirmDialog.options.cancelText && 'Cancel' : stryMutAct_9fa48("1791") ? false : stryMutAct_9fa48("1790") ? true : (stryCov_9fa48("1790", "1791", "1792"), confirmDialog.options.cancelText || (stryMutAct_9fa48("1793") ? "" : (stryCov_9fa48("1793"), 'Cancel')))}
                            </button>
                            <button onClick={stryMutAct_9fa48("1794") ? () => undefined : (stryCov_9fa48("1794"), () => handleConfirm(stryMutAct_9fa48("1795") ? false : (stryCov_9fa48("1795"), true)))} className={stryMutAct_9fa48("1796") ? `` : (stryCov_9fa48("1796"), `px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${(stryMutAct_9fa48("1799") ? confirmDialog.options.type !== 'danger' : stryMutAct_9fa48("1798") ? false : stryMutAct_9fa48("1797") ? true : (stryCov_9fa48("1797", "1798", "1799"), confirmDialog.options.type === (stryMutAct_9fa48("1800") ? "" : (stryCov_9fa48("1800"), 'danger')))) ? stryMutAct_9fa48("1801") ? "" : (stryCov_9fa48("1801"), 'bg-rose-600 shadow-rose-600/20') : stryMutAct_9fa48("1802") ? "" : (stryCov_9fa48("1802"), 'bg-slate-900 dark:bg-slate-700 shadow-slate-900/20')}`)}>
                                {stryMutAct_9fa48("1805") ? confirmDialog.options.confirmText && 'Confirm' : stryMutAct_9fa48("1804") ? false : stryMutAct_9fa48("1803") ? true : (stryCov_9fa48("1803", "1804", "1805"), confirmDialog.options.confirmText || (stryMutAct_9fa48("1806") ? "" : (stryCov_9fa48("1806"), 'Confirm')))}
                            </button>
                        </div>
                    </div>
                </div>, document.body))}
        </NotificationContext.Provider>;
  }
};
export const useNotifications = () => {
  if (stryMutAct_9fa48("1807")) {
    {}
  } else {
    stryCov_9fa48("1807");
    const context = useContext(NotificationContext);
    if (stryMutAct_9fa48("1810") ? false : stryMutAct_9fa48("1809") ? true : stryMutAct_9fa48("1808") ? context : (stryCov_9fa48("1808", "1809", "1810"), !context)) throw new Error(stryMutAct_9fa48("1811") ? "" : (stryCov_9fa48("1811"), 'useNotifications must be used within a NotificationProvider'));
    return context;
  }
};