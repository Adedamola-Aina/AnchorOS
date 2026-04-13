import FirebaseFirestore

/// SecureDb — uid-scoped Firestore gateway.
///
/// ALL Firestore access in the native app goes through this class.
/// No caller may construct a Firestore path without supplying a uid.
/// Mirrors src/utils/secureDb.ts — never bypass this gateway.
final class SecureDb {
    static let shared = SecureDb()
    private init() {}

    private let db = Firestore.firestore()
    private static let root = "artifacts/anchor-os"

    // MARK: — Document References

    func userDocument(uid: String) -> DocumentReference {
        db.document("\(Self.root)/users/\(uid)")
    }

    func commitmentDocument(uid: String, taskId: String) -> DocumentReference {
        db.document("\(Self.root)/users/\(uid)/commitments/\(taskId)")
    }

    // MARK: — Collection References

    func accountsCollection(uid: String) -> CollectionReference {
        db.collection("\(Self.root)/users/\(uid)/accounts")
    }

    func financeCollection(uid: String) -> CollectionReference {
        db.collection("\(Self.root)/users/\(uid)/finance")
    }

    func commitmentsCollection(uid: String) -> CollectionReference {
        db.collection("\(Self.root)/users/\(uid)/commitments")
    }
}
