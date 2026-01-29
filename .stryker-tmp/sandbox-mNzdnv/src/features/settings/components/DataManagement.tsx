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
import { Database } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface DataManagementProps {
  userUid: string;
  profile: any;
  onWipeData: () => Promise<void>;
}
export const DataManagement: React.FC<DataManagementProps> = ({
  userUid,
  profile,
  onWipeData
}) => {
  if (stryMutAct_9fa48("5667")) {
    {}
  } else {
    stryCov_9fa48("5667");
    const {
      showToast
    } = useNotifications();
    const handleExportJson = async () => {
      if (stryMutAct_9fa48("5668")) {
        {}
      } else {
        stryCov_9fa48("5668");
        try {
          if (stryMutAct_9fa48("5669")) {
            {}
          } else {
            stryCov_9fa48("5669");
            const {
              getDocs,
              collection
            } = await import(stryMutAct_9fa48("5670") ? "" : (stryCov_9fa48("5670"), 'firebase/firestore'));
            const {
              db,
              APP_ID
            } = await import(stryMutAct_9fa48("5671") ? "" : (stryCov_9fa48("5671"), '../../../config/firebase'));

            // Fetch all data
            const [accSnap, txSnap, tasksSnap] = await Promise.all(stryMutAct_9fa48("5672") ? [] : (stryCov_9fa48("5672"), [getDocs(collection(db, stryMutAct_9fa48("5673") ? "" : (stryCov_9fa48("5673"), 'artifacts'), APP_ID, stryMutAct_9fa48("5674") ? "" : (stryCov_9fa48("5674"), 'users'), userUid, stryMutAct_9fa48("5675") ? "" : (stryCov_9fa48("5675"), 'accounts'))), getDocs(collection(db, stryMutAct_9fa48("5676") ? "" : (stryCov_9fa48("5676"), 'artifacts'), APP_ID, stryMutAct_9fa48("5677") ? "" : (stryCov_9fa48("5677"), 'users'), userUid, stryMutAct_9fa48("5678") ? "" : (stryCov_9fa48("5678"), 'finance'))), getDocs(collection(db, stryMutAct_9fa48("5679") ? "" : (stryCov_9fa48("5679"), 'artifacts'), APP_ID, stryMutAct_9fa48("5680") ? "" : (stryCov_9fa48("5680"), 'users'), userUid, stryMutAct_9fa48("5681") ? "" : (stryCov_9fa48("5681"), 'commitments')))]));
            const data = stryMutAct_9fa48("5682") ? {} : (stryCov_9fa48("5682"), {
              profile,
              accounts: accSnap.docs.map(stryMutAct_9fa48("5683") ? () => undefined : (stryCov_9fa48("5683"), d => d.data())),
              transactions: txSnap.docs.map(stryMutAct_9fa48("5684") ? () => undefined : (stryCov_9fa48("5684"), d => d.data())),
              commitments: tasksSnap.docs.map(stryMutAct_9fa48("5685") ? () => undefined : (stryCov_9fa48("5685"), d => d.data())),
              exportedAt: new Date().toISOString()
            });
            const blob = new Blob(stryMutAct_9fa48("5686") ? [] : (stryCov_9fa48("5686"), [JSON.stringify(data, null, 2)]), stryMutAct_9fa48("5687") ? {} : (stryCov_9fa48("5687"), {
              type: stryMutAct_9fa48("5688") ? "" : (stryCov_9fa48("5688"), 'application/json')
            }));
            const url = URL.createObjectURL(blob);
            const a = document.createElement(stryMutAct_9fa48("5689") ? "" : (stryCov_9fa48("5689"), 'a'));
            a.href = url;
            a.download = stryMutAct_9fa48("5690") ? `` : (stryCov_9fa48("5690"), `anchor-data-${new Date().toISOString().split(stryMutAct_9fa48("5691") ? "" : (stryCov_9fa48("5691"), 'T'))[0]}.json`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(stryMutAct_9fa48("5692") ? "" : (stryCov_9fa48("5692"), 'Data export started.'), stryMutAct_9fa48("5693") ? "" : (stryCov_9fa48("5693"), 'success'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("5694")) {
            {}
          } else {
            stryCov_9fa48("5694");
            showToast((stryMutAct_9fa48("5695") ? "" : (stryCov_9fa48("5695"), 'Export failed: ')) + (e as Error).message, stryMutAct_9fa48("5696") ? "" : (stryCov_9fa48("5696"), 'error'));
          }
        }
      }
    };
    return <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-primary-50/30 dark:bg-primary-900/10">
                <CardTitle className="text-base font-bold text-primary-900 dark:text-primary-400 flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    Data Management
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Export Personal Data</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Download a JSON copy of all your accounts, transactions, and commitments.</p>
                    </div>
                    <Button onClick={handleExportJson} variant="primary" className="bg-primary-600 hover:bg-primary-700 h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        Export JSON
                    </Button>
                </div>

                {stryMutAct_9fa48("5699") ? import.meta.env.MODE !== 'production' || <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Wipe All Data (Dev Only)</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                Factory reset your account for testing. Removes all finance and task data, keeps profile.
                            </p>
                        </div>
                        <Button onClick={onWipeData} variant="secondary" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                            Wipe Data
                        </Button>
                    </div> : stryMutAct_9fa48("5698") ? false : stryMutAct_9fa48("5697") ? true : (stryCov_9fa48("5697", "5698", "5699"), (stryMutAct_9fa48("5701") ? import.meta.env.MODE === 'production' : stryMutAct_9fa48("5700") ? true : (stryCov_9fa48("5700", "5701"), import.meta.env.MODE !== (stryMutAct_9fa48("5702") ? "" : (stryCov_9fa48("5702"), 'production')))) && <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Wipe All Data (Dev Only)</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                Factory reset your account for testing. Removes all finance and task data, keeps profile.
                            </p>
                        </div>
                        <Button onClick={onWipeData} variant="secondary" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                            Wipe Data
                        </Button>
                    </div>)}
            </CardContent>
        </Card>;
  }
};