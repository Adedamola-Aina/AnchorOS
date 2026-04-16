import XCTest
@testable import AnchorOSNative

/// Parity contract: every assertion here mirrors a case in
/// src/utils/finance.test.ts → `describe('calculateNetWorth')`.
/// If PWA behavior changes, update both sides in the same commit.
final class NetWorthCalculatorTests: XCTestCase {

    // MARK: — Helpers

    private func account(_ cents: Int, _ currency: String, archived: Bool = false) -> AnchorAccount {
        AnchorAccount(
            id: UUID().uuidString,
            name: "Acct",
            type: "checking",
            currency: currency,
            balanceCents: cents,
            color: "#3D52D5",
            scope: "personal",
            ownerId: nil,
            isArchived: archived,
            sortOrder: 0
        )
    }

    // MARK: — Parity scenarios

    func test_returnsZerosForEmptyAccounts() {
        let result = NetWorthCalculator.calculate(accounts: [])
        XCTAssertEqual(result.ngn, 0.0)
        XCTAssertEqual(result.usd, 0.0)
        XCTAssertEqual(result.total.amount, 0.0)
    }

    func test_sumsNgnAccountsCorrectly() {
        // ₦1,000.00 + ₦2,000.00 = ₦3,000.00
        let result = NetWorthCalculator.calculate(accounts: [
            account(100_000, "NGN"),
            account(200_000, "NGN")
        ])
        XCTAssertEqual(result.ngn, 3_000.0, accuracy: 0.001)
        XCTAssertEqual(result.total.currency, "NGN")
    }

    func test_sumsUsdAccountsSeparately() {
        let result = NetWorthCalculator.calculate(accounts: [
            account(50_000, "USD")
        ])
        XCTAssertEqual(result.usd, 500.0, accuracy: 0.001)
        XCTAssertEqual(result.total.currency, "USD")
    }

    func test_usesDominantCurrencyForTotal() {
        // ₦100,000 vs $50 → NGN dominates by absolute value
        let result = NetWorthCalculator.calculate(accounts: [
            account(10_000_000, "NGN"),
            account(5_000, "USD")
        ])
        XCTAssertEqual(result.total.currency, "NGN")
        XCTAssertEqual(result.total.amount, 100_000.0, accuracy: 0.001)
    }

    func test_selectsUsdWhenUsdTotalIsHigher() {
        let result = NetWorthCalculator.calculate(accounts: [
            account(100, "NGN"),      // ₦1
            account(100_000, "USD")   // $1,000
        ])
        XCTAssertEqual(result.total.currency, "USD")
    }

    func test_handlesNegativeBalances() {
        // Liabilities are accounted as negative balance.
        let result = NetWorthCalculator.calculate(accounts: [
            account(-50_000, "NGN")
        ])
        XCTAssertEqual(result.ngn, -500.0, accuracy: 0.001)
    }

    // MARK: — Native-specific (filter contract matching PWA useFinanceData)

    func test_cents_sumsAcrossCurrenciesAreIndependent() {
        // This is the regression guard. Previous native impl summed NGN+USD cents
        // into a single `netWorthCents`, silently producing wrong totals.
        let result = NetWorthCalculator.calculate(accounts: [
            account(100_000, "NGN"),   // ₦1,000.00 (100,000 cents)
            account(10_000, "USD")     // $100.00  (10,000 cents)
        ])
        XCTAssertEqual(result.ngnCents, 100_000)
        XCTAssertEqual(result.usdCents, 10_000)
        // No combined "cents" field — callers must pick a currency.
    }
}
