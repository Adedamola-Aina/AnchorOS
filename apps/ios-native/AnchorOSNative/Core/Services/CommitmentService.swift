import FirebaseFirestore


/// Real-time listener + write operations for the user's commitments.
/// All reads/writes go through SecureDb — never bypass to Firestore directly.
final class CommitmentService {
    private let db = SecureDb.shared

    func listen(
        uid: String,
        onChange: @escaping ([AnchorCommitment]) -> Void
    ) -> ListenerRegistration {
        db.commitmentsCollection(uid: uid)
            .order(by: "createdAt", descending: false)
            .addSnapshotListener { snapshot, error in
                guard error == nil else { return }
                let commitments = snapshot?.documents.compactMap {
                    try? $0.data(as: AnchorCommitment.self)
                } ?? []
                onChange(commitments)
            }
    }

    func toggleCompleted(uid: String, taskId: String, completed: Bool) async throws {
        var data: [String: Any] = ["completed": completed]
        if completed {
            data["lastCompletedAt"] = ISO8601DateFormatter().string(from: Date())
        }
        // Routes through SecureDb — updatedAt/updatedBy added centrally.
        try await db.updateDocument(uid: uid, path: ["commitments", taskId], data: data)
    }

    func addCommitment(
        uid: String,
        title: String,
        type: String,
        domain: String,
        timeOfDay: String?,
        notes: String?,
        priority: String? = nil,
        scope: String? = nil
    ) async throws {
        var data: [String: Any] = [
            "title": title,
            "type": type,
            "domain": domain,
            "completed": false
        ]
        if let t = timeOfDay { data["timeOfDay"] = t }
        if let n = notes, !n.isEmpty { data["notes"] = n }
        if let p = priority, !p.isEmpty { data["priority"] = p }
        if let s = scope, !s.isEmpty { data["scope"] = s }
        try await db.addDocument(uid: uid, collection: "commitments", data: data)
    }

    func updateCommitment(
        uid: String,
        taskId: String,
        title: String,
        type: String,
        domain: String,
        timeOfDay: String?,
        notes: String?,
        priority: String? = nil,
        scope: String? = nil
    ) async throws {
        var data: [String: Any] = [
            "title": title,
            "type": type,
            "domain": domain
        ]
        if let t = timeOfDay { data["timeOfDay"] = t }
        if let n = notes, !n.isEmpty { data["notes"] = n }
        if let p = priority { data["priority"] = p }
        if let s = scope { data["scope"] = s }
        // Routes through SecureDb — updatedAt/updatedBy added centrally.
        try await db.updateDocument(uid: uid, path: ["commitments", taskId], data: data)
    }

    func deleteCommitment(uid: String, taskId: String) async throws {
        try await db.deleteDocument(uid: uid, path: ["commitments", taskId])
    }
}
