import FirebaseFirestore
import FirebaseFirestoreSwift

/// Real-time listener for the user's financial accounts.
/// All reads go through SecureDb — never bypass to Firestore directly.
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
}
