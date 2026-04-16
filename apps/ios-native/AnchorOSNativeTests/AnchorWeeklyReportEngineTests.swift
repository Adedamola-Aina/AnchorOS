import XCTest
@testable import AnchorOSNative

/// Parity tests for AnchorWeeklyReportEngine vs PWA WeeklyReportEngine.ts.
final class AnchorWeeklyReportEngineTests: XCTestCase {

    // Fixed "now" for reproducibility: Fri 2026-04-17 12:00 UTC
    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-17T12:00:00Z")!
    }()

    // MARK: — helpers

    private func tx(_ id: String,
                    amount: Int,
                    type: String,
                    category: String? = "Food",
                    date: String,
                    deleted: Bool = false,
                    currency: String = "USD") -> AnchorTransaction {
        AnchorTransaction(
            id: id, title: id, amountCents: amount, type: type,
            category: category, accountId: nil, accountName: nil,
            currency: currency, date: date, isSoftDeleted: deleted
        )
    }

    private func com(_ id: String,
                     completed: Bool,
                     category: String = "health",
                     streak: Int = 0,
                     createdAt: String?) -> AnchorCommitment {
        AnchorCommitment(
            id: id, title: id, type: "daily", completed: completed,
            category: category, domain: nil, timeOfDay: nil, notes: nil,
            currentStreak: streak, longestStreak: streak,
            lastCompletedAt: nil, createdAt: createdAt, priority: nil
        )
    }

    // MARK: — empty

    func test_emptyInputsProduceZeroReport() {
        let r = AnchorWeeklyReportEngine.build(transactions: [], commitments: [], now: now)
        XCTAssertEqual(r.totalSpentCents, 0)
        XCTAssertEqual(r.totalIncomeCents, 0)
        XCTAssertEqual(r.netCashFlowCents, 0)
        XCTAssertEqual(r.vsLastWeekPct, 0)
        XCTAssertEqual(r.topCategory.name, "General")
        XCTAssertEqual(r.commitmentSummary.completionRatePct, 0)
        XCTAssertEqual(r.commitmentSummary.longestStreak.name, "N/A")
    }

    // MARK: — totals + net cash flow

    func test_sumsIncomeAndExpenseInsideWindow() {
        let txs: [AnchorTransaction] = [
            tx("a", amount: 10_00, type: "expense", date: "2026-04-12T10:00:00Z"),
            tx("b", amount: 30_00, type: "income",  date: "2026-04-14T10:00:00Z"),
            tx("c", amount:  5_00, type: "expense", date: "2026-04-17T10:00:00Z"),
            tx("d", amount: 99_00, type: "expense", date: "2026-04-05T10:00:00Z"), // outside
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: txs, commitments: [], now: now)
        XCTAssertEqual(r.totalSpentCents, 15_00)
        XCTAssertEqual(r.totalIncomeCents, 30_00)
        XCTAssertEqual(r.netCashFlowCents, 15_00)
    }

    func test_softDeletedTransactionsExcluded() {
        let txs: [AnchorTransaction] = [
            tx("a", amount: 20_00, type: "expense", date: "2026-04-14T10:00:00Z"),
            tx("b", amount: 80_00, type: "expense", date: "2026-04-14T10:00:00Z", deleted: true),
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: txs, commitments: [], now: now)
        XCTAssertEqual(r.totalSpentCents, 20_00)
    }

    // MARK: — top category

    func test_topCategoryWinsByTotal() {
        let txs: [AnchorTransaction] = [
            tx("a", amount: 10_00, type: "expense", category: "Food",      date: "2026-04-12T10:00:00Z"),
            tx("b", amount: 50_00, type: "expense", category: "Transport", date: "2026-04-13T10:00:00Z"),
            tx("c", amount:  5_00, type: "expense", category: "Food",      date: "2026-04-14T10:00:00Z"),
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: txs, commitments: [], now: now)
        XCTAssertEqual(r.topCategory.name, "Transport")
        XCTAssertEqual(r.topCategory.amountCents, 50_00)
    }

    // MARK: — vsLastWeek

    func test_vsLastWeekReturnsZeroWhenNoPriorData() {
        let txs = [tx("a", amount: 100_00, type: "expense", date: "2026-04-14T10:00:00Z")]
        let r = AnchorWeeklyReportEngine.build(transactions: txs, commitments: [], now: now)
        XCTAssertEqual(r.vsLastWeekPct, 0)
    }

    func test_vsLastWeekPositiveDelta() {
        // prior week spent 100, this week spent 150 → +50.0%
        let txs: [AnchorTransaction] = [
            tx("p", amount: 100_00, type: "expense", date: "2026-04-05T10:00:00Z"), // prev window
            tx("c", amount: 150_00, type: "expense", date: "2026-04-14T10:00:00Z"),
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: txs, commitments: [], now: now)
        XCTAssertEqual(r.vsLastWeekPct, 50.0)
    }

    func test_vsLastWeekNegativeDeltaRoundedToOneDp() {
        // prior 300, current 200 → -33.333% → -33.3
        let txs: [AnchorTransaction] = [
            tx("p", amount: 300_00, type: "expense", date: "2026-04-05T10:00:00Z"),
            tx("c", amount: 200_00, type: "expense", date: "2026-04-14T10:00:00Z"),
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: txs, commitments: [], now: now)
        XCTAssertEqual(r.vsLastWeekPct, -33.3)
    }

    // MARK: — commitment summary

    func test_commitmentsFilteredByCreatedAtWithinWeek() {
        let cs: [AnchorCommitment] = [
            com("a", completed: true,  createdAt: "2026-04-14T10:00:00Z"),
            com("b", completed: false, createdAt: "2026-04-14T10:00:00Z"),
            com("c", completed: true,  createdAt: "2026-04-01T10:00:00Z"), // outside
            com("d", completed: true,  createdAt: nil),                    // no createdAt
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: [], commitments: cs, now: now)
        XCTAssertEqual(r.commitmentSummary.completed, 1)
        XCTAssertEqual(r.commitmentSummary.missed, 1)
        XCTAssertEqual(r.commitmentSummary.completionRatePct, 50)
    }

    func test_longestStreakAmongWeekCreatedCommitments() {
        let cs: [AnchorCommitment] = [
            com("a", completed: true, streak: 3, createdAt: "2026-04-14T10:00:00Z"),
            com("b", completed: true, streak: 7, createdAt: "2026-04-15T10:00:00Z"),
            com("c", completed: true, streak: 99, createdAt: "2026-03-01T10:00:00Z"), // outside
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: [], commitments: cs, now: now)
        XCTAssertEqual(r.commitmentSummary.longestStreak.name, "b")
        XCTAssertEqual(r.commitmentSummary.longestStreak.days, 7)
    }

    func test_bestAndWorstCategoryByCompletionRate() {
        let cs: [AnchorCommitment] = [
            com("a", completed: true,  category: "fitness", createdAt: "2026-04-14T10:00:00Z"),
            com("b", completed: true,  category: "fitness", createdAt: "2026-04-14T10:00:00Z"),
            com("c", completed: false, category: "finance", createdAt: "2026-04-14T10:00:00Z"),
            com("d", completed: false, category: "finance", createdAt: "2026-04-14T10:00:00Z"),
        ]
        let r = AnchorWeeklyReportEngine.build(transactions: [], commitments: cs, now: now)
        XCTAssertEqual(r.commitmentSummary.bestCategory, "fitness")
        XCTAssertEqual(r.commitmentSummary.worstCategory, "finance")
    }
}
