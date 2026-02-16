/**
 * csvExport - Converts structured data to CSV and triggers download.
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
type Row = Record<string, unknown>;
function escapeCell(value: unknown): string {
  if (stryMutAct_9fa48("847")) {
    {}
  } else {
    stryCov_9fa48("847");
    if (stryMutAct_9fa48("850") ? value != null : stryMutAct_9fa48("849") ? false : stryMutAct_9fa48("848") ? true : (stryCov_9fa48("848", "849", "850"), value == null)) return stryMutAct_9fa48("851") ? "Stryker was here!" : (stryCov_9fa48("851"), '');
    const str = (stryMutAct_9fa48("854") ? typeof value !== 'object' : stryMutAct_9fa48("853") ? false : stryMutAct_9fa48("852") ? true : (stryCov_9fa48("852", "853", "854"), typeof value === (stryMutAct_9fa48("855") ? "" : (stryCov_9fa48("855"), 'object')))) ? JSON.stringify(value) : String(value);
    if (stryMutAct_9fa48("858") ? (str.includes(',') || str.includes('"')) && str.includes('\n') : stryMutAct_9fa48("857") ? false : stryMutAct_9fa48("856") ? true : (stryCov_9fa48("856", "857", "858"), (stryMutAct_9fa48("860") ? str.includes(',') && str.includes('"') : stryMutAct_9fa48("859") ? false : (stryCov_9fa48("859", "860"), str.includes(stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), ',')) || str.includes(stryMutAct_9fa48("862") ? "" : (stryCov_9fa48("862"), '"')))) || str.includes(stryMutAct_9fa48("863") ? "" : (stryCov_9fa48("863"), '\n')))) {
      if (stryMutAct_9fa48("864")) {
        {}
      } else {
        stryCov_9fa48("864");
        return stryMutAct_9fa48("865") ? `` : (stryCov_9fa48("865"), `"${str.replace(/"/g, stryMutAct_9fa48("866") ? "" : (stryCov_9fa48("866"), '""'))}"`);
      }
    }
    return str;
  }
}
function toCsv(rows: Row[]): string {
  if (stryMutAct_9fa48("867")) {
    {}
  } else {
    stryCov_9fa48("867");
    if (stryMutAct_9fa48("870") ? rows.length !== 0 : stryMutAct_9fa48("869") ? false : stryMutAct_9fa48("868") ? true : (stryCov_9fa48("868", "869", "870"), rows.length === 0)) return stryMutAct_9fa48("871") ? "Stryker was here!" : (stryCov_9fa48("871"), '');
    const headers = Object.keys(rows[0]);
    const lines = stryMutAct_9fa48("872") ? [] : (stryCov_9fa48("872"), [headers.join(stryMutAct_9fa48("873") ? "" : (stryCov_9fa48("873"), ','))]);
    for (const row of rows) {
      if (stryMutAct_9fa48("874")) {
        {}
      } else {
        stryCov_9fa48("874");
        lines.push(headers.map(stryMutAct_9fa48("875") ? () => undefined : (stryCov_9fa48("875"), h => escapeCell(row[h]))).join(stryMutAct_9fa48("876") ? "" : (stryCov_9fa48("876"), ',')));
      }
    }
    return lines.join(stryMutAct_9fa48("877") ? "" : (stryCov_9fa48("877"), '\n'));
  }
}
export function downloadCsv(data: {
  accounts: Row[];
  transactions: Row[];
  commitments: Row[];
}): void {
  if (stryMutAct_9fa48("878")) {
    {}
  } else {
    stryCov_9fa48("878");
    const sections: string[] = stryMutAct_9fa48("879") ? ["Stryker was here"] : (stryCov_9fa48("879"), []);
    if (stryMutAct_9fa48("883") ? data.accounts.length <= 0 : stryMutAct_9fa48("882") ? data.accounts.length >= 0 : stryMutAct_9fa48("881") ? false : stryMutAct_9fa48("880") ? true : (stryCov_9fa48("880", "881", "882", "883"), data.accounts.length > 0)) {
      if (stryMutAct_9fa48("884")) {
        {}
      } else {
        stryCov_9fa48("884");
        sections.push((stryMutAct_9fa48("885") ? "" : (stryCov_9fa48("885"), '# Accounts\n')) + toCsv(data.accounts));
      }
    }
    if (stryMutAct_9fa48("889") ? data.transactions.length <= 0 : stryMutAct_9fa48("888") ? data.transactions.length >= 0 : stryMutAct_9fa48("887") ? false : stryMutAct_9fa48("886") ? true : (stryCov_9fa48("886", "887", "888", "889"), data.transactions.length > 0)) {
      if (stryMutAct_9fa48("890")) {
        {}
      } else {
        stryCov_9fa48("890");
        sections.push((stryMutAct_9fa48("891") ? "" : (stryCov_9fa48("891"), '# Transactions\n')) + toCsv(data.transactions));
      }
    }
    if (stryMutAct_9fa48("895") ? data.commitments.length <= 0 : stryMutAct_9fa48("894") ? data.commitments.length >= 0 : stryMutAct_9fa48("893") ? false : stryMutAct_9fa48("892") ? true : (stryCov_9fa48("892", "893", "894", "895"), data.commitments.length > 0)) {
      if (stryMutAct_9fa48("896")) {
        {}
      } else {
        stryCov_9fa48("896");
        sections.push((stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), '# Commitments\n')) + toCsv(data.commitments));
      }
    }
    const content = sections.join(stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), '\n\n'));
    const blob = new Blob(stryMutAct_9fa48("899") ? [] : (stryCov_9fa48("899"), [content]), stryMutAct_9fa48("900") ? {} : (stryCov_9fa48("900"), {
      type: stryMutAct_9fa48("901") ? "" : (stryCov_9fa48("901"), 'text/csv;charset=utf-8')
    }));
    const url = URL.createObjectURL(blob);
    const a = document.createElement(stryMutAct_9fa48("902") ? "" : (stryCov_9fa48("902"), 'a'));
    a.href = url;
    a.download = stryMutAct_9fa48("903") ? `` : (stryCov_9fa48("903"), `anchor-data-${new Date().toISOString().split(stryMutAct_9fa48("904") ? "" : (stryCov_9fa48("904"), 'T'))[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}