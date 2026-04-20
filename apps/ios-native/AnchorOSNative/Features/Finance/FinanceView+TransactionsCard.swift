import SwiftUI\n\nextension FinanceView {
    // MARK: — Month Navigation

    var monthNavRow: some View {
        HStack(spacing: 0) {
            Button {
                monthOffset -= 1
            } label: {
                Image(systemName: "chevron.left")
                    .font(.footnote).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.horizontal, 12).padding(.vertical, 8)
            }
            .buttonStyle(.plain)

            HStack(spacing: 6) {
                Image(systemName: "calendar")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                Text(monthLabel)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }
            .frame(maxWidth: .infinity)

            Button {
                monthOffset += 1
            } label: {
                Image(systemName: "chevron.right")
                    .font(.footnote).fontWeight(.semibold)
                    .foregroundStyle(monthOffset < 0 ? AnchorPalette.textSecondary : AnchorPalette.textSecondary.opacity(0.3))
                    .padding(.horizontal, 12).padding(.vertical, 8)
            }
            .buttonStyle(.plain)
            .disabled(monthOffset >= 0)
        }
        .background(AnchorPalette.chip.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: — Transactions

    var transactionsCard: some View {
        AnchorCard(title: "Recent Activity", icon: "list.bullet.rectangle") {
            if financeStore.recentTransactions.isEmpty {
                Text("No transactions yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.subheadline)
            } else {
                VStack(spacing: 12) {
                    ForEach(financeStore.recentTransactions) { tx in
                        SwipeableRow(
                            deleteAction: {
                                Task { try? await financeStore.deleteTransaction(transactionId: tx.resolvedId) }
                            },
                            editAction: { txToEdit = tx }
                        ) {
                            txRow(tx)
                        }
                    }
                }
            }
        }
    }

    func txRow(_ tx: AnchorTransaction) -> some View {
        HStack(alignment: .top, spacing: 12) {
            // Category icon bubble
            ZStack {
                Circle()
                    .fill(tx.type == "income" ? AnchorPalette.success.opacity(0.15) :
                          tx.type == "transfer" ? AnchorPalette.chipActive.opacity(0.15) :
                          AnchorPalette.danger.opacity(0.15))
                    .frame(width: 36, height: 36)
                Image(systemName: tx.type == "income" ? "arrow.down.circle" :
                      tx.type == "transfer" ? "arrow.left.arrow.right" : "bolt.fill")
                    .font(.caption)
                    .foregroundStyle(tx.type == "income" ? AnchorPalette.success :
                                     tx.type == "transfer" ? AnchorPalette.chipActive :
                                     AnchorPalette.warning)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(tx.title)
                    .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
                    .font(.subheadline)
                HStack(spacing: 6) {
                    Text(tx.displayDate)
                        .foregroundStyle(AnchorPalette.textSecondary).font(.caption)
                    if let cat = tx.category {
                        Text(cat)
                            .font(.caption2).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.chipActive)
                            .padding(.horizontal, 7).padding(.vertical, 2)
                            .background(AnchorPalette.chipActive.opacity(0.15))
                            .clipShape(Capsule())
                    }
                    if let acct = tx.accountName {
                        Text(acct)
                            .foregroundStyle(AnchorPalette.textSecondary).font(.caption)
                    }
                }
            }

            Spacer()

            Text(tx.formattedAmount)
                .foregroundStyle(
                    tx.type == "income" ? AnchorPalette.success :
                    tx.type == "transfer" ? AnchorPalette.textSecondary :
                    AnchorPalette.danger
                )
                .fontWeight(.bold)
                .font(.subheadline)
        }
        .contentShape(Rectangle())
        .onTapGesture { txToEdit = tx }
    }
}
