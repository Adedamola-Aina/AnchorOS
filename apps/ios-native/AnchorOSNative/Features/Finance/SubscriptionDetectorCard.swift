import SwiftUI

/// Parity with src/features/finance/components/SubscriptionDetectorCard.tsx.
///
/// iOS surfaces "subscriptions" as the active recurring-transaction entries
/// with frequency == "monthly" | "quarterly" | "annual". The PWA runs a
/// full detection ML over free-form transactions; on native we rely on the
/// already-structured `recurring` collection as the source of truth for now.
struct SubscriptionDetectorCard: View {
    let recurring: [AnchorRecurringTransaction]

    private var subscriptions: [AnchorRecurringTransaction] {
        recurring.filter { $0.isActive && Self.subscriptionFrequency($0.frequency) != nil }
    }

    private static func subscriptionFrequency(_ raw: String) -> String? {
        switch raw {
        case "monthly":   return "Monthly"
        case "quarterly": return "Every 3 months"
        case "yearly":    return "Annual"
        default:          return nil
        }
    }

    var body: some View {
        if subscriptions.isEmpty {
            EmptyView()
        } else {
            AnchorCard(title: "Detected Subscriptions", icon: "repeat") {
                VStack(spacing: 0) {
                    HStack {
                        Spacer()
                        Text("\(subscriptions.count)")
                            .font(.caption).fontWeight(.bold)
                            .foregroundStyle(Color.purple)
                            .padding(.horizontal, 8).padding(.vertical, 2)
                            .background(Color.purple.opacity(0.15))
                            .clipShape(Capsule())
                    }
                    .padding(.bottom, 8)

                    ForEach(Array(subscriptions.enumerated()), id: \.element.id) { (idx, sub) in
                        if idx > 0 {
                            Divider().background(AnchorPalette.cardBorder)
                        }
                        row(for: sub)
                    }
                }
            }
        }
    }

    private func row(for sub: AnchorRecurringTransaction) -> some View {
        HStack(spacing: 12) {
            ZStack {
                Circle().fill(Color.purple.opacity(0.15)).frame(width: 36, height: 36)
                Image(systemName: "arrow.triangle.2.circlepath")
                    .font(.subheadline)
                    .foregroundStyle(Color.purple)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(sub.title)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .lineLimit(1)
                HStack(spacing: 6) {
                    Text(Self.subscriptionFrequency(sub.frequency) ?? "—")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                    if let category = sub.category, !category.isEmpty {
                        Text("•").font(.caption).foregroundStyle(AnchorPalette.textSecondary)
                        Text(category.capitalized)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 2) {
                Text(formatCents(sub.amountCents, currency: sub.currency ?? "NGN"))
                    .font(.subheadline.monospacedDigit()).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
        }
        .padding(.vertical, 8)
    }

    private func formatCents(_ cents: Int, currency: String) -> String {
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
