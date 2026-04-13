import SwiftUI

/// Dashboard — "Life at a glance" with real name, net worth, tasks + activity.
/// Data sources: UserProfileStore, FinanceStore, CommitmentsStore
struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var userProfileStore: UserProfileStore

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 12 { return "Good morning" }
        if hour < 18 { return "Good afternoon" }
        return "Good evening"
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    greetingHeader
                    AnchorSectionTabs(labels: ["Overview", "Wealth", "Activity", "Focus"])
                    wealthCard
                    tasksProgressCard
                    recentActivityCard
                    statusCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor OS")
            .navigationBarTitleDisplayMode(.inline)
            .task { await projectStateStore.refresh(for: appState.environment) }
            .onChange(of: appState.environment) { _, _ in
                Task { await projectStateStore.refresh(for: appState.environment, force: true) }
            }
        }
    }

    // MARK: — Greeting

    private var greetingHeader: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("\(greeting), \(userProfileStore.displayName)")
                .font(.title2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Life at a glance.")
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: — Wealth

    private var wealthCard: some View {
        AnchorCard(title: "Net Worth", icon: "chart.pie.fill") {
            VStack(alignment: .leading, spacing: 8) {
                if financeStore.isLoading {
                    ProgressView().tint(.white)
                } else {
                    Text(financeStore.netWorthFormatted)
                        .font(.title).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    HStack(spacing: 12) {
                        ForEach(Array(financeStore.accounts.prefix(3).enumerated()), id: \.element.resolvedId) { idx, acc in
                            Circle()
                                .fill(acc.cardColor(at: idx))
                                .frame(width: 10, height: 10)
                            Text(acc.name)
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                }
            }
        }
    }

    // MARK: — Tasks Progress

    private var tasksProgressCard: some View {
        AnchorCard(title: "Today's Commitments", icon: "checkmark.circle") {
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .stroke(AnchorPalette.chip, lineWidth: 5)
                    Circle()
                        .trim(from: 0, to: commitmentsStore.completionPercent)
                        .stroke(AnchorPalette.chipActive, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                        .animation(.easeInOut, value: commitmentsStore.completionPercent)
                }
                .frame(width: 44, height: 44)

                VStack(alignment: .leading, spacing: 2) {
                    Text("\(commitmentsStore.completedCount) done, \(commitmentsStore.activeCount) remaining")
                        .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
                    Text(commitmentsStore.totalCount == 0 ? "Add your first commitment." : "Keep going — you're making progress.")
                        .foregroundStyle(AnchorPalette.textSecondary).font(.caption)
                }
                Spacer()
            }
        }
    }

    // MARK: — Recent Activity

    private var recentActivityCard: some View {
        AnchorCard(title: "Recent Activity", icon: "clock.arrow.circlepath") {
            if financeStore.recentTransactions.isEmpty {
                Text("No recent transactions.")
                    .foregroundStyle(AnchorPalette.textSecondary).font(.subheadline)
            } else {
                VStack(spacing: 8) {
                    ForEach(financeStore.recentTransactions.prefix(3)) { tx in
                        HStack {
                            Image(systemName: tx.type == "income" ? "arrow.down.circle.fill" : tx.type == "transfer" ? "arrow.left.arrow.right.circle.fill" : "arrow.up.circle.fill")
                                .foregroundStyle(tx.type == "income" ? AnchorPalette.success : tx.type == "transfer" ? AnchorPalette.textSecondary : AnchorPalette.danger)
                            Text(tx.title)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .fontWeight(.medium)
                            Spacer()
                            Text(tx.formattedAmount)
                                .foregroundStyle(tx.type == "income" ? AnchorPalette.success : tx.type == "transfer" ? AnchorPalette.textSecondary : AnchorPalette.danger)
                                .fontWeight(.semibold)
                        }
                        .font(.subheadline)
                    }
                }
            }
        }
    }

    // MARK: — System Status

    private var statusCard: some View {
        AnchorCard(title: "System Status", icon: "wave.3.right.circle") {
            VStack(alignment: .leading, spacing: 8) {
                statusRow("Backend Health", value: projectStateStore.healthStatus)
                statusRow("Environment", value: appState.environment.rawValue.capitalized)
                statusRow("Alerts", value: "\(projectStateStore.snapshot?.alertsCount ?? 0)")
                statusRow("In Progress", value: "\(projectStateStore.snapshot?.inProgressCount ?? 0)")
            }
        }
    }

    private func statusRow(_ label: String, value: String) -> some View {
        HStack {
            Text(label).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
