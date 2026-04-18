import SwiftUI

struct FinanceNetWorthCard: View {
    let rows: [(currency: String, symbol: String, formatted: String)]

    var body: some View {
        if rows.isEmpty {
            EmptyView()
        } else {
            AnchorCard(title: "Net Worth", icon: "chart.line.uptrend.xyaxis") {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                        HStack {
                            Text(row.currency)
                                .font(.caption.weight(.bold))
                                .foregroundStyle(AnchorPalette.textSecondary)
                            Spacer()
                            Text(row.formatted)
                                .font(.headline.weight(.bold))
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                    }
                }
                .tidePulse()
            }
        }
    }
}
