// @ts-nocheck

const crypto = require('node:crypto');

function normalizeHeaders(headers = {}) {
    const normalized = {};
    for (const [key, value] of Object.entries(headers)) {
        normalized[String(key).toLowerCase()] = value;
    }
    return normalized;
}

function isStrictWebhookMode() {
    return String(process.env.INTEGRATION_WEBHOOK_ENFORCE_SECRET || '').toLowerCase() === 'true';
}

function getWebhookSecret(providerConfig = {}) {
    const envName = providerConfig.webhookSecretEnv;
    return envName ? String(process.env[envName] || '') : '';
}

function safeStringEqual(left = '', right = '') {
    const leftBuffer = Buffer.from(String(left));
    const rightBuffer = Buffer.from(String(right));
    if (leftBuffer.length !== rightBuffer.length) return false;
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getRawPayloadBody(payload, meta = {}) {
    if (typeof meta.rawBody === 'string' && meta.rawBody.length > 0) {
        return meta.rawBody;
    }
    return JSON.stringify(payload || {});
}

function isValidSignature(signatureValue, secret, rawBody) {
    if (!signatureValue || !secret) return false;
    const provided = String(signatureValue).trim().toLowerCase();
    const normalizedProvided = provided.startsWith('sha256=') ? provided.slice(7) : provided;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex').toLowerCase();
    return safeStringEqual(normalizedProvided, expected);
}

function verifyWebhookRequest({ provider, providerConfig, payload, meta = {} }) {
    const secret = getWebhookSecret(providerConfig);
    const strictMode = isStrictWebhookMode();

    if (!secret) {
        if (strictMode) {
            throw new Error(`Webhook secret not configured for provider: ${provider}`);
        }
        return {
            required: false,
            verified: false,
            method: 'none',
            strictMode
        };
    }

    const headers = normalizeHeaders(meta.headers);
    const sharedSecretHeader = headers['x-integration-secret'] || headers['x-webhook-secret'];

    if (sharedSecretHeader && safeStringEqual(sharedSecretHeader, secret)) {
        return {
            required: true,
            verified: true,
            method: 'shared-secret',
            strictMode
        };
    }

    const rawBody = getRawPayloadBody(payload, meta);
    const signatureHeader = headers['x-integration-signature'] || headers['x-hook-signature'] || headers['x-hub-signature-256'];
    if (isValidSignature(signatureHeader, secret, rawBody)) {
        return {
            required: true,
            verified: true,
            method: 'hmac-sha256',
            strictMode
        };
    }

    throw new Error('Unauthorized webhook request: missing or invalid webhook authentication');
}

module.exports = {
    isStrictWebhookMode,
    getWebhookSecret,
    verifyWebhookRequest
};
