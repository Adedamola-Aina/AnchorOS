import SwiftUI

/// Account Detail — drill-down from FinanceView account card.
/// Shows account info, all transactions for this account, edit + delete actions.
struct AccountDetailView: View {
    let account: AnchorAccount
    let accountIndex: Int

    @EnvironmentObject private var financeStore: FinanceStore
    @Environment(\.dismiss) private var dismiss

    @State private var showEditAccount = false
    @State private var showDeleteAlert = false
    @State private var txToEdit: AnchorTransaction? = nil
    @State private var selectedType: String = "All"

    private let typeFilters = ["All", "Income", "Expense", "Transfer"]

    private var accountTransactions: [AnchorTransaction] {
        let all = financeStore.recentTransactions.filter { $0.accountId == account.resolvedId }
        guard selectedType != "All" else { return all }
        return all.filter { $0.type.lowercased() == selectedType.lowercased() }
    }

    var body: some View {
        ZStack {
            AnchorBackground().ignoresSafeArea()
            ScrollView {
                VStack(spacing: 16) {
                    // Hero card
                    heroCard

                    // Spending Trends
                    let buckets = AnchorFabricEngine.weeklyBuckets(transactions: financeStore.recentTransactions.filter { $0.accountId == account.resolvedId })
                    if buckets.contains(where: { $0.incomeCents > 0 || $0.expenseCents > 0 }) {
                        AnchorCard(title: "Spending Trends", icon: "chart.bar.fill") {
                            SpendingTrendsChart(buckets: buckets, currency: account.currency)
                        }
                    }

                    // Transactions
                    AnchorCard(title: "Transactions", icon: "list.bullet.rectangle") {
                        VStack(alignment: .leading, spacing: 12) {
                            // Filter chips
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(typeFilters, id: \.self) { f in
                                        Button { selectedType = f } label: {
                                            Text(f.uppercased())
                                                .font(.caption2).fontWeight(.bold)
                                                .foregroundStyle(selectedType == f ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                                .padding(.horizontal, 12).padding(.vertical, 6)
                                                .background(selectedType == f ? AnchorPalette.chipActive : AnchorPalette.chip)
                                                .clipShape(Capsule())
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                            }

                            if accountTransactions.isEmpty {
                                Text(selectedType == "All" ? "No transactions for this account." : "No \(selectedType.lowercased()) transactions.")
                                    .foregroundStyle(AnchorPalette.textSecondary)
                                    .font(.subheadline)
                            } else {
                                VStack(spacing: 12) {
                                    ForEach(accountTransactions) { tx in
                                        txRow(tx)
                                    }
                                }
                            }
                        }
                    }
                }
                .padding(16)
            }
        }
        .navigationTitle(account.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Button { showEditAccount = true } label: {
                        Label("Edit Account", systemImage: "pencil")
                    }
                    Button(role: .destructive) {
                        showDeleteAlert = true
                    } label: {
                        Label("Delete Account", systemImage: "trash")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundStyle(AnchorPalette.textPrimary)
                }
            }
        }
        .sheet(isPresented: $showEditAccount) {
            EditAccountSheet(account: account)
                .environmentObject(financeStore)
        }
        .sheet(item: $txToEdit) { tx in
            EditTransactionSheet(transaction: tx)
                .environmentObject(financeStore)
        }
        .alert("Delete Account?", isPresented: $showDeleteAlert) {
            Button("Delete", role: .destructive) {
                Task {
                    do {
                        try await financeStore.deleteAccount(accountId: account.resolvedId)
                        ToastStore.shared.show("Account removed", style: .info)
                        dismiss()
                    } catch {
                        ToastStore.shared.show("Failed to remove account", style: .error)
                    }
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Remove \"\(account.name)\"? Transactions will remain in history.")
        }
    }

    // MARK: — Hero Card

    private var heroCard: some View {
        VStack(spacing: 0) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(account.type.uppercased())
                        .font(.caption2).fontWeight(.bold)
                        .foregroundStyle(.white.opacity(0.65))
                    Text(account.formattedBalance)
                        .font(.largeTitle).fontWeight(.bold)
                        .foregroundStyle(.white)
                    Text(account.currency)
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.65))
                }
                Spacer()
                Image(systemName: "creditcard.fill")
                    .font(.title)
                    .foregroundStyle(.white.opacity(0.4))
            }
            .padding(20)
        }
        .background(account.cardColor(at: accountIndex))
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }

    // MARK: — Transaction Row

    private func txRow(_ tx: AnchorTransaction) -> some View {
        HStack(alignment: .top, spacing: 12) {
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
                Text(tx.displayDate)
                    .foregroundStyle(AnchorPalette.textSecondary).font(.caption)
            }

            Spacer()

            Text(tx.formattedAmount)
                .foregroundStyle(tx.type == "income" ? AnchorPalette.success :
                                 tx.type == "transfer" ? AnchorPalette.textSecondary :
                                 AnchorPalette.danger)
                .fontWeight(.bold)
                .font(.subheadline)
        }
        .contentShape(Rectangle())
        .onTapGesture { txToEdit = tx }
        .contextMenu {
            Button { txToEdit = tx } label: {
                Label("Edit Transaction", systemImage: "pencil")
            }
            Button(role: .destructive) {
                Task { try? await financeStore.deleteTransaction(transactionId: tx.resolvedId) }
            } label: {
                Label("Remove Transaction", systemImage: "trash")
            }
        }
    }
}
