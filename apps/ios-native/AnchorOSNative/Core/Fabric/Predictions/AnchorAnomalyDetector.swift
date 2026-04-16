import Foundation

/// Anomaly detection mirroring src/utils/insights/transactionInsights.ts
/// `detectAnomalies`. Flags expense transactions that exceed
/// ANOMALY_THRESHOLD (2.0)× their category's per-transaction average.
/// Categories with fewer than 3 transactions are skipped.
enum AnchorAnomalyDetector {

    static let threshold: Double = 2.0
    static let minSamples: Int = 3

    struct Anomaly: Equatable {
        let id: String
        let title: String
        let category: String
        let amountCents: Int
        let averageCents: Int
    }

    static func detect(transactions: [AnchorTransaction]) -> [Anomaly] {
        let expenses = transactions.filter { $0.type == "expense" && $0.isActive }
        guard !expenses.isEmpty else { return [] }

        var groups: [String: [AnchorTransaction]] = [:]
        for tx in expenses {
            let cat = tx.category ?? "Other"
            groups[cat, default: []].append(tx)
        }

        var anomalies: [Anomaly] = []
        for (category, group) in groups {
            guard group.count >= minSamples else { continue }
            let total = group.reduce(0) { $0 + $1.amountCents }
            let avg = Double(total) / Double(group.count)
            for tx in group where Double(tx.amountCents) > avg * threshold {
                anomalies.append(Anomaly(
                    id: tx.resolvedId,
                    title: tx.title,
                    category: category,
                    amountCents: tx.amountCents,
                    averageCents: Int(avg.rounded())
                ))
            }
        }
        // PWA sorts descending by amount.
        return anomalies.sorted { $0.amountCents > $1.amountCents }
    }
}
