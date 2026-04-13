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

    func addAccount(uid: String, name: String, type: String, currency: String, balanceCents: Int) async throws {
        let ref = db.accountsCollection(uid: uid).document()
        let data: [String: Any] = [
            "name": name,
            "type": type,
            "currency": currency,
            "balanceCents": balanceCents,
            "scope": "personal",
            "isArchived": false,
            "sortOrder": Int(Date().timeIntervalSince1970),
            "createdAt": FieldValue.serverTimestamp()
        ]
        try await ref.setData(data)
    }

    func deleteAccount(uid: String, accountId: String) async throws {
        try await db.accountsCollection(uid: uid).document(accountId).updateData(["isArchived": true])
    }

    func updateAccount(uid: String, accountId: String, name: String, type: String, currency: String, balanceCents: Int) async throws {
        try await db.accountsCollection(uid: uid).document(accountId).updateData([
            "name": name,
            "type": type,
            "currency": currency,
            "balanceCents": balanceCents
        ] as [String: Any])
    }
}
