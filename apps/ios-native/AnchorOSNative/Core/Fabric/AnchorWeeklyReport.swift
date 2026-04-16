import Foundation

/// Weekly report struct — parity with src/types/index.ts WeeklyReport.
/// Cents (Int) on the Swift side; PWA stores major-units (Double) after
/// `fromCents`. We keep cents here and format at the view boundary.
struct AnchorWeeklyReport: Equatable {
    let weekStart: Date
    let weekEnd: Date
    let currency: String
    let totalSpentCents: Int
    let totalIncomeCents: Int
    let netCashFlowCents: Int
    let topCategory: Category
    /// Percentage vs last week. Positive = overspending. 0 when no prior-week data.
    let vsLastWeekPct: Double
    let commitmentSummary: CommitmentSummary

    struct Category: Equatable {
        let name: String
        let amountCents: Int
    }

    struct CommitmentSummary: Equatable {
        let completed: Int
        let missed: Int
        let completionRatePct: Int          // 0..100, rounded
        let bestCategory: String
        let worstCategory: String
        let longestStreak: Streak

        struct Streak: Equatable {
            let name: String
            let days: Int
        }
    }
}
