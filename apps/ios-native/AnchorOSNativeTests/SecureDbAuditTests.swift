import XCTest
@testable import AnchorOSNative

/// Unit tests for SecureDbAudit — pure-function audit-field merging.
/// Mirrors the audit contract enforced by secureDb.ts / firestore.rules.
/// No Firestore / network required.
final class SecureDbAuditTests: XCTestCase {

    func testMergeAuditFields_onCreate_addsCreatedAndUpdatedFields() {
        let merged = SecureDbAudit.mergeAuditFields(
            ["name": "Savings"],
            uid: "user-123",
            isCreate: true
        )

        XCTAssertEqual(merged["name"] as? String, "Savings")
        XCTAssertEqual(merged["createdBy"] as? String, "user-123")
        XCTAssertEqual(merged["updatedBy"] as? String, "user-123")
        XCTAssertNotNil(merged["createdAt"])
        XCTAssertNotNil(merged["updatedAt"])
    }

    func testMergeAuditFields_onUpdate_onlyAddsUpdatedFields() {
        let merged = SecureDbAudit.mergeAuditFields(
            ["name": "Savings v2"],
            uid: "user-123",
            isCreate: false
        )

        XCTAssertEqual(merged["name"] as? String, "Savings v2")
        XCTAssertNil(merged["createdBy"], "update must not overwrite createdBy")
        XCTAssertNil(merged["createdAt"], "update must not overwrite createdAt")
        XCTAssertEqual(merged["updatedBy"] as? String, "user-123")
        XCTAssertNotNil(merged["updatedAt"])
    }

    func testMergeAuditFields_doesNotMutateInputDictionary() {
        let original: [String: Any] = ["name": "Savings"]
        _ = SecureDbAudit.mergeAuditFields(original, uid: "user-123", isCreate: true)
        XCTAssertEqual(original.count, 1, "Input dict must not be mutated")
    }

    func testMergeAuditFields_rejectsEmptyUid() {
        // Empty uid should be rejected at write boundary — audit helper enforces this.
        XCTAssertThrowsError(
            try SecureDbAudit.mergeAuditFieldsStrict([:], uid: "", isCreate: true)
        ) { error in
            guard case SecureDbError.invalidUid = error else {
                XCTFail("Expected SecureDbError.invalidUid, got \(error)")
                return
            }
        }
    }

    func testMergeAuditFields_preservesCallerProvidedUpdatedFields() {
        // If caller explicitly sets updatedAt (e.g. offline replay), we respect it.
        let caller: [String: Any] = [
            "name": "Test",
            "updatedBy": "system-migration"
        ]
        let merged = SecureDbAudit.mergeAuditFields(caller, uid: "user-123", isCreate: false)
        XCTAssertEqual(
            merged["updatedBy"] as? String, "system-migration",
            "Caller-supplied updatedBy must be preserved (e.g. for server-side migrations)"
        )
    }
}
