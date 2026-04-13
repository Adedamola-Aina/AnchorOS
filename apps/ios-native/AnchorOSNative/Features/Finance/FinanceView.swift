import SwiftUI

/// Finance screen — Apple Wallet-inspired layout with live Firestore data.
/// Data source: FinanceStore (uid-scoped via SecureDb)
struct FinanceView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @State private var selectedPeriod: String = "30D"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Accounts", "Transactions", "Bills", "Insights"])
                    netWorthCard
                    accountsCard
                    transactionsCard
                    signalsCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Finance")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Picker("Period", selection: $selectedPeriod) {
                        Text("7D").tag("7D")
                        Text("30D").tag("30D")
                        Text("90D").tag("90D")
                    }
                    .pickerStyle(.menu)
                }
            }
        }
    }

    // MARK: — Net Worth

    private var netWorthCard: some View {
        AnchorCard(title: "Net Position", icon: "chart.pie") {
            VStack(alignment: .leading, spacing: 6) {
                if financeStore.isLoading {
                    ProgressView().tint(.white)
                } else {
                    Text(financeStore.netWorthFormatted)
                        .font(.title2).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text("Across \(financeStore.accounts.count) account\(financeStore.accounts.count == 1 ? "" : "s") • \(selectedPeriod)")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.footnote)
                }
            }
        }
    }

    // MARK: — Account Cards

    private var accountsCard: some View {
        AnchorCard(title: "Accounts", icon: "wallet.pass") {
            if financeStore.accounts.isEmpty && !financeStore.isLoading {
                Text("No accounts yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.subheadline)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(Array(financeStore.accounts.enumerated()), id: \.element.resolvedId) { index, account in
                            accountCard(account, at: index)
                        }
                    }
                }
            }
        }
    }

    private func accountCard(_ account: AnchorAccount, at index: Int) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(account.type.uppercased())
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(.white.opacity(0.75))
            Text(account.name)
                .foregroundStyle(.white).fontWeight(.semibold)
            Spacer()
            Text(account.formattedBalance)
                .foregroundStyle(.white)
                .font(.title3).fontWeight(.bold)
        }
        .padding(14)
        .frame(width: 190, height: 110, alignment: .leading)
        .background(account.cardColor(at: index))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    // MARK: — Recent Transactions

    private var transactionsCard: some View {
        AnchorCard(title: "Recent Activity", icon: "list.bullet.rectangle") {
            if financeStore.recentTransactions.isEmpty {
                Text("No transactions yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.subheadline)
            } else {
                VStack(spacing: 10) {
                    ForEach(financeStore.recentTransactions) { tx in
                        txRow(tx)
                    }
                }
            }
        }
    }

    private func txRow(_ tx: AnchorTransaction) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(tx.title)
                    .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
                Text("\(tx.displayDate) • \(tx.accountName ?? tx.category ?? "")")
                    .foregroundStyle(AnchorPalette.textSecondary).font(.caption)
            }
            Spacer()
            Text(tx.formattedAmount)
                .foregroundStyle(
                    tx.type == "income" ? AnchorPalette.success :
                    tx.type == "transfer" ? AnchorPalette.textSecondary :
                    AnchorPalette.danger
                )
                .fontWeight(.bold)
        }
    }

    // MARK: — Signals

    private var signalsCard: some View {
        AnchorCard(title: "Operational Signals", icon: "waveform.path.ecg") {
            VStack(alignment: .leading, spacing: 8) {
                signalRow("Alerts", value: "\(projectStateStore.snapshot?.alertsCount ?? 0)")
                signalRow("Critical", value: "\(projectStateStore.snapshot?.criticalAlerts ?? 0)")
                signalRow("In Progress", value: "\(projectStateStore.snapshot?.inProgressCount ?? 0)")
                signalRow("Completed", value: "\(projectStateStore.snapshot?.completedThisWeek ?? 0)")
            }
        }
    }

    private func signalRow(_ name: String, value: String) -> some View {
        HStack {
            Text(name).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
