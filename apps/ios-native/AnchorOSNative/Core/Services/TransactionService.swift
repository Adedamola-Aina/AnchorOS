import FirebaseFirestore


/// Real-time listener + write operations for the user's financial transactions.
/// All reads/writes go through SecureDb — never bypass to Firestore directly.
final class TransactionService {
    private let db = SecureDb.shared

    func listen(
        uid: String,
        onChange: @escaping ([AnchorTransaction]) -> Void
    ) -> ListenerRegistration {
        db.financeCollection(uid: uid)
            .order(by: "date", descending: true)
            .limit(to: 50)
            .addSnapshotListener { snapshot, error in
                guard error == nil else { return }
                let txs = snapshot?.documents.compactMap {
                    try? $0.data(as: AnchorTransaction.self)
                } ?? []
                let active = txs.filter { $0.isActive }
                onChange(active)
            }
    }

    func addTransaction(
        uid: String,
        title: String,
        amountCents: Int,
        type: String,
        category: String?,
        accountId: String,
        accountName: String?,
        currency: String,
        date: String? = nil,
        isRecurring: Bool = false,
        recurringFrequency: String? = nil
    ) async throws {
        var data: [String: Any] = [
            "title": title,
            "amountCents": amountCents,
            "type": type,
            "accountId": accountId,
            "currency": currency,
            "date": date ?? ISO8601DateFormatter().string(from: Date()),
            "isRecurring": isRecurring,
            "isSoftDeleted": false
        ]
        if let cat = category { data["category"] = cat }
        if let name = accountName { data["accountName"] = name }
        if let freq = recurringFrequency { data["recurringFrequency"] = freq }
        // Routes through SecureDb — audit fields added centrally.
        try await db.addDocument(uid: uid, collection: "finance", data: data)
    }

    func deleteTransaction(uid: String, transactionId: String) async throws {
        try await db.updateDocument(uid: uid, path: ["finance", transactionId], data: ["isSoftDeleted": true])
    }

    func updateTransaction(
        uid: String,
        transactionId: String,
        title: String,
        amountCents: Int,
        type: String,
        category: String?
    ) async throws {
        var data: [String: Any] = [
            "title": title,
            "amountCents": amountCents,
            "type": type
        ]
        if let cat = category { data["category"] = cat }
        try await db.updateDocument(uid: uid, path: ["finance", transactionId], data: data)
    }
}
