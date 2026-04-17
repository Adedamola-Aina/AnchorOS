import SwiftUI
import Charts

// MARK: - CashFlowChart
// iOS parity with src/features/dashboard/components/CashFlowChart.tsx.
// Income vs expense bars over the last 7 days, plus momentum footer.
// Transfers (type=="transfer" OR category=="transfer") excluded per BUG-037.

struct CashFlowChart: View {
    struct DailyPoint: Identifiable {
        let id = UUID()
        let label: String   // day short (e.g. "Mon")
        let income: Double
        let expense: Double
    }

    let transactions: [AnchorTransaction]
    let currency: String

    private static let calendar: Calendar = {
        var c = Calendar(identifier: .gregorian)
        c.timeZone = .current
        return c
    }()

    private var points: [DailyPoint] {
        let now = Date()
        let fmt = DateFormatter()
        fmt.dateFormat = "EEE"
        var out: [DailyPoint] = []
        for offset in (0..<7).reversed() {
            guard let day = Self.calendar.date(byAdding: .day, value: -offset, to: now) else { continue }
            var income: Double = 0
            var expense: Double = 0
            for tx in transactions {
                guard !isTransfer(tx), let d = parseDate(tx.date) else { continue }
                if Self.calendar.isDate(d, inSameDayAs: day) {
                    let amt = Double(tx.amountCents) / 100.0
                    if tx.type == "income" { income += amt }
                    else if tx.type == "expense" { expense += amt }
                }
            }
            out.append(DailyPoint(label: fmt.string(from: day), income: income, expense: expense))
        }
        return out
    }

    private var totals: (income: Double, expense: Double) {
        points.reduce((0, 0)) { ($0.0 + $1.income, $0.1 + $1.expense) }
    }

    private var net: Double { totals.income - totals.expense }

    var body: some View {
        AnchorCard(title: "Cash Flow (7 days)", icon: "chart.bar.fill") {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 16) {
                    statBlock(label: "In", value: totals.income, color: AnchorPalette.success)
                    statBlock(label: "Out", value: totals.expense, color: AnchorPalette.danger)
                    Spacer()
                }
                Chart {
                    ForEach(points) { p in
                        BarMark(
                            x: .value("Day", p.label),
                            y: .value("Income", p.income),
                            width: .ratio(0.35)
                        )
                        .foregroundStyle(AnchorPalette.success.opacity(0.85))
                        .position(by: .value("Type", "Income"))

                        BarMark(
                            x: .value("Day", p.label),
                            y: .value("Spend", p.expense),
                            width: .ratio(0.35)
                        )
                        .foregroundStyle(AnchorPalette.danger.opacity(0.85))
                        .position(by: .value("Type", "Spend"))
                    }
                }
                .frame(height: 160)
                .accessibilityLabel("Cash flow bar chart, last 7 days")

                HStack(spacing: 6) {
                    Image(systemName: net >= 0 ? "arrow.up.right" : "arrow.down.right")
                        .font(.caption2).fontWeight(.bold)
                    Text("Net: \(formatCents(Int(net * 100), currency))")
                        .font(.caption).fontWeight(.semibold)
                }
                .foregroundStyle(net >= 0 ? AnchorPalette.success : AnchorPalette.danger)
                .padding(.horizontal, 8).padding(.vertical, 4)
                .background((net >= 0 ? AnchorPalette.success : AnchorPalette.danger).opacity(0.12))
                .clipShape(Capsule())
            }
        }
    }

    private func statBlock(label: String, value: Double, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label.uppercased())
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            Text(formatCents(Int(value * 100), currency))
                .font(.subheadline).fontWeight(.bold).monospacedDigit()
                .foregroundStyle(color)
        }
    }

    private func isTransfer(_ tx: AnchorTransaction) -> Bool {
        if tx.type == "transfer" { return true }
        return tx.category?.lowercased() == "transfer"
    }

    private func parseDate(_ s: String) -> Date? {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let d = iso.date(from: s) { return d }
        return ISO8601DateFormatter().date(from: s)
    }

    private func formatCents(_ cents: Int, _ currency: String) -> String {
        let amt = Double(cents) / 100.0
        let symbol: String
        switch currency {
        case "USD": symbol = "$"
        case "GBP": symbol = "£"
        case "EUR": symbol = "€"
        default:    symbol = "₦"
        }
        return "\(symbol)\(Int(amt).formatted(.number))"
    }
}
