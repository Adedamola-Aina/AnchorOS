import SwiftUI

/// Parity with src/features/finance/components/ActivityFeed.tsx and
/// SharedActivitySection.tsx. A chronological log of transactions and
/// commitment completions. Shared-activity mode is a header variant (family
/// tint) rather than a separate component, matching how iOS consolidates
/// family context into the same list.
struct ActivityFeedSheet: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var familyStore: FamilyStore

    struct Entry: Identifiable {
        let id = UUID()
        let date: Date
        let title: String
        let subtitle: String
        let icon: String
        let tint: Color
    }

    private var entries: [Entry] {
        var out: [Entry] = []
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        for tx in financeStore.transactions {
            guard let d = iso.date(from: tx.date) ?? ISO8601DateFormatter().date(from: tx.date) else { continue }
            let isIncome = tx.type == "income"
            let isTransfer = tx.type == "transfer"
            let tint: Color = isTransfer ? AnchorPalette.chipActive : (isIncome ? AnchorPalette.success : AnchorPalette.danger)
            let icon = isTransfer ? "arrow.left.arrow.right" : (isIncome ? "arrow.down.left.circle.fill" : "arrow.up.right.circle.fill")
            let amountStr = String(format: "%.0f", Double(tx.amountCents) / 100.0)
            out.append(Entry(
                date: d,
                title: tx.category?.capitalized ?? (isIncome ? "Income" : "Expense"),
                subtitle: "\(isIncome ? "+" : "-")\(amountStr)",
                icon: icon,
                tint: tint
            ))
        }

        for c in commitmentsStore.commitments {
            if let completed = c.lastCompletedAt, let d = iso.date(from: completed) ?? ISO8601DateFormatter().date(from: completed) {
                out.append(Entry(
                    date: d,
                    title: c.title,
                    subtitle: "Completed",
                    icon: "checkmark.circle.fill",
                    tint: AnchorPalette.success
                ))
            }
        }

        return out.sorted { $0.date > $1.date }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    if familyStore.hasConnection {
                        HStack(spacing: 8) {
                            Image(systemName: "person.2.fill")
                                .foregroundStyle(AnchorPalette.chipActive)
                            Text("Shared with \(familyStore.partnerName)")
                                .font(.caption).fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.chipActive)
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                    }

                    if entries.isEmpty {
                        emptyState
                    } else {
                        VStack(spacing: 0) {
                            ForEach(Array(entries.prefix(50).enumerated()), id: \.element.id) { (idx, e) in
                                if idx > 0 { Divider().background(AnchorPalette.cardBorder) }
                                row(e)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(AnchorPalette.card)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .padding(.horizontal, 16)
                    }
                }
                .padding(.vertical, 16)
            }
            .background(AnchorBackground())
            .navigationTitle("Activity")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 8) {
            Image(systemName: "clock.arrow.circlepath")
                .font(.largeTitle)
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("No activity yet")
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Transactions and completed commitments will appear here.")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
        .padding(32)
    }

    private func row(_ e: Entry) -> some View {
        HStack(spacing: 12) {
            Image(systemName: e.icon)
                .foregroundStyle(e.tint)
                .frame(width: 32, height: 32)
                .background(e.tint.opacity(0.15))
                .clipShape(Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(e.title)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .lineLimit(1)
                Text(relativeLabel(for: e.date))
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            Spacer()
            Text(e.subtitle)
                .font(.caption.monospacedDigit())
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .padding(.vertical, 10)
    }

    private func relativeLabel(for d: Date) -> String {
        let f = RelativeDateTimeFormatter()
        f.unitsStyle = .abbreviated
        return f.localizedString(for: d, relativeTo: Date())
    }
}
