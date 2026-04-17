import SwiftUI

/// Parity with src/features/finance/components/InsightCards.tsx — a single
/// monthly-summary insight card. Pulls precomputed totals from the Fabric
/// engine's monthly snapshot so we do not duplicate aggregation logic.
struct InsightCards: View {
    struct Insight {
        let title: String
        let message: String
        let tint: Color
        let icon: String
    }

    let transactions: [AnchorTransaction]
    let currency: String

    private var insight: Insight? {
        let now = Date()
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = .current
        let comps = cal.dateComponents([.year, .month], from: now)
        guard let monthStart = cal.date(from: comps) else { return nil }

        var income: Int = 0
        var expense: Int = 0
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        for tx in transactions {
            guard let d = iso.date(from: tx.date) ?? ISO8601DateFormatter().date(from: tx.date),
                  d >= monthStart else { continue }
            if tx.type == "income" { income += tx.amountCents }
            else if tx.type == "expense" { expense += tx.amountCents }
        }

        if income == 0 && expense == 0 { return nil }
        let net = income - expense
        let df = DateFormatter()
        df.dateFormat = "MMMM"
        let monthName = df.string(from: now)

        if net >= 0 {
            return Insight(
                title: "\(monthName) is in the green",
                message: "You've saved \(format(net)) so far — \(format(income)) in, \(format(expense)) out.",
                tint: AnchorPalette.success,
                icon: "arrow.up.forward.circle.fill"
            )
        } else {
            return Insight(
                title: "\(monthName) is running tight",
                message: "You're \(format(-net)) over — \(format(expense)) out vs \(format(income)) in.",
                tint: AnchorPalette.warning,
                icon: "exclamationmark.triangle.fill"
            )
        }
    }

    var body: some View {
        if let insight {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: insight.icon)
                    .font(.title3)
                    .foregroundStyle(insight.tint)
                    .padding(10)
                    .background(insight.tint.opacity(0.15))
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(insight.title)
                        .font(.subheadline).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(insight.message)
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                Spacer()
            }
            .padding(14)
            .background(AnchorPalette.chip.opacity(0.5))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(insight.tint.opacity(0.3), lineWidth: 1)
            )
            .accessibilityElement(children: .combine)
        } else {
            EmptyView()
        }
    }

    private func format(_ cents: Int) -> String {
        let amt = Double(cents) / 100.0
        let sym: String
        switch currency {
        case "USD": sym = "$"
        case "GBP": sym = "£"
        case "EUR": sym = "€"
        default:    sym = "₦"
        }
        return "\(sym)\(Int(amt).formatted(.number))"
    }
}
