import FirebaseFirestore
import Combine

/// FamilyStore — observable state for Family Mode.
/// Mirrors useFamilySharing + the connection subscription pattern from the PWA.
@MainActor
final class FamilyStore: ObservableObject {
    @Published var connection: AnchorFamilyConnection?
    @Published var isLoading = true
    @Published var inviteSent = false   // true after createInvitation succeeds
    @Published var awaitingConfirmations: [AnchorFamilyInvitation] = []

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

        let awaiting = service.subscribeAwaitingConfirmation(ownerUid: uid) { [weak self] invites in
            guard let self else { return }
            Task { @MainActor in
                self.awaitingConfirmations = invites
            }
        }
        listeners.append(awaiting)

        // Consume any pre-auth invite token saved by AcceptInviteSheet.
        // Mirrors PWA /accept-invite redirect → auto-accept post-auth.
        consumePendingInviteToken()
    }

    /// Reads `anchor_pending_invite_token` from UserDefaults; if present,
    /// attempts to accept the invitation and clears the token regardless
    /// of the outcome (failures bubble up as a toast for visibility).
    private func consumePendingInviteToken() {
        let key = "anchor_pending_invite_token"
        let token = UserDefaults.standard.string(forKey: key) ?? ""
        guard !token.isEmpty else { return }
        UserDefaults.standard.removeObject(forKey: key)
        Task { @MainActor in
            do {
                try await self.service.acceptInvitation(token: token)
                ToastStore.shared.show("Family connection activated 🎉", style: .success)
            } catch {
                ToastStore.shared.show(
                    "Invite code couldn't be applied — try in Settings → Family.",
                    style: .info
                )
            }
        }
    }

    func stop() {
        listeners.forEach { $0.remove() }
        listeners = []
        uid = nil
        connection = nil
        isLoading = true
        inviteSent = false
        awaitingConfirmations = []
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

    /// Update the permission level for the connected member on a shared account.
    func updateSharedPermission(accountId: String, permission: String) async throws {
        guard let uid, let conn = connection else { return }
        try await service.updateSharedPermission(
            ownerUid: uid,
            accountId: accountId,
            memberUid: conn.memberUid,
            permission: permission
        )
    }

    /// Owner removes member, or member leaves connection.
    func disconnect() async throws {
        let type = isOwner ? "remove_member" : "leave"
        try await service.disconnectFamily(type: type)
    }

    /// Owner confirms (or rejects) a pending family invitation that the
    /// invitee has accepted. Calls `confirmConnection` Cloud Function.
    func confirmConnection(inviteId: String, confirmed: Bool) async throws {
        try await service.confirmConnection(inviteId: inviteId, confirmed: confirmed)
    }
}
