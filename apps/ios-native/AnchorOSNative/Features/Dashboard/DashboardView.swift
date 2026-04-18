import SwiftUI
import UIKit

/// Dashboard — "Life at a glance" with real name, net worth, tasks + activity.
/// Data sources: UserProfileStore, FinanceStore, CommitmentsStore
struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var userProfileStore: UserProfileStore

    @State private var showAddTransaction = false
    @State private var showAddCommitment = false
    @State private var loadTimedOut = false

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 12 { return "Good morning" }
        if hour < 18 { return "Good afternoon" }
        return "Good evening"
    }

    // MARK: — Derived state (pure calculators — parity with PWA)

    private var productivity: ProductivityCalculator.Metrics {
        ProductivityCalculator.calculate(commitments: commitmentsStore.commitments)
    }

    private var beyondBasics: BeyondBasicsCalculator.Result {
        BeyondBasicsCalculator.calculate(
            accounts: financeStore.accounts,
            transactions: financeStore.transactions,
            commitments: commitmentsStore.commitments,
            themeCustomized: userProfileStore.profile?.preferences?.theme != nil,
            notificationsSet: userProfileStore.profile?.preferences?.notifications != nil,
            emailVerified: AuthService.shared.isEmailVerified,
            mfaEnabled: userProfileStore.mfaEnabled
        )
    }

    /// Top 3 incomplete daily commitments — matches PWA todaysPriorities.
    private var todaysPriorities: [AnchorCommitment] {
        commitmentsStore.commitments
            .filter { $0.type == "daily" && !$0.completed }
            .prefix(3)
            .map { $0 }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    Color.clear.frame(height: 0).id(ScrollToTopAnchor.id)
                    greetingHeader
                    BeyondBasicsCard(result: beyondBasics)
                    if loadTimedOut && financeStore.accounts.isEmpty && commitmentsStore.commitments.isEmpty {
                        AnchorErrorBanner()
                    } else {
                        DashboardSwipeSections(
                            netWorthFormatted: financeStore.netWorthFormatted,
                            accounts: financeStore.accounts,
                            metrics: productivity,
                            todaysPriorities: todaysPriorities,
                            recentTransactions: financeStore.recentTransactions,
                            environment: appState.environment.rawValue,
                            healthStatus: projectStateStore.healthStatus,
                            alertsCount: projectStateStore.snapshot?.alertsCount ?? 0,
                            inProgressCount: projectStateStore.snapshot?.inProgressCount ?? 0
                        )
                    }
                }
                .padding(16)
            }
            .scrollsToTopOnTabRetap(tab: 0)
            .background(AnchorBackground())
            .navigationTitle("Anchor OS")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                // Parity: PWA CompletionRing in dashboard header (top-right of card).
                // Native shows it in the toolbar leading slot; tapping scrolls
                // back to the Beyond Basics card which is always at the top.
                ToolbarItem(placement: .topBarLeading) {
                    AnchorCompletionRing(
                        completed: beyondBasics.completedCount,
                        total: beyondBasics.totalCount,
                        action: {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        },
                        size: 36
                    )
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button {
                            showAddTransaction = true
                        } label: {
                            Label("Add Transaction", systemImage: "plus.circle")
                        }
                        Button {
                            showAddCommitment = true
                        } label: {
                            Label("Add Commitment", systemImage: "checkmark.circle")
                        }
                    } label: {
                        Image(systemName: "plus")
                            .font(.body.weight(.semibold))
                            .foregroundStyle(AnchorPalette.textPrimary)
                    }
                }
            }
            .sheet(isPresented: $showAddTransaction) {
                AddTransactionSheet()
                    .environmentObject(financeStore)
            }
            .sheet(isPresented: $showAddCommitment) {
                AddCommitmentSheet()
                    .environmentObject(commitmentsStore)
            }
            .refreshable {
                // Haptic parity with PWA: light on start, success on complete.
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                async let a: Void = projectStateStore.refresh(for: appState.environment, force: true)
                async let b: Void = financeStore.refresh()
                async let c: Void = commitmentsStore.refresh()
                _ = await (a, b, c)
                UINotificationFeedbackGenerator().notificationOccurred(.success)
            }
            .task { await projectStateStore.refresh(for: appState.environment) }
            .task {
                try? await Task.sleep(for: .seconds(12))
                if financeStore.isLoading || commitmentsStore.isLoading { loadTimedOut = true }
            }
            .onChange(of: appState.environment) { _, _ in
                Task { await projectStateStore.refresh(for: appState.environment, force: true) }
            }
        }
        .fadeInOnAppear(duration: 0.4) // Parity: PWA dashboard cards `animate-in fade-in` 300-500ms.
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

    // MARK: — Tasks progress is now rendered by DashboardFocusSection.
    // Recent Activity + System Status are rendered by DashboardStatusSection.
    // Extractions were required to keep this file under ARCH-001's 200-line budget.
}
