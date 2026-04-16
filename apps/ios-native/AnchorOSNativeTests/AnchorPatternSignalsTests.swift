import XCTest
@testable import AnchorOSNative

/// Parity contract with src/services/fabric/predictionPatternSignals.ts
/// and the recurring_due case from predictionBehaviorSignals.ts.
/// No dedicated PWA test file exists — contract is derived from source.
final class AnchorPatternSignalsTests: XCTestCase {

    // Mid-month 9am local so day > 5 (suppresses recurring_due), hour = 9.
    private let morningMidMonth: Date = {
        let c = DateComponents(year: 2026, month: 3, day: 20, hour: 9, minute: 0)
        return Calendar(identifier: .gregorian).date(from: c)!
    }()

    private typealias F = AnchorPredictionsFixtures
    private func pattern(
        id: String = "p1",
        triggerKind: AnchorUserPattern.TriggerKind,
        hour: Int? = nil,
        category: String? = nil,
        commitmentId: String? = nil,
        actionKind: AnchorUserPattern.ActionKind,
        actionCategory: String? = nil,
        confidence: Double = 0.8
    ) -> AnchorUserPattern {
        F.pattern(id: id, triggerKind: triggerKind, hour: hour,
                  category: category, commitmentId: commitmentId,
                  actionKind: actionKind, actionCategory: actionCategory,
                  confidence: confidence)
    }
    private func tx(_ a: Int, _ c: String = "Food",
                    date: String, type: String = "expense") -> AnchorTransaction {
        F.tx(a, c, date: date, type: type)
    }
    private func daily(id: String, title: String = "Walk",
                       completed: Bool = false, streak: Int? = 3) -> AnchorCommitment {
        F.daily(id: id, title: title, completed: completed, streak: streak)
    }

    // MARK: — Confidence gate

