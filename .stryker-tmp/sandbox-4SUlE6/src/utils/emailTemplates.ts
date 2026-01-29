/**
 * Email Templates
 * 
 * Centralized email templates for Anchor OS.
 * These templates are used by AuthContext and Cloud Functions.
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
interface WelcomeEmailData {
  name: string;
}
interface InvitationEmailData {
  ownerName: string;
  inviteeEmail: string;
  verificationCode: string;
  acceptUrl: string;
}
interface PasswordResetEmailData {
  name: string;
  resetUrl: string;
}
export const emailTemplates = stryMutAct_9fa48("8594") ? {} : (stryCov_9fa48("8594"), {
  welcome: stryMutAct_9fa48("8595") ? () => undefined : (stryCov_9fa48("8595"), (data: WelcomeEmailData): string => stryMutAct_9fa48("8596") ? `` : (stryCov_9fa48("8596"), `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Anchor OS!</h2>
            <p>Hello <strong>${data.name}</strong>,</p>
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
    `)),
  invitation: stryMutAct_9fa48("8597") ? () => undefined : (stryCov_9fa48("8597"), (data: InvitationEmailData): string => stryMutAct_9fa48("8598") ? `` : (stryCov_9fa48("8598"), `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">Family Invitation from ${data.ownerName}</h2>
            <p>Hello,</p>
            <p><strong>${data.ownerName}</strong> has invited you to connect on Anchor OS.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #6b7280;">Your Verification Code:</p>
                <p style="font-size: 32px; letter-spacing: 4px; font-weight: bold; color: #1f2937; margin: 10px 0;">
                    ${data.verificationCode}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">This code expires in 24 hours</p>
            </div>
            <p style="text-align: center;">
                <a href="${data.acceptUrl}" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Accept Invitation
                </a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                If you did not expect this invitation, you can safely ignore this email.
            </p>
        </div>
    `)),
  passwordReset: stryMutAct_9fa48("8599") ? () => undefined : (stryCov_9fa48("8599"), (data: PasswordResetEmailData): string => stryMutAct_9fa48("8600") ? `` : (stryCov_9fa48("8600"), `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ef4444;">Password Reset Request</h2>
            <p>Hello ${data.name},</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" 
                   style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Reset Password
                </a>
            </p>
            <p style="color: #6b7280; font-size: 12px;">
                This link expires in 1 hour. If you didn't request this, please ignore this email.
            </p>
            <p>Best,<br/>The Anchor OS Team</p>
        </div>
    `))
});
export const emailSubjects = stryMutAct_9fa48("8601") ? {} : (stryCov_9fa48("8601"), {
  welcome: stryMutAct_9fa48("8602") ? "" : (stryCov_9fa48("8602"), 'Welcome to Anchor OS!'),
  invitation: stryMutAct_9fa48("8603") ? () => undefined : (stryCov_9fa48("8603"), (ownerName: string) => stryMutAct_9fa48("8604") ? `` : (stryCov_9fa48("8604"), `${ownerName} invited you to Anchor OS`)),
  passwordReset: stryMutAct_9fa48("8605") ? "" : (stryCov_9fa48("8605"), 'Reset Your Password')
});