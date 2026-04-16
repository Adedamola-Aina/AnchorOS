import SwiftUI

/// Extracted from DashboardView to keep it under ARCH-001's 200-line limit.
/// Renders the "Today's Commitments" progress card plus "Today's Focus"
/// (top 3 incomplete daily commitments), matching PWA
/// ProductivityWidget + TodaysFocusWidget.
struct DashboardFocusSection: View {
    let metrics: ProductivityCalculator.Metrics
    let todaysPriorities: [AnchorCommitment]

    var body: some View {
        VStack(spacing: 16) {
            progressCard
            if !todaysPriorities.isEmpty {
                focusCard
            }
        }
    }

    // MARK: — Productivity progress + insight

    private var progressCard: some View {
        AnchorCard(title: "Today's Commitments", icon: "checkmark.circle") {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 16) {
                    ZStack {
                        Circle().stroke(AnchorPalette.chip, lineWidth: 5)
                        Circle()
                            .trim(from: 0, to: Double(metrics.score) / 100.0)
                            .stroke(AnchorPalette.chipActive, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                            .rotationEffect(.degrees(-90))
                            .animation(.easeInOut, value: metrics.score)
                        Text("\(metrics.score)%")
                            .font(.caption2).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                    }
                    .frame(width: 52, height: 52)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(metrics.completedCount) done · \(metrics.totalCount - metrics.completedCount) remaining")
                            .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
                        Text(metrics.totalCount == 0
                             ? "Add your first commitment."
                             : "Keep going — you're making progress.")
                            .foregroundStyle(AnchorPalette.textSecondary).font(.caption)
                    }
                    Spacer()
                }

                if let insight = metrics.insight {
                    HStack(spacing: 8) {
                        Image(systemName: "sparkles")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.chipActive)
                        Text(insight)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    .padding(.top, 4)
                }
            }
        }
    }

    // MARK: — Today's Focus (top 3 incomplete daily)

    private var focusCard: some View {
        AnchorCard(title: "Today's Focus", icon: "target") {
            VStack(spacing: 8) {
                ForEach(todaysPriorities.prefix(3)) { c in
                    HStack(spacing: 10) {
                        Image(systemName: "circle")
                            .foregroundStyle(c.priorityColor)
                        Text(c.title)
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .fontWeight(.medium)
                        Spacer()
                        if let t = c.timeOfDay, !t.isEmpty {
                            Text(t.capitalized)
                                .font(.caption2)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                    .font(.subheadline)
                }
            }
        }
    }
}
