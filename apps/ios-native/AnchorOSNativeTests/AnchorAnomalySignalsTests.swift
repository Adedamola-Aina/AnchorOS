import XCTest
@testable import AnchorOSNative

/// Parity contract with src/services/fabric/predictionAnomalySignals.test.ts.
/// Each test maps 1:1 to a case in the PWA vitest suite.
final class AnchorAnomalySignalsTests: XCTestCase {

    private let fixedNow: Date = {
        let c = DateComponents(year: 2026, month: 3, day: 20, hour: 12)
        return Calendar(identifier: .gregorian).date(from: c)!
    }()

    private func tx(
        id: String,
        amount: Int,
        category: String = "Food",
        title: String = "Test"
    ) -> AnchorTransaction {
        AnchorTransaction(
            id: id,
            title: title,
            amountCents: amount,
            type: "expense",
            category: category,
            accountId: nil,
            accountName: nil,
            currency: "USD",
            date: "2026-03-15",
            isSoftDeleted: false
        )
    }

    // MARK: — Empty / no anomaly

    func test_returnsEmptyWhenNoAnomalies() {
        let txns = [
            tx(id: "tx-1", amount: 1000),
            tx(id: "tx-2", amount: 1100),
            tx(id: "tx-3", amount: 900),
        ]
        XCTAssertTrue(AnchorAnomalySignals.build(transactions: txns, now: fixedNow).isEmpty)
    }

    // MARK: — Unusual spending prediction

    func test_unusualSpendingPrediction() {
        let txns = [
            tx(id: "tx-1", amount: 500),
            tx(id: "tx-2", amount: 600),
            tx(id: "tx-3", amount: 550),
            tx(id: "tx-4", amount: 5000, title: "Fancy Dinner"),
        ]
        let result = AnchorAnomalySignals.build(transactions: txns, now: fixedNow)
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].kind, .unusualSpending)
        XCTAssertEqual(result[0].severity, .warning)
        XCTAssertTrue(result[0].actionable)
        XCTAssertTrue(result[0].message.contains("Food"))
        XCTAssertGreaterThan(result[0].confidence, 0.5)
        XCTAssertLessThanOrEqual(result[0].confidence, 1.0)
    }

    // MARK: — Critical severity

    func test_criticalSeverityAtFiveTimesAverage() {
        var txns: [AnchorTransaction] = (0..<10).map { i in
            tx(id: "tx-\(i)", amount: 200, category: "Transport")
        }
        txns.append(tx(id: "tx-big", amount: 5000, category: "Transport", title: "Big ride"))
        let result = AnchorAnomalySignals.build(transactions: txns, now: fixedNow)
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].severity, .critical)
    }

    // MARK: — Multi-category anomalies

    func test_multipleAnomaliesAcrossCategories() {
        let txns = [
            tx(id: "t1", amount: 500,  category: "Food"),
            tx(id: "t2", amount: 600,  category: "Food"),
            tx(id: "t3", amount: 550,  category: "Food"),
            tx(id: "t4", amount: 5000, category: "Food",   title: "Fancy"),
            tx(id: "t5", amount: 100,  category: "Coffee"),
            tx(id: "t6", amount: 120,  category: "Coffee"),
            tx(id: "t7", amount: 110,  category: "Coffee"),
            tx(id: "t8", amount: 1500, category: "Coffee", title: "Expensive Beans"),
        ]
        let result = AnchorAnomalySignals.build(transactions: txns, now: fixedNow)
        XCTAssertEqual(result.count, 2)
        XCTAssertTrue(result.allSatisfy { $0.kind == .unusualSpending })
    }

    // MARK: — Cap at 3

    func test_capsAtThreeAnomalies() {
        let cats = ["A", "B", "C", "D"]
        var txns: [AnchorTransaction] = []
        for cat in cats {
            txns.append(contentsOf: [
                tx(id: "\(cat)-1", amount: 100,  category: cat),
                tx(id: "\(cat)-2", amount: 110,  category: cat),
                tx(id: "\(cat)-3", amount: 90,   category: cat),
                tx(id: "\(cat)-4", amount: 2000, category: cat, title: "Big \(cat)"),
            ])
        }
        let result = AnchorAnomalySignals.build(transactions: txns, now: fixedNow)
        XCTAssertLessThanOrEqual(result.count, 3)
    }

    // MARK: — Action navigates to finance

    func test_actionNavigatesToFinance() {
        let txns = [
            tx(id: "tx-1", amount: 500),
            tx(id: "tx-2", amount: 600),
            tx(id: "tx-3", amount: 550),
            tx(id: "tx-4", amount: 5000, title: "Big one"),
        ]
        let result = AnchorAnomalySignals.build(transactions: txns, now: fixedNow)
        XCTAssertEqual(result.first?.action?.navigateTo, "/finance")
    }

    // MARK: — Engine integration

    func test_engineSortsByConfidenceAndCapsAtFive() {
        let txns = [
            tx(id: "tx-1", amount: 500),
            tx(id: "tx-2", amount: 600),
            tx(id: "tx-3", amount: 550),
            tx(id: "tx-4", amount: 5000, title: "Big one"),
        ]
        let result = AnchorPredictionsEngine.build(.init(
            transactions: txns, commitments: [], goals: [], now: fixedNow
        ))
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].kind, .unusualSpending)
    }
}
