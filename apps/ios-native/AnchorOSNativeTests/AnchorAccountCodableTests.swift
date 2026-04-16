import XCTest
import FirebaseFirestore
@testable import AnchorOSNative

/// Round-trip parity: AnchorAccount must Decode from the same JSON shape
/// PWA writes (see src/types/financeTypes.ts → AnchorAccount).
final class AnchorAccountCodableTests: XCTestCase {

    func test_decodesPwaShape() throws {
        let json = """
        {
          "name": "GTBank Salary",
          "type": "salary",
          "currency": "NGN",
          "balanceCents": 450000,
          "color": "#3D52D5",
          "scope": "personal",
          "isArchived": false,
          "sortOrder": 1700000000
        }
        """.data(using: .utf8)!

        let account = try JSONDecoder().decode(AnchorAccount.self, from: json)
        XCTAssertEqual(account.name, "GTBank Salary")
        XCTAssertEqual(account.currency, "NGN")
        XCTAssertEqual(account.balanceCents, 450_000)
        XCTAssertEqual(account.isArchived, false)
    }

    func test_missingOptionalsDefaultToNil() throws {
        // Legacy accounts may lack scope/ownerId/isArchived.
        let json = """
        {
          "name": "Old Account",
          "type": "checking",
          "currency": "USD",
          "balanceCents": 0
        }
        """.data(using: .utf8)!

        let account = try JSONDecoder().decode(AnchorAccount.self, from: json)
        XCTAssertNil(account.scope)
        XCTAssertNil(account.ownerId)
        XCTAssertNil(account.isArchived)
        XCTAssertNil(account.sortOrder)
    }

    func test_formattedBalancePreservesCents() {
        let account = AnchorAccount(
            id: "a1",
            name: "Test",
            type: "checking",
            currency: "USD",
            balanceCents: 123_456,
            color: nil,
            scope: "personal",
            ownerId: nil,
            isArchived: false,
            sortOrder: 0
        )
        // Locale-agnostic: must contain currency symbol + cents digits.
        let s = account.formattedBalance
        XCTAssertTrue(s.hasPrefix("$"), "got \(s)")
        XCTAssertTrue(s.contains("1") && s.contains("234") && s.hasSuffix(".56"), "got \(s)")
    }
}
