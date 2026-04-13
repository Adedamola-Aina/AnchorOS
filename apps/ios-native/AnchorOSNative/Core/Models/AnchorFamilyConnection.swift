import FirebaseFirestore

/// Mirrors the `FamilyConnection` interface from the PWA.
/// Path: `artifacts/anchor-os/family_connections/{connectionId}`
struct AnchorFamilyConnection: Codable, Identifiable {
    @DocumentID var id: String?
    var ownerUid: String
    var memberUid: String
    var ownerName: String
    var memberName: String
    var status: String          // "active" | "disconnected"
    var connectedAt: String?

    var resolvedId: String { id ?? "" }

    /// Name of the family member from the perspective of `currentUid`.
    func partnerName(for currentUid: String) -> String {
        ownerUid == currentUid ? memberName : ownerName
    }

    func isOwner(uid: String) -> Bool { ownerUid == uid }
}
