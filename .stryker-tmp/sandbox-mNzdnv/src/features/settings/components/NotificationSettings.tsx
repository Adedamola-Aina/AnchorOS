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
import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface NotificationSettingsProps {
  emailEnabled: boolean;
  email: string;
  frequency: 'instant' | 'daily' | 'weekly';
  userEmail: string;
  emailVerified: boolean;
  onUpdatePreferences: (prefs: any) => void;
  pushPermissionStatus: NotificationPermission;
  requestPushPermission: () => void;
}
export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  emailEnabled,
  email,
  frequency,
  userEmail,
  emailVerified,
  onUpdatePreferences,
  pushPermissionStatus,
  requestPushPermission
}) => {
  if (stryMutAct_9fa48("6008")) {
    {}
  } else {
    stryCov_9fa48("6008");
    return <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Bell className="w-5 h-5 text-primary-500" />
                    </div>
                    Notifications
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {/* Push Notifications Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Push Notifications</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Real-time alerts for transactions and commitments.
                            </p>
                            {stryMutAct_9fa48("6011") ? pushPermissionStatus === 'granted' || <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">ON</span> : stryMutAct_9fa48("6010") ? false : stryMutAct_9fa48("6009") ? true : (stryCov_9fa48("6009", "6010", "6011"), (stryMutAct_9fa48("6013") ? pushPermissionStatus !== 'granted' : stryMutAct_9fa48("6012") ? true : (stryCov_9fa48("6012", "6013"), pushPermissionStatus === (stryMutAct_9fa48("6014") ? "" : (stryCov_9fa48("6014"), 'granted')))) && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">ON</span>)}
                            {stryMutAct_9fa48("6017") ? pushPermissionStatus === 'denied' || <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">BLOCKED</span> : stryMutAct_9fa48("6016") ? false : stryMutAct_9fa48("6015") ? true : (stryCov_9fa48("6015", "6016", "6017"), (stryMutAct_9fa48("6019") ? pushPermissionStatus !== 'denied' : stryMutAct_9fa48("6018") ? true : (stryCov_9fa48("6018", "6019"), pushPermissionStatus === (stryMutAct_9fa48("6020") ? "" : (stryCov_9fa48("6020"), 'denied')))) && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">BLOCKED</span>)}
                        </div>
                    </div>
                    <button onClick={() => {
            if (stryMutAct_9fa48("6021")) {
              {}
            } else {
              stryCov_9fa48("6021");
              if (stryMutAct_9fa48("6024") ? pushPermissionStatus === 'granted' : stryMutAct_9fa48("6023") ? false : stryMutAct_9fa48("6022") ? true : (stryCov_9fa48("6022", "6023", "6024"), pushPermissionStatus !== (stryMutAct_9fa48("6025") ? "" : (stryCov_9fa48("6025"), 'granted')))) {
                if (stryMutAct_9fa48("6026")) {
                  {}
                } else {
                  stryCov_9fa48("6026");
                  requestPushPermission();
                }
              } else {
                if (stryMutAct_9fa48("6027")) {
                  {}
                } else {
                  stryCov_9fa48("6027");
                  // In a real app, this would delete the token from the backend
                  // For now we just allow re-requesting/syncing
                  requestPushPermission();
                }
              }
            }
          }} className={stryMutAct_9fa48("6028") ? `` : (stryCov_9fa48("6028"), `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${(stryMutAct_9fa48("6031") ? pushPermissionStatus !== 'granted' : stryMutAct_9fa48("6030") ? false : stryMutAct_9fa48("6029") ? true : (stryCov_9fa48("6029", "6030", "6031"), pushPermissionStatus === (stryMutAct_9fa48("6032") ? "" : (stryCov_9fa48("6032"), 'granted')))) ? stryMutAct_9fa48("6033") ? "" : (stryCov_9fa48("6033"), 'bg-primary-500') : stryMutAct_9fa48("6034") ? "" : (stryCov_9fa48("6034"), 'bg-slate-300 dark:bg-slate-700')}`)} disabled={stryMutAct_9fa48("6037") ? pushPermissionStatus !== 'denied' : stryMutAct_9fa48("6036") ? false : stryMutAct_9fa48("6035") ? true : (stryCov_9fa48("6035", "6036", "6037"), pushPermissionStatus === (stryMutAct_9fa48("6038") ? "" : (stryCov_9fa48("6038"), 'denied')))}>
                        <span className={stryMutAct_9fa48("6039") ? `` : (stryCov_9fa48("6039"), `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(stryMutAct_9fa48("6042") ? pushPermissionStatus !== 'granted' : stryMutAct_9fa48("6041") ? false : stryMutAct_9fa48("6040") ? true : (stryCov_9fa48("6040", "6041", "6042"), pushPermissionStatus === (stryMutAct_9fa48("6043") ? "" : (stryCov_9fa48("6043"), 'granted')))) ? stryMutAct_9fa48("6044") ? "" : (stryCov_9fa48("6044"), 'translate-x-6') : stryMutAct_9fa48("6045") ? "" : (stryCov_9fa48("6045"), 'translate-x-1')}`)} />
                    </button>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Email Notifications</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive digests or instant alerts for family activity.</p>
                    </div>
                    <button onClick={stryMutAct_9fa48("6046") ? () => undefined : (stryCov_9fa48("6046"), () => onUpdatePreferences(stryMutAct_9fa48("6047") ? {} : (stryCov_9fa48("6047"), {
            enabled: stryMutAct_9fa48("6048") ? emailEnabled : (stryCov_9fa48("6048"), !emailEnabled)
          })))} className={stryMutAct_9fa48("6049") ? `` : (stryCov_9fa48("6049"), `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${emailEnabled ? stryMutAct_9fa48("6050") ? "" : (stryCov_9fa48("6050"), 'bg-primary-500') : stryMutAct_9fa48("6051") ? "" : (stryCov_9fa48("6051"), 'bg-slate-300 dark:bg-slate-700')}`)}>
                        <span className={stryMutAct_9fa48("6052") ? `` : (stryCov_9fa48("6052"), `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailEnabled ? stryMutAct_9fa48("6053") ? "" : (stryCov_9fa48("6053"), 'translate-x-6') : stryMutAct_9fa48("6054") ? "" : (stryCov_9fa48("6054"), 'translate-x-1')}`)} />
                    </button>
                </div>

                {stryMutAct_9fa48("6057") ? emailEnabled || <div className="animate-in slide-in-from-top-2 duration-300 space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Notification Email</label>
                            <input type="email" value={email || userEmail || ''} onChange={e => onUpdatePreferences({
              email: e.target.value
            })} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400" />
                            {!emailVerified && <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3 h-3" /> Email not verified. Notifications may be restricted.
                                </p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Frequency</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['instant', 'daily', 'weekly'] as const).map(freq => <Button key={freq} variant={frequency === freq ? 'primary' : 'secondary'} size="sm" onClick={() => onUpdatePreferences({
                frequency: freq
              })} className={`capitalize ${frequency === freq ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-100 dark:shadow-none' : ''}`}>
                                        {freq}
                                    </Button>)}
                            </div>
                        </div>
                    </div> : stryMutAct_9fa48("6056") ? false : stryMutAct_9fa48("6055") ? true : (stryCov_9fa48("6055", "6056", "6057"), emailEnabled && <div className="animate-in slide-in-from-top-2 duration-300 space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Notification Email</label>
                            <input type="email" value={stryMutAct_9fa48("6060") ? (email || userEmail) && '' : stryMutAct_9fa48("6059") ? false : stryMutAct_9fa48("6058") ? true : (stryCov_9fa48("6058", "6059", "6060"), (stryMutAct_9fa48("6062") ? email && userEmail : stryMutAct_9fa48("6061") ? false : (stryCov_9fa48("6061", "6062"), email || userEmail)) || (stryMutAct_9fa48("6063") ? "Stryker was here!" : (stryCov_9fa48("6063"), '')))} onChange={stryMutAct_9fa48("6064") ? () => undefined : (stryCov_9fa48("6064"), e => onUpdatePreferences(stryMutAct_9fa48("6065") ? {} : (stryCov_9fa48("6065"), {
              email: e.target.value
            })))} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400" />
                            {stryMutAct_9fa48("6068") ? !emailVerified || <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3 h-3" /> Email not verified. Notifications may be restricted.
                                </p> : stryMutAct_9fa48("6067") ? false : stryMutAct_9fa48("6066") ? true : (stryCov_9fa48("6066", "6067", "6068"), (stryMutAct_9fa48("6069") ? emailVerified : (stryCov_9fa48("6069"), !emailVerified)) && <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3 h-3" /> Email not verified. Notifications may be restricted.
                                </p>)}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Frequency</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['instant', 'daily', 'weekly'] as const).map(stryMutAct_9fa48("6070") ? () => undefined : (stryCov_9fa48("6070"), freq => <Button key={freq} variant={(stryMutAct_9fa48("6073") ? frequency !== freq : stryMutAct_9fa48("6072") ? false : stryMutAct_9fa48("6071") ? true : (stryCov_9fa48("6071", "6072", "6073"), frequency === freq)) ? stryMutAct_9fa48("6074") ? "" : (stryCov_9fa48("6074"), 'primary') : stryMutAct_9fa48("6075") ? "" : (stryCov_9fa48("6075"), 'secondary')} size="sm" onClick={stryMutAct_9fa48("6076") ? () => undefined : (stryCov_9fa48("6076"), () => onUpdatePreferences(stryMutAct_9fa48("6077") ? {} : (stryCov_9fa48("6077"), {
                frequency: freq
              })))} className={stryMutAct_9fa48("6078") ? `` : (stryCov_9fa48("6078"), `capitalize ${(stryMutAct_9fa48("6081") ? frequency !== freq : stryMutAct_9fa48("6080") ? false : stryMutAct_9fa48("6079") ? true : (stryCov_9fa48("6079", "6080", "6081"), frequency === freq)) ? stryMutAct_9fa48("6082") ? "" : (stryCov_9fa48("6082"), 'bg-primary-500 hover:bg-primary-600 shadow-primary-100 dark:shadow-none') : stryMutAct_9fa48("6083") ? "Stryker was here!" : (stryCov_9fa48("6083"), '')}`)}>
                                        {freq}
                                    </Button>))}
                            </div>
                        </div>
                    </div>)}
            </CardContent>
        </Card>;
  }
};