import SwiftUI

// MARK: - FinanceSummarySheet
// SwiftUI port of src/features/finance/components/FinanceSummarySheet.tsx.
// Shows per-currency totals + sorted account list; tapping an account row
// dismisses the sheet and the parent handles navigation.
struct FinanceSummarySheet: View {
    let accounts: [AnchorAccount]
    let onOpenAccount: (AnchorAccount) -> Void

    @Environment(\.dismiss) private var dismiss

    private var totalsByCurrency: [(currency: String, totalCents: Int)] {
        var buckets: [String: Int] = [:]
        for acc in accounts { buckets[acc.currency, default: 0] += acc.balanceCents }
        return buckets.map { ($0.key, $0.value) }.sorted { $0.currency < $1.currency }
    }

    private var sortedAccounts: [AnchorAccount] {
        accounts.sorted { $0.balanceCents > $1.balanceCents }
    }

    private func fmt(_ cents: Int, currency: String) -> String {
        let units = Double(cents) / 100.0
        let nf = NumberFormatter()
        nf.numberStyle = .decimal
        nf.minimumFractionDigits = 2
        nf.maximumFractionDigits = 2
        let symbol = currency == "USD" ? "$" : (currency == "NGN" ? "₦" : "")
        return "\(symbol)\(nf.string(from: NSNumber(value: units)) ?? "0.00")"
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(totalsByCurrency, id: \.currency) { entry in
                            VStack(alignment: .leading, spacing: 8) {
                                Text("\(entry.currency) TOTAL")
                                    .font(.caption2.weight(.semibold))
                                    .tracking(1.5)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                                Text(fmt(entry.totalCents, currency: entry.currency))
                                    .font(.title2.weight(.semibold))
                                    .foregroundStyle(AnchorPalette.textPrimary)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(16)
                            .background(AnchorPalette.chip.opacity(0.5))
                            .overlay(RoundedRectangle(cornerRadius: 18).stroke(AnchorPalette.chip, lineWidth: 1))
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                        }
                    }

                    VStack(alignment: .leading, spacing: 10) {
                        Text("\(accounts.count) active account\(accounts.count == 1 ? "" : "s")")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(AnchorPalette.textSecondary)
                        VStack(spacing: 8) {
                            ForEach(sortedAccounts) { acc in
                                Button {
                                    onOpenAccount(acc)
                                    dismiss()
                                } label: {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(acc.name)
                                                .font(.subheadline.weight(.semibold))
                                                .foregroundStyle(AnchorPalette.textPrimary)
                                            Text(acc.type.capitalized)
                                                .font(.caption)
                                                .foregroundStyle(AnchorPalette.textSecondary)
                                        }
                                        Spacer()
                                        Text(fmt(acc.balanceCents, currency: acc.currency))
                                            .font(.subheadline.weight(.semibold))
                                            .foregroundStyle(AnchorPalette.textPrimary)
                                    }
                                    .padding(16)
                                    .background(AnchorPalette.chip.opacity(0.3))
                                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(AnchorPalette.chip, lineWidth: 1))
                                    .clipShape(RoundedRectangle(cornerRadius: 18))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
                .padding(20)
            }
            .background(AnchorBackground())
            .navigationTitle("Summary")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }.foregroundStyle(AnchorPalette.chipActive)
                }
            }
        }
    }
}
