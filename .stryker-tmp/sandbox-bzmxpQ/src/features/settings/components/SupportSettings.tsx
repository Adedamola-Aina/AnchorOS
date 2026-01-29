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
import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface SupportSettingsProps {
  onOpenContact: () => void;
}
export const SupportSettings = ({
  onOpenContact
}: SupportSettingsProps) => {
  if (stryMutAct_9fa48("6346")) {
    {}
  } else {
    stryCov_9fa48("6346");
    return <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-cyan-50/30 dark:bg-cyan-900/10">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-cyan-500" />
                    </div>
                    Contact & Feedback
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Get in Touch</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Report bugs, suggest features, or share feedback directly.
                        </p>
                    </div>
                    <Button onClick={onOpenContact} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 h-10 shadow-cyan-500/20 whitespace-nowrap w-full md:w-auto">
                        Send Message
                    </Button>
                </div>
            </CardContent>
        </Card>;
  }
};