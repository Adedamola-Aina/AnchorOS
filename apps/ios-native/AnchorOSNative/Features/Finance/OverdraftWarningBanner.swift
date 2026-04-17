import SwiftUI

// MARK: - OverdraftWarningBanner
// SwiftUI port of src/features/finance/components/OverdraftWarning.tsx.
// Shown inside AddTransactionSheet when an expense would push the
// selected account's projected balance below zero.
//
// Parity notes:
//   • rose-50/900 bg             → AnchorPalette.danger.opacity(0.12)
//   • rose-100/900 border        → AnchorPalette.danger.opacity(0.28)
//   • ArrowRightLeft icon        → SF Symbol "arrow.left.arrow.right"
//   • animate-in slide-in-top-2  → .slideFadeFromTop() from AnchorPressStyles
//   • uppercase bold label       → .textCase(.uppercase) + .bold
struct OverdraftWarningBanner: View {
    /// Projected balance in cents (already subtracted). Negative = overdraft.
    let projectedBalanceCents: Int
    let currency: String

    private var formattedAmount: String {
        let units = Double(abs(projectedBalanceCents)) / 100.0
        let fmt = NumberFormatter()
        fmt.numberStyle = .decimal
        fmt.minimumFractionDigits = 2
        fmt.maximumFractionDigits = 2
        let s = fmt.string(from: NSNumber(value: units)) ?? String(format: "%.2f", units)
        return "-\(s) \(currency)"
    }

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            ZStack {
                Circle()
                    .fill(AnchorPalette.danger.opacity(0.25))
                    .frame(width: 22, height: 22)
                Image(systemName: "arrow.left.arrow.right")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(AnchorPalette.danger)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text("WARNING: OVERDRAFT RISK")
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(AnchorPalette.danger)
                Text("This transaction will take your account balance to ")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.danger.opacity(0.85))
                + Text(formattedAmount)
                    .font(.caption.monospaced().weight(.bold))
                    .foregroundStyle(AnchorPalette.danger)
                + Text(".")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.danger.opacity(0.85))
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .background(AnchorPalette.danger.opacity(0.12))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(AnchorPalette.danger.opacity(0.28), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .transition(.move(edge: .top).combined(with: .opacity))
    }
}
