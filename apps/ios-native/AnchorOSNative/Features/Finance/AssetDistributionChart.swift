import SwiftUI
import Charts

// MARK: - AssetDistributionChart
// iOS parity with src/features/dashboard/components/AssetDistributionChart.tsx.
// Donut chart of positive account balances (negatives surfaced as footer note).

struct AssetDistributionChart: View {
    struct Slice: Identifiable {
        let id = UUID()
        let name: String
        let value: Double
        let color: Color
        let currency: String
    }

    let accounts: [AnchorAccount]

    private var slices: [Slice] {
        let palette: [Color] = [
            AnchorPalette.chipActive,
            AnchorPalette.success,
            AnchorPalette.warning,
            AnchorPalette.danger,
            .purple, .teal, .orange, .pink
        ]
        return accounts
            .filter { ($0.isArchived != true) && $0.balanceCents > 0 }
            .enumerated()
            .map { (idx, acc) in
                Slice(
                    name: acc.name,
                    value: Double(acc.balanceCents) / 100.0,
                    color: palette[idx % palette.count],
                    currency: acc.currency
                )
            }
    }

    private var total: Double { slices.reduce(0) { $0 + $1.value } }
    private var hasNegative: Bool { accounts.contains { ($0.isArchived != true) && $0.balanceCents < 0 } }

    var body: some View {
        AnchorCard(title: "Asset Distribution", icon: "chart.pie.fill") {
            if slices.isEmpty {
                Text("No positive balances to chart.")
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.vertical, 24)
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    if hasNegative {
                        Text("Negative balances excluded.")
                            .font(.caption2)
                            .foregroundStyle(AnchorPalette.warning)
                    }
                    Chart(slices) { slice in
                        SectorMark(
                            angle: .value("Balance", slice.value),
                            innerRadius: .ratio(0.62),
                            angularInset: 2
                        )
                        .foregroundStyle(slice.color)
                        .cornerRadius(4)
                    }
                    .frame(height: 180)
                    .accessibilityLabel("Asset distribution donut chart")

                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(slices) { slice in
                            HStack(spacing: 10) {
                                Circle().fill(slice.color).frame(width: 10, height: 10)
                                Text(slice.name)
                                    .font(.subheadline)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                    .lineLimit(1)
                                Spacer()
                                Text(percentLabel(for: slice.value))
                                    .font(.caption).monospacedDigit()
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }
                        }
                    }
                }
            }
        }
    }

    private func percentLabel(for value: Double) -> String {
        guard total > 0 else { return "0%" }
        return "\(Int(round((value / total) * 100)))%"
    }
}
