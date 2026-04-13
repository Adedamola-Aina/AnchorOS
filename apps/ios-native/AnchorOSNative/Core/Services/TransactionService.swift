import FirebaseFirestore


/// Real-time listener for the user's financial transactions.
/// All reads go through SecureDb — never bypass to Firestore directly.
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
}
