/**
 * Auth Email Templates
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
export const getWelcomeEmailHtml = stryMutAct_9fa48("1837") ? () => undefined : (stryCov_9fa48("1837"), (() => {
  const getWelcomeEmailHtml = (name: string): string => stryMutAct_9fa48("1838") ? `` : (stryCov_9fa48("1838"), `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">Welcome to Anchor OS!</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We're thrilled to have you on board! Anchor OS is designed to help you organize your financial and family life with intentionality.</p>
    <p><strong>Get started by:</strong></p>
    <ul>
        <li>Connecting your spouse (via Settings)</li>
        <li>Adding your first financial account</li>
        <li>Setting up your commitment tracking</li>
    </ul>
    <p>If you have any questions, just reply to this email.</p>
    <p>Welcome home,<br/>The Anchor OS Team</p>
</div>
`);
  return getWelcomeEmailHtml;
})());