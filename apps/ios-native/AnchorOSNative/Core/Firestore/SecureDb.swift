import FirebaseFirestore
import Foundation

/// SecureDb — uid-scoped Firestore gateway. Mirrors src/utils/secureDb.ts.
///
/// Rules:
///   • Every path rooted at `artifacts/anchor-os/users/{uid}/...`
///   • All writes go through setDocument/updateDocument/addDocument and pick up
///     audit fields (createdAt/createdBy/updatedAt/updatedBy) automatically.
///   • Empty or unsafe uids are rejected at the boundary (not rules-only).
///   • Operations are timeout-bounded (default 5s) so the UI never hangs.
///
/// Services must NOT touch `Firestore.firestore()` directly. Tests assert this.
final class SecureDb {
    static let shared = SecureDb()
    private init() {}

    private let db = Firestore.firestore()
    static let root = "artifacts/anchor-os"
    static let defaultTimeout: TimeInterval = 5.0

    // MARK: — Path Strings (pure, unit-testable)

    func userDocumentPath(uid: String) -> String { "\(Self.root)/users/\(uid)" }
    func userCollectionPath(uid: String, collection: String) -> String {
        "\(Self.root)/users/\(uid)/\(collection)"
    }
    func userSubdocumentPath(uid: String, segments: [String]) -> String {
        // Empty segments target the user root doc itself (e.g. profile updates).
        guard !segments.isEmpty else { return userDocumentPath(uid: uid) }
        return "\(Self.root)/users/\(uid)/" + segments.joined(separator: "/")
    }

    /// Strict variant — throws on invalid uid. Used by generic CRUD below.
    func userDocumentPathStrict(uid: String) throws -> String {
        guard SecureDbPath.isValidUid(uid) else { throw SecureDbError.invalidUid }
        return userDocumentPath(uid: uid)
    }

    // MARK: — Reference Builders (back-compat; existing services use these)

    func userDocument(uid: String) -> DocumentReference {
        db.document(userDocumentPath(uid: uid))
    }
    func commitmentDocument(uid: String, taskId: String) -> DocumentReference {
        db.document("\(Self.root)/users/\(uid)/commitments/\(taskId)")
    }
    func accountsCollection(uid: String) -> CollectionReference {
        db.collection(userCollectionPath(uid: uid, collection: "accounts"))
    }
    func financeCollection(uid: String) -> CollectionReference {
        db.collection(userCollectionPath(uid: uid, collection: "finance"))
    }
    func commitmentsCollection(uid: String) -> CollectionReference {
        db.collection(userCollectionPath(uid: uid, collection: "commitments"))
    }
    var familyConnectionsCollection: CollectionReference {
        db.collection("\(Self.root)/family_connections")
    }
    var familyInvitationsCollection: CollectionReference {
        db.collection("\(Self.root)/family_invitations")
    }
    func userMoodDocument(uid: String) -> DocumentReference {
        db.document("\(Self.root)/users/\(uid)/fabric/mood")
    }

    // MARK: — Generic CRUD (PWA parity)

    /// Fetch a Codable document at a user-scoped path.
    /// Returns nil when the document does not exist. Mirrors secureDb.getDocument<T>.
    func getDocument<T: Decodable>(
        uid: String,
        path: [String],
        type: T.Type,
        timeout: TimeInterval = SecureDb.defaultTimeout
    ) async throws -> T? {
        guard SecureDbPath.isValidUid(uid) else { throw SecureDbError.invalidUid }
        let ref = db.document(userSubdocumentPath(uid: uid, segments: path))
        let snap = try await withTimeout(timeout, "getDocument(\(path.joined(separator: "/")))") {
            try await ref.getDocument()
        }
        guard snap.exists else { return nil }
        return try snap.data(as: T.self)
    }

    /// Fetch multiple Codable documents from a user-scoped collection.
    /// `shape` configures ordering / limits / filters via Firestore's fluent Query API.
    func queryCollection<T: Decodable>(
        uid: String,
        collection: String,
        shape: (Query) -> Query = { $0 },
        type: T.Type,
        timeout: TimeInterval = SecureDb.defaultTimeout
    ) async throws -> [T] {
        guard SecureDbPath.isValidUid(uid) else { throw SecureDbError.invalidUid }
        let base: Query = db.collection(userCollectionPath(uid: uid, collection: collection))
        let q = shape(base)
        let snap = try await withTimeout(timeout, "queryCollection(\(collection))") {
            try await q.getDocuments()
        }
        return snap.documents.compactMap { try? $0.data(as: T.self) }
    }

    /// Create-or-overwrite. Adds audit fields automatically.
    func setDocument(
        uid: String,
        path: [String],
        data: [String: Any],
        merge: Bool = false,
        timeout: TimeInterval = SecureDb.defaultTimeout
    ) async throws {
        let payload = try SecureDbAudit.mergeAuditFieldsStrict(data, uid: uid, isCreate: !merge)
        let ref = db.document(userSubdocumentPath(uid: uid, segments: path))
        try await withTimeout(timeout, "setDocument(\(path.joined(separator: "/")))") {
            try await ref.setData(payload, merge: merge)
        }
    }

    /// Patch an existing document. Adds updatedAt/updatedBy automatically.
    func updateDocument(
        uid: String,
        path: [String],
        data: [String: Any],
        timeout: TimeInterval = SecureDb.defaultTimeout
    ) async throws {
        let payload = try SecureDbAudit.mergeAuditFieldsStrict(data, uid: uid, isCreate: false)
        let ref = db.document(userSubdocumentPath(uid: uid, segments: path))
        try await withTimeout(timeout, "updateDocument(\(path.joined(separator: "/")))") {
            try await ref.updateData(payload)
        }
    }

    /// Hard delete. Most deletions are soft via `isArchived` / `isSoftDeleted`.
    func deleteDocument(
        uid: String,
        path: [String],
        timeout: TimeInterval = SecureDb.defaultTimeout
    ) async throws {
        guard SecureDbPath.isValidUid(uid) else { throw SecureDbError.invalidUid }
        let ref = db.document(userSubdocumentPath(uid: uid, segments: path))
        try await withTimeout(timeout, "deleteDocument(\(path.joined(separator: "/")))") {
            try await ref.delete()
        }
    }

    /// Create a new document in a user-scoped collection. Returns the generated id.
    @discardableResult
    func addDocument(
        uid: String,
        collection: String,
        data: [String: Any],
        timeout: TimeInterval = SecureDb.defaultTimeout
    ) async throws -> String {
        let payload = try SecureDbAudit.mergeAuditFieldsStrict(data, uid: uid, isCreate: true)
        let ref = db.collection(userCollectionPath(uid: uid, collection: collection)).document()
        try await withTimeout(timeout, "addDocument(\(collection))") {
            try await ref.setData(payload)
        }
        return ref.documentID
    }

    // MARK: — Timeout wrapper

    /// Race `operation` against a timeout. Throws SecureDbError.timeout on expiry.
    /// Equivalent to withTimeout() in src/utils/secureDbCore.ts.
    private func withTimeout<T>(
        _ seconds: TimeInterval,
        _ op: String,
        _ operation: @escaping () async throws -> T
    ) async throws -> T {
        try await withThrowingTaskGroup(of: T.self) { group in
            group.addTask { try await operation() }
            group.addTask {
                try await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
                throw SecureDbError.timeout(operation: op)
            }
            guard let result = try await group.next() else {
                throw SecureDbError.timeout(operation: op)
            }
            group.cancelAll()
            return result
        }
    }
}
