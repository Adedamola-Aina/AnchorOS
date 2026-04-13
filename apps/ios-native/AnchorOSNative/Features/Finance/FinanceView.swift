import SwiftUI

struct FinanceView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @State private var selectedPeriod: String = "30D"

    private let accounts: [FinanceAccount] = [
        .init(name: "Main Wallet", type: "Checking", amount: 125480.12, color: Color(red: 0.17, green: 0.31, blue: 0.78)),
        .init(name: "Family Savings", type: "Savings", amount: 40210.00, color: Color(red: 0.15, green: 0.44, blue: 0.62)),
        .init(name: "USD Reserve", type: "Multi-currency", amount: 9200.44, color: Color(red: 0.25, green: 0.22, blue: 0.58))
    ]

    private let recentTx: [FinanceTransaction] = [
        .init(title: "Groceries", subtitle: "Today • Main Wallet", amount: -14250.00),
        .init(title: "Salary", subtitle: "Yesterday • Main Wallet", amount: 210000.00),
        .init(title: "Netflix", subtitle: "2d ago • Family Savings", amount: -1500.00),
        .init(title: "Transfer In", subtitle: "3d ago • USD Reserve", amount: 8250.00)
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Accounts", "Transactions", "Bills", "Insights"])

                    netWorthCard
                    accountsCard
                    transactionsCard

                    AnchorCard(title: "Operational Signals", icon: "waveform.path.ecg") {
                        VStack(alignment: .leading, spacing: 8) {
                            signalRow("Alerts", value: "\(projectStateStore.snapshot?.alertsCount ?? 0)")
                            signalRow("Critical", value: "\(projectStateStore.snapshot?.criticalAlerts ?? 0)")
                            signalRow("In Progress", value: "\(projectStateStore.snapshot?.inProgressCount ?? 0)")
                            signalRow("Completed", value: "\(projectStateStore.snapshot?.completedThisWeek ?? 0)")
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Finance")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await projectStateStore.refresh(for: appState.environment)
            }
            .onChange(of: appState.environment) { _, _ in
                Task { await projectStateStore.refresh(for: appState.environment, force: true) }
            }
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

    private var netWorthCard: some View {
        AnchorCard(title: "Net Position", icon: "chart.pie") {
            VStack(alignment: .leading, spacing: 6) {
                Text("₦174,890.56")
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .font(.title2)
                    .fontWeight(.bold)
                Text("Across 3 accounts • \(selectedPeriod)")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.footnote)
            }
        }
    }

    private var accountsCard: some View {
        AnchorCard(title: "Accounts", icon: "wallet.pass") {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(accounts) { account in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(account.type.uppercased())
                                .font(.caption2)
                                .fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.textSecondary)
                            Text(account.name)
                                .foregroundStyle(.white)
                                .fontWeight(.semibold)
                            Text(formatCurrency(account.amount))
                                .foregroundStyle(.white)
                                .font(.title3)
                                .fontWeight(.bold)
                        }
                        .padding(14)
                        .frame(width: 190, alignment: .leading)
                        .background(account.color)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                }
            }
        }
    }

    private var transactionsCard: some View {
        AnchorCard(title: "Recent Activity", icon: "list.bullet.rectangle") {
            VStack(spacing: 10) {
                ForEach(recentTx) { tx in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(tx.title)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .fontWeight(.semibold)
                            Text(tx.subtitle)
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .font(.caption)
                        }
                        Spacer()
                        Text(formatCurrency(tx.amount))
                            .foregroundStyle(tx.amount >= 0 ? Color.green : Color.red)
                            .fontWeight(.bold)
                    }
                }
            }
        }
    }

    private func signalRow(_ name: String, value: String) -> some View {
        HStack {
            Text(name)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .foregroundStyle(AnchorPalette.textPrimary)
                .fontWeight(.semibold)
        }
    }

    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "NGN"
        formatter.maximumFractionDigits = 2
        return formatter.string(from: NSNumber(value: value)) ?? "₦0.00"
    }
}

private struct FinanceAccount: Identifiable {
    let id = UUID()
    let name: String
    let type: String
    let amount: Double
    let color: Color
}

private struct FinanceTransaction: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let amount: Double
}
