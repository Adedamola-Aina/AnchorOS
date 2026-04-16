import XCTest
@testable import AnchorOSNative

/// Parity: AnchorTransaction decodes the same shape PWA writes via secureDb.
final class AnchorTransactionCodableTests: XCTestCase {

    func test_decodesExpensePwaShape() throws {
        let json = """
        {
          "title": "Shell Fuel",
          "amountCents": 1500000,
          "type": "expense",
          "category": "Transport",
          "accountId": "acct_123",
          "accountName": "GTBank Salary",
          "currency": "NGN",
          "date": "2026-04-15T10:30:00.000Z",
          "isSoftDeleted": false
        }
        """.data(using: .utf8)!

        let tx = try JSONDecoder().decode(AnchorTransaction.self, from: json)
        XCTAssertEqual(tx.title, "Shell Fuel")
        XCTAssertEqual(tx.type, "expense")
        XCTAssertEqual(tx.category, "Transport")
        XCTAssertEqual(tx.isActive, true)
        XCTAssertEqual(tx.amountSign, "-")
    }

    func test_softDeletedIsInactive() throws {
        let json = """
        {
          "title": "Removed",
          "amountCents": 100,
          "type": "expense",
          "accountId": "a",
          "currency": "NGN",
          "date": "2026-04-15T10:30:00.000Z",
          "isSoftDeleted": true
        }
        """.data(using: .utf8)!

        let tx = try JSONDecoder().decode(AnchorTransaction.self, from: json)
        XCTAssertEqual(tx.isActive, false)
    }

    func test_signMatchesPwaContract() {
        // PWA displays '+', '-', '→' for income/expense/transfer.
        let income = makeTx(type: "income")
        let expense = makeTx(type: "expense")
        let transfer = makeTx(type: "transfer")
        XCTAssertEqual(income.amountSign, "+")
        XCTAssertEqual(expense.amountSign, "-")
        XCTAssertEqual(transfer.amountSign, "→")
    }

    private func makeTx(type: String) -> AnchorTransaction {
        AnchorTransaction(
            id: "t",
            title: "T",
            amountCents: 100,
            type: type,
            category: nil,
            accountId: "a",
            accountName: nil,
            currency: "NGN",
            date: "2026-04-15T10:30:00.000Z",
            isSoftDeleted: false
        )
    }
}
