import Foundation

/// Errors produced by SecureDb. Mirrors the error-mapping contract in
/// src/utils/secureDbCore.ts `mapSecureDbError`.
///
/// User-facing messages are intentionally terse and do not leak existence
/// of unauthorized resources (permission-denied → "Not found", matching PWA).
enum SecureDbError: Error, Equatable {
    /// The supplied uid was empty, contained '/', or otherwise unsafe as a path segment.
    case invalidUid
    /// An operation exceeded its timeout budget.
    case timeout(operation: String)
    /// A bare Firestore permission-denied surfaced to the client.
    case permissionDenied
    /// A document was not found (may be mapped from permissionDenied on purpose).
    case notFound

    static func == (lhs: SecureDbError, rhs: SecureDbError) -> Bool {
        switch (lhs, rhs) {
        case (.invalidUid, .invalidUid): return true
        case (.permissionDenied, .permissionDenied): return true
        case (.notFound, .notFound): return true
        case (.timeout(let a), .timeout(let b)): return a == b
        default: return false
        }
    }

    /// Map any thrown error (including NSError from Firestore) to a user-facing string.
    /// Contract match with src/utils/secureDbCore.ts mapSecureDbError.
    static func mapToUserMessage(_ error: Error) -> String {
        if let sdb = error as? SecureDbError {
            switch sdb {
            case .timeout: return "Service temporarily unavailable. Please try again."
            case .permissionDenied, .notFound: return "Not found"
            case .invalidUid: return "An unexpected error occurred. Please try again."
            }
        }

        let ns = error as NSError
        // Firestore uses FIRFirestoreErrorDomain with canonical codes.
        // 5 = not-found, 7 = permission-denied, 4 = deadline-exceeded.
        if ns.domain == "FIRFirestoreErrorDomain" {
            switch ns.code {
            case 5, 7: return "Not found"
            case 4: return "Service temporarily unavailable. Please try again."
            default: break
            }
        }

        let msg = ns.localizedDescription.lowercased()
        if msg.contains("timed out") || msg.contains("deadline") {
            return "Service temporarily unavailable. Please try again."
        }
        if msg.contains("permission") || msg.contains("not found") {
            return "Not found"
        }
        return "An unexpected error occurred. Please try again."
    }
}
