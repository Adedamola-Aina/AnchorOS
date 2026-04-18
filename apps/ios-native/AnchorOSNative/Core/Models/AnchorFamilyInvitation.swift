import FirebaseFirestore

/// Mirrors the `FamilyInvitation` interface from the PWA.
/// Path: `artifacts/anchor-os/family_invitations/{inviteId}`
///
/// Status lifecycle:
///   pending → awaiting_confirmation → accepted (active connection) | rejected | expired
struct AnchorFamilyInvitation: Codable, Identifiable {
    @DocumentID var id: String?
    var ownerUid: String
    var ownerDisplayName: String
    var inviteeEmail: String
    var inviteeUid: String?
    var status: String              // pending | awaiting_confirmation | accepted | rejected | expired
    var createdAt: String?
    var acceptedAt: String?

    var resolvedId: String { id ?? "" }

    var isAwaitingConfirmation: Bool { status == "awaiting_confirmation" }
}