    func test_patternsBelow065AreIgnored() {
        let p = pattern(triggerKind: .timeOfDay, hour: 9,
                        actionKind: .checkCommitment, confidence: 0.5)
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: [], commitments: [], now: morningMidMonth
        )
        XCTAssertEqual(r, [])
    }

    // MARK: — time_of_day

    func test_timeOfDayFiresWithinTwoHours() {
        // now.hour = 9, trigger hour = 10 → |diff| = 1 ≤ 2 → fires.
        let p = pattern(triggerKind: .timeOfDay, hour: 10,
                        actionKind: .checkCommitment, confidence: 0.8)
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: [], commitments: [], now: morningMidMonth
        )
        XCTAssertEqual(r.count, 1)
        XCTAssertEqual(r[0].kind, .commitmentReminder)
        XCTAssertEqual(r[0].action?.navigateTo, "/commitments")
        XCTAssertTrue(r[0].detail.contains("commitments"))
        XCTAssertEqual(r[0].id, "pred-pattern-time-10-2026-03")
    }

    func test_timeOfDaySuppressedWhenMoreThanTwoHoursAway() {
        // now.hour = 9, trigger hour = 15 → |diff| = 6 > 2 → no fire.
        let p = pattern(triggerKind: .timeOfDay, hour: 15,
                        actionKind: .checkCommitment, confidence: 0.8)
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: [], commitments: [], now: morningMidMonth
        )
        XCTAssertTrue(r.isEmpty)
    }

    func test_timeOfDayBudgetActionRoutesToFinance() {
        let p = pattern(triggerKind: .timeOfDay, hour: 9,
                        actionKind: .reviewBudget, confidence: 0.8)
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: [], commitments: [], now: morningMidMonth
        )
        XCTAssertEqual(r.first?.action?.navigateTo, "/finance")
        XCTAssertEqual(r.first?.action?.label, "Review Budget")
        XCTAssertTrue(r.first?.detail.contains("budget") == true)
    }

    // MARK: — transaction_recorded

    func test_transactionRecordedFiresOn20PctOverage() {
        let p = pattern(triggerKind: .transactionRecorded, category: "Food",
                        actionKind: .reviewBudget, actionCategory: "Food", confidence: 0.8)
        let txs = [
            tx(50_000, "Food", date: "2026-02-10"),
            tx(61_000, "Food", date: "2026-03-05"), // 22% up
        ]
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: txs, commitments: [], now: morningMidMonth
        )
        let sig = r.first { $0.id.hasPrefix("pred-pattern-category-food-") }
        XCTAssertNotNil(sig)
        XCTAssertEqual(sig?.kind, .budgetOverage)
        // Confidence is pattern * 0.9
        XCTAssertEqual(sig?.confidence ?? 0, 0.8 * 0.9, accuracy: 0.0001)
    }

    func test_transactionRecordedSuppressedAtExactly20Pct() {
        let p = pattern(triggerKind: .transactionRecorded, category: "Food",
                        actionKind: .reviewBudget, actionCategory: "Food", confidence: 0.8)
        let txs = [
            tx(50_000, "Food", date: "2026-02-10"),
            tx(60_000, "Food", date: "2026-03-05"), // 1.2× exactly — strict `>` in PWA
        ]
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: txs, commitments: [], now: morningMidMonth
        )
        XCTAssertTrue(r.isEmpty)
    }

    // MARK: — commitment_completed

    func test_commitmentCompletedFiresWhenDailyPending() {
        let p = pattern(triggerKind: .commitmentCompleted, commitmentId: "c-1",
                        actionKind: .checkCommitment, confidence: 0.8)
        let task = daily(id: "c-1", title: "Meditate", completed: false, streak: 4)
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: [], commitments: [task], now: morningMidMonth
        )
        let sig = r.first
        XCTAssertNotNil(sig)
        XCTAssertTrue(sig?.message.contains("\"Meditate\"") == true)
        XCTAssertTrue(sig?.detail.contains("4-day streak") == true)
        XCTAssertEqual(sig?.action?.navigateTo, "/commitments")
    }

    func test_commitmentCompletedSuppressedWhenTaskDone() {
        let p = pattern(triggerKind: .commitmentCompleted, commitmentId: "c-1",
                        actionKind: .checkCommitment, confidence: 0.8)
        let task = daily(id: "c-1", completed: true)
        let r = AnchorPatternSignals.build(
            patterns: [p], transactions: [], commitments: [task], now: morningMidMonth
        )
        XCTAssertTrue(r.isEmpty)
    }

    // MARK: — cap at 2

    func test_capsAtTwoResults() {
        let p1 = pattern(id: "p1", triggerKind: .timeOfDay, hour: 10,
                         actionKind: .checkCommitment, confidence: 0.8)
        let p2 = pattern(id: "p2", triggerKind: .timeOfDay, hour: 8,
                         actionKind: .checkCommitment, confidence: 0.8)
        let p3 = pattern(id: "p3", triggerKind: .timeOfDay, hour: 11,
                         actionKind: .checkCommitment, confidence: 0.8)
        let r = AnchorPatternSignals.build(
            patterns: [p1, p2, p3],
            transactions: [], commitments: [], now: morningMidMonth
        )
        XCTAssertEqual(r.count, 2)
    }

    // MARK: — recurring_due

    func test_recurringDueFiresInFirst5DaysWithReviewBudgetPattern() {
        let earlyMarch = Calendar(identifier: .gregorian)
            .date(from: DateComponents(year: 2026, month: 3, day: 3, hour: 12))!
        let p = pattern(triggerKind: .appOpened,
                        actionKind: .reviewBudget,
                        actionCategory: "Food",
                        confidence: 0.7)
        let r = AnchorPatternSignals.buildRecurringDue(patterns: [p], now: earlyMarch)
        XCTAssertEqual(r.count, 1)
        XCTAssertEqual(r[0].kind, .recurringDue)
        XCTAssertTrue(r[0].message.contains("Food"))
        XCTAssertEqual(r[0].id, "pred-recurring-due-2026-03")
    }

    func test_recurringDueSuppressedAfterDay5() {
        let p = pattern(triggerKind: .appOpened, actionKind: .reviewBudget,
                        actionCategory: "Food", confidence: 0.7)
        let r = AnchorPatternSignals.buildRecurringDue(
            patterns: [p], now: morningMidMonth
        )
        XCTAssertTrue(r.isEmpty)
    }

    func test_recurringDueSuppressedBelowConfidence() {
        let earlyMarch = Calendar(identifier: .gregorian)
            .date(from: DateComponents(year: 2026, month: 3, day: 3, hour: 12))!
        let p = pattern(triggerKind: .appOpened, actionKind: .reviewBudget,
                        actionCategory: "Food", confidence: 0.5)
        let r = AnchorPatternSignals.buildRecurringDue(patterns: [p], now: earlyMarch)
        XCTAssertTrue(r.isEmpty)
    }
}
