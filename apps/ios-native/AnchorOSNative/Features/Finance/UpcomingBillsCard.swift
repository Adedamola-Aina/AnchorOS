import SwiftUI

// MARK: - UpcomingBillsCard
// SwiftUI port of src/features/finance/components/UpcomingBillsPanel.tsx.
// Pulls active recurring transactions with nextRunAt inside the next
// `windowDays` and renders a compact upcoming-bills list. Mirrors
// getUpcomingBills() pure filter from billReminderUtils.ts.
struct UpcomingBillsCard: View {
    let bills: [AnchorRecurringTransaction]
    var windowDays: Int = 7

    private var upcoming: [(bill: AnchorRecurringTransaction, due: Date)] {
        let now = Date()
        guard let cutoff = Calendar.current.date(byAdding: .day, value: windowDays, to: now) else { return [] }
        let iso = ISO8601DateFormatter()
        return bills
            .filter { $0.isActive }
            .compactMap { bill -> (AnchorRecurringTransaction, Date)? in
                guard let due = iso.date(from: bill.nextRunAt) else { return nil }
                if due < now || due > cutoff { return nil }
                return (bill, due)
            }
            .sorted { $0.1 < $1.1 }
    }

    private func dueLabel(_ due: Date) -> String {
        let days = Calendar.current.dateComponents([.day], from: Calendar.current.startOfDay(for: Date()),
                                                    to: Calendar.current.startOfDay(for: due)).day ?? 0
        if days <= 0 { return "Due today" }
        if days == 1 { return "Due tomorrow" }
        return "Due in \(days) days"
    }

    private func isUrgent(_ due: Date) -> Bool {
        let days = Calendar.current.dateComponents([.day], from: Calendar.current.startOfDay(for: Date()),
                                                    to: Calendar.current.startOfDay(for: due)).day ?? 0
        return days <= 1
    }

    private func formattedAmount(_ cents: Int) -> String {
        let units = Double(cents) / 100.0
        let fmt = NumberFormatter()
        fmt.numberStyle = .decimal
        fmt.minimumFractionDigits = 0
        fmt.maximumFractionDigits = 2
        return fmt.string(from: NSNumber(value: units)) ?? String(format: "%.0f", units)
    }

    var body: some View {
        if upcoming.isEmpty {
            EmptyView()
        } else {
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 8) {
                    Image(systemName: "calendar")
                        .font(.system(size: 13))
                        .foregroundStyle(AnchorPalette.warning)
                    Text("UPCOMING BILLS")
                        .font(.caption2.weight(.bold))
                        .tracking(1)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                VStack(spacing: 8) {
                    ForEach(upcoming, id: \.bill.resolvedId) { entry in
                        row(for: entry.bill, due: entry.due)
                    }
                }
            }
        }
    }

    private func row(for bill: AnchorRecurringTransaction, due: Date) -> some View {
        let urgent = isUrgent(due)
        let label = dueLabel(due)
        return HStack(spacing: 10) {
            if urgent {
                Image(systemName: "exclamationmark.circle.fill")
                    .font(.system(size: 14))
                    .foregroundStyle(AnchorPalette.warning)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(bill.title)
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .lineLimit(1)
                Text("\(label) · \(bill.frequency)")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundStyle(urgent ? AnchorPalette.warning : AnchorPalette.textSecondary)
            }
            Spacer()
            Text(formattedAmount(bill.amountCents))
                .font(.subheadline.monospaced().weight(.bold))
                .foregroundStyle(AnchorPalette.textPrimary)
        }
        .padding(12)
        .background(urgent ? AnchorPalette.warning.opacity(0.12) : AnchorPalette.chip.opacity(0.5))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(urgent ? AnchorPalette.warning.opacity(0.3) : AnchorPalette.chip, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
