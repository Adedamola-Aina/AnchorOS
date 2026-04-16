import XCTest
@testable import AnchorOSNative

/// Parity contract with src/services/fabric/predictionGoalSignals.ts and
/// its sibling predictionGoalSignals.test.ts.
final class AnchorGoalSignalsTests: XCTestCase {

    private let fixedNow: Date = {
        let c = DateComponents(year: 2026, month: 3, day: 20, hour: 12)
        return Calendar(identifier: .gregorian).date(from: c)!
    }()

    private func goal(
        id: String = "goal-1",
        title: String = "Emergency Fund",
        target: Int = 100_000,
        current: Int = 50_000,
        targetDate: String? = "2026-09-20"
    ) -> AnchorGoal {
        AnchorGoal(
            id: id, title: title,
            targetAmountCents: target, currentAmountCents: current,
            currency: "USD", goalType: "savings",
            accountId: nil, targetDate: targetDate,
            createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z"
        )
    }

    private func tx(
        _ amount: Int,
        _ type: String = "income",
        date: String
    ) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount,
            type: type, category: nil, accountId: nil, accountName: nil,
            currency: "USD", date: date, isSoftDeleted: false
        )
    }

    // MARK: — Empty

    func test_emptyWhenNoGoals() {
        XCTAssertEqual(AnchorGoalSignals.build(goals: [], transactions: [], now: fixedNow), [])
    }

    // MARK: — On-track / at-risk

    func test_onTrackWhenSavingsRateSufficient() {
        // $500 remaining, 6 months ahead, last-month savings = $2000
        let g = goal(target: 100_000, current: 95_000, targetDate: "2026-09-20")
        let txs = [
            tx(500_000, "income",  date: "2026-02-01"),
            tx(300_000, "expense", date: "2026-02-15"),
        ]
        let r = AnchorGoalSignals.build(goals: [g], transactions: txs, now: fixedNow)
        XCTAssertEqual(r.count, 1)
        XCTAssertEqual(r[0].kind, .goalOnTrack)
        XCTAssertEqual(r[0].severity, .info)
        XCTAssertFalse(r[0].actionable)
        XCTAssertEqual(r[0].id, "pred-goal-track-goal-1")
    }

    func test_atRiskWhenSavingsRateTooLow() {
        let g = goal(target: 100_000, current: 10_000, targetDate: "2026-04-20")
        let txs = [
            tx(5_000, "income",  date: "2026-02-01"),
            tx(4_500, "expense", date: "2026-02-15"),
        ]
        let r = AnchorGoalSignals.build(goals: [g], transactions: txs, now: fixedNow)
        XCTAssertEqual(r.count, 1)
        XCTAssertEqual(r[0].kind, .goalAtRisk)
        XCTAssertEqual(r[0].severity, .warning)
        XCTAssertTrue(r[0].actionable)
        XCTAssertEqual(r[0].action?.navigateTo, "/finance")
        XCTAssertEqual(r[0].id, "pred-goal-risk-goal-1")
    }

    // MARK: — Skip conditions

    func test_skipsGoalWithoutTargetDate() {
        let g = goal(targetDate: nil)
        XCTAssertEqual(AnchorGoalSignals.build(goals: [g], transactions: [], now: fixedNow), [])
    }

    func test_skipsAlreadyCompletedGoal() {
        let g = goal(target: 100_000, current: 100_000)
        XCTAssertEqual(AnchorGoalSignals.build(goals: [g], transactions: [], now: fixedNow), [])
    }

    func test_skipsGoalWithPastTargetDate() {
        let g = goal(targetDate: "2026-01-20") // before now
        XCTAssertEqual(AnchorGoalSignals.build(goals: [g], transactions: [], now: fixedNow), [])
    }

    // MARK: — Detail

    func test_detailIncludesEstimatedMonths() {
        let g = goal(target: 100_000, current: 50_000, targetDate: "2026-12-20")
        let txs = [
            tx(200_000, "income",  date: "2026-02-01"),
            tx(150_000, "expense", date: "2026-02-15"),
        ]
        let r = AnchorGoalSignals.build(goals: [g], transactions: txs, now: fixedNow)
        XCTAssertEqual(r.count, 1)
        XCTAssertTrue(r[0].detail.contains("month"))
    }

    func test_atRiskDetailUsesInfinityWhenZeroSavings() {
        let g = goal(target: 100_000, current: 10_000, targetDate: "2026-04-20")
        // No income last month → monthlySavings = 0.
        let r = AnchorGoalSignals.build(goals: [g], transactions: [], now: fixedNow)
        XCTAssertEqual(r.first?.kind, .goalAtRisk)
        XCTAssertTrue(r.first?.detail.contains("∞") == true)
    }

    // MARK: — Sort + cap

    func test_capsAtThreeSignals() {
        let goals = (0..<5).map { i in
            goal(id: "goal-\(i)", title: "Goal \(i)",
                 target: 100_000, current: 10_000, targetDate: "2026-04-20")
        }
        let txs = [
            tx(5_000, "income",  date: "2026-02-01"),
            tx(4_500, "expense", date: "2026-02-15"),
        ]
        let r = AnchorGoalSignals.build(goals: goals, transactions: txs, now: fixedNow)
        XCTAssertLessThanOrEqual(r.count, 3)
    }

    func test_atRiskSortsBeforeOnTrack() {
        // One at-risk + one on-track → at-risk wins the top slot regardless
        // of confidence.
        let atRisk = goal(id: "goal-a", title: "Car", target: 100_000,
                          current: 10_000, targetDate: "2026-04-20")
        let onTrack = goal(id: "goal-b", title: "Fund", target: 100_000,
                           current: 95_000, targetDate: "2026-09-20")
        let txs = [
            tx(500_000, "income",  date: "2026-02-01"),
            tx(300_000, "expense", date: "2026-02-15"),
        ]
        let r = AnchorGoalSignals.build(goals: [onTrack, atRisk], transactions: txs, now: fixedNow)
        XCTAssertEqual(r.count, 2)
        XCTAssertEqual(r[0].kind, .goalAtRisk)
        XCTAssertEqual(r[1].kind, .goalOnTrack)
    }
}
