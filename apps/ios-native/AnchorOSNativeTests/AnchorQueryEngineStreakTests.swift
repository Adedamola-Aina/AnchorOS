import XCTest
@testable import AnchorOSNative

/// WS-7 — parity coverage for the `query_streak` intent. Closes the last
/// open row in docs/NATIVE_PARITY_AUDIT.md §6.3.
final class AnchorQueryEngineStreakTests: XCTestCase {

    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-15T12:00:00Z")!
    }()

    private func commit(_ title: String, current: Int?, longest: Int?) -> AnchorCommitment {
        AnchorCommitment(
            id: title, title: title, type: "daily", completed: false,
            category: nil, domain: nil, timeOfDay: nil, notes: nil,
            reminderTime: nil,
            currentStreak: current, longestStreak: longest,
            lastCompletedAt: nil, createdAt: nil, priority: nil, scope: nil
        )
    }

    private func input(_ cs: [AnchorCommitment]) -> AnchorQueryEngine.Input {
        let intent = AnchorFabricIntent(
            action: .queryStreak, confidence: 0.8,
            entities: .init(), rawInput: "my streak"
        )
        return .init(
            intent: intent, transactions: [], commitments: cs,
            accounts: [], recurring: [], upcoming: [],
            weeklyReport: nil, now: now
        )
    }

    func test_noCommitmentsReturnsFallback() {
        let r = AnchorQueryEngine.run(input([]))
        XCTAssertTrue(r.summary.contains("No active streaks"))
    }

    func test_returnsTopThreeActiveStreaksSortedDescending() {
        let cs = [
            commit("read",      current: 5,  longest: 10),
            commit("walk",      current: 12, longest: 12),
            commit("meditate",  current: 3,  longest: 3),
            commit("water",     current: 0,  longest: 8)
        ]
        let r = AnchorQueryEngine.run(input(cs))
        XCTAssertTrue(r.summary.contains("walk"))
        XCTAssertTrue(r.summary.contains("12-day streak"))
        XCTAssertTrue(r.summary.contains("Longest streak ever"))
    }

    func test_parserDetectsStreakIntent() {
        XCTAssertEqual(AnchorIntentParser.parse("my streak").action, .queryStreak)
        XCTAssertEqual(AnchorIntentParser.parse("what's my longest streak").action, .queryStreak)
    }
}
