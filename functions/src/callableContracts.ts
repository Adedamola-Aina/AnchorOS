import { CALLABLE_REGISTRY } from './callableRegistry';

export interface ObjectContract {
    type: 'object';
    required?: string[];
}

export interface CallableContract {
    request: ObjectContract;
    response: ObjectContract;
}

function objectContract(requestRequired: string[] = [], responseRequired: string[] = []): CallableContract {
    return {
        request: { type: 'object', required: requestRequired },
        response: { type: 'object', required: responseRequired },
    };
}

export const CALLABLE_CONTRACTS: Readonly<Record<string, CallableContract>> = {
    acceptInvitation: objectContract(),
    addTransactionToSharedAccount: objectContract(),
    checkRateLimit: objectContract(['bucket'], ['allowed']),
    completePasskeyRegistration: objectContract(),
    confirmConnection: objectContract(),
    createFamilyInvitation: objectContract(),
    createRecurringTransaction: objectContract(),
    deleteMyAccount: objectContract(),
    deletePasskey: objectContract(),
    deleteRecurringTransaction: objectContract(),
    disconnectFamily: objectContract(),
    dismissAuthEvent: objectContract(),
    dismissNotification: objectContract(),
    fixSharedAccountScopes: objectContract(),
    getMigrationStatus: objectContract(),
    getNotifications: objectContract(),
    getSharedAccountsWithMe: objectContract(),
    health: objectContract([], ['ok']),
    issuePasskeyChallenge: objectContract(),
    linkBankAccount: objectContract(),
    listActiveSessions: objectContract(),
    listMigrations: objectContract(),
    logAuditEvent: objectContract(),
    migrateFamilyConnectionsV2: objectContract(),
    recordAuthEvent: objectContract(),
    recoverMfaWithCode: objectContract(),
    reportUnrecognisedSignIn: objectContract(),
    resetRateLimit: objectContract(['bucket']),
    revokeInvitation: objectContract(),
    revokeSession: objectContract(),
    rollbackMigration: objectContract(),
    runMigration: objectContract(),
    sendTemplatedEmail: objectContract(),
    shareAccount: objectContract(),
    submitFeedback: objectContract(),
    syncBankAccountNow: objectContract(),
    syncEmailToProfile: objectContract(),
    toggleRecurringTransaction: objectContract(),
    unlinkBankAccount: objectContract(),
    updateRecurringTransaction: objectContract(),
    validateInvitationToken: objectContract(),
    verifyDeviceAttestation: objectContract(),
    verifyPasskeyAssertion: objectContract(),
};

export function validateObjectContractPayload(payload: unknown, contract: ObjectContract): string[] {
    if (contract.type !== 'object') return ['Unsupported contract type'];
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return ['Payload must be an object'];
    }

    const required = contract.required || [];
    const missing = required.filter((field) => !(field in (payload as Record<string, unknown>)));
    return missing.map((field) => `Missing required field: ${field}`);
}

export function validateCallableContract(name: string, request: unknown, response: unknown): string[] {
    const contract = CALLABLE_CONTRACTS[name];
    if (!contract) return [`Missing callable contract for ${name}`];
    return [
        ...validateObjectContractPayload(request, contract.request).map((e) => `request: ${e}`),
        ...validateObjectContractPayload(response, contract.response).map((e) => `response: ${e}`),
    ];
}

export function getCallableNamesFromRegistry(): string[] {
    return CALLABLE_REGISTRY.filter((entry) => entry.trigger === 'callable').map((entry) => entry.name).sort();
}
