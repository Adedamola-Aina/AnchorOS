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
        currency: String
    ) async throws {
        let ref = db.financeCollection(uid: uid).document()
        var data: [String: Any] = [
            "title": title,
            "amountCents": amountCents,
            "type": type,
            "accountId": accountId,
            "currency": currency,
            "date": ISO8601DateFormatter().string(from: Date()),
            "isSoftDeleted": false,
            "createdAt": FieldValue.serverTimestamp()
        ]
        if let cat = category { data["category"] = cat }
        if let name = accountName { data["accountName"] = name }
        try await ref.setData(data)
    }

    func deleteTransaction(uid: String, transactionId: String) async throws {
        try await db.financeCollection(uid: uid).document(transactionId)
            .updateData(["isSoftDeleted": true])
    }
}
