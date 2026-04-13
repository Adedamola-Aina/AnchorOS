import Foundation

/// Fetches and holds the authenticated user's Firestore profile.
/// Started and stopped by AnchorOSNativeApp based on auth state.
@MainActor
final class UserProfileStore: ObservableObject {
    @Published private(set) var profile: AnchorUserProfile?

    private let service = UserProfileService()

    var displayName: String { profile?.resolvedDisplayName ?? "You" }
    var email: String { profile?.email ?? "" }
    var currency: String { profile?.resolvedCurrency ?? "NGN" }
    var mfaEnabled: Bool { profile?.mfaEnabled ?? false }

    func start(uid: String) async {
        profile = await service.fetch(uid: uid)
    }

    func stop() {
        profile = nil
    }
}
