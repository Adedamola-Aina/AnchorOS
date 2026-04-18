import Foundation
import UIKit
import UserNotifications

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

    func requestNotificationPermission() async {
        let granted = (try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])) ?? false
        if granted {
            UIApplication.shared.registerForRemoteNotifications()
        }
    }

    func handleIncomingURL(_ url: URL) {
        if let token = Self.extractInviteToken(from: url), !token.isEmpty {
            UserDefaults.standard.set(token, forKey: "anchor_pending_invite_token")
            ToastStore.shared.show("Invite link captured", style: .success)
            AnchorHaptics.success()
        }

        if Self.isBankCallback(url) {
            UserDefaults.standard.set(true, forKey: "anchor_bank_connected")
            ToastStore.shared.show("Bank connection synced", style: .success)
            AnchorHaptics.success()
        }
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

    func syncPushTokenIfAvailable(uid: String) async {
        guard Self.shouldStorePushToken(lastPushToken) else { return }
        try? await SecureDb.shared.setDocument(
            uid: uid,
            path: ["pushTokens", "ios"],
            data: [
                "token": lastPushToken,
                "source": lastPushSource,
                "platform": "ios",
                "updatedAtClient": ISO8601DateFormatter().string(from: Date())
            ],
            merge: true
        )
    }
}
