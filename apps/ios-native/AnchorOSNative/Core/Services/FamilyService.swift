import FirebaseFirestore
import FirebaseFunctions

/// FamilyService — Cloud Function calls + Firestore listeners for Family Mode.
///
/// All Firestore reads go through SecureDb. Cloud Functions are called via
/// FirebaseFunctions — the server enforces all security rules.
final class FamilyService {
    private let db = SecureDb.shared
    private let functions = Functions.functions()

    // MARK: — Active Connection Listener

    /// Subscribe to the active family connection for `uid`.
    /// Mirrors `subscribeToActiveFamilyConnection` in the PWA.
    /// The PWA runs two queries (ownerUid + memberUid); we do the same.
    func subscribeToConnection(
        uid: String,
        onChange: @escaping (AnchorFamilyConnection?) -> Void
    ) -> [ListenerRegistration] {
        let col = db.familyConnectionsCollection
        var ownerResult: AnchorFamilyConnection?
        var memberResult: AnchorFamilyConnection?

        let emit = {
            onChange(ownerResult ?? memberResult)
        }

        let ownerListener = col
            .whereField("ownerUid", isEqualTo: uid)
            .whereField("status", isEqualTo: "active")
            .addSnapshotListener { snapshot, _ in
                ownerResult = snapshot?.documents.first.flatMap {
                    try? $0.data(as: AnchorFamilyConnection.self)
                }
                emit()
            }

        let memberListener = col
            .whereField("memberUid", isEqualTo: uid)
            .whereField("status", isEqualTo: "active")
            .addSnapshotListener { snapshot, _ in
                memberResult = snapshot?.documents.first.flatMap {
                    try? $0.data(as: AnchorFamilyConnection.self)
                }
                emit()
            }

        return [ownerListener, memberListener]
    }

    // MARK: — Cloud Function Calls

    /// Send a family invitation to `recipientEmail`.
    /// Calls `createFamilyInvitation` Cloud Function.
    func createInvitation(ownerName: String, recipientEmail: String) async throws {
        let callable = functions.httpsCallable("createFamilyInvitation")
        _ = try await callable.call([
            "recipientEmail": recipientEmail,
            "ownerName": ownerName
        ] as [String: Any])
    }

    /// Accept a family invitation with the 6-digit `token`.
    /// Calls `acceptInvitation` Cloud Function.
    func acceptInvitation(token: String) async throws {
        let callable = functions.httpsCallable("acceptInvitation")
        _ = try await callable.call(["inviteToken": token] as [String: Any])
    }

    /// Share or unshare an account with the connected family member.
    /// Calls `shareAccount` Cloud Function.
    func shareAccount(accountId: String, share: Bool) async throws {
        let callable = functions.httpsCallable("shareAccount")
        _ = try await callable.call([
            "accountId": accountId,
            "share": share
        ] as [String: Any])
    }

    /// Update permission level for a member already on a shared account.
    /// Mirrors PWA `updateSharedPermission` — writes directly to Firestore;
    /// security rules gate the write to the account owner.
    /// `permission`: "read" | "transact" | "manage"
    func updateSharedPermission(
        ownerUid: String,
        accountId: String,
        memberUid: String,
        permission: String
    ) async throws {
        let ref = db.accountsCollection(uid: ownerUid).document(accountId)
        try await ref.updateData([
            "sharedWith.\(memberUid).permission": permission
        ])
    }

    /// Disconnect from the family connection.
    /// Calls `disconnectFamily` Cloud Function.
    /// `type`: "remove_member" (owner removes) | "leave" (member leaves)
    func disconnectFamily(type: String) async throws {
        let callable = functions.httpsCallable("disconnectFamily")
        _ = try await callable.call(["type": type] as [String: Any])
    }

    // MARK: — Awaiting Confirmation (Owner-side)

    /// Subscribe to invitations the owner has sent that the invitee has accepted
    /// and are now waiting for the owner to confirm. Mirrors the PWA AwaitingConfirmationCard.
    func subscribeAwaitingConfirmation(
        ownerUid: String,
        onChange: @escaping ([AnchorFamilyInvitation]) -> Void
    ) -> ListenerRegistration {
        return db.familyInvitationsCollection
            .whereField("ownerUid", isEqualTo: ownerUid)
            .whereField("status", isEqualTo: "awaiting_confirmation")
            .addSnapshotListener { snap, _ in
                let invites: [AnchorFamilyInvitation] = snap?.documents.compactMap {
                    try? $0.data(as: AnchorFamilyInvitation.self)
                } ?? []
                onChange(invites)
            }
    }

    /// Subscribe to recent invite history for the current owner.
    /// Used by FamilyInviteHistoryCard for visibility into pending / accepted / rejected invites.
    func subscribeInviteHistory(
        ownerUid: String,
        onChange: @escaping ([AnchorFamilyInvitation]) -> Void
    ) -> ListenerRegistration {
        db.familyInvitationsCollection
            .whereField("ownerUid", isEqualTo: ownerUid)
            .addSnapshotListener { snap, _ in
                let invites: [AnchorFamilyInvitation] = snap?.documents.compactMap {
                    try? $0.data(as: AnchorFamilyInvitation.self)
                } ?? []
                let sorted = invites.sorted { ($0.createdAt ?? "") > ($1.createdAt ?? "") }
                onChange(Array(sorted.prefix(10)))
            }
    }

    /// Owner confirms or rejects a pending invitation.
    /// Calls `confirmConnection` Cloud Function.
    func confirmConnection(inviteId: String, confirmed: Bool) async throws {
        let callable = functions.httpsCallable("confirmConnection")
        _ = try await callable.call([
            "inviteId": inviteId,
            "confirmed": confirmed,
            "password": ""    // backend accepts empty; reauth gated client-side
        ] as [String: Any])
    }

    // MARK: — Mood Persistence

    /// Write today's mood to Firestore fabric/mood doc.
    func saveMood(uid: String, mood: String) async throws {
        let data: [String: Any] = [
            "mood": mood,
            "recordedAt": FieldValue.serverTimestamp()
        ]
        try await db.userMoodDocument(uid: uid).setData(data, merge: true)
    }
}
