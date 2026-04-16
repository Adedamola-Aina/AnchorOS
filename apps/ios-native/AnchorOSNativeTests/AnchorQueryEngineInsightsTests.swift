import XCTest
@testable import AnchorOSNative

/// Phase 4e-3b parity tests: query_day_of_week + query_correlation.
final class AnchorQueryEngineInsightsTests: XCTestCase {

    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-15T12:00:00Z")!
    }()

    private func iso(_ daysAgo: Double) -> String {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.string(from: now.addingTimeInterval(-daysAgo * 86400))
    }

    private func tx(_ amount: Int, cat: String = "Food",
                    daysAgo d: Double) -> AnchorTransaction {
        AnchorTransaction(id: UUID().uuidString, title: "t", amountCents: amount,
                          type: "expense", category: cat, accountId: nil,
                          accountName: nil, currency: "NGN",
                          date: iso(d), isSoftDeleted: false)
    }

    private func commitment(type: String = "daily",
                            completedDaysAgo d: Double?,
                            createdDaysAgo c: Double = 100) -> AnchorCommitment {
        AnchorCommitment(
            id: UUID().uuidString, title: "t", type: type, completed: d != nil,
            category: nil, domain: nil, timeOfDay: nil, notes: nil,
            currentStreak: nil, longestStreak: nil,
            lastCompletedAt: d.map { iso($0) },
            createdAt: iso(c), priority: nil
        )
    }

    private func input(_ action: AnchorFabricIntent.Action,
                       tx: [AnchorTransaction] = [],
                       commitments: [AnchorCommitment] = [])
    -> AnchorQueryEngine.Input {
        let intent = AnchorFabricIntent(
            action: action, confidence: 0.8,
            entities: .init(), rawInput: ""
        )
        return .init(
            intent: intent, transactions: tx, commitments: commitments,
            accounts: [], recurring: [], upcoming: [],
            weeklyReport: nil, now: now
        )
    }

    // MARK: — day_of_week

    func test_dayOfWeekWithNoDataReturnsFallback() {
        let r = AnchorQueryEngine.run(input(.queryDayOfWeek))
        XCTAssertTrue(r.summary.contains("Not enough data"))
    }

    func test_dayOfWeekDetectsHighSpendAfter56Days() {
        // Heavy Friday spending across a 70-day window. "2026-04-15" is a
        // Wednesday, so Fridays in the window are 5d ago, 12d ago, ...
        var txs: [AnchorTransaction] = []
        for w in 0..<10 {
            txs.append(tx(5000_00, cat: "Food", daysAgo: Double(5 + w * 7)))  // Fridays
            txs.append(tx(200_00,  cat: "Food", daysAgo: Double(1 + w * 7)))  // other
        }
        let r = AnchorQueryEngine.run(input(.queryDayOfWeek, tx: txs))
        XCTAssertTrue(r.summary.contains("highest-spend"))
    }

    // MARK: — correlation

    func test_correlationInsufficientBucketsReturnsFallback() {
        let r = AnchorQueryEngine.run(input(.queryCorrelation))
        XCTAssertTrue(r.summary.contains("at least 8 weeks"))
    }

    // MARK: — intent detection

    func test_parserDetectsDayOfWeekIntent() {
        let p = AnchorIntentParser.parse("which day do i spend most on")
        XCTAssertEqual(p.action, .queryDayOfWeek)
    }

    func test_parserDetectsCorrelationIntent() {
        let p = AnchorIntentParser.parse("is there a connection between my habits and spending")
        XCTAssertEqual(p.action, .queryCorrelation)
    }

    // MARK: — family (4e-3c)

    func test_parserDetectsFamilyIntent() {
        let p = AnchorIntentParser.parse("how much did my family spend this month")
        XCTAssertEqual(p.action, .queryFamily)
    }

    func test_familySummaryWithNoSharedTransactions() {
        let personal = AnchorTransaction(
            id: "p", title: "t", amountCents: 500_00, type: "expense",
            category: "Food", accountId: nil, accountName: nil,
            currency: "NGN", date: iso(1), isSoftDeleted: false,
            scope: "personal"
        )
        let r = AnchorQueryEngine.run(input(.queryFamily, tx: [personal]))
        XCTAssertTrue(r.summary.contains("No shared family transactions"))
    }

    func test_familySummaryAggregatesScopeFamily() {
        let family = AnchorTransaction(
            id: "f", title: "groceries", amountCents: 1_500_00, type: "expense",
            category: "Groceries", accountId: nil, accountName: nil,
            currency: "NGN", date: iso(2), isSoftDeleted: false,
            scope: "family"
        )
        let r = AnchorQueryEngine.run(input(.queryFamily, tx: [family]))
        XCTAssertTrue(r.summary.contains("1 shared transactions"))
        XCTAssertTrue(r.summary.contains("this month"))
    }
}
