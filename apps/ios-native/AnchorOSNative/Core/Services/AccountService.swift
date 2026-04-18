import FirebaseFirestore


/// Real-time listener + write operations for the user's financial accounts.
/// All reads/writes go through SecureDb — never bypass to Firestore directly.
final class AccountService {
    private let db = SecureDb.shared

    func listen(
        uid: String,
        onChange: @escaping ([AnchorAccount]) -> Void
    ) -> ListenerRegistration {
        db.accountsCollection(uid: uid)
            .addSnapshotListener { snapshot, error in
                guard error == nil else { return }
                let accounts = snapshot?.documents.compactMap {
                    try? $0.data(as: AnchorAccount.self)
                } ?? []
                let active = accounts
                    .filter { $0.isArchived != true }
                    .sorted {
                        ($0.sortOrder ?? Int.max) < ($1.sortOrder ?? Int.max)
                    }
                onChange(active)
            }
    }

    func addAccount(
        uid: String,
        name: String,
        type: String,
        currency: String,
        balanceCents: Int,
        color: String = "#3D52D5",
        institution: String? = nil,
        artwork: String? = nil
    ) async throws {
        let data: [String: Any] = [
            "name": name,
            "type": type,
            "currency": currency,
            "balanceCents": balanceCents,
            "color": color,
            "institution": institution ?? "",
            "artwork": artwork ?? "stripes",
            "scope": "personal",
            "isArchived": false,
            "sortOrder": Int(Date().timeIntervalSince1970)
        ]
        // Routes through SecureDb — audit fields (createdAt/createdBy/updatedAt/updatedBy) added centrally.
        try await db.addDocument(uid: uid, collection: "accounts", data: data)
    }

    func deleteAccount(uid: String, accountId: String) async throws {
        // Soft-delete: audit fields updated so downstream sees the archive event.
        try await db.updateDocument(uid: uid, path: ["accounts", accountId], data: ["isArchived": true])
    }

    func updateAccount(
        uid: String,
        accountId: String,
        name: String,
        type: String,
        currency: String,
        balanceCents: Int,
        color: String = "#3D52D5",
        institution: String? = nil,
        artwork: String? = nil
    ) async throws {
        let data: [String: Any] = [
            "name": name,
            "type": type,
            "currency": currency,
            "balanceCents": balanceCents,
            "color": color,
            "institution": institution ?? "",
            "artwork": artwork ?? "stripes"
        ]
        try await db.updateDocument(uid: uid, path: ["accounts", accountId], data: data)
    }
}
