import XCTest
@testable import AnchorOSNative

/// Parity tests for AnchorQueryEngine vs the PWA surfaces in
/// src/services/fabric/query/*.
final class AnchorQueryEngineTests: XCTestCase {

    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-15T12:00:00Z")!
    }()

    private func daysAgo(_ n: Double) -> String {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.string(from: now.addingTimeInterval(-n * 86400))
    }

    private func tx(_ amount: Int, _ type: String, _ category: String = "Food",
                    daysAgo d: Double = 1) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount, type: type,
            category: category, accountId: nil, accountName: nil, currency: "NGN",
            date: daysAgo(d), isSoftDeleted: false
        )
    }

    private func commitment(_ completed: Bool, streak: Int? = 0,
                            type: String = "daily") -> AnchorCommitment {
        AnchorCommitment(
            id: UUID().uuidString, title: "t", type: type,
            completed: completed, category: nil, domain: nil, timeOfDay: nil,
            notes: nil, currentStreak: streak, longestStreak: streak,
            lastCompletedAt: nil, createdAt: nil, priority: nil
        )
    }

    private func account(_ bal: Int, currency: String = "NGN") -> AnchorAccount {
        AnchorAccount(id: UUID().uuidString, name: "a", type: "checking",
                      currency: currency, balanceCents: bal, color: nil,
                      scope: "personal", ownerId: nil, isArchived: false, sortOrder: 0)
    }

    private func input(
        action: AnchorFabricIntent.Action,
        period: AnchorFabricIntent.TimePeriod? = nil,
        page: String? = nil,
        tx: [AnchorTransaction] = [],
        commitments: [AnchorCommitment] = [],
        accounts: [AnchorAccount] = [],
        upcoming: [AnchorUpcomingItem] = [],
        report: AnchorWeeklyReport? = nil
    ) -> AnchorQueryEngine.Input {
        let intent = AnchorFabricIntent(
            action: action, confidence: 0.8,
            entities: .init(timePeriod: period, page: page),
            rawInput: ""
        )
        return .init(
            intent: intent, transactions: tx, commitments: commitments,
            accounts: accounts, upcoming: upcoming,
            weeklyReport: report, now: now
        )
    }

    // MARK: — today

    func test_todayWithNoTasks() {
        let r = AnchorQueryEngine.run(input(action: .queryToday))
        XCTAssertTrue(r.summary.contains("No scheduled tasks"))
    }

    func test_todayAllComplete() {
        let r = AnchorQueryEngine.run(input(
            action: .queryToday,
            commitments: [commitment(true), commitment(true)]
        ))
        XCTAssertTrue(r.summary.contains("All 2 tasks done"))
    }

    func test_todayPartialWithPending() {
        let r = AnchorQueryEngine.run(input(
            action: .queryToday,
            commitments: [commitment(true), commitment(false), commitment(false)]
        ))
        XCTAssertTrue(r.summary.contains("2 tasks remaining"))
        XCTAssertTrue(r.summary.contains("1/3 done"))
    }

    // MARK: — upcoming

    func test_upcomingEmpty() {
        let r = AnchorQueryEngine.run(input(action: .queryUpcoming))
        XCTAssertTrue(r.summary.contains("No upcoming"))
    }

    func test_upcomingListsItems() {
        let item = AnchorUpcomingItem(
            id: "1", type: .bill, title: "Rent",
            dueDate: daysAgo(-3), amountCents: 100_00,
            currency: "NGN", category: nil,
            isToday: false, isTomorrow: false, daysUntil: 3
        )
        let r = AnchorQueryEngine.run(input(action: .queryUpcoming, upcoming: [item]))
        XCTAssertTrue(r.summary.contains("1 upcoming payment"))
        XCTAssertTrue((r.detail ?? "").contains("Rent"))
    }

    // MARK: — spending

    func test_spendingThisMonthWithTopCategory() {
        let r = AnchorQueryEngine.run(input(
            action: .querySpending, period: .thisMonth,
            tx: [tx(500_00, "expense", "Food", daysAgo: 2),
                 tx(200_00, "expense", "Transport", daysAgo: 3)]
        ))
        XCTAssertTrue(r.summary.contains("2 transactions"))
        XCTAssertTrue((r.detail ?? "").contains("Food"))
    }

    func test_spendingZeroReturnsFallback() {
        let r = AnchorQueryEngine.run(input(action: .querySpending, period: .thisMonth))
        XCTAssertTrue(r.summary.contains("No expenses"))
    }

    // MARK: — savings rate

    func test_savingsRateNoIncome() {
        let r = AnchorQueryEngine.run(input(action: .querySavingsRate))
        XCTAssertTrue(r.summary.contains("No income"))
    }

    func test_savingsRatePositive() {
        let r = AnchorQueryEngine.run(input(
            action: .querySavingsRate,
            tx: [tx(1000_00, "income", "Salary", daysAgo: 1),
                 tx(300_00,  "expense", "Food",   daysAgo: 1)]
        ))
        XCTAssertTrue(r.summary.contains("70%"))
        XCTAssertTrue((r.detail ?? "").contains("Solid"))
    }

    // MARK: — net worth

    func test_netWorthFormatsDominantCurrency() {
        let r = AnchorQueryEngine.run(input(
            action: .queryNetWorth,
            accounts: [account(100_000_00)]
        ))
        XCTAssertTrue(r.summary.contains("net worth"))
        XCTAssertTrue(r.summary.contains("1 account"))
    }

    // MARK: — commitments summary

    func test_commitmentsSummaryComputesCompletion() {
        let r = AnchorQueryEngine.run(input(
            action: .queryCommitments,
            commitments: [commitment(true, streak: 5), commitment(true), commitment(false), commitment(false)]
        ))
        XCTAssertTrue(r.summary.contains("50% (2/4)"))
    }

    // MARK: — navigate + unknown

    func test_navigateToKnownPage() {
        let r = AnchorQueryEngine.run(input(action: .navigate, page: "finance"))
        XCTAssertTrue(r.summary.contains("Opening finance"))
        XCTAssertEqual(r.actions.first?.kind, .navigate(page: "finance"))
    }

    func test_unknownShowsFallback() {
        let r = AnchorQueryEngine.run(input(action: .unknown))
        XCTAssertTrue(r.summary.contains("not sure"))
    }
}
