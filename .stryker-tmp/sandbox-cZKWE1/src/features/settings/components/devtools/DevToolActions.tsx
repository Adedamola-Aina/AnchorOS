/**
 * Developer Tools Action Components
 * Split from DeveloperTools.tsx per CLAUDE.md §3.2 (200-line rule)
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
import { Button } from '@anchor-os/ui';
import { useNotifications } from '../../../../context/NotificationContext';
import { seedData } from '../../../../utils/seeder';
interface ActionProps {
  userUid: string;
}

/**
 * Seed Test Data Action
 */
export const SeedDataAction: React.FC<ActionProps> = ({
  userUid
}) => {
  if (stryMutAct_9fa48("6412")) {
    {}
  } else {
    stryCov_9fa48("6412");
    const {
      showToast,
      confirm
    } = useNotifications();
    const [seeding, setSeeding] = useState(stryMutAct_9fa48("6413") ? true : (stryCov_9fa48("6413"), false));
    const handleSeedData = async () => {
      if (stryMutAct_9fa48("6414")) {
        {}
      } else {
        stryCov_9fa48("6414");
        if (stryMutAct_9fa48("6417") ? false : stryMutAct_9fa48("6416") ? true : stryMutAct_9fa48("6415") ? userUid : (stryCov_9fa48("6415", "6416", "6417"), !userUid)) return;
        if (stryMutAct_9fa48("6420") ? false : stryMutAct_9fa48("6419") ? true : stryMutAct_9fa48("6418") ? await confirm({
          title: 'Seed Test Data?',
          message: 'This will add random transactions, accounts, and tasks to your profile. This is intended for development and testing only. Continue?',
          confirmText: 'Seed Database',
          type: 'danger'
        }) : (stryCov_9fa48("6418", "6419", "6420"), !(await confirm(stryMutAct_9fa48("6421") ? {} : (stryCov_9fa48("6421"), {
          title: stryMutAct_9fa48("6422") ? "" : (stryCov_9fa48("6422"), 'Seed Test Data?'),
          message: stryMutAct_9fa48("6423") ? "" : (stryCov_9fa48("6423"), 'This will add random transactions, accounts, and tasks to your profile. This is intended for development and testing only. Continue?'),
          confirmText: stryMutAct_9fa48("6424") ? "" : (stryCov_9fa48("6424"), 'Seed Database'),
          type: stryMutAct_9fa48("6425") ? "" : (stryCov_9fa48("6425"), 'danger')
        }))))) return;
        setSeeding(stryMutAct_9fa48("6426") ? false : (stryCov_9fa48("6426"), true));
        try {
          if (stryMutAct_9fa48("6427")) {
            {}
          } else {
            stryCov_9fa48("6427");
            await seedData(userUid);
            showToast(stryMutAct_9fa48("6428") ? "" : (stryCov_9fa48("6428"), 'Seeding Complete! Refresh to see data.'), stryMutAct_9fa48("6429") ? "" : (stryCov_9fa48("6429"), 'success'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("6430")) {
            {}
          } else {
            stryCov_9fa48("6430");
            showToast((stryMutAct_9fa48("6431") ? "" : (stryCov_9fa48("6431"), 'Error: ')) + (e as Error).message, stryMutAct_9fa48("6432") ? "" : (stryCov_9fa48("6432"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("6433")) {
            {}
          } else {
            stryCov_9fa48("6433");
            setSeeding(stryMutAct_9fa48("6434") ? true : (stryCov_9fa48("6434"), false));
          }
        }
      }
    };
    return <div className="flex items-center justify-between">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Seed Test Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Populate account with random data (Accounts, Tx, Commitments).</p>
            </div>
            <Button onClick={handleSeedData} isLoading={seeding} className="bg-purple-600 hover:bg-purple-700 h-10 px-6 text-xs font-black uppercase tracking-widest">
                Seed Data
            </Button>
        </div>;
  }
};

/**
 * Simulate Family Data Action
 */
export const SimulateFamilyAction: React.FC<ActionProps> = ({
  userUid
}) => {
  if (stryMutAct_9fa48("6435")) {
    {}
  } else {
    stryCov_9fa48("6435");
    const {
      showToast
    } = useNotifications();
    const handleSimulate = async () => {
      if (stryMutAct_9fa48("6436")) {
        {}
      } else {
        stryCov_9fa48("6436");
        try {
          if (stryMutAct_9fa48("6437")) {
            {}
          } else {
            stryCov_9fa48("6437");
            const {
              db,
              APP_ID
            } = await import(stryMutAct_9fa48("6438") ? "" : (stryCov_9fa48("6438"), '../../../../config/firebase'));
            const {
              doc,
              collection,
              writeBatch
            } = await import(stryMutAct_9fa48("6439") ? "" : (stryCov_9fa48("6439"), 'firebase/firestore'));
            const batch = writeBatch(db);
            const timestamp = new Date().toISOString();

            // Enable Family Mode in Config
            const familyConfigRef = doc(db, stryMutAct_9fa48("6440") ? "" : (stryCov_9fa48("6440"), 'artifacts'), APP_ID, stryMutAct_9fa48("6441") ? "" : (stryCov_9fa48("6441"), 'users'), userUid, stryMutAct_9fa48("6442") ? "" : (stryCov_9fa48("6442"), 'family'), stryMutAct_9fa48("6443") ? "" : (stryCov_9fa48("6443"), 'config'));
            batch.set(familyConfigRef, stryMutAct_9fa48("6444") ? {} : (stryCov_9fa48("6444"), {
              spouseId: stryMutAct_9fa48("6445") ? "" : (stryCov_9fa48("6445"), 'simulated-sarah-uid'),
              spouseName: stryMutAct_9fa48("6446") ? "" : (stryCov_9fa48("6446"), 'Sarah'),
              joinedAt: timestamp,
              status: stryMutAct_9fa48("6447") ? "" : (stryCov_9fa48("6447"), 'active')
            }));

            // Inject Shared Account
            const accountRef = doc(collection(db, stryMutAct_9fa48("6448") ? "" : (stryCov_9fa48("6448"), 'artifacts'), APP_ID, stryMutAct_9fa48("6449") ? "" : (stryCov_9fa48("6449"), 'users'), userUid, stryMutAct_9fa48("6450") ? "" : (stryCov_9fa48("6450"), 'accounts')));
            batch.set(accountRef, stryMutAct_9fa48("6451") ? {} : (stryCov_9fa48("6451"), {
              name: stryMutAct_9fa48("6452") ? "" : (stryCov_9fa48("6452"), 'Family Savings'),
              type: stryMutAct_9fa48("6453") ? "" : (stryCov_9fa48("6453"), 'savings'),
              balanceCents: 500000,
              currency: stryMutAct_9fa48("6454") ? "" : (stryCov_9fa48("6454"), 'NGN'),
              color: stryMutAct_9fa48("6455") ? "" : (stryCov_9fa48("6455"), '#8b5cf6'),
              scope: stryMutAct_9fa48("6456") ? "" : (stryCov_9fa48("6456"), 'family'),
              ownerId: userUid,
              isArchived: stryMutAct_9fa48("6457") ? true : (stryCov_9fa48("6457"), false),
              sharedWith: stryMutAct_9fa48("6458") ? {} : (stryCov_9fa48("6458"), {
                'simulated-sarah-uid': stryMutAct_9fa48("6459") ? {} : (stryCov_9fa48("6459"), {
                  role: stryMutAct_9fa48("6460") ? "" : (stryCov_9fa48("6460"), 'transact'),
                  sharedAt: timestamp
                })
              })
            }));

            // Inject Shared Notifications
            for (let i = 0; stryMutAct_9fa48("6463") ? i >= 3 : stryMutAct_9fa48("6462") ? i <= 3 : stryMutAct_9fa48("6461") ? false : (stryCov_9fa48("6461", "6462", "6463"), i < 3); stryMutAct_9fa48("6464") ? i-- : (stryCov_9fa48("6464"), i++)) {
              if (stryMutAct_9fa48("6465")) {
                {}
              } else {
                stryCov_9fa48("6465");
                const notifRef = doc(collection(db, stryMutAct_9fa48("6466") ? "" : (stryCov_9fa48("6466"), 'artifacts'), APP_ID, stryMutAct_9fa48("6467") ? "" : (stryCov_9fa48("6467"), 'users'), userUid, stryMutAct_9fa48("6468") ? "" : (stryCov_9fa48("6468"), 'notifications')));
                batch.set(notifRef, stryMutAct_9fa48("6469") ? {} : (stryCov_9fa48("6469"), {
                  type: stryMutAct_9fa48("6470") ? "" : (stryCov_9fa48("6470"), 'finance'),
                  date: timestamp,
                  read: stryMutAct_9fa48("6471") ? true : (stryCov_9fa48("6471"), false),
                  message: (stryMutAct_9fa48("6474") ? i !== 0 : stryMutAct_9fa48("6473") ? false : stryMutAct_9fa48("6472") ? true : (stryCov_9fa48("6472", "6473", "6474"), i === 0)) ? stryMutAct_9fa48("6475") ? "" : (stryCov_9fa48("6475"), 'Sarah added ₦10,000 to Family Savings') : (stryMutAct_9fa48("6478") ? i !== 1 : stryMutAct_9fa48("6477") ? false : stryMutAct_9fa48("6476") ? true : (stryCov_9fa48("6476", "6477", "6478"), i === 1)) ? stryMutAct_9fa48("6479") ? "" : (stryCov_9fa48("6479"), 'Sarah updated the Rent commitment') : stryMutAct_9fa48("6480") ? "" : (stryCov_9fa48("6480"), 'Sarah shared a new grocery list'),
                  title: (stryMutAct_9fa48("6483") ? i !== 0 : stryMutAct_9fa48("6482") ? false : stryMutAct_9fa48("6481") ? true : (stryCov_9fa48("6481", "6482", "6483"), i === 0)) ? stryMutAct_9fa48("6484") ? "" : (stryCov_9fa48("6484"), 'Transaction') : stryMutAct_9fa48("6485") ? "" : (stryCov_9fa48("6485"), 'Family Update'),
                  accountId: accountRef.id,
                  accountName: stryMutAct_9fa48("6486") ? "" : (stryCov_9fa48("6486"), 'Family Savings'),
                  actorId: stryMutAct_9fa48("6487") ? "" : (stryCov_9fa48("6487"), 'simulated-sarah-uid'),
                  actorName: stryMutAct_9fa48("6488") ? "" : (stryCov_9fa48("6488"), 'Sarah')
                }));
              }
            }
            await batch.commit();
            showToast(stryMutAct_9fa48("6489") ? "" : (stryCov_9fa48("6489"), 'Family data simulated! Refreshing...'), stryMutAct_9fa48("6490") ? "" : (stryCov_9fa48("6490"), 'success'));
            setTimeout(stryMutAct_9fa48("6491") ? () => undefined : (stryCov_9fa48("6491"), () => window.location.reload()), 1500);
          }
        } catch (e) {
          if (stryMutAct_9fa48("6492")) {
            {}
          } else {
            stryCov_9fa48("6492");
            showToast((stryMutAct_9fa48("6493") ? "" : (stryCov_9fa48("6493"), 'Simulation failed: ')) + (e as Error).message, stryMutAct_9fa48("6494") ? "" : (stryCov_9fa48("6494"), 'error'));
          }
        }
      }
    };
    return <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Simulate Family Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mock a spouse, shared accounts, and activity for testing.</p>
            </div>
            <Button onClick={handleSimulate} className="bg-purple-700 hover:bg-purple-800 h-10 px-6 text-xs font-black uppercase tracking-widest gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Simulate
            </Button>
        </div>;
  }
};

/**
 * Fix Shared Accounts Action
 */
export const FixSharedAccountsAction: React.FC = () => {
  if (stryMutAct_9fa48("6495")) {
    {}
  } else {
    stryCov_9fa48("6495");
    const {
      showToast
    } = useNotifications();
    const handleFix = async () => {
      if (stryMutAct_9fa48("6496")) {
        {}
      } else {
        stryCov_9fa48("6496");
        try {
          if (stryMutAct_9fa48("6497")) {
            {}
          } else {
            stryCov_9fa48("6497");
            const {
              getFunctions,
              httpsCallable
            } = await import(stryMutAct_9fa48("6498") ? "" : (stryCov_9fa48("6498"), 'firebase/functions'));
            const functions = getFunctions();
            const fix = httpsCallable(functions, stryMutAct_9fa48("6499") ? "" : (stryCov_9fa48("6499"), 'fixSharedAccountScopes'));
            const result = await fix();
            const data = result.data as {
              message: string;
            };
            showToast(data.message, stryMutAct_9fa48("6500") ? "" : (stryCov_9fa48("6500"), 'success'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("6501")) {
            {}
          } else {
            stryCov_9fa48("6501");
            showToast((stryMutAct_9fa48("6502") ? "" : (stryCov_9fa48("6502"), 'Error: ')) + (e as Error).message, stryMutAct_9fa48("6503") ? "" : (stryCov_9fa48("6503"), 'error'));
          }
        }
      }
    };
    return <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Fix Shared Accounts</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update all shared accounts to have correct scope (family).</p>
            </div>
            <Button onClick={handleFix} className="bg-green-600 hover:bg-green-700 h-10 px-6 text-xs font-black uppercase tracking-widest">
                Fix Now
            </Button>
        </div>;
  }
};