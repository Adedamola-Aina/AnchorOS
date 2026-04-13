import FirebaseFirestore
import Combine

/// FamilyStore — observable state for Family Mode.
/// Mirrors useFamilySharing + the connection subscription pattern from the PWA.
@MainActor
final class FamilyStore: ObservableObject {
    @Published var connection: AnchorFamilyConnection?
    @Published var isLoading = true
    @Published var inviteSent = false   // true after createInvitation succeeds

    private var uid: String?
    private var listeners: [ListenerRegistration] = []
    private let service = FamilyService()

    // MARK: — Computed

    var hasConnection: Bool { connection != nil }

    var isOwner: Bool {
        guard let uid, let conn = connection else { return false }
        return conn.isOwner(uid: uid)
    }

    var partnerName: String {
        guard let uid else { return "" }
        return connection?.partnerName(for: uid) ?? ""
    }

    // MARK: — Lifecycle

    func start(uid: String) {
        self.uid = uid
        isLoading = true

        let registered = service.subscribeToConnection(uid: uid) { [weak self] conn in
            guard let self else { return }
            Task { @MainActor in
                self.connection = conn
                self.isLoading = false
            }
        }
        listeners = registered
    }

    func stop() {
        listeners.forEach { $0.remove() }
        listeners = []
        uid = nil
        connection = nil
        isLoading = true
        inviteSent = false
    }

    // MARK: — Actions

    /// Send an invitation to a recipient email.
    func createInvitation(ownerName: String, recipientEmail: String) async throws {
        try await service.createInvitation(ownerName: ownerName, recipientEmail: recipientEmail)
        inviteSent = true
    }

    /// Accept an invitation using the 6-digit token.
    func acceptInvitation(token: String) async throws {
        try await service.acceptInvitation(token: token)
    }

    /// Share or unshare a specific account.
    func shareAccount(accountId: String, share: Bool) async throws {
        try await service.shareAccount(accountId: accountId, share: share)
    }

    /// Owner removes member, or member leaves connection.
    func disconnect() async throws {
        let type = isOwner ? "remove_member" : "leave"
        try await service.disconnectFamily(type: type)
    }
}
