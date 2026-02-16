"use strict";
/**
 * Family Connection — accept, confirm, disconnect
 *
 * Handles the second half of the invitation lifecycle (verification +
 * connection establishment) and the disconnect flow.
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmConnection = exports.acceptInvitation = void 0;
const https_1 = require("firebase-functions/v2/https");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("./config");
const rateLimit_1 = require("./rateLimit");
const helpers_1 = require("./helpers");
// ============================================================================
// Accept Invitation (invitee enters verification code)
// ============================================================================
exports.acceptInvitation = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const { inviteId, verificationCode } = request.data;
    const inviteeUid = request.auth.uid;
    await (0, rateLimit_1.enforceRateLimit)('codeVerification', inviteId);
    const inviteRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('family_invitations').doc(inviteId);
    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Invitation not found');
    }
    const invite = inviteDoc.data();
    if (invite.status === 'locked') {
        throw new https_1.HttpsError('failed-precondition', 'This invitation is locked due to too many failed attempts');
    }
    if (invite.status !== 'pending') {
        throw new https_1.HttpsError('failed-precondition', 'This invitation is no longer valid');
    }
    if (new Date(invite.expiresAt) < new Date()) {
        await inviteRef.update({ status: 'expired' });
        throw new https_1.HttpsError('failed-precondition', 'This invitation has expired');
    }
    const codeMatch = await bcrypt.compare(verificationCode, invite.verificationCodeHash);
    if (!codeMatch) {
        const newAttempts = invite.verificationAttempts + 1;
        if (newAttempts >= 5) {
            await inviteRef.update({
                status: 'locked',
                lockedAt: new Date().toISOString(),
                verificationAttempts: newAttempts,
            });
            await (0, helpers_1.createAuditLog)('invitation_locked', inviteeUid, { inviteId, attempts: newAttempts });
            throw new https_1.HttpsError('failed-precondition', 'Too many failed attempts. Invitation locked.');
        }
        await inviteRef.update({ verificationAttempts: newAttempts });
        await (0, helpers_1.createAuditLog)('verification_failed', inviteeUid, { inviteId, attempts: newAttempts });
        return { success: false, attemptsRemaining: 5 - newAttempts };
    }
    await inviteRef.update({
        status: 'awaiting_confirmation',
        inviteeUid,
        acceptedAt: new Date().toISOString(),
    });
    await (0, helpers_1.createNotification)(invite.ownerUid, 'invitation_accepted', 'Family Invitation Accepted', `${request.auth.token.email} has accepted your invitation and entered the correct verification code. Please confirm the connection.`, inviteeUid, request.auth.token.email || 'Unknown');
    await (0, helpers_1.createAuditLog)('verification_success', inviteeUid, { inviteId });
    await (0, helpers_1.createAuditLog)('invitation_accepted', inviteeUid, { inviteId, ownerUid: invite.ownerUid });
    return { success: true };
});
// ============================================================================
// Confirm Connection (owner confirms after invitee accepts)
// ============================================================================
exports.confirmConnection = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required');
    }
    const { inviteId, confirmed } = request.data;
    const ownerUid = request.auth.uid;
    await (0, rateLimit_1.enforceRateLimit)('invite', ownerUid);
    const inviteRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('family_invitations').doc(inviteId);
    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Invitation not found');
    }
    const invite = inviteDoc.data();
    if (invite.ownerUid !== ownerUid) {
        throw new https_1.HttpsError('permission-denied', 'Only the invitation owner can confirm');
    }
    if (invite.status !== 'awaiting_confirmation') {
        throw new https_1.HttpsError('failed-precondition', 'Invitation is not awaiting confirmation');
    }
    if (!invite.inviteeUid) {
        throw new https_1.HttpsError('failed-precondition', 'Invitee has not accepted yet');
    }
    if (!confirmed) {
        await inviteRef.update({ status: 'rejected' });
        await (0, helpers_1.createNotification)(invite.inviteeUid, 'invitation_rejected', 'Family Connection Declined', `${invite.ownerDisplayName} has declined the family connection.`, ownerUid, invite.ownerDisplayName);
        await (0, helpers_1.createAuditLog)('connection_rejected', ownerUid, { inviteId, inviteeUid: invite.inviteeUid });
        return { success: true, rejected: true };
    }
    const inviteeProfileRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('users').doc(invite.inviteeUid);
    const inviteeProfile = await inviteeProfileRef.get();
    const memberDisplayName = inviteeProfile.data()?.name || invite.inviteeEmail.split('@')[0];
    const connectionId = `${ownerUid}_${invite.inviteeUid}`;
    const connectionRef = config_1.db.collection('artifacts').doc(config_1.APP_ID).collection('family_connections').doc(connectionId);
    const connection = {
        id: connectionRef.id,
        ownerUid,
        memberUid: invite.inviteeUid,
        ownerDisplayName: invite.ownerDisplayName,
        memberDisplayName,
        status: 'active',
        connectedAt: new Date().toISOString(),
    };
    await connectionRef.set(connection);
    await inviteRef.update({ status: 'accepted', confirmedAt: new Date().toISOString() });
    await (0, helpers_1.createNotification)(ownerUid, 'family_connected', '🎉 Family Connected!', `You're now connected with ${memberDisplayName}. No accounts are shared yet. Go to Finance to choose which accounts to share.`, invite.inviteeUid, memberDisplayName);
    await (0, helpers_1.createNotification)(invite.inviteeUid, 'family_connected', '👥 Family Connected!', `You're now connected to ${invite.ownerDisplayName}'s household. They'll choose which accounts to share with you. Shared accounts will appear in your Finance section once they do.`, ownerUid, invite.ownerDisplayName);
    await (0, helpers_1.createAuditLog)('connection_confirmed', ownerUid, {
        inviteId, inviteeUid: invite.inviteeUid, connectionId: connectionRef.id,
    });
    return {
        success: true,
        redirect: '/finance',
        message: `You're now connected with ${memberDisplayName}. No accounts are shared yet. Go to Finance to choose which accounts to share.`,
        memberName: memberDisplayName,
    };
});
//# sourceMappingURL=familyConnection.js.map