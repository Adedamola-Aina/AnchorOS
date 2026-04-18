import Foundation
import UserNotifications

@MainActor
final class PlatformIntegrationService: ObservableObject {
    func requestNotificationPermission() async {
        _ = try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])
    }

    func handleIncomingURL(_ url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return }
        if let token = components.queryItems?.first(where: { $0.name.lowercased().contains("invite") || $0.name == "token" })?.value,
           !token.isEmpty {
            UserDefaults.standard.set(token, forKey: "anchor_pending_invite_token")
            ToastStore.shared.show("Invite link captured", style: .success)
        }
    }
}
