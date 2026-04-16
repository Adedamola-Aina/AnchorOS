import XCTest
@testable import AnchorOSNative

/// Parity contract for AnchorFabricEngine — mirrors the behavioral expectations
/// of src/services/fabric/insights/* on the PWA side. Deterministic inputs →
/// deterministic outputs; no Firestore, no clock drift.
final class AnchorFabricEngineTests: XCTestCase {

    // MARK: — Helpers

    /// Fixed "now" so month-range math is stable in CI.
    private var fixedNow: Date {
        // 2026-02-15T12:00:00Z — safely mid-month
        let c = DateComponents(year: 2026, month: 2, day: 15, hour: 12)
        return Calendar(identifier: .gregorian).date(from: c)!
    }

    private func iso(_ year: Int, _ month: Int, _ day: Int) -> String {
        String(format: "%04d-%02d-%02d", year, month, day)
    }

    private func tx(
        _ amount: Int,
        _ type: String,
        _ category: String?,
        _ date: String,
        currency: String = "NGN"
    ) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString,
            title: "t",
            amountCents: amount,
            type: type,
            category: category,
            accountId: nil,
            accountName: nil,
            currency: currency,
            date: date,
            isSoftDeleted: false
        )
    }

    private func account(_ cents: Int, _ currency: String = "NGN") -> AnchorAccount {
        AnchorAccount(
            id: UUID().uuidString,
            name: "A",
            type: "checking",
            currency: currency,
            balanceCents: cents,
            color: "#000",
            scope: "personal",
            ownerId: nil,
            isArchived: false,
            sortOrder: 0
        )
    }

    private func commitment(streak: Int, title: String = "Gym") -> AnchorCommitment {
        AnchorCommitment(
            id: UUID().uuidString,
            title: title,
            type: "daily",
            completed: false,
            category: nil,
            domain: nil,
            timeOfDay: nil,
            notes: nil,
            currentStreak: streak,
            longestStreak: streak,
            lastCompletedAt: nil,
            priority: "medium"
        )
    }

    // MARK: — Empty state

    func test_emptyInputsReturnsNoInsights() {
        let result = AnchorFabricEngine.buildInsights(
            transactions: [], accounts: [], commitments: []
        )
        XCTAssertTrue(result.isEmpty)
    }

    // MARK: — Determinism (same input → same output + same order)

    func test_deterministicOrdering() {
        let txs = [
            tx(50_000, "income", nil, iso(2026, 2, 1)),
            tx(10_000, "expense", "Food", iso(2026, 2, 10))
        ]
        let accts = [account(500_000)]
        let coms  = [commitment(streak: 5)]

        let a = AnchorFabricEngine.buildInsights(transactions: txs, accounts: accts, commitments: coms)
        let b = AnchorFabricEngine.buildInsights(transactions: txs, accounts: accts, commitments: coms)
        XCTAssertEqual(a.map(\.id), b.map(\.id))
        // Ordering contract: spending → savings → networth → streak
        XCTAssertEqual(a.map(\.id), [
            "insight-spending", "insight-savings", "insight-networth", "insight-streak"
        ])
    }

    // MARK: — Savings rate insight

    func test_strongSavingsRateIsPositive() {
        // 80% savings rate → positive
        let txs = [
            tx(100_000, "income",  nil, iso(2026, 2, 1)),
            tx(20_000,  "expense", "Food", iso(2026, 2, 5))
        ]
        let result = AnchorFabricEngine.buildInsights(transactions: txs, accounts: [], commitments: [])
        let savings = result.first { $0.id == "insight-savings" }
        XCTAssertNotNil(savings)
        XCTAssertEqual(savings?.severity, .positive)
        XCTAssertEqual(savings?.trend, .up)
    }

    func test_overspendingIsAttentionWithDownTrend() {
        let txs = [
            tx(50_000,  "income",  nil, iso(2026, 2, 1)),
            tx(80_000,  "expense", "Rent", iso(2026, 2, 5))
        ]
        let result = AnchorFabricEngine.buildInsights(transactions: txs, accounts: [], commitments: [])
        let savings = result.first { $0.id == "insight-savings" }
        XCTAssertEqual(savings?.severity, .attention)
        XCTAssertEqual(savings?.trend, .down)
        XCTAssertTrue(savings?.headline.contains("Overspending") == true)
    }

    func test_noSavingsInsightWhenZeroIncome() {
        let txs = [ tx(10_000, "expense", "Food", iso(2026, 2, 1)) ]
        let result = AnchorFabricEngine.buildInsights(transactions: txs, accounts: [], commitments: [])
        XCTAssertNil(result.first { $0.id == "insight-savings" })
    }

    // MARK: — Net worth insight

    func test_positiveNetWorthIsPositiveSeverity() {
        let result = AnchorFabricEngine.buildInsights(
            transactions: [], accounts: [account(500_000)], commitments: []
        )
        let nw = result.first { $0.id == "insight-networth" }
        XCTAssertEqual(nw?.severity, .positive)
        XCTAssertEqual(nw?.trend, .up)
    }

    func test_negativeNetWorthIsAttention() {
        let result = AnchorFabricEngine.buildInsights(
            transactions: [], accounts: [account(-10_000)], commitments: []
        )
        let nw = result.first { $0.id == "insight-networth" }
        XCTAssertEqual(nw?.severity, .attention)
        XCTAssertEqual(nw?.trend, .down)
    }

    // MARK: — Streak insight

    func test_streakBelowTwoIsSuppressed() {
        let result = AnchorFabricEngine.buildInsights(
            transactions: [], accounts: [], commitments: [commitment(streak: 1)]
        )
        XCTAssertNil(result.first { $0.id == "insight-streak" })
    }

    func test_streakAtLeastTwoSurfaces() {
        let result = AnchorFabricEngine.buildInsights(
            transactions: [], accounts: [], commitments: [commitment(streak: 7, title: "Run")]
        )
        let s = result.first { $0.id == "insight-streak" }
        XCTAssertEqual(s?.severity, .positive)
        XCTAssertTrue(s?.headline.contains("7-day streak") == true)
        XCTAssertTrue(s?.detail.contains("Run") == true)
    }

    // MARK: — Currency safety (no hardcoded symbol leak)

    func test_usdFormatterProducesDollarSign() {
        XCTAssertTrue(AnchorFabricEngine.formatCents(100_000, "USD").contains("$"))
        XCTAssertFalse(AnchorFabricEngine.formatCents(100_000, "USD").contains("₦"))
    }

    func test_ngnFormatterProducesNaira() {
        XCTAssertTrue(AnchorFabricEngine.formatCents(100_000, "NGN").contains("₦"))
    }

    func test_negativeValueHasMinusPrefix() {
        let s = AnchorFabricEngine.formatCents(-50_000, "NGN")
        XCTAssertTrue(s.hasPrefix("-"))
    }

    // MARK: — Weekly buckets (chart data parity)

    func test_weeklyBucketsAlwaysReturnsFour() {
        let buckets = AnchorFabricEngine.weeklyBuckets(transactions: [], now: fixedNow)
        XCTAssertEqual(buckets.count, 4)
    }
}
