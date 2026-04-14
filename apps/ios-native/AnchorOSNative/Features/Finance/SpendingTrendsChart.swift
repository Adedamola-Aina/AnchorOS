import SwiftUI
import Charts

/// 4-week income vs expense bar chart — mirrors PWA SpendingTrendsChart.
/// Data computed by AnchorFabricEngine.weeklyBuckets().
struct SpendingTrendsChart: View {
    let buckets: [AnchorFabricEngine.WeekBucket]
    let currency: String

    private var maxCents: Int {
        buckets.map { max($0.incomeCents, $0.expenseCents) }.max() ?? 1
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Legend
            HStack(spacing: 16) {
                legendDot(color: AnchorPalette.success, label: "Income")
                legendDot(color: AnchorPalette.danger, label: "Spend")
                Spacer()
            }

            if buckets.allSatisfy({ $0.incomeCents == 0 && $0.expenseCents == 0 }) {
                Text("No transactions in the last 4 weeks.")
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.vertical, 24)
            } else {
                Chart {
                    ForEach(buckets) { bucket in
                        BarMark(
                            x: .value("Week", bucket.label),
                            y: .value("Income", Double(bucket.incomeCents) / 100.0),
                            width: .ratio(0.35)
                        )
                        .foregroundStyle(AnchorPalette.success.opacity(0.85))
                        .position(by: .value("Type", "Income"))

                        BarMark(
                            x: .value("Week", bucket.label),
                            y: .value("Spend", Double(bucket.expenseCents) / 100.0),
                            width: .ratio(0.35)
                        )
                        .foregroundStyle(AnchorPalette.danger.opacity(0.85))
                        .position(by: .value("Type", "Spend"))
                    }
                }
                .chartYAxis {
                    AxisMarks(position: .leading) { val in
                        AxisValueLabel {
                            if let d = val.as(Double.self) {
                                Text(AnchorFabricEngine.formatCents(Int(d * 100), currency))
                                    .font(.caption2)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }
                        }
                        AxisGridLine().foregroundStyle(AnchorPalette.chip.opacity(0.4))
                    }
                }
                .chartXAxis {
                    AxisMarks { val in
                        AxisValueLabel {
                            if let s = val.as(String.self) {
                                Text(s).font(.caption2).foregroundStyle(AnchorPalette.textSecondary)
                            }
                        }
                    }
                }
                .frame(height: 160)
                .chartPlotStyle { plot in
                    plot.background(Color.clear)
                }
            }
        }
    }

    private func legendDot(color: Color, label: String) -> some View {
        HStack(spacing: 4) {
            Circle().fill(color).frame(width: 8, height: 8)
            Text(label).font(.caption2).foregroundStyle(AnchorPalette.textSecondary)
        }
    }
}
