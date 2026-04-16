import Foundation

/// Ports src/services/fabric/predictionAnomalySignals.ts.
/// Surfaces up to 3 anomaly-based predictions sorted by amount descending.
/// Severity flips to `.critical` when the anomalous transaction is
/// \>= 5× the category average (CRITICAL_MULTIPLIER).
enum AnchorAnomalySignals {

    static let maxPredictions: Int = 3
    static let criticalMultiplier: Double = 5.0

    static func build(
        transactions: [AnchorTransaction],
        now: Date = Date()
    ) -> [AnchorPrediction] {
        let anomalies = AnchorAnomalyDetector.detect(transactions: transactions)
        guard !anomalies.isEmpty else { return [] }

        let currency = transactions.first?.currency ?? "NGN"
        return anomalies.prefix(maxPredictions).map { anomaly in
            let ratio = Double(anomaly.amountCents) / max(Double(anomaly.averageCents), 1)
            let confidence = min(0.5 + (ratio - 2.0) * 0.1, 1.0)
            let severity: AnchorPrediction.Severity = ratio >= criticalMultiplier ? .critical : .warning
            let ratioStr = String(format: "%.1f", ratio)

            return AnchorPrediction(
                id: "pred-anomaly-\(anomaly.id)",
                kind: .unusualSpending,
                message: "Unusual \(anomaly.category) spending: "
                    + AnchorFabricEngine.formatCents(anomaly.amountCents, currency)
                    + " (avg " + AnchorFabricEngine.formatCents(anomaly.averageCents, currency) + ").",
                detail: "\"\(anomaly.title)\" was \(ratioStr)× your typical \(anomaly.category) transaction.",
                severity: severity,
                confidence: confidence,
                actionable: true,
                action: .init(label: "Review spending", navigateTo: "/finance"),
                expiresAt: Calendar.current.date(byAdding: .day, value: 7, to: now) ?? now,
                createdAt: now
            )
        }
    }
}
