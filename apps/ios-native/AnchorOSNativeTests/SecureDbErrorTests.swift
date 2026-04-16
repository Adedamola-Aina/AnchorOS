import XCTest
@testable import AnchorOSNative

/// Mirrors src/utils/secureDbCore.ts `mapSecureDbError` contract.
/// PWA parity: timeout → service-unavailable message, permission-denied → "Not found",
/// not-found → "Not found", otherwise → generic fallback.
final class SecureDbErrorTests: XCTestCase {

    func testMapError_timeout_returnsServiceMessage() {
        let msg = SecureDbError.mapToUserMessage(
            SecureDbError.timeout(operation: "getDocument(accounts/abc)")
        )
        XCTAssertEqual(msg, "Service temporarily unavailable. Please try again.")
    }

    func testMapError_permissionDenied_returnsNotFound() {
        // Firestore permission-denied is mapped to "Not found" to avoid leaking
        // existence of resources to unauthorized callers (same as PWA).
        let underlying = NSError(
            domain: "FIRFirestoreErrorDomain",
            code: 7, // permission-denied
            userInfo: [NSLocalizedDescriptionKey: "Missing or insufficient permissions."]
        )
        XCTAssertEqual(
            SecureDbError.mapToUserMessage(underlying),
            "Not found"
        )
    }

    func testMapError_notFound_returnsNotFound() {
        let underlying = NSError(
            domain: "FIRFirestoreErrorDomain",
            code: 5, // not-found
            userInfo: [NSLocalizedDescriptionKey: "No such document."]
        )
        XCTAssertEqual(
            SecureDbError.mapToUserMessage(underlying),
            "Not found"
        )
    }

    func testMapError_invalidUid_returnsGenericMessage() {
        // Invalid-uid is a programming error, not user-facing; surface as generic.
        XCTAssertEqual(
            SecureDbError.mapToUserMessage(SecureDbError.invalidUid),
            "An unexpected error occurred. Please try again."
        )
    }

    func testMapError_unknownError_returnsGenericMessage() {
        let unknown = NSError(domain: "Other", code: 999)
        XCTAssertEqual(
            SecureDbError.mapToUserMessage(unknown),
            "An unexpected error occurred. Please try again."
        )
    }
}
