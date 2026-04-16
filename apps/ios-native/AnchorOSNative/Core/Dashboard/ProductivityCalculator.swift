import Foundation

/// Pure productivity metrics calculator.
/// Mirrors src/utils/taskInsights.ts → getProductivityMetrics.
///
/// Parity contract:
///   • score is rounded percentage of completed commitments (0-100)
///   • trend: 'improving' when score > 50, otherwise 'stable'
///     (PWA uses the same "simplistic placeholder" rule; TODO: promote once
///      TaskCompletions history lands server-side)
///   • insight strings are verbatim copies of PWA strings — do not edit one
///     side without the other
///   • domain breakdown uses `category` field ("personal" | "family")
enum ProductivityCalculator {

    enum Trend: String, Equatable { case improving, declining, stable }

    struct DomainBreakdown: Equatable {
        let personal: Int  // percent
        let family: Int
    }

    struct Metrics: Equatable {
        let score: Int
        let trend: Trend
        let completedCount: Int
        let totalCount: Int
        let domainBreakdown: DomainBreakdown
        let insight: String?
    }

    static func calculate(commitments: [AnchorCommitment]) -> Metrics {
        guard !commitments.isEmpty else {
            return Metrics(
                score: 0, trend: .stable,
                completedCount: 0, totalCount: 0,
                domainBreakdown: DomainBreakdown(personal: 0, family: 0),
                insight: nil
            )
        }

        let total = commitments.count
        let completed = commitments.filter(\.completed).count
        let score = Int((Double(completed) / Double(total) * 100).rounded())

        let personalAll = commitments.filter { $0.category == "personal" }
        let familyAll = commitments.filter { $0.category == "family" }

        let personalScore = personalAll.isEmpty ? 0 :
            Int((Double(personalAll.filter(\.completed).count) / Double(personalAll.count) * 100).rounded())
        let familyScore = familyAll.isEmpty ? 0 :
            Int((Double(familyAll.filter(\.completed).count) / Double(familyAll.count) * 100).rounded())

        // Insights — same order & copy as PWA so a string grep matches both codebases.
        var insight: String? = nil
        if score > 80 {
            insight = "Your consistency is outstanding this week!"
        } else if score > 50 {
            insight = "You're on track, keep pushing!"
        } else if score > 0 {
            insight = "Focus on one small win today."
        }
        if personalScore > familyScore + 20 {
            insight = "Personal tasks are strong; don't forget family commitments."
        }
        if familyScore > personalScore + 20 {
            insight = "Great family focus! Take time for yourself too."
        }

        return Metrics(
            score: score,
            trend: score > 50 ? .improving : .stable,
            completedCount: completed,
            totalCount: total,
            domainBreakdown: DomainBreakdown(personal: personalScore, family: familyScore),
            insight: insight
        )
    }
}
