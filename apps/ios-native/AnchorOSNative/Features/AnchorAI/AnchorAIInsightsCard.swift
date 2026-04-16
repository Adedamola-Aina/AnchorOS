import SwiftUI

/// AnchorAI Insights card — extracted from AnchorAIView to satisfy ARCH-001.
/// Pure view over the pre-computed insights from AnchorFabricEngine.
/// Mirrors PWA FabricInsightCard (src/features/fabric/FabricInsightCard.tsx).
struct AnchorAIInsightsCard: View {
    let insights: [AnchorInsight]

    var body: some View {
        AnchorCard(title: "Insights", icon: "sparkles") {
            VStack(alignment: .leading, spacing: 14) {
                ForEach(insights) { insight in
                    row(insight)
                    if insight.id != insights.last?.id {
                        Divider().background(AnchorPalette.chip)
                    }
                }
            }
        }
    }

    private func row(_ insight: AnchorInsight) -> some View {
        HStack(alignment: .top, spacing: 12) {
            ZStack {
                Circle()
                    .fill(severityColor(insight.severity).opacity(0.15))
                    .frame(width: 36, height: 36)
                Image(systemName: insight.icon)
                    .font(.caption)
                    .foregroundStyle(severityColor(insight.severity))
            }
            VStack(alignment: .leading, spacing: 3) {
                HStack(spacing: 4) {
                    Text(insight.headline)
                        .font(.subheadline).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(insight.trendArrow)
                        .font(.caption).fontWeight(.bold)
                        .foregroundStyle(trendColor(insight.trend))
                }
                Text(insight.detail)
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private func severityColor(_ severity: AnchorInsight.Severity) -> Color {
        switch severity {
        case .positive:  return AnchorPalette.success
        case .attention: return AnchorPalette.warning
        case .neutral:   return AnchorPalette.chipActive
        }
    }

    private func trendColor(_ trend: AnchorInsight.Trend) -> Color {
        switch trend {
        case .up:     return AnchorPalette.success
        case .down:   return AnchorPalette.danger
        case .stable: return AnchorPalette.textSecondary
        }
    }
}
