import SwiftUI

/// Finance screen — Apple Wallet-inspired layout with live Firestore data.
/// Data source: FinanceStore (uid-scoped via SecureDb)
struct FinanceView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var recurringStore: AnchorRecurringStore
    @State private var monthOffset: Int = 0
    @State private var showAddTransaction = false
    @State private var showAddAccount = false
    @State private var showDeleteAccountAlert = false
    @State private var accountToDelete: AnchorAccount? = nil
    @State private var txToEdit: AnchorTransaction? = nil
    @State private var loadTimedOut = false
    @State private var showSummarySheet = false
    @State private var showSearchSheet = false

    private var monthLabel: String {
        guard let date = Calendar.current.date(byAdding: .month, value: monthOffset, to: Date()) else { return "" }
        let fmt = DateFormatter()
        fmt.dateFormat = "MMMM yyyy"
        return fmt.string(from: date)
    }

    /// Per-currency balance totals for the TOTAL ASSETS bar.
    /// Sourced from NetWorthCalculator so PWA parity is enforced centrally.
    private var currencyTotals: [(currency: String, symbol: String, formatted: String)] {
        let nw = financeStore.netWorth
        let numFmt = NumberFormatter()
        numFmt.numberStyle = .decimal
        numFmt.minimumFractionDigits = 2
        numFmt.maximumFractionDigits = 2
        var rows: [(String, String, String)] = []
        if nw.ngnCents != 0 || nw.usdCents == 0 {
            let s = numFmt.string(from: NSNumber(value: nw.ngn)) ?? "0.00"
            rows.append(("NGN", "₦", "₦\(s)"))
        }
        if nw.usdCents != 0 {
            let s = numFmt.string(from: NSNumber(value: nw.usd)) ?? "0.00"
            rows.append(("USD", "$", "$\(s)"))
        }
        return rows
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    Color.clear.frame(height: 0).id(ScrollToTopAnchor.id)
                    totalAssetsBar
                    if loadTimedOut && financeStore.accounts.isEmpty {
                        AnchorErrorBanner()
                            .padding(16)
                    } else {
                    WalletCardStack(
                        accounts: financeStore.accounts,
                        onAdd: { showAddAccount = true },
                        onEdit: { _ in },
                        onDelete: { acc in
                            accountToDelete = acc
                            showDeleteAccountAlert = true
                        }
                    )
                        if familyStore.hasConnection { sharedAccountsSection }
                        VStack(spacing: 16) {
                            monthNavRow
                            UpcomingBillsCard(bills: recurringStore.recurring)
                            transactionsCard
                        }
                        .padding(16)
                    }
                }
            }
            .scrollsToTopOnTabRetap(tab: 3)
            .background(AnchorBackground())
            .navigationTitle("Finance")

            .refreshable { await financeStore.refresh() }
            .task {
                try? await Task.sleep(for: .seconds(12))
                if financeStore.isLoading { loadTimedOut = true }
            }
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    HStack(spacing: 4) {
                        Button { showSearchSheet = true } label: {
                            Image(systemName: "magnifyingglass")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                        .anchorPressable()
                        .accessibilityLabel("Search transactions")
                        Button { showSummarySheet = true } label: {
                            Image(systemName: "chart.pie")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                        .anchorPressable()
                        .accessibilityLabel("Finance summary")
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button { showAddTransaction = true } label: {
                            Label("Add Transaction", systemImage: "plus.circle")
                        }
                        Button { showAddAccount = true } label: {
                            Label("New Account", systemImage: "creditcard.fill")
                        }
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                            .foregroundStyle(AnchorPalette.chipActive)
                    }
                }
            }
            .sheet(isPresented: $showAddTransaction) {
                AddTransactionSheet()
                    .environmentObject(financeStore)
            }
            .sheet(isPresented: $showAddAccount) {
                AddAccountSheet()
                    .environmentObject(financeStore)
            }
            .sheet(item: $txToEdit) { tx in
                EditTransactionSheet(transaction: tx)
                    .environmentObject(financeStore)
            }
            .sheet(isPresented: $showSummarySheet) {
                FinanceSummarySheet(
                    accounts: financeStore.accounts,
                    onOpenAccount: { _ in
                        // Navigation to account detail from sheet is a follow-up;
                        // current wallet stack already supports direct card taps.
                    }
                )
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
            }
            .sheet(isPresented: $showSearchSheet) {
                FinanceSearchSheet(
                    accounts: financeStore.accounts,
                    transactions: financeStore.transactions,
                    onOpenAccount: { _ in }
                )
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
            }
            .alert("Delete Account?", isPresented: $showDeleteAccountAlert, presenting: accountToDelete) { acc in
                Button("Delete", role: .destructive) {
                    Task {
                        do {
                            try await financeStore.deleteAccount(accountId: acc.resolvedId)
                            ToastStore.shared.show("Account removed", style: .info)
                        } catch {
                            ToastStore.shared.show("Failed to remove account", style: .error)
                        }
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: { acc in
                Text("Remove \"\(acc.name)\"? Transactions will remain in history.")
            }
        }
    }

    // MARK: — Shared Accounts (Family Mode)

    private var sharedAccountsSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 6) {
                Image(systemName: "person.2.fill")
                    .font(.caption2)
                    .foregroundStyle(AnchorPalette.chipActive)
                Text("SHARED WITH \(familyStore.partnerName.uppercased())")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .padding(.horizontal, 20).padding(.top, 16).padding(.bottom, 8)

            let shared = financeStore.accounts.filter { $0.scope == "shared" }
            if shared.isEmpty {
                Text("No shared accounts yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.caption)
                    .padding(.horizontal, 20).padding(.bottom, 12)
            } else {
                ForEach(Array(shared.enumerated()), id: \.element.resolvedId) { index, account in
                    NavigationLink(destination:
                        AccountDetailView(account: account, accountIndex: index + financeStore.accounts.count)
                            .environmentObject(financeStore)
                    ) {
                        fullWidthAccountCard(account, at: index + financeStore.accounts.count)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: — Total Assets

    private var totalAssetsBar: some View {
        ZStack {
            // PWA parity: microMotion.netWorthRise shimmer when total > 0.
            LinearGradient(
                colors: [Color.clear, AnchorPalette.finance.opacity(0.3), Color.clear],
                startPoint: .leading, endPoint: .trailing
            )
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .allowsHitTesting(false)
            .netWorthRise(trigger: !currencyTotals.isEmpty)

            VStack(alignment: .leading, spacing: 4) {
                Text("TOTAL ASSETS")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)
                if financeStore.isLoading {
                    ProgressView().tint(.white)
                } else if currencyTotals.isEmpty {
                    Text("—").foregroundStyle(AnchorPalette.textPrimary).font(.title3)
                } else {
                    HStack(spacing: 16) {
                        ForEach(currencyTotals, id: \.currency) { entry in
                            Text(entry.formatted)
                                .font(.title3).fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.horizontal, 20).padding(.top, 16).padding(.bottom, 12)
    }

    // MARK: — Account Card Stack (full-width vertical)

    private var accountStack: some View {
        VStack(spacing: 1) {
            if financeStore.accounts.isEmpty && !financeStore.isLoading {
                Text("No accounts yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(20)
            } else {
                ForEach(Array(financeStore.accounts.enumerated()), id: \.element.resolvedId) { index, account in
                    NavigationLink(destination:
                        AccountDetailView(account: account, accountIndex: index)
                            .environmentObject(financeStore)
                    ) {
                        fullWidthAccountCard(account, at: index)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func fullWidthAccountCard(_ account: AnchorAccount, at index: Int) -> some View {
        HStack(alignment: .center, spacing: 0) {
            VStack(alignment: .leading, spacing: 4) {
                Text(account.name)
                    .font(.body).fontWeight(.semibold)
                    .foregroundStyle(.white)
                Text(account.type.uppercased())
                    .font(.caption2).fontWeight(.bold)
                    .foregroundStyle(.white.opacity(0.65))
            }
            Spacer()
            Text(account.formattedBalance)
                .font(.body).fontWeight(.bold)
                .foregroundStyle(.white)
        }
        .padding(.horizontal, 20).padding(.vertical, 16)
        .background(account.cardColor(at: index))
        .contextMenu {
            Button(role: .destructive) {
                accountToDelete = account
                showDeleteAccountAlert = true
            } label: {
                Label("Remove Account", systemImage: "trash")
            }
        }
    }

    // MARK: — Month Navigation

    private var monthNavRow: some View {
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

    private var transactionsCard: some View {
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

    private func txRow(_ tx: AnchorTransaction) -> some View {
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
