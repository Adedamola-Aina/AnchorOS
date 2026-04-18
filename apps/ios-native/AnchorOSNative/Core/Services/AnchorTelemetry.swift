import Foundation
import FirebaseAnalytics
import FirebaseCrashlytics
import FirebasePerformance

/// WS-3 — thin wrapper that mirrors the PWA `src/telemetry/` event vocabulary so
/// analytics dashboards receive matching event names from both surfaces.
///
/// Events are intentionally a small, named set. New events require a PLAN entry
/// per `.anchor/WORKFLOW.md` and must be added to the PWA telemetry at the same
/// time to keep the two surfaces aligned.
final class AnchorTelemetry {
    static let shared = AnchorTelemetry()
    private init() {}

    enum Event: String {
        case appLaunch = "app_launch"
        case authSignIn = "auth_sign_in"
        case authSignUp = "auth_sign_up"
        case addTransaction = "finance_add_transaction"
        case completeTask = "commitment_complete"
        case fabricQuery = "fabric_query"
        case inviteSent = "family_invite_sent"
        case bankConnect = "finance_bank_connect"
        case reminderFired = "commitment_reminder_fired"
        case biometricUnlock = "biometric_unlock"
        case signOut = "auth_sign_out"
    }

    func logEvent(_ name: String, params: [String: Any] = [:]) {
        Analytics.logEvent(name, parameters: params)
    }

    func log(_ event: Event, params: [String: Any] = [:]) {
        logEvent(event.rawValue, params: params)
    }

    func recordError(_ error: Error, context: String) {
        let userInfo = ["anchor_context": context]
        let nserror = NSError(domain: "AnchorOSNative", code: 0, userInfo: userInfo)
        Crashlytics.crashlytics().record(error: error)
        Crashlytics.crashlytics().record(error: nserror)
    }

    func trace(_ name: String, _ block: () throws -> Void) rethrows {
        let t = Performance.startTrace(name: name)
        defer { t?.stop() }
        try block()
    }

    func setUser(uid: String?) {
        Analytics.setUserID(uid)
        if let uid { Crashlytics.crashlytics().setUserID(uid) }
    }
}
