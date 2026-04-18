import Foundation
import UIKit
import UserNotifications
import FirebaseFirestore

@MainActor
final class PlatformIntegrationService: ObservableObject {
    @Published private(set) var lastPushToken: String = UserDefaults.standard.string(forKey: "anchor_push_token") ?? ""
    @Published private(set) var lastPushSource: String = UserDefaults.standard.string(forKey: "anchor_push_token_source") ?? "unknown"

    private var tokenObserver: NSObjectProtocol?

    init() {
        tokenObserver = NotificationCenter.default.addObserver(
            forName: .anchorDidReceivePushToken,
            object: nil,
            queue: .main
        ) { [weak self] note in
            guard let token = note.userInfo?["token"] as? String else { return }
            let source = note.userInfo?["source"] as? String ?? "unknown"
            self?.handlePushToken(token, source: source)
        }
    }

    deinit {
        if let tokenObserver {
            NotificationCenter.default.removeObserver(tokenObserver)
        }
    }

    static func extractInviteToken(from url: URL) -> String? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return nil }
        return components.queryItems?.first(where: {
            let name = $0.name.lowercased()
            return name.contains("invite") || name == "token"
        })?.value
    }

    static func isBankCallback(_ url: URL) -> Bool {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return false }
        return components.queryItems?.contains(where: {
            let name = $0.name.lowercased()
            let value = ($0.value ?? "").lowercased()
            return name.contains("bank") || value.contains("connected") || value.contains("mono")
        }) ?? false
    }

    static func shouldStorePushToken(_ token: String?) -> Bool {
        guard let token else { return false }
        return !token.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    /// WS-1 — the FCM collection path segments used by the PWA
    /// (`src/api/PushTokenApi.ts`). Exposed as a pure helper so unit tests can
    /// lock the shape without requiring a live Firestore.
    static func fcmTokenPathSegments(forToken token: String) -> [String] {
        ["fcmTokens", token]
    }

    /// Only FCM tokens hit the shared `fcmTokens` collection. Raw APNS tokens
    /// are replaced by Firebase Messaging automatically and must not be
    /// persisted — doing so breaks server dispatchers that treat every entry
    /// as a send-able FCM registration id.
    static func shouldPersistTokenToFirestore(source: String) -> Bool {
        source == "fcm"
    }

    func requestNotificationPermission() async {
        let granted = (try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])) ?? false
        if granted {
            UIApplication.shared.registerForRemoteNotifications()
        }
    }

    func handleIncomingURL(_ url: URL) {
        if let token = Self.extractInviteToken(from: url), !token.isEmpty {
            // WS-8 — invite tokens expire after 24h so a forgotten link
            // can't resurrect itself months later. Matches the PWA flow
            // that rejects tokens older than their server-issued TTL.
            UserDefaults.standard.set(token, forKey: "anchor_pending_invite_token")
            UserDefaults.standard.set(Date().timeIntervalSince1970,
                                      forKey: "anchor_pending_invite_issued_at")
            ToastStore.shared.show("Invite link captured", style: .success)
            AnchorHaptics.success()
        }

        if Self.isBankCallback(url) {
            UserDefaults.standard.set(true, forKey: "anchor_bank_connected")
            ToastStore.shared.show("Bank connection synced", style: .success)
            AnchorHaptics.success()
        }
    }

    /// Returns the stored invite token only when it is within its 24h TTL.
    /// Callers should treat nil as "no pending invite".
    static func validStoredInviteToken(now: Date = Date()) -> String? {
        let defaults = UserDefaults.standard
        guard let token = defaults.string(forKey: "anchor_pending_invite_token"),
              !token.isEmpty else { return nil }
        let issuedAt = defaults.double(forKey: "anchor_pending_invite_issued_at")
        if issuedAt > 0 {
            let age = now.timeIntervalSince1970 - issuedAt
            if age > 24 * 60 * 60 {
                defaults.removeObject(forKey: "anchor_pending_invite_token")
                defaults.removeObject(forKey: "anchor_pending_invite_issued_at")
                return nil
            }
        }
        return token
    }

    func handlePushToken(_ token: String, source: String = "unknown") {
        guard Self.shouldStorePushToken(token) else { return }
        let cleaned = token.trimmingCharacters(in: .whitespacesAndNewlines)
        lastPushToken = cleaned
        lastPushSource = source
        UserDefaults.standard.set(cleaned, forKey: "anchor_push_token")
        UserDefaults.standard.set(source, forKey: "anchor_push_token_source")

        if let uid = UserDefaults.standard.string(forKey: "anchor_current_uid"), !uid.isEmpty {
            Task { await syncPushTokenIfAvailable(uid: uid) }
        }
    }

    /// Writes FCM tokens to `artifacts/anchor-os/users/{uid}/fcmTokens/{token}`
    /// matching the PWA shape in `src/api/PushTokenApi.ts` so shared server
    /// dispatchers (reminders, weeklyReport, fabricNudges, billReminders) reach
    /// native devices. Only FCM tokens are stored — raw APNS tokens are ignored
    /// because `FirebaseMessaging` converts them to an FCM token automatically.
    func syncPushTokenIfAvailable(uid: String) async {
        guard Self.shouldStorePushToken(lastPushToken) else { return }
        // Only persist FCM-formatted tokens to the shared delivery collection.
        // The APNS token is still retained in-memory for diagnostics.
        guard Self.shouldPersistTokenToFirestore(source: lastPushSource) else { return }

        let userAgent = "AnchorOSNative/iOS \(UIDevice.current.systemVersion)"
        try? await SecureDb.shared.setDocument(
            uid: uid,
            path: Self.fcmTokenPathSegments(forToken: lastPushToken),
            data: [
                "token": lastPushToken,
                "platform": "ios",
                "userAgent": userAgent,
                "lastSeen": FieldValue.serverTimestamp()
            ],
            merge: true
        )
    }
}
