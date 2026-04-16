import XCTest
@testable import AnchorOSNative

/// Path-building parity with src/utils/secureDbCore.ts.
/// Every native Firestore path must be rooted at `artifacts/anchor-os/users/{uid}/...`
/// so it matches the PWA and the firestore.rules allowlist.
final class SecureDbPathTests: XCTestCase {

    func testUserDocumentPath_rootsAtAnchorOsArtifacts() {
        let path = SecureDb.shared.userDocumentPath(uid: "u1")
        XCTAssertEqual(path, "artifacts/anchor-os/users/u1")
    }

    func testCollectionPath_usesUserSubcollection() {
        let path = SecureDb.shared.userCollectionPath(uid: "u1", collection: "accounts")
        XCTAssertEqual(path, "artifacts/anchor-os/users/u1/accounts")
    }

    func testNestedDocumentPath_joinsAllSegments() {
        let path = SecureDb.shared.userSubdocumentPath(
            uid: "u1",
            segments: ["fabric", "mood"]
        )
        XCTAssertEqual(path, "artifacts/anchor-os/users/u1/fabric/mood")
    }

    func testPathBuilders_rejectEmptyUid() {
        XCTAssertThrowsError(
            try SecureDb.shared.userDocumentPathStrict(uid: "")
        ) { error in
            guard case SecureDbError.invalidUid = error else {
                XCTFail("Expected SecureDbError.invalidUid, got \(error)")
                return
            }
        }
    }

    func testPathBuilders_rejectSlashInUid() {
        // A uid containing '/' would escape the user scope — security hazard.
        XCTAssertThrowsError(
            try SecureDb.shared.userDocumentPathStrict(uid: "u1/../admin")
        ) { error in
            guard case SecureDbError.invalidUid = error else {
                XCTFail("Expected SecureDbError.invalidUid, got \(error)")
                return
            }
        }
    }
}
