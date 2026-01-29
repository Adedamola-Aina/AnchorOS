/**
 * Activity Feed Component
 * 
 * Displays a timeline of activities on a shared account.
 * Shows who did what and when for full transparency in family mode.
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
import React from 'react';
import { Activity, Clock } from 'lucide-react';
import type { AccountActivity } from '../../../types/activity';
import { formatActivityMessage, getActivityColor } from '../../../types/activity';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency } from '../../../types';
import { formatRelativeTime, getActivityIcon } from './activityHelpers';
interface ActivityFeedProps {
  activities: AccountActivity[];
  currentUserId?: string;
  loading?: boolean;
  maxItems?: number;
}
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  currentUserId,
  loading = stryMutAct_9fa48("4323") ? true : (stryCov_9fa48("4323"), false),
  maxItems = 10
}) => {
  if (stryMutAct_9fa48("4324")) {
    {}
  } else {
    stryCov_9fa48("4324");
    const displayActivities = stryMutAct_9fa48("4325") ? activities : (stryCov_9fa48("4325"), activities.slice(0, maxItems));
    if (stryMutAct_9fa48("4327") ? false : stryMutAct_9fa48("4326") ? true : (stryCov_9fa48("4326", "4327"), loading)) {
      if (stryMutAct_9fa48("4328")) {
        {}
      } else {
        stryCov_9fa48("4328");
        return <div className="space-y-3">
                {(stryMutAct_9fa48("4329") ? [] : (stryCov_9fa48("4329"), [1, 2, 3])).map(stryMutAct_9fa48("4330") ? () => undefined : (stryCov_9fa48("4330"), i => <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                        </div>
                    </div>))}
            </div>;
      }
    }
    if (stryMutAct_9fa48("4333") ? displayActivities.length !== 0 : stryMutAct_9fa48("4332") ? false : stryMutAct_9fa48("4331") ? true : (stryCov_9fa48("4331", "4332", "4333"), displayActivities.length === 0)) {
      if (stryMutAct_9fa48("4334")) {
        {}
      } else {
        stryCov_9fa48("4334");
        return <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <Activity className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    No activity yet
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Activity will appear here when transactions are added
                </p>
            </div>;
      }
    }
    return <div className="space-y-1">
            {displayActivities.map((activity, index) => {
        if (stryMutAct_9fa48("4335")) {
          {}
        } else {
          stryCov_9fa48("4335");
          const isCurrentUser = stryMutAct_9fa48("4338") ? activity.actorId !== currentUserId : stryMutAct_9fa48("4337") ? false : stryMutAct_9fa48("4336") ? true : (stryCov_9fa48("4336", "4337", "4338"), activity.actorId === currentUserId);
          const colorClasses = getActivityColor(activity.action);
          const showAmount = stryMutAct_9fa48("4341") ? activity.details.amountCents !== undefined || activity.action !== 'transaction_deleted' : stryMutAct_9fa48("4340") ? false : stryMutAct_9fa48("4339") ? true : (stryCov_9fa48("4339", "4340", "4341"), (stryMutAct_9fa48("4343") ? activity.details.amountCents === undefined : stryMutAct_9fa48("4342") ? true : (stryCov_9fa48("4342", "4343"), activity.details.amountCents !== undefined)) && (stryMutAct_9fa48("4345") ? activity.action === 'transaction_deleted' : stryMutAct_9fa48("4344") ? true : (stryCov_9fa48("4344", "4345"), activity.action !== (stryMutAct_9fa48("4346") ? "" : (stryCov_9fa48("4346"), 'transaction_deleted')))));
          return <div key={activity.id} className={stryMutAct_9fa48("4347") ? `` : (stryCov_9fa48("4347"), `
              flex gap-3 p-3 rounded-xl transition-colors
              ${(stryMutAct_9fa48("4350") ? index !== 0 : stryMutAct_9fa48("4349") ? false : stryMutAct_9fa48("4348") ? true : (stryCov_9fa48("4348", "4349", "4350"), index === 0)) ? stryMutAct_9fa48("4351") ? "" : (stryCov_9fa48("4351"), 'bg-slate-50 dark:bg-slate-800/50') : stryMutAct_9fa48("4352") ? "" : (stryCov_9fa48("4352"), 'hover:bg-slate-50 dark:hover:bg-slate-800/30')}
            `)}>
                        {/* Icon */}
                        <div className={stryMutAct_9fa48("4353") ? `` : (stryCov_9fa48("4353"), `
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${colorClasses}
            `)}>
                            {getActivityIcon(activity.action)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 dark:text-slate-200">
                                <span className={stryMutAct_9fa48("4354") ? `` : (stryCov_9fa48("4354"), `font-semibold ${isCurrentUser ? stryMutAct_9fa48("4355") ? "" : (stryCov_9fa48("4355"), 'text-primary-600 dark:text-primary-400') : stryMutAct_9fa48("4356") ? "Stryker was here!" : (stryCov_9fa48("4356"), '')}`)}>
                                    {isCurrentUser ? stryMutAct_9fa48("4357") ? "" : (stryCov_9fa48("4357"), 'You') : activity.actorName}
                                </span>
                                {stryMutAct_9fa48("4358") ? "" : (stryCov_9fa48("4358"), ' ')}
                                <span className="text-slate-600 dark:text-slate-300">
                                    {stryMutAct_9fa48("4359") ? formatActivityMessage({
                    ...activity,
                    actorName: ''
                  }) : (stryCov_9fa48("4359"), formatActivityMessage(stryMutAct_9fa48("4360") ? {} : (stryCov_9fa48("4360"), {
                    ...activity,
                    actorName: stryMutAct_9fa48("4361") ? "Stryker was here!" : (stryCov_9fa48("4361"), '')
                  })).trim())}
                                </span>
                            </p>

                            {/* Amount display for transaction activities */}
                            {stryMutAct_9fa48("4364") ? showAmount || <p className={`text-xs font-semibold mt-0.5 ${activity.details.type === 'income' ? 'text-finance-600 dark:text-finance-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {activity.details.type === 'income' ? '+' : '-'}
                                    {formatCurrency(fromCents(activity.details.amountCents!), (activity.details.currency || 'USD') as Currency)}
                                    {activity.details.previousAmountCents !== undefined && activity.details.previousAmountCents !== activity.details.amountCents && <span className="text-slate-400 ml-1">
                                                (was {formatCurrency(fromCents(activity.details.previousAmountCents), (activity.details.currency || 'USD') as Currency)})
                                            </span>}
                                </p> : stryMutAct_9fa48("4363") ? false : stryMutAct_9fa48("4362") ? true : (stryCov_9fa48("4362", "4363", "4364"), showAmount && <p className={stryMutAct_9fa48("4365") ? `` : (stryCov_9fa48("4365"), `text-xs font-semibold mt-0.5 ${(stryMutAct_9fa48("4368") ? activity.details.type !== 'income' : stryMutAct_9fa48("4367") ? false : stryMutAct_9fa48("4366") ? true : (stryCov_9fa48("4366", "4367", "4368"), activity.details.type === (stryMutAct_9fa48("4369") ? "" : (stryCov_9fa48("4369"), 'income')))) ? stryMutAct_9fa48("4370") ? "" : (stryCov_9fa48("4370"), 'text-finance-600 dark:text-finance-400') : stryMutAct_9fa48("4371") ? "" : (stryCov_9fa48("4371"), 'text-slate-600 dark:text-slate-400')}`)}>
                                    {(stryMutAct_9fa48("4374") ? activity.details.type !== 'income' : stryMutAct_9fa48("4373") ? false : stryMutAct_9fa48("4372") ? true : (stryCov_9fa48("4372", "4373", "4374"), activity.details.type === (stryMutAct_9fa48("4375") ? "" : (stryCov_9fa48("4375"), 'income')))) ? stryMutAct_9fa48("4376") ? "" : (stryCov_9fa48("4376"), '+') : stryMutAct_9fa48("4377") ? "" : (stryCov_9fa48("4377"), '-')}
                                    {formatCurrency(fromCents(activity.details.amountCents!), (activity.details.currency || 'USD') as Currency)}
                                    {stryMutAct_9fa48("4380") ? activity.details.previousAmountCents !== undefined && activity.details.previousAmountCents !== activity.details.amountCents || <span className="text-slate-400 ml-1">
                                                (was {formatCurrency(fromCents(activity.details.previousAmountCents), (activity.details.currency || 'USD') as Currency)})
                                            </span> : stryMutAct_9fa48("4379") ? false : stryMutAct_9fa48("4378") ? true : (stryCov_9fa48("4378", "4379", "4380"), (stryMutAct_9fa48("4382") ? activity.details.previousAmountCents !== undefined || activity.details.previousAmountCents !== activity.details.amountCents : stryMutAct_9fa48("4381") ? true : (stryCov_9fa48("4381", "4382"), (stryMutAct_9fa48("4384") ? activity.details.previousAmountCents === undefined : stryMutAct_9fa48("4383") ? true : (stryCov_9fa48("4383", "4384"), activity.details.previousAmountCents !== undefined)) && (stryMutAct_9fa48("4386") ? activity.details.previousAmountCents === activity.details.amountCents : stryMutAct_9fa48("4385") ? true : (stryCov_9fa48("4385", "4386"), activity.details.previousAmountCents !== activity.details.amountCents)))) && <span className="text-slate-400 ml-1">
                                                (was {formatCurrency(fromCents(activity.details.previousAmountCents), (activity.details.currency || 'USD') as Currency)})
                                            </span>)}
                                </p>)}

                            {/* Timestamp */}
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(activity.timestamp)}
                            </p>
                        </div>
                    </div>;
        }
      })}

            {stryMutAct_9fa48("4389") ? activities.length > maxItems || <div className="pt-2 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        +{activities.length - maxItems} more activities
                    </p>
                </div> : stryMutAct_9fa48("4388") ? false : stryMutAct_9fa48("4387") ? true : (stryCov_9fa48("4387", "4388", "4389"), (stryMutAct_9fa48("4392") ? activities.length <= maxItems : stryMutAct_9fa48("4391") ? activities.length >= maxItems : stryMutAct_9fa48("4390") ? true : (stryCov_9fa48("4390", "4391", "4392"), activities.length > maxItems)) && <div className="pt-2 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        +{stryMutAct_9fa48("4393") ? activities.length + maxItems : (stryCov_9fa48("4393"), activities.length - maxItems)} more activities
                    </p>
                </div>)}
        </div>;
  }
};