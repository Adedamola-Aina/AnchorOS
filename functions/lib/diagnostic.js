"use strict";
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
exports.diagnoseFamilySharing = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
const APP_ID = 'anchor-os';
/**
 * Diagnostic function to check family sharing setup
 */
exports.diagnoseFamilySharing = functions.https.onCall(async (_data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const userId = context.auth.uid;
    const userEmail = context.auth.token.email;
    const report = {
        userId,
        userEmail,
        timestamp: new Date().toISOString(),
        checks: {},
    };
    // 1. Check family connections
    const connectionsAsOwner = await db
        .collection('artifacts')
        .doc(APP_ID)
        .collection('family_connections')
        .where('ownerUid', '==', userId)
        .where('status', '==', 'active')
        .get();
    const connectionsAsMember = await db
        .collection('artifacts')
        .doc(APP_ID)
        .collection('family_connections')
        .where('memberUid', '==', userId)
        .where('status', '==', 'active')
        .get();
    report.checks.familyConnection = {
        asOwner: connectionsAsOwner.docs.map(d => (Object.assign({ id: d.id }, d.data()))),
        asMember: connectionsAsMember.docs.map(d => (Object.assign({ id: d.id }, d.data()))),
    };
    // 2. Check accounts I own with sharedWith
    const myAccounts = await db
        .collection('artifacts')
        .doc(APP_ID)
        .collection('users')
        .doc(userId)
        .collection('accounts')
        .get();
    report.checks.myAccounts = myAccounts.docs.map(d => ({
        id: d.id,
        name: d.data().name,
        scope: d.data().scope,
        sharedWith: d.data().sharedWith ? Object.keys(d.data().sharedWith) : [],
        hasSharedWith: !!d.data().sharedWith && Object.keys(d.data().sharedWith).length > 0,
    }));
    // 3. If I'm a member, check what accounts are shared with me
    if (!connectionsAsMember.empty) {
        const ownerUid = connectionsAsMember.docs[0].data().ownerUid;
        const ownerAccounts = await db
            .collection('artifacts')
            .doc(APP_ID)
            .collection('users')
            .doc(ownerUid)
            .collection('accounts')
            .get();
        report.checks.accountsSharedWithMe = ownerAccounts.docs
            .filter(d => {
            const sharedWith = d.data().sharedWith || {};
            return sharedWith[userId] !== undefined;
        })
            .map(d => {
            var _a, _b;
            return ({
                id: d.id,
                name: d.data().name,
                scope: d.data().scope,
                sharedAt: (_b = (_a = d.data().sharedWith) === null || _a === void 0 ? void 0 : _a[userId]) === null || _b === void 0 ? void 0 : _b.grantedAt,
            });
        });
        report.checks.ownerUid = ownerUid;
    }
    // 4. If I'm an owner, check member's access
    if (!connectionsAsOwner.empty) {
        const memberUid = connectionsAsOwner.docs[0].data().memberUid;
        report.checks.memberUid = memberUid;
    }
    return report;
});
//# sourceMappingURL=diagnostic.js.map