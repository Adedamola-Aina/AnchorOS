import SwiftUI

/// Anchor AI screen — real Fabric engine insights + mood + weekly snapshot.
/// Data sources: FinanceStore, CommitmentsStore (no extra Firestore reads)
struct AnchorAIView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var fabricStore: AnchorFabricStore
    @State private var selectedMood: Int? = nil

    private let moodService = FamilyService()

    private struct MoodOption: Identifiable {
        let id: Int; let emoji: String; let label: String
    }
    private let moods = [
        MoodOption(id: 1, emoji: "😔", label: "Rough"),
        MoodOption(id: 2, emoji: "😕", label: "Okay-ish"),
        MoodOption(id: 3, emoji: "😐", label: "Alright"),
        MoodOption(id: 4, emoji: "🙂", label: "Good"),
        MoodOption(id: 5, emoji: "😄", label: "Great"),
    ]

    private var insights: [AnchorInsight] {
        AnchorFabricEngine.buildInsights(
            transactions: financeStore.transactions,
            accounts: financeStore.accounts,
            commitments: commitmentsStore.commitments
        )
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    HStack {
                        Text("\(commitmentsStore.activeCount) task\(commitmentsStore.activeCount == 1 ? "" : "s") remaining")
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textSecondary)
                        Spacer()
                    }
                    .padding(.horizontal, 4)

                    todayCard
                    moodCard

                    FabricQuerySection(
                        text: Binding(
                            get: { fabricStore.queryText },
                            set: { fabricStore.queryText = $0 }
                        ),
                        isQuerying: fabricStore.isQuerying,
                        result: fabricStore.queryResult,
                        onSubmit: { fabricStore.submitQuery(fabricStore.queryText) },
                        onPrompt: { fabricStore.runPrompt($0) },
                        onGenerateWeeklyReport: {
                            fabricStore.runPrompt("generate weekly report")
                        },
                        onAction: { kind in
                            switch kind {
                            case .navigate(let page): appState.navigate(to: page)
                            case .generateWeeklyReport:
                                fabricStore.runPrompt("generate weekly report")
                            case .openAddTransaction:
                                // Phase 4e-2: record_expense / record_income
                                // intents route to Finance where the Add
                                // Transaction sheet lives. Future work can
                                // pipe the parsed amount/category directly
                                // into that sheet via AppState.
                                appState.navigate(to: "finance")
                            }
                        }
                    )

                    FabricUpcomingCard(
                        items: fabricStore.upcoming,
                        currency: financeStore.transactions.first?.currency ?? "NGN"
                    )

                    if let q = fabricStore.proactiveQuestion {
                        FabricProactiveQuestionCard(
                            question: q,
                            onTap: { question in
                                // Phase 4e: route the question into the query
                                // input for NLP handling.
                                fabricStore.runPrompt(question.question)
                                fabricStore.dismissQuestion()
                            },
                            onDismiss: { _ in fabricStore.dismissQuestion() }
                        )
                    }

                    FabricPredictionsSection(
                        predictions: fabricStore.predictions,
                        onAction: { prediction in
                            if let target = prediction.action?.navigateTo {
                                appState.navigate(to: target)
                            }
                            fabricStore.dismiss(prediction.id)
                        },
                        onDismiss: { prediction in
                            fabricStore.dismiss(prediction.id)
                        }
                    )

                    if !insights.isEmpty {
                        AnchorAIInsightsCard(insights: insights)
                    }

                    FabricWeeklySnapshotSection(report: fabricStore.weeklyReport)
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor AI")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: — TODAY card

    private var todayCard: some View {
        AnchorCard(title: "Today", icon: "sun.max") {
            VStack(alignment: .leading, spacing: 10) {
                let done = commitmentsStore.completedCount
                let total = commitmentsStore.totalCount
                let pct = commitmentsStore.completionPercent
                let allDone = done == total && total > 0

                HStack {
                    Text(allDone ? "All done!" : "\(done) of \(total) done")
                        .foregroundStyle(allDone ? AnchorPalette.success : AnchorPalette.textPrimary)
                        .fontWeight(.semibold)
                    Spacer()
                    Text("\(Int(pct * 100))%")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.caption)
                }

                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule().fill(AnchorPalette.chip).frame(height: 8)
                        Capsule()
                            .fill(allDone ? AnchorPalette.success : AnchorPalette.chipActive)
                            .frame(width: max(0, geo.size.width * pct), height: 8)
                            .animation(.easeInOut(duration: 0.5), value: pct)
                    }
                }
                .frame(height: 8)

                if commitmentsStore.activeCount > 0 {
                    HStack(spacing: 8) {
                        Image(systemName: "circle").font(.caption).foregroundStyle(AnchorPalette.textSecondary)
                        Text("\(commitmentsStore.activeCount) task\(commitmentsStore.activeCount == 1 ? "" : "s") remaining")
                            .font(.subheadline).foregroundStyle(AnchorPalette.textSecondary)
                    }
                }
            }
        }
    }

    // MARK: — Mood card

    private var moodCard: some View {
        AnchorCard(title: "How are you feeling?", icon: "face.smiling") {
            HStack(spacing: 0) {
                ForEach(moods) { m in
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) { selectedMood = m.id }
                        if let uid = appState.currentUID {
                            Task { try? await moodService.saveMood(uid: uid, mood: m.label.lowercased()) }
                        }
                    } label: {
                        VStack(spacing: 4) {
                            Text(m.emoji)
                                .font(.title2)
                                .scaleEffect(selectedMood == m.id ? 1.25 : 1.0)
                                .animation(.spring(response: 0.3, dampingFraction: 0.6), value: selectedMood)
                            Text(m.label)
                                .font(.caption2)
                                .foregroundStyle(selectedMood == m.id ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(selectedMood == m.id ? AnchorPalette.chipActive.opacity(0.2) : Color.clear)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: — Insights rendered by AnchorAIInsightsCard (extracted for ARCH-001).
    // MARK: — Weekly Snapshot rendered by FabricWeeklySnapshotSection (extracted, Phase 4c).
    // MARK: — Upcoming rendered by FabricUpcomingCard (extracted, Phase 4c).
}
