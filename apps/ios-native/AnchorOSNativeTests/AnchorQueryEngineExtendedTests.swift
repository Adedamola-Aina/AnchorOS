import XCTest
@testable import AnchorOSNative

/// Parity tests for:
///   - Phase 4e-2: record_expense / record_income intent → form action
///   - Phase 4e-3: queryIncome, queryAccounts, queryRecurring,
///     queryMomentum, queryScenario
///   - Phase 4e-4: contextual follow-up resolution
final class AnchorQueryEngineExtendedTests: XCTestCase {

    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-15T12:00:00Z")!
    }()

    private func isoDaysAgo(_ n: Double) -> String {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.string(from: now.addingTimeInterval(-n * 86400))
    }

    private func tx(_ amount: Int, _ type: String, _ cat: String = "Food",
                    daysAgo d: Double = 1) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount, type: type,
            category: cat, accountId: nil, accountName: nil, currency: "NGN",
            date: isoDaysAgo(d), isSoftDeleted: false
        )
    }

    private func account(_ bal: Int, archived: Bool = false) -> AnchorAccount {
        AnchorAccount(id: UUID().uuidString, name: "a", type: "checking",
                      currency: "NGN", balanceCents: bal, color: nil,
                      scope: "personal", ownerId: nil,
                      isArchived: archived, sortOrder: 0)
    }

    private func recurring(_ amount: Int, freq: String,
                           nextRunAt: String,
                           status: String = "active") -> AnchorRecurringTransaction {
        AnchorRecurringTransaction(
            id: UUID().uuidString, title: "Netflix", amountCents: amount,
            currency: "NGN", category: "Entertainment", type: "expense",
            frequency: freq, nextRunAt: nextRunAt, status: status
        )
    }

    private func input(
        _ action: AnchorFabricIntent.Action,
        period: AnchorFabricIntent.TimePeriod? = nil,
        amount: Double? = nil, category: String? = nil,
        tx: [AnchorTransaction] = [],
        accounts: [AnchorAccount] = [],
        recurring: [AnchorRecurringTransaction] = []
    ) -> AnchorQueryEngine.Input {
        let intent = AnchorFabricIntent(
            action: action, confidence: 0.8,
            entities: .init(amount: amount, category: category,
                            timePeriod: period, page: nil),
            rawInput: ""
        )
        return .init(
            intent: intent, transactions: tx, commitments: [],
            accounts: accounts, recurring: recurring,
            upcoming: [], weeklyReport: nil, now: now
        )
    }

    // MARK: — record (4e-2)

    func test_recordExpenseWithAmountReturnsOpenAddTransaction() {
        let r = AnchorQueryEngine.run(input(.recordExpense, amount: 500, category: "Food"))
        XCTAssertTrue(r.summary.contains("Ready to log"))
        XCTAssertTrue(r.summary.contains("Food"))
        guard case .openAddTransaction(let t, let a, let c) = r.actions.first?.kind else {
            return XCTFail("expected openAddTransaction")
        }
        XCTAssertEqual(t, .expense)
        XCTAssertEqual(a, 500)
        XCTAssertEqual(c, "Food")
    }

    func test_recordIncomeWithoutAmountFallsBackToFormOpener() {
        let r = AnchorQueryEngine.run(input(.recordIncome))
        XCTAssertTrue(r.summary.contains("Opening transaction form"))
        guard case .openAddTransaction(let t, _, _) = r.actions.first?.kind else {
            return XCTFail("expected openAddTransaction")
        }
        XCTAssertEqual(t, .income)
    }

    // MARK: — extended queries (4e-3)

    func test_queryIncomeSumsAndNarrates() {
        let r = AnchorQueryEngine.run(input(
            .queryIncome, period: .thisMonth,
            tx: [tx(200_00, "income", "Salary", daysAgo: 1),
                 tx(50_00,  "income", "Gig",    daysAgo: 2)]
        ))
        XCTAssertTrue(r.summary.contains("2 income transactions"))
    }

    func test_queryAccountsShowsTopAccount() {
        let r = AnchorQueryEngine.run(input(
            .queryAccounts,
            accounts: [account(1_000_00), account(5_000_00), account(0, archived: true)]
        ))
        XCTAssertTrue(r.summary.contains("2 accounts"))
        XCTAssertTrue((r.detail ?? "").contains("Highest balance"))
    }

    func test_queryRecurringSumsMonthly() {
        let r = AnchorQueryEngine.run(input(
            .queryRecurring,
            recurring: [recurring(1_000_00, freq: "monthly", nextRunAt: isoDaysAgo(-3)),
                        recurring(500_00,   freq: "weekly",  nextRunAt: isoDaysAgo(-1))]
        ))
        XCTAssertTrue(r.summary.contains("2 active recurring"))
        XCTAssertTrue(r.summary.contains("month"))
        XCTAssertTrue((r.detail ?? "").contains("Next due"))
    }

    func test_queryMomentumComparesTwoWeeks() {
        let r = AnchorQueryEngine.run(input(
            .queryMomentum,
            tx: [tx(100_00, "expense", "Food", daysAgo: 1),     // this week
                 tx(200_00, "expense", "Food", daysAgo: 8)]     // last week
        ))
        XCTAssertTrue(r.summary.contains("spending"))
        XCTAssertTrue(r.summary.contains("net cash flow"))
    }

    func test_queryScenarioReducesOverallByDefault20() {
        let r = AnchorQueryEngine.run(input(
            .queryScenario,
            tx: (1...3).map { tx(300_00, "expense", "Food", daysAgo: Double($0)) }
        ))
        XCTAssertTrue(r.summary.contains("20%"))
        XCTAssertTrue(r.summary.contains("3 months"))
    }

    func test_queryScenarioUsesExplicitPercentAndCategory() {
        let r = AnchorQueryEngine.run(input(
            .queryScenario, amount: 50, category: "Food",
            tx: (1...3).map { tx(600_00, "expense", "Food", daysAgo: Double($0)) }
        ))
        XCTAssertTrue(r.summary.contains("50%"))
        XCTAssertTrue(r.summary.contains("Food"))
    }

    // MARK: — contextual intent (4e-4)

    func test_followUpInheritsPriorActionAndCategory() {
        let history: [AnchorFabricMessage] = [
            .init(role: .user, content: "how much did i spend on food this month", timestamp: now),
            .init(role: .assistant, content: "...", timestamp: now),
        ]
        let intent = AnchorIntentParser.parse("what about transport", history: history)
        XCTAssertEqual(intent.action, .querySpending)
        XCTAssertEqual(intent.entities.category, "Transport")
    }

    func test_followUpIgnoredWithoutFollowUpMarker() {
        let history: [AnchorFabricMessage] = [
            .init(role: .user, content: "how much did i spend on food", timestamp: now),
        ]
        // "nonsense" has no follow-up pattern → stays unknown
        let intent = AnchorIntentParser.parse("nonsense", history: history)
        XCTAssertEqual(intent.action, .unknown)
    }

    func test_directIntentNotOverriddenByContext() {
        let history: [AnchorFabricMessage] = [
            .init(role: .user, content: "how much did i spend", timestamp: now),
        ]
        let intent = AnchorIntentParser.parse("plan my week", history: history)
        XCTAssertEqual(intent.action, .planWeek)
    }

    func test_contextualConfidenceIsReducedBy15Pct() {
        let history: [AnchorFabricMessage] = [
            .init(role: .user, content: "how much did i spend", timestamp: now),
        ]
        let intent = AnchorIntentParser.parse("what about this month", history: history)
        XCTAssertEqual(intent.confidence, 0.8 * 0.85, accuracy: 0.001)
    }
}
