import SwiftUI

/// Finance screen — Apple Wallet-inspired layout with live Firestore data.
/// Data source: FinanceStore (uid-scoped via SecureDb)
struct FinanceView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var financeStore: FinanceStore
    @EnvironmentObject var familyStore: FamilyStore
    @EnvironmentObject var recurringStore: AnchorRecurringStore
    @EnvironmentObject var userProfileStore: UserProfileStore
    @State var monthOffset: Int = 0
    @State var showAddTransaction = false
    @State var showAddAccount = false
    @State var showDeleteAccountAlert = false
    @State var accountToDelete: AnchorAccount? = nil
    @State var txToEdit: AnchorTransaction? = nil
    @State var loadTimedOut = false
    @State var showSummarySheet = false
    @State var showSearchSheet = false
    @State var showChartsSheet = false
    @State var showRecurringSheet = false
    @State var showBankSheet = false
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    Color.clear.frame(height: 0).id(ScrollToTopAnchor.id)
                    totalAssetsBar
                    if loadTimedOut && financeStore.accounts.isEmpty {
                        AnchorErrorBanner()
                            .padding(16)
                    } else if financeStore.isLoading {
                        LoadingBoundary(isLoading: true, skeleton: .finance) { EmptyView() }
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
                            NotificationBanner()
                            monthNavRow
                            FinanceNetWorthCard(rows: currencyTotals)
                            InsightCards(
                                transactions: financeStore.transactions,
                                currency: userProfileStore.currency
                            )
                            SubscriptionDetectorCard(recurring: recurringStore.recurring)
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
                        Button { showChartsSheet = true } label: {
                            Image(systemName: "chart.bar.xaxis")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                        .anchorPressable()
                        .accessibilityLabel("Charts")
                        Button { showRecurringSheet = true } label: {
                            Image(systemName: "repeat")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                        .anchorPressable()
                        .accessibilityLabel("Recurring rules")
                        Button { showBankSheet = true } label: {
                            Image(systemName: "building.columns")
                                .font(.body.weight(.semibold))
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                        .anchorPressable()
                        .accessibilityLabel("Bank connection")
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
            .sheet(isPresented: $showChartsSheet) {
                FinanceChartsSheet(
                    accounts: financeStore.accounts,
                    transactions: financeStore.transactions,
                    currency: userProfileStore.currency
                )
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
            }
            .sheet(isPresented: $showRecurringSheet) {
                RecurringRulesSheet()
                    .environmentObject(recurringStore)
            }
            .sheet(isPresented: $showBankSheet) {
                BankConnectionSheet()
            }
            .alert("Archive Account?", isPresented: $showDeleteAccountAlert, presenting: accountToDelete) { acc in
                Button("Archive", role: .destructive) {
                    Task {
                        do {
                            try await financeStore.deleteAccount(accountId: acc.resolvedId)
                            ToastStore.shared.show("Account archived", style: .info)
                        } catch {
                            ToastStore.shared.show("Failed to remove account", style: .error)
                        }
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: { acc in
                Text("Archive \"\(acc.name)\"? Transactions will remain in history and the account can be restored later.")
            }
        }
    }

