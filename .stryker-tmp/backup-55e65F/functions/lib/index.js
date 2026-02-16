"use strict";
/**
 * Cloud Functions for Anchor OS — barrel re-exports
 *
 * All implementation lives in dedicated modules. This file
 * re-exports every Cloud Function so Firebase can discover them.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixSharedAccountScopes = exports.addTransactionToSharedAccount = exports.sendTemplatedEmail = exports.migrateFamilyConnectionsV2 = exports.cleanupExpiredInvitations = exports.onSharedTransactionWrite = exports.dismissNotification = exports.getNotifications = exports.disconnectFamily = exports.getSharedAccountsWithMe = exports.shareAccount = exports.confirmConnection = exports.acceptInvitation = exports.validateInvitationToken = exports.revokeInvitation = exports.createFamilyInvitation = exports.logAuditEvent = exports.resetRateLimit = exports.checkRateLimit = void 0;
// Rate limiting
var rateLimit_1 = require("./rateLimit");
Object.defineProperty(exports, "checkRateLimit", { enumerable: true, get: function () { return rateLimit_1.checkRateLimit; } });
Object.defineProperty(exports, "resetRateLimit", { enumerable: true, get: function () { return rateLimit_1.resetRateLimit; } });
// Audit logging
var audit_1 = require("./audit");
Object.defineProperty(exports, "logAuditEvent", { enumerable: true, get: function () { return audit_1.logAuditEvent; } });
// Family Mode — invitations
var familyInvitations_1 = require("./familyInvitations");
Object.defineProperty(exports, "createFamilyInvitation", { enumerable: true, get: function () { return familyInvitations_1.createFamilyInvitation; } });
Object.defineProperty(exports, "revokeInvitation", { enumerable: true, get: function () { return familyInvitations_1.revokeInvitation; } });
Object.defineProperty(exports, "validateInvitationToken", { enumerable: true, get: function () { return familyInvitations_1.validateInvitationToken; } });
// Family Mode — connection lifecycle
var familyConnection_1 = require("./familyConnection");
Object.defineProperty(exports, "acceptInvitation", { enumerable: true, get: function () { return familyConnection_1.acceptInvitation; } });
Object.defineProperty(exports, "confirmConnection", { enumerable: true, get: function () { return familyConnection_1.confirmConnection; } });
// Family Mode — sharing, notifications & disconnect
var familySharing_1 = require("./familySharing");
Object.defineProperty(exports, "shareAccount", { enumerable: true, get: function () { return familySharing_1.shareAccount; } });
Object.defineProperty(exports, "getSharedAccountsWithMe", { enumerable: true, get: function () { return familySharing_1.getSharedAccountsWithMe; } });
Object.defineProperty(exports, "disconnectFamily", { enumerable: true, get: function () { return familySharing_1.disconnectFamily; } });
// Notifications
var notifications_1 = require("./notifications");
Object.defineProperty(exports, "getNotifications", { enumerable: true, get: function () { return notifications_1.getNotifications; } });
Object.defineProperty(exports, "dismissNotification", { enumerable: true, get: function () { return notifications_1.dismissNotification; } });
// Family Mode — triggers & maintenance
var familyTriggers_1 = require("./familyTriggers");
Object.defineProperty(exports, "onSharedTransactionWrite", { enumerable: true, get: function () { return familyTriggers_1.onSharedTransactionWrite; } });
Object.defineProperty(exports, "cleanupExpiredInvitations", { enumerable: true, get: function () { return familyTriggers_1.cleanupExpiredInvitations; } });
// Family Mode — migration
var familyMigration_1 = require("./familyMigration");
Object.defineProperty(exports, "migrateFamilyConnectionsV2", { enumerable: true, get: function () { return familyMigration_1.migrateFamilyConnectionsV2; } });
// Email
var email_1 = require("./email");
Object.defineProperty(exports, "sendTemplatedEmail", { enumerable: true, get: function () { return email_1.sendTemplatedEmail; } });
// Shared transactions
var sharedTransactions_1 = require("./sharedTransactions");
Object.defineProperty(exports, "addTransactionToSharedAccount", { enumerable: true, get: function () { return sharedTransactions_1.addTransactionToSharedAccount; } });
Object.defineProperty(exports, "fixSharedAccountScopes", { enumerable: true, get: function () { return sharedTransactions_1.fixSharedAccountScopes; } });
// Finance automation
__exportStar(require("./recurring"), exports);
// Push notification reminders
__exportStar(require("./reminders"), exports);
//# sourceMappingURL=index.js.map