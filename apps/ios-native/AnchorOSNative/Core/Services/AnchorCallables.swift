import Foundation
import FirebaseFunctions

/// WS-7 — native client for the Cloud Functions previously marked MISSING
/// in docs/NATIVE_PARITY_AUDIT.md §14. Each method wraps the callable with
/// the minimal shape needed by the native UI. Server-side logic is unchanged
/// (single source of truth in `functions/src/`).
///
/// All calls route through Firebase Functions, which is already App-Check-
/// enforced by WS-2 — unauthenticated or unattested calls will be rejected
/// at the gateway.
@MainActor
final class AnchorCallables {
    static let shared = AnchorCallables()
    private init() {}

    private let functions = Functions.functions()

    // MARK: — Fabric nudges (functions/src/fabricNudges.ts)
    /// Requests the server to re-evaluate the user's nudge set. Used by the
    /// "Refresh nudges" action on the AnchorAI view.
    @discardableResult
    func refreshFabricNudges() async throws -> [String: Any] {
        let res = try await functions.httpsCallable("fabricNudges").call()
        return (res.data as? [String: Any]) ?? [:]
    }

    // MARK: — Weekly report (functions/src/weeklyReport.ts)
    /// Triggers the server-generated weekly report for the current user.
    @discardableResult
    func generateWeeklyReport() async throws -> [String: Any] {
        let res = try await functions.httpsCallable("weeklyReport").call()
        return (res.data as? [String: Any]) ?? [:]
    }

    // MARK: — MFA recovery (functions/src/mfaRecovery.ts)
    func consumeMFARecoveryCode(_ code: String) async throws -> Bool {
        let res = try await functions.httpsCallable("mfaRecovery").call(["code": code])
        return (res.data as? [String: Any])?["ok"] as? Bool ?? false
    }

    // MARK: — Feedback (functions/src/feedback.ts)
    func sendFeedback(message: String, category: String, contact: String?) async throws {
        var payload: [String: Any] = ["message": message, "category": category]
        if let contact { payload["contact"] = contact }
        _ = try await functions.httpsCallable("feedback").call(payload)
    }

    // MARK: — Delete account (functions/src/deleteAccount.ts)
    /// Irreversible. The UI must collect an explicit reauth token first.
    func deleteAccount(reauthToken: String) async throws {
        _ = try await functions.httpsCallable("deleteAccount").call([
            "reauthToken": reauthToken
        ])
    }

    // MARK: — Device attestation (functions/src/deviceAttestation.ts)
    /// Called pre-sensitive op. Server returns a short-lived allow token.
    @discardableResult
    func attestDevice() async throws -> String? {
        let res = try await functions.httpsCallable("deviceAttestation").call()
        return (res.data as? [String: Any])?["token"] as? String
    }

    // MARK: — Auth alert detection (functions/src/authAlertDetection.ts)
    /// Called post-auth-event so the backend can issue anomaly alerts.
    func reportAuthEvent(kind: String, metadata: [String: Any] = [:]) async throws {
        var payload: [String: Any] = ["kind": kind]
        for (k, v) in metadata { payload[k] = v }
        _ = try await functions.httpsCallable("authAlertDetection").call(payload)
    }
}
