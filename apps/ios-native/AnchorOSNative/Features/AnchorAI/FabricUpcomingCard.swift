import SwiftUI

/// Mirrors src/features/fabric/FabricUpcomingCard.tsx.
///
/// "COMING UP" list of upcoming recurring bills (next 7 days).
/// Each row: icon, title (+ optional category), amount + due badge.
/// Hidden entirely when empty (parity with PWA `items.length === 0`).
/// Caps at 5 rows (parity with PWA `items.slice(0, 5)`).
struct FabricUpcomingCard: View {
    let items: [AnchorUpcomingItem]
    let currency: String

    var body: some View {
        if !items.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("COMING UP")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .kerning(1.1)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.horizontal, 4)

                VStack(spacing: 0) {
                    ForEach(Array(items.prefix(5).enumerated()), id: \.element.id) { idx, item in
                        row(for: item)
                        if idx < min(items.count, 5) - 1 {
                            Divider().foregroundStyle(AnchorPalette.cardBorder)
                        }
                    }
                }
                .background(AnchorPalette.card)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
    }

    private func row(for item: AnchorUpcomingItem) -> some View {
        HStack(spacing: 12) {
            Image(systemName: "calendar.badge.clock")
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .lineLimit(1)
                if let cat = item.category, !cat.isEmpty {
                    Text(cat)
                        .font(.caption2)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }

            Spacer(minLength: 8)

            if let cents = item.amountCents {
                Text(AnchorFabricEngine.formatCents(cents, currency))
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }

            badge(for: item)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .frame(minHeight: 44)
    }

    private func badge(for item: AnchorUpcomingItem) -> some View {
        let (label, bg, fg) = badgeStyle(for: item)
        return Text(label)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundStyle(fg)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(bg)
            .clipShape(Capsule())
    }

    private func badgeStyle(for item: AnchorUpcomingItem) -> (String, Color, Color) {
        if item.isToday {
            return ("Today",
                    AnchorPalette.warning.opacity(0.18),
                    AnchorPalette.warning)
        }
        if item.isTomorrow {
            return ("Tomorrow",
                    Color.orange.opacity(0.18),
                    Color.orange)
        }
        return ("In \(item.daysUntil)d",
                AnchorPalette.chip,
                AnchorPalette.textSecondary)
    }
}
