import SwiftUI

/// Parity with src/features/finance/components/TransferDetails.tsx —
/// a detail inspector for a transfer pair (outbound + inbound matched via
/// linkId or opposing account ids on the same date). Surfaces both legs with
/// accounts, amounts, and a banner reminder that transfers are excluded from
/// cash-flow totals.
struct TransferDetailsSheet: View {
    @Environment(\.dismiss) private var dismiss

    let transaction: AnchorTransaction
    let accounts: [AnchorAccount]
    let allTransactions: [AnchorTransaction]

    private var counterpart: AnchorTransaction? {
        // Heuristic: opposing transfer leg is same-date + same-amount +
        // different accountId. Persistent link-id lives in the PWA schema but
        // is not yet mapped into AnchorTransaction on iOS.
        allTransactions.first {
            $0.resolvedId != transaction.resolvedId
                && $0.type == "transfer"
                && $0.date == transaction.date
                && $0.amountCents == transaction.amountCents
                && $0.accountId != transaction.accountId
        }
    }

    private func accountName(for id: String?) -> String {
        guard let id else { return "Unknown" }
        return accounts.first { $0.id == id }?.name ?? "Unknown"
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    banner
                    legCard(title: "This Leg", tx: transaction)
                    if let pair = counterpart {
                        legCard(title: "Paired Leg", tx: pair)
                    } else {
                        AnchorCard(title: "Paired Leg", icon: "questionmark.circle") {
                            Text("Counterpart not found. This transfer may have been deleted or predates link-id persistence.")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Transfer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var banner: some View {
        HStack(spacing: 10) {
            Image(systemName: "info.circle.fill")
                .foregroundStyle(AnchorPalette.chipActive)
            Text("Transfers are excluded from cash-flow totals.")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
        }
        .padding(12)
        .background(AnchorPalette.chipActive.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func legCard(title: String, tx: AnchorTransaction) -> some View {
        AnchorCard(title: title, icon: "arrow.left.arrow.right") {
            VStack(alignment: .leading, spacing: 10) {
                row(label: "Account", value: accountName(for: tx.accountId))
                Divider().background(AnchorPalette.cardBorder)
                row(label: "Amount", value: tx.formattedAmount)
                Divider().background(AnchorPalette.cardBorder)
                row(label: "Category", value: tx.category?.capitalized ?? "Transfer")
                Divider().background(AnchorPalette.cardBorder)
                row(label: "Date", value: tx.displayDate)
                if !tx.title.isEmpty {
                    Divider().background(AnchorPalette.cardBorder)
                    row(label: "Title", value: tx.title)
                }
            }
        }
    }

    private func row(label: String, value: String) -> some View {
        HStack {
            Text(label.uppercased())
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(AnchorPalette.textPrimary)
                .lineLimit(2)
                .multilineTextAlignment(.trailing)
        }
    }
}
