import SwiftUI

/// Anchor AI screen — Fabric briefing, weekly snapshot, and prompts.
/// Data sources: FinanceStore + CommitmentsStore (real numbers, AI copy is aspirational)
struct AnchorAIView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @State private var selectedPrompt: String = ""

    private let prompts = ["How much did I save?", "Risk this month", "Family spending", "Upcoming bills"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Brief", "Insights", "Predictions", "Prompts"])
                    briefCard
                    snapshotCard
                    promptsCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor AI")
            .navigationBarTitleDisplayMode(.inline)
            .task { await projectStateStore.refresh(for: appState.environment) }
        }
    }

    // MARK: — Brief

    private var briefCard: some View {
        AnchorCard(title: "Today's Brief", icon: "sparkles") {
            VStack(alignment: .leading, spacing: 8) {
                let completionPct = Int(commitmentsStore.completionPercent * 100)
                Text(completionPct >= 50
                     ? "You're on track this week. Spending velocity looks steady."
                     : "\(commitmentsStore.activeCount) commitment\(commitmentsStore.activeCount == 1 ? "" : "s") still open — you've got this.")
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text("\(financeStore.accounts.count) account\(financeStore.accounts.count == 1 ? "" : "s") tracked • \(commitmentsStore.totalCount) commitment\(commitmentsStore.totalCount == 1 ? "" : "s")")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.footnote)
            }
        }
    }

    // MARK: — Weekly Snapshot

    private var snapshotCard: some View {
        AnchorCard(title: "Weekly Snapshot", icon: "chart.line.uptrend.xyaxis") {
            VStack(alignment: .leading, spacing: 8) {
                row("Net worth", financeStore.netWorthFormatted)
                row("Commitments done", "\(commitmentsStore.completedCount) / \(commitmentsStore.totalCount)")
                row("Active remaining", "\(commitmentsStore.activeCount)")
                row("Completion", "\(Int(commitmentsStore.completionPercent * 100))%")
                row("Accounts tracked", "\(financeStore.accounts.count)")
                row("Transactions (recent)", "\(financeStore.transactions.count)")
                row("Critical alerts", "\(projectStateStore.snapshot?.criticalAlerts ?? 0)")
            }
        }
    }

    // MARK: — Quick Prompts

    private var promptsCard: some View {
        AnchorCard(title: "Quick Prompts", icon: "quote.bubble") {
            VStack(alignment: .leading, spacing: 12) {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                    ForEach(prompts, id: \.self) { p in
                        promptChip(p)
                    }
                }
                if !selectedPrompt.isEmpty {
                    Text(""\(selectedPrompt)"")
                        .font(.footnote)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .italic()
                        .padding(.top, 4)
                    Text("Natural language query support coming in Sprint 3.")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary.opacity(0.7))
                }
            }
        }
    }

    private func promptChip(_ label: String) -> some View {
        Button { selectedPrompt = label } label: {
            Text(label)
                .font(.subheadline)
                .foregroundStyle(selectedPrompt == label ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 14).padding(.vertical, 10)
                .frame(maxWidth: .infinity)
                .background(selectedPrompt == label ? AnchorPalette.chipActive : AnchorPalette.chip)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    private func row(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
