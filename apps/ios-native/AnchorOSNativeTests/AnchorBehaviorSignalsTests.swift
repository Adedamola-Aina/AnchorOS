import XCTest
@testable import AnchorOSNative

/// Parity contract with src/services/fabric/predictionBehaviorSignals.ts.
/// No dedicated PWA test file exists — these assertions encode the
/// behavioral contract from the TypeScript source directly.
final class AnchorBehaviorSignalsTests: XCTestCase {

    // Mid-month so day >= 15 for surplus signal.
    private let midMonth: Date = {
        let c = DateComponents(year: 2026, month: 3, day: 20, hour: 12)
        return Calendar(identifier: .gregorian).date(from: c)!
    }()

    // Early-month date so surplus gate fails.
    private let earlyMonth: Date = {
        let c = DateComponents(year: 2026, month: 3, day: 3, hour: 12)
        return Calendar(identifier: .gregorian).date(from: c)!
    }()

    private func tx(
        _ amount: Int,
        _ type: String = "expense",
        _ category: String = "Food",
        date: String
    ) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount,
            type: type, category: category, accountId: nil,
            accountName: nil, currency: "USD", date: date, isSoftDeleted: false
        )
    }

    private func daily(_ title: String, completed: Bool, streak: Int?) -> AnchorCommitment {
        AnchorCommitment(
            id: UUID().uuidString, title: title, type: "daily", completed: completed,
            category: nil, domain: nil, timeOfDay: nil, notes: nil,
            currentStreak: streak, longestStreak: streak, lastCompletedAt: nil, priority: nil
        )
    }

    // MARK: — Empty

    func test_emptyWhenNoInputs() {
        let r = AnchorBehaviorSignals.build(transactions: [], commitments: [], now: midMonth)
        XCTAssertEqual(r, [])
    }

    // MARK: — Streak at risk

    func test_streakRiskSingularWhenOnePending() {
        let r = AnchorBehaviorSignals.build(
            transactions: [],
            commitments: [daily("Read", completed: false, streak: 5)],
            now: midMonth
        )
        let s = r.first { $0.kind == .streakAtRisk }
        XCTAssertNotNil(s)
        XCTAssertTrue(s?.message.contains("\"Read\" is still incomplete") == true)
        XCTAssertTrue(s?.detail.contains("streak is at 5 days") == true)
        XCTAssertEqual(s?.action?.navigateTo, "/commitments")
    }

    func test_streakRiskPluralWhenMultiplePending() {
        let r = AnchorBehaviorSignals.build(
            transactions: [],
            commitments: [
                daily("Read", completed: false, streak: 2),
                daily("Walk", completed: false, streak: 9),
            ],
            now: midMonth
        )
        let s = r.first { $0.kind == .streakAtRisk }
        // Riskiest = highest streak = Walk (9).
        XCTAssertTrue(s?.message.contains("2 daily commitments") == true)
        XCTAssertTrue(s?.detail.contains("\"Walk\"") == true)
        XCTAssertTrue(s?.detail.contains("9 days") == true)
    }

    func test_streakRiskSingularDayWording() {
        let r = AnchorBehaviorSignals.build(
            transactions: [],
            commitments: [daily("Read", completed: false, streak: 1)],
            now: midMonth
        )
        let s = r.first { $0.kind == .streakAtRisk }
        XCTAssertTrue(s?.detail.contains("1 day.") == true)
    }

    func test_streakRiskSuppressedWhenAllCompleted() {
        let r = AnchorBehaviorSignals.build(
            transactions: [],
            commitments: [daily("Read", completed: true, streak: 5)],
            now: midMonth
        )
        XCTAssertNil(r.first { $0.kind == .streakAtRisk })
    }

    func test_streakRiskIgnoresNonDaily() {
        let weekly = AnchorCommitment(
            id: "a", title: "Review", type: "weekly", completed: false,
            category: nil, domain: nil, timeOfDay: nil, notes: nil,
            currentStreak: 3, longestStreak: 3, lastCompletedAt: nil, priority: nil
        )
        let r = AnchorBehaviorSignals.build(
            transactions: [], commitments: [weekly], now: midMonth
        )
        XCTAssertNil(r.first { $0.kind == .streakAtRisk })
    }

    // MARK: — Surplus / cash-flow alert

    func test_surplusFiresAfterDay15() {
        let txs = [
            tx(100_000, "income",  date: "2026-03-01"),
            tx(40_000,  "expense", date: "2026-03-02"),
        ]
        let r = AnchorBehaviorSignals.build(transactions: txs, commitments: [], now: midMonth)
        let s = r.first { $0.kind == .cashFlowAlert }
        XCTAssertNotNil(s)
        XCTAssertTrue(s?.message.contains("surplus") == true)
        XCTAssertEqual(s?.id, "pred-savings-opportunity-2026-03")
    }

    func test_surplusSuppressedBeforeDay15() {
        let txs = [
            tx(100_000, "income",  date: "2026-03-01"),
            tx(40_000,  "expense", date: "2026-03-02"),
        ]
        let r = AnchorBehaviorSignals.build(transactions: txs, commitments: [], now: earlyMonth)
        XCTAssertNil(r.first { $0.kind == .cashFlowAlert })
    }

    func test_surplusSuppressedWhenDeficit() {
        let txs = [
            tx(40_000,  "income",  date: "2026-03-01"),
            tx(100_000, "expense", date: "2026-03-02"),
        ]
        let r = AnchorBehaviorSignals.build(transactions: txs, commitments: [], now: midMonth)
        XCTAssertNil(r.first { $0.kind == .cashFlowAlert })
    }

    // MARK: — 7-day spike

    func test_spikeFiresWhenBeyond150PctAndAtLeast3Txs() {
        // last month expenses total = 40,000 → typical7 = 10,000.
        // last 7 days total must exceed 15,000 AND have >=3 txs.
        let txs = [
            tx(40_000, "expense", "Food", date: "2026-02-10"),
            tx(6_000,  "expense", "Food", date: "2026-03-16"),
            tx(6_000,  "expense", "Food", date: "2026-03-17"),
            tx(6_000,  "expense", "Food", date: "2026-03-18"),
        ]
        let r = AnchorBehaviorSignals.build(transactions: txs, commitments: [], now: midMonth)
        let s = r.first { $0.id.hasPrefix("pred-unusual-spike-") }
        XCTAssertNotNil(s)
        XCTAssertEqual(s?.id, "pred-unusual-spike-2026-03-20")
        XCTAssertEqual(s?.severity, .warning)
    }

    func test_spikeSuppressedWhenFewerThan3Txs() {
        let txs = [
            tx(40_000, "expense", "Food", date: "2026-02-10"),
            tx(20_000, "expense", "Food", date: "2026-03-18"),
            tx(20_000, "expense", "Food", date: "2026-03-19"),
        ]
        let r = AnchorBehaviorSignals.build(transactions: txs, commitments: [], now: midMonth)
        XCTAssertNil(r.first { $0.kind == .unusualSpending })
    }

    func test_spikeSuppressedWhenNoPriorBaseline() {
        let txs = [
            tx(10_000, "expense", "Food", date: "2026-03-16"),
            tx(10_000, "expense", "Food", date: "2026-03-17"),
            tx(10_000, "expense", "Food", date: "2026-03-18"),
        ]
        let r = AnchorBehaviorSignals.build(transactions: txs, commitments: [], now: midMonth)
        XCTAssertNil(r.first { $0.kind == .unusualSpending })
    }

    // MARK: — Soft delete

    func test_softDeletedTxsExcluded() {
        let softInc = AnchorTransaction(
            id: "a", title: "salary", amountCents: 100_000,
            type: "income", category: nil, accountId: nil,
            accountName: nil, currency: "USD", date: "2026-03-01",
            isSoftDeleted: true
        )
        let r = AnchorBehaviorSignals.build(
            transactions: [softInc, tx(40_000, "expense", date: "2026-03-02")],
            commitments: [],
            now: midMonth
        )
        XCTAssertNil(r.first { $0.kind == .cashFlowAlert })
    }
}
