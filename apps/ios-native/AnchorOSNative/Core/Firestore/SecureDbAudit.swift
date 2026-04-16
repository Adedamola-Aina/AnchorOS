import FirebaseFirestore
import Foundation

/// SecureDbAudit — audit-field merging for every write that goes through SecureDb.
///
/// Mirrors the PWA write convention:
///   createdAt / createdBy  — set once on create
///   updatedAt / updatedBy  — set on every write (create + update)
///
/// Caller may override updatedBy (e.g. server-side migrations marking their own
/// writes). We never override caller-supplied values.
enum SecureDbAudit {

    /// Merge audit fields into `data`. Does NOT mutate the input.
    /// - Parameter isCreate: when true, adds createdAt/createdBy in addition to updatedAt/updatedBy.
    static func mergeAuditFields(
        _ data: [String: Any],
        uid: String,
        isCreate: Bool
    ) -> [String: Any] {
        var out = data
        let ts = FieldValue.serverTimestamp()

        if isCreate {
            if out["createdAt"] == nil { out["createdAt"] = ts }
            if out["createdBy"] == nil { out["createdBy"] = uid }
        }
        if out["updatedAt"] == nil { out["updatedAt"] = ts }
        if out["updatedBy"] == nil { out["updatedBy"] = uid }
        return out
    }

    /// Strict variant — throws `SecureDbError.invalidUid` for empty or unsafe uids.
    /// Used at write boundaries where uid must never be missing.
    static func mergeAuditFieldsStrict(
        _ data: [String: Any],
        uid: String,
        isCreate: Bool
    ) throws -> [String: Any] {
        guard SecureDbPath.isValidUid(uid) else { throw SecureDbError.invalidUid }
        return mergeAuditFields(data, uid: uid, isCreate: isCreate)
    }
}

/// Pure path-segment validation. Keeps SecureDb.swift slim and makes rules testable.
enum SecureDbPath {
    static func isValidUid(_ uid: String) -> Bool {
        guard !uid.isEmpty else { return false }
        // Reject path separators and parent-dir tokens to prevent path escape.
        if uid.contains("/") || uid.contains("..") { return false }
        return true
    }
}
