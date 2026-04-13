import Foundation
import FirebaseAuth

/// Fetches and holds the authenticated user's Firestore profile.
/// Started and stopped by AnchorOSNativeApp based on auth state.
@MainActor
final class UserProfileStore: ObservableObject {
    @Published private(set) var profile: AnchorUserProfile?

    private var uid: String?
    private let service = UserProfileService()

    /// Resolves display name: Firestore doc → Firebase Auth displayName → email prefix → "You"
    var displayName: String {
        if let name = profile?.displayName, !name.isEmpty { return name }
        if let authName = Auth.auth().currentUser?.displayName, !authName.isEmpty { return authName }
        if let email = Auth.auth().currentUser?.email {
            return String(email.split(separator: "@").first ?? "")
        }
        return "You"
    }

    /// Resolves email: Firestore doc → Firebase Auth email
    var email: String {
        if let e = profile?.email, !e.isEmpty { return e }
        return Auth.auth().currentUser?.email ?? ""
    }

    var currency: String { profile?.resolvedCurrency ?? "NGN" }
    var mfaEnabled: Bool { profile?.mfaEnabled ?? false }

    func start(uid: String) async {
        self.uid = uid
        profile = await service.fetch(uid: uid)
    }

    func stop() {
        profile = nil
        uid = nil
    }

    func updateDisplayName(_ name: String) async throws {
        guard let uid else { return }
        try await service.updateDisplayName(uid: uid, name: name)
        // Refresh profile
        profile = await service.fetch(uid: uid)
    }

    func updateCurrency(_ currency: String) async throws {
        guard let uid else { return }
        try await service.updateCurrency(uid: uid, currency: currency)
        profile = await service.fetch(uid: uid)
    }
}
