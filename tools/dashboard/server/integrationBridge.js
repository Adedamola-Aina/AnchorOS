// @ts-nocheck

const { publishEvent, getRecentEvents } = require('./eventIngestion');
const { isStrictWebhookMode, getWebhookSecret, verifyWebhookRequest } = require('./integrationWebhookSecurity');

const PROVIDERS = {
    jira: {
        name: 'Jira',
        env: ['JIRA_BASE_URL', 'JIRA_API_TOKEN'],
        webhookSecretEnv: 'JIRA_WEBHOOK_SECRET'
    },
    asana: {
        name: 'Asana',
        env: ['ASANA_WORKSPACE_GID', 'ASANA_ACCESS_TOKEN'],
        webhookSecretEnv: 'ASANA_WEBHOOK_SECRET'
    }
}

function extractWorkItemId(text = '') {
    const match = String(text).toUpperCase().match(/\b[A-Z]{2,6}-\d{3}\b/);
    return match ? match[0] : null;
}

function isConfigured(provider) {
    const config = PROVIDERS[provider];
    if (!config) return false;
    return config.env.every((envName) => Boolean(process.env[envName]));
}

function normalizeJira(payload = {}) {
    const issue = payload.issue || {};
    const summary = issue.fields?.summary || payload.title || 'Untitled Jira issue';

    return {
        provider: 'jira',
        externalId: issue.key || payload.id || null,
        eventType: payload.webhookEvent || payload.issue_event_type_name || 'issue_updated',
        title: summary,
        status: issue.fields?.status?.name || payload.status || 'unknown',
        workItemId: extractWorkItemId(`${summary} ${issue.fields?.description || ''}`),
        raw: payload
    };
}

function normalizeAsana(payload = {}) {
    const firstEvent = payload.events?.[0] || {};
    const resource = firstEvent.resource || payload.data || {};
    const title = resource.name || payload.title || 'Untitled Asana task';

    return {
        provider: 'asana',
        externalId: resource.gid || payload.id || null,
        eventType: firstEvent.action || payload.action || 'task_updated',
        title,
        status: resource.completed ? 'done' : (payload.status || 'open'),
        workItemId: extractWorkItemId(`${title} ${resource.notes || ''}`),
        raw: payload
    };
}

function normalizeWebhook(provider, payload) {
    if (provider === 'jira') return normalizeJira(payload);
    if (provider === 'asana') return normalizeAsana(payload);
    throw new Error(`Unsupported provider: ${provider}`);
}

function ingestWebhook(provider, payload, meta = {}) {
    if (!PROVIDERS[provider]) {
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const webhookAuth = verifyWebhookRequest({
        provider,
        providerConfig: PROVIDERS[provider],
        payload,
        meta
    });
    const normalized = normalizeWebhook(provider, payload);

    const event = publishEvent({
        source: `integration:${provider}`,
        type: `webhook:${normalized.eventType}`,
        level: 'info',
        status: 'received',
        entityId: normalized.externalId,
        message: `${PROVIDERS[provider].name} webhook: ${normalized.title}`,
        payload: {
            provider,
            workItemId: normalized.workItemId,
            status: normalized.status,
            ip: meta.ip || null,
            webhookAuth: {
                required: webhookAuth.required,
                verified: webhookAuth.verified,
                method: webhookAuth.method,
                strictMode: webhookAuth.strictMode
            }
        }
    });

    return {
        provider,
        configured: isConfigured(provider),
        webhookAuth,
        normalized,
        event
    };
}

async function syncProvider(provider, options = {}) {
    if (!PROVIDERS[provider]) {
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const configured = isConfigured(provider);
    const mode = options.mode || 'dry-run';
    const items = Array.isArray(options.items) ? options.items : [];

    publishEvent({
        source: `integration:${provider}`,
        type: 'sync:start',
        level: 'info',
        status: configured ? 'started' : 'skipped',
        message: `${PROVIDERS[provider].name} sync ${configured ? 'started' : 'skipped (not configured)'}`,
        payload: { mode, count: items.length }
    });

    const result = {
        provider,
        mode,
        configured,
        synced: configured ? items.length : 0,
        skipped: configured ? 0 : items.length,
        status: configured ? 'completed' : 'not-configured'
    };

    publishEvent({
        source: `integration:${provider}`,
        type: 'sync:complete',
        level: configured ? 'info' : 'warning',
        status: result.status,
        message: `${PROVIDERS[provider].name} sync ${result.status}`,
        payload: result
    });

    return result;
}

function getIntegrationStatus() {
    const statuses = {};
    const strictMode = isStrictWebhookMode();

    for (const provider of Object.keys(PROVIDERS)) {
        const latest = getRecentEvents({ limit: 1, source: `integration:${provider}` })[0] || null;
        const webhookSecretConfigured = Boolean(getWebhookSecret(PROVIDERS[provider]));
        statuses[provider] = {
            name: PROVIDERS[provider].name,
            configured: isConfigured(provider),
            webhookSecurity: {
                secretConfigured: webhookSecretConfigured,
                enforcement: strictMode ? 'strict' : 'optional'
            },
            lastEventAt: latest?.timestamp || null,
            lastEventType: latest?.type || null
        };
    }

    return {
        providers: statuses,
        summary: {
            total: Object.keys(PROVIDERS).length,
            configured: Object.values(statuses).filter((s) => s.configured).length,
            webhookSecretsConfigured: Object.values(statuses).filter((s) => s.webhookSecurity.secretConfigured).length,
            strictWebhookMode: strictMode
        }
    };
}

module.exports = {
    ingestWebhook,
    syncProvider,
    getIntegrationStatus,
    normalizeWebhook,
    extractWorkItemId,
    verifyWebhookRequest
};
