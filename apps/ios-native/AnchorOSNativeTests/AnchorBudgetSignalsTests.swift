import XCTest
@testable import AnchorOSNative

/// Parity contract with src/services/fabric/predictionBudgetSignals.ts.
/// No dedicated PWA test file exists \u2014 these assertions encode the
/// behavioral contract from the TypeScript source directly.
final class AnchorBudgetSignalsTests: XCTestCase {

    // Mid-month date so monthProgress > 0.1 trivially.
    private let fixedNow: Date = {
        let c = DateComponents(year: 2026, month: 3, day: 20, hour: 12)
        return Calendar(identifier: .gregorian).date(from: c)!
    }()

    private func tx(
        _ amount: Int,
        _ category: String = "Food",
        date: String
    ) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString,
            title: "t",
            amountCents: amount,
            type: "expense",
            category: category,
            accountId: nil,
            accountName: nil,
            currency: "USD",
            date: date,
            isSoftDeleted: false
        )
    }

    // MARK: — Empty

    func test_emptyWhenNoTransactions() {
        XCTAssertEqual(AnchorBudgetSignals.build(transactions: [], now: fixedNow), [])
    }

    func test_emptyWhenNoPriorBaseline() {
        // Lots this month, nothing last month \u2192 no overage (divide by zero guard).
        let txs = [
            tx(100_000, date: "2026-03-01"),
            tx(100_000, date: "2026-03-02"),
        ]
        XCTAssertTrue(AnchorBudgetSignals.build(transactions: txs, now: fixedNow).isEmpty)
    }

    // MARK: — Overall overage

    func test_overageAt21PercentFires() {
        let txs = [
            tx(100_000, date: "2026-02-15"), // last month baseline
            tx(121_000, date: "2026-03-05"), // this month, 21% above
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        let overage = result.first { $0.id.hasPrefix("pred-budget-overage-") }
        XCTAssertNotNil(overage)
        XCTAssertEqual(overage?.severity, .warning)
        XCTAssertEqual(overage?.confidence, AnchorBudgetSignals.overageConfidence)
        XCTAssertTrue(overage?.message.contains("21%") == true)
        XCTAssertEqual(overage?.action?.navigateTo, "/finance")
    }

    func test_overageAt20PercentDoesNotFire() {
        // 1.2x exactly \u2014 PWA uses `>` strict, so this must not fire.
        let txs = [
            tx(100_000, date: "2026-02-15"),
            tx(120_000, date: "2026-03-05"),
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        XCTAssertNil(result.first { $0.id.hasPrefix("pred-budget-overage-") })
    }

    func test_overageIdUsesCurrentMonthKey() {
        let txs = [
            tx(100_000, date: "2026-02-15"),
            tx(200_000, date: "2026-03-05"),
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        XCTAssertTrue(
            result.contains { $0.id == "pred-budget-overage-2026-03" }
        )
    }

    // MARK: — Burn rate

    func test_burnRateFiresForAggressiveCategory() {
        // Day 20 of 31 \u2192 monthProgress \u2248 0.645.
        // Category "Food" this month = 50,000 by day 20. Projected = 50k / 0.645 \u2248 77.5k.
        // Last month Food = 40,000. Typical * 1.3 = 52,000. 77.5k > 52k \u2192 fire.
        let txs = [
            tx(40_000, "Food", date: "2026-02-15"),
            tx(50_000, "Food", date: "2026-03-10"),
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        let burn = result.first { $0.id.hasPrefix("pred-burn-rate-food-") }
        XCTAssertNotNil(burn)
        XCTAssertEqual(burn?.severity, .warning)
        XCTAssertEqual(burn?.confidence, AnchorBudgetSignals.burnConfidence)
        XCTAssertEqual(burn?.action?.navigateTo, "/finance")
        XCTAssertEqual(burn?.id, "pred-burn-rate-food-2026-03")
    }

    func test_burnRateOnlyFiresOnce() {
        // Two categories both burning \u2014 PWA `break`s after first match.
        let txs = [
            tx(40_000, "Coffee", date: "2026-02-15"),
            tx(40_000, "Food",   date: "2026-02-15"),
            tx(50_000, "Coffee", date: "2026-03-10"),
            tx(50_000, "Food",   date: "2026-03-10"),
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        let burns = result.filter { $0.id.hasPrefix("pred-burn-rate-") }
        XCTAssertEqual(burns.count, 1)
    }

    func test_burnRateSlugifiesMultiWordCategory() {
        let txs = [
            tx(40_000, "Take Out", date: "2026-02-15"),
            tx(60_000, "Take Out", date: "2026-03-10"),
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        let burn = result.first { $0.id.hasPrefix("pred-burn-rate-") }
        XCTAssertEqual(burn?.id, "pred-burn-rate-take-out-2026-03")
    }

    func test_burnRateSkipsCategoryWithNoPriorBaseline() {
        // Only fires when typical > 0.
        let txs = [
            tx(40_000, "Food",  date: "2026-02-15"),
            tx(50_000, "Bikes", date: "2026-03-10"), // no prior Bikes baseline
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: fixedNow)
        XCTAssertNil(result.first { $0.id.contains("bikes") })
    }

    // MARK: — Month-progress floor

    func test_burnRateSuppressedEarlyInMonth() {
        // Day 2 of March \u2192 monthProgress \u2248 0.065 < 0.1 \u2192 burn rate gated off.
        let earlyNow = Calendar(identifier: .gregorian)
            .date(from: DateComponents(year: 2026, month: 3, day: 2, hour: 12))!
        let txs = [
            tx(40_000, "Food", date: "2026-02-15"),
            tx(50_000, "Food", date: "2026-03-01"),
        ]
        let result = AnchorBudgetSignals.build(transactions: txs, now: earlyNow)
        XCTAssertNil(result.first { $0.id.hasPrefix("pred-burn-rate-") })
    }

    // MARK: — Soft-delete respected

    func test_softDeletedTransactionsExcluded() {
        var soft = tx(999_999, date: "2026-03-10")
        soft = AnchorTransaction(
            id: soft.resolvedId, title: soft.title, amountCents: soft.amountCents,
            type: soft.type, category: soft.category, accountId: nil,
            accountName: nil, currency: soft.currency, date: soft.date,
            isSoftDeleted: true
        )
        let result = AnchorBudgetSignals.build(
            transactions: [tx(100_000, date: "2026-02-15"), soft],
            now: fixedNow
        )
        XCTAssertTrue(result.isEmpty)
    }
}
