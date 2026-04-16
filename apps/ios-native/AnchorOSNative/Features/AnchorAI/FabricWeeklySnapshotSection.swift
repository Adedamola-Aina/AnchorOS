import SwiftUI

/// Mirrors src/features/fabric/FabricWeeklySnapshotSection.tsx — but expanded
/// to surface the full WeeklyReportEngine output (vs-last-week delta,
/// commitment completion %, top category, net cash flow, longest streak).
/// Hidden entirely when no report is available (first-run / no data).
struct FabricWeeklySnapshotSection: View {
    let report: AnchorWeeklyReport?

    var body: some View {
        if let r = report {
            AnchorCard(title: "Weekly Snapshot", icon: "chart.line.uptrend.xyaxis") {
                VStack(alignment: .leading, spacing: 8) {
                    row("Income",
                        AnchorFabricEngine.formatCents(r.totalIncomeCents, r.currency))
                    row("Spent",
                        AnchorFabricEngine.formatCents(r.totalSpentCents, r.currency),
                        trailing: vsBadge(r.vsLastWeekPct))
                    row("Net cash flow",
                        AnchorFabricEngine.formatCents(r.netCashFlowCents, r.currency),
                        valueColor: r.netCashFlowCents >= 0
                            ? AnchorPalette.success
                            : AnchorPalette.danger)
                    row("Top category",
                        "\(r.topCategory.name) · " +
                        AnchorFabricEngine.formatCents(r.topCategory.amountCents, r.currency))
                    row("Commitments",
                        "\(r.commitmentSummary.completed) done · \(r.commitmentSummary.completionRatePct)%")
                    if r.commitmentSummary.longestStreak.days > 0 {
                        row("Longest streak",
                            "\(r.commitmentSummary.longestStreak.name) · \(r.commitmentSummary.longestStreak.days)d")
                    }
                }
            }
        }
    }

    private func row(_ label: String,
                     _ value: String,
                     valueColor: Color = AnchorPalette.textPrimary,
                     trailing: AnyView? = nil) -> some View {
        HStack(spacing: 8) {
            Text(label).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(valueColor).fontWeight(.semibold)
            if let trailing { trailing }
        }
        .font(.subheadline)
    }

    private func vsBadge(_ pct: Double) -> AnyView? {
        guard pct != 0 else { return nil }
        let up = pct > 0
        let label = "\(up ? "↑" : "↓") \(String(format: "%.1f", abs(pct)))%"
        let color: Color = up ? AnchorPalette.warning : AnchorPalette.success
        return AnyView(
            Text(label)
                .font(.caption2)
                .fontWeight(.semibold)
                .foregroundStyle(color)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(color.opacity(0.15))
                .clipShape(Capsule())
        )
    }
}
