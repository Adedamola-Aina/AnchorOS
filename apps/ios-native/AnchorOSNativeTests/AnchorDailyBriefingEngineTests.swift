import XCTest
@testable import AnchorOSNative

/// Parity tests for AnchorDailyBriefingEngine.upcoming vs
/// src/services/fabric/DailyBriefingEngine.ts `getUpcomingItems`.
final class AnchorDailyBriefingEngineTests: XCTestCase {

    // Sun 2026-04-12 09:00 UTC
    private let now: Date = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]
        return f.date(from: "2026-04-12T09:00:00Z")!
    }()

    private func rec(_ id: String,
                     nextRunAt: String,
                     status: String = "active",
                     amount: Int = 10_00) -> AnchorRecurringTransaction {
        AnchorRecurringTransaction(
            id: id, title: id, amountCents: amount, currency: "USD",
            category: "bills", type: "expense", frequency: "monthly",
            nextRunAt: nextRunAt, status: status
        )
    }

    func test_emptyReturnsEmpty() {
        XCTAssertTrue(AnchorDailyBriefingEngine.upcoming(recurring: [], now: now).isEmpty)
    }

    func test_dueTodayFlagged() {
        let r = AnchorDailyBriefingEngine.upcoming(
            recurring: [rec("a", nextRunAt: "2026-04-12T14:00:00Z")],
            now: now
        )
        XCTAssertEqual(r.count, 1)
        XCTAssertTrue(r[0].isToday)
        XCTAssertEqual(r[0].daysUntil, 0)
    }

    func test_dueTomorrowFlagged() {
        let r = AnchorDailyBriefingEngine.upcoming(
            recurring: [rec("a", nextRunAt: "2026-04-13T14:00:00Z")],
            now: now
        )
        XCTAssertTrue(r[0].isTomorrow)
        XCTAssertEqual(r[0].daysUntil, 1)
        XCTAssertFalse(r[0].isToday)
    }

    func test_pastDueExcluded() {
        let r = AnchorDailyBriefingEngine.upcoming(
            recurring: [rec("a", nextRunAt: "2026-04-10T14:00:00Z")],
            now: now
        )
        XCTAssertTrue(r.isEmpty)
    }

    func test_beyondWindowExcluded() {
        // 8 days out > default windowDays=7
        let r = AnchorDailyBriefingEngine.upcoming(
            recurring: [rec("a", nextRunAt: "2026-04-21T14:00:00Z")],
            now: now
        )
        XCTAssertTrue(r.isEmpty)
    }

    func test_pausedStatusExcluded() {
        let r = AnchorDailyBriefingEngine.upcoming(
            recurring: [rec("a", nextRunAt: "2026-04-13T14:00:00Z", status: "paused")],
            now: now
        )
        XCTAssertTrue(r.isEmpty)
    }

    func test_sortedByDaysUntilAscending() {
        let r = AnchorDailyBriefingEngine.upcoming(
            recurring: [
                rec("c", nextRunAt: "2026-04-15T14:00:00Z"),   // +3
                rec("a", nextRunAt: "2026-04-12T14:00:00Z"),   // 0
                rec("b", nextRunAt: "2026-04-14T14:00:00Z"),   // +2
            ],
            now: now
        )
        XCTAssertEqual(r.map(\.id), ["a", "b", "c"])
    }
}
