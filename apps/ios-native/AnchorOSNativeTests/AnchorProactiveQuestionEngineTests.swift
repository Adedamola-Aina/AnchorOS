import XCTest
@testable import AnchorOSNative

/// Parity tests for AnchorProactiveQuestionEngine vs
/// src/services/fabric/ProactiveQuestionEngine.ts.
final class AnchorProactiveQuestionEngineTests: XCTestCase {

    // Fixed "now": Wed 2026-04-15 12:00 UTC
    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-15T12:00:00Z")!
    }()

    // MARK: — fixtures

    private func isoDaysAgo(_ days: Double) -> String {
        let d = now.addingTimeInterval(-days * 24 * 3600)
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.string(from: d)
    }

    private func pattern(confidence: Double, daysAgo: Double,
                         action: AnchorUserPattern.ActionKind = .reviewBudget) -> AnchorUserPattern {
        AnchorUserPattern(
            id: UUID().uuidString,
            triggerKind: .timeOfDay, triggerHour: 9,
            triggerCategory: nil, triggerCommitmentId: nil,
            actionKind: action, actionCategory: nil,
            actionCommitmentId: nil, frequency: 5,
            confidence: confidence, lastOccurred: isoDaysAgo(daysAgo)
        )
    }

    private func commitment(completedDaysAgo: Double?) -> AnchorCommitment {
        AnchorCommitment(
            id: UUID().uuidString, title: "t", type: "daily",
            completed: false, category: nil, domain: nil, timeOfDay: nil,
            notes: nil, currentStreak: nil, longestStreak: nil,
            lastCompletedAt: completedDaysAgo.map(isoDaysAgo),
            createdAt: nil, priority: nil
        )
    }

    private func expense(_ amount: Int, _ category: String, daysAgo: Double) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount,
            type: "expense", category: category, accountId: nil,
            accountName: nil, currency: "USD", date: isoDaysAgo(daysAgo),
            isSoftDeleted: false
        )
    }

    private func income(_ amount: Int, _ category: String, daysAgo: Double) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount,
            type: "income", category: category, accountId: nil,
            accountName: nil, currency: "USD", date: isoDaysAgo(daysAgo),
            isSoftDeleted: false
        )
    }

    private func account(_ balance: Int) -> AnchorAccount {
        AnchorAccount(
            id: UUID().uuidString, name: "a", type: "checking",
            currency: "USD", balanceCents: balance, color: nil,
            scope: "personal", ownerId: nil, isArchived: false, sortOrder: 0
        )
    }

    private func empty() -> AnchorProactiveQuestionEngine.Input {
        .init(patterns: [], transactions: [], commitments: [], accounts: [], now: now)
    }

    // MARK: — empty

    func test_emptyInputsReturnNil() {
        XCTAssertNil(AnchorProactiveQuestionEngine.build(empty()))
    }

    // MARK: — missed_habit

    func test_missedHabitFiresWhenConfirmedPatternIsStale() {
        var i = empty(); i = .init(
            patterns: [pattern(confidence: 0.8, daysAgo: 5, action: .reviewBudget)],
            transactions: [], commitments: [], accounts: [], now: now
        )
        let q = AnchorProactiveQuestionEngine.build(i)
        XCTAssertEqual(q?.kind, .missedHabit)
        XCTAssertTrue(q?.question.contains("review budget") ?? false)
    }

    func test_missedHabitSuppressedBelowConfidence() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [pattern(confidence: 0.4, daysAgo: 5)],
            transactions: [], commitments: [], accounts: [], now: now
        )
        XCTAssertNil(AnchorProactiveQuestionEngine.build(i))
    }

    func test_missedHabitSuppressedWhenRecent() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [pattern(confidence: 0.9, daysAgo: 1)],
            transactions: [], commitments: [], accounts: [], now: now
        )
        XCTAssertNil(AnchorProactiveQuestionEngine.build(i))
    }

    // MARK: — completion_drop

    func test_completionDropFiresWhenRecentHalvedFromPrior() {
        let cs: [AnchorCommitment] = [
            // prior window: 8–14 days ago → 3 completions
            commitment(completedDaysAgo: 9),
            commitment(completedDaysAgo: 10),
            commitment(completedDaysAgo: 12),
            // recent window: last 7 days → 1 completion (< 3 * 0.5 = 1.5)
            commitment(completedDaysAgo: 3),
        ]
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [], transactions: [], commitments: cs, accounts: [], now: now
        )
        XCTAssertEqual(AnchorProactiveQuestionEngine.build(i)?.kind, .completionDrop)
    }

    func test_completionDropSuppressedWithNoCommitments() {
        XCTAssertNil(AnchorProactiveQuestionEngine.build(empty()))
    }

    // MARK: — category_spike

    func test_categorySpikeFiresWhenWeeklyAverageExceeded() {
        // prior 30d: 230 cents in Food → weekly avg = 70
        // recent 7d: 200 cents in Food → 200 > 70 * 1.5 (105)
        let txs: [AnchorTransaction] = [
            expense(100, "Food", daysAgo: 10),
            expense(130, "Food", daysAgo: 25),
            expense(200, "Food", daysAgo: 2),
        ]
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [], transactions: txs, commitments: [], accounts: [], now: now
        )
        XCTAssertEqual(AnchorProactiveQuestionEngine.build(i)?.kind, .categorySpike)
    }

    func test_categorySpikeSuppressedBelowThreshold() {
        let txs: [AnchorTransaction] = [
            expense(1000, "Food", daysAgo: 10),
            expense(1000, "Food", daysAgo: 20),
            expense(100,  "Food", daysAgo: 2),   // recent < prior avg → no spike
        ]
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [], transactions: txs, commitments: [], accounts: [], now: now
        )
        XCTAssertNil(AnchorProactiveQuestionEngine.build(i))
    }

    // MARK: — surplus_idle

    func test_surplusIdleFiresWithoutRecentSavingsIncome() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [], transactions: [],
            commitments: [], accounts: [account(60_000_00)], now: now
        )
        XCTAssertEqual(AnchorProactiveQuestionEngine.build(i)?.kind, .surplusIdle)
    }

    func test_surplusIdleSuppressedBelowThreshold() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [], transactions: [],
            commitments: [], accounts: [account(10_000_00)], now: now
        )
        XCTAssertNil(AnchorProactiveQuestionEngine.build(i))
    }

    func test_surplusIdleSuppressedWithRecentSavingsIncome() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [],
            transactions: [income(5_000_00, "Savings Transfer", daysAgo: 3)],
            commitments: [], accounts: [account(60_000_00)], now: now
        )
        XCTAssertNil(AnchorProactiveQuestionEngine.build(i))
    }

    // MARK: — suppression + priority

    func test_wasShownRecentlyBlocksSameKindOnly() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [pattern(confidence: 0.9, daysAgo: 5)],
            transactions: [], commitments: [],
            accounts: [account(60_000_00)], now: now
        )
        // Suppress missed_habit → falls through to surplus_idle
        let q = AnchorProactiveQuestionEngine.build(i) { kind in
            kind == .missedHabit
        }
        XCTAssertEqual(q?.kind, .surplusIdle)
    }

    func test_priorityOrderMissedHabitWinsOverSurplus() {
        let i = AnchorProactiveQuestionEngine.Input(
            patterns: [pattern(confidence: 0.9, daysAgo: 5)],
            transactions: [], commitments: [],
            accounts: [account(60_000_00)], now: now
        )
        XCTAssertEqual(AnchorProactiveQuestionEngine.build(i)?.kind, .missedHabit)
    }
}
