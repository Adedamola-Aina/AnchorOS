"use strict";
/**
 * Shared configuration for Cloud Functions
 *
 * Firebase admin initialization, Firestore reference, Resend client,
 * and environment-aware URL resolution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_URL = exports.EMAIL_FROM = exports.BCRYPT_SALT_ROUNDS = exports.APP_ID = exports.db = void 0;
exports.getResend = getResend;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const resend_1 = require("resend");
(0, app_1.initializeApp)();
exports.db = (0, firestore_1.getFirestore)();
exports.APP_ID = 'anchor-os';
exports.BCRYPT_SALT_ROUNDS = 10;
// Resend client — lazy initialized to avoid module-load errors
let resendClient = null;
function getResend() {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }
        resendClient = new resend_1.Resend(apiKey);
    }
    return resendClient;
}
// Email configuration from environment variables
exports.EMAIL_FROM = process.env.EMAIL_FROM || 'Anchor OS <noreply@adedamola.us>';
// Determine APP_URL based on Firebase project ID
function getAppUrl() {
    if (process.env.APP_URL)
        return process.env.APP_URL;
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || '';
    if (projectId === 'anchor-os') {
        return 'https://anchor-os.web.app';
    }
    else if (projectId === 'anchor-os-staging') {
        return 'https://anchor-os-staging.web.app';
    }
    else if (projectId.includes('dev')) {
        return 'https://anchor-os-dev-1c6ec.web.app';
    }
    return 'https://anchor-os.web.app';
}
exports.APP_URL = getAppUrl();
//# sourceMappingURL=config.js.map