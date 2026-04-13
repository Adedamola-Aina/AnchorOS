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
        let ref = db.commitmentDocument(uid: uid, taskId: taskId)
        var data: [String: Any] = ["completed": completed]
        if completed {
            data["lastCompletedAt"] = ISO8601DateFormatter().string(from: Date())
        }
        try await ref.updateData(data)
    }

    func addCommitment(
        uid: String,
        title: String,
        type: String,
        domain: String,
        timeOfDay: String?,
        notes: String?
    ) async throws {
        let ref = db.commitmentsCollection(uid: uid).document()
        var data: [String: Any] = [
            "title": title,
            "type": type,
            "domain": domain,
            "completed": false,
            "createdAt": FieldValue.serverTimestamp()
        ]
        if let t = timeOfDay { data["timeOfDay"] = t }
        if let n = notes, !n.isEmpty { data["notes"] = n }
        try await ref.setData(data)
    }

    func updateCommitment(
        uid: String,
        taskId: String,
        title: String,
        type: String,
        domain: String,
        timeOfDay: String?,
        notes: String?
    ) async throws {
        var data: [String: Any] = [
            "title": title,
            "type": type,
            "domain": domain,
            "updatedAt": FieldValue.serverTimestamp()
        ]
        if let t = timeOfDay { data["timeOfDay"] = t }
        if let n = notes, !n.isEmpty { data["notes"] = n }
        try await db.commitmentDocument(uid: uid, taskId: taskId).updateData(data)
    }

    func deleteCommitment(uid: String, taskId: String) async throws {
        try await db.commitmentDocument(uid: uid, taskId: taskId).delete()
    }
}
