import SwiftUI

/// Anchor AI screen — real Fabric engine insights + mood + weekly snapshot.
/// Data sources: FinanceStore, CommitmentsStore (no extra Firestore reads)
struct AnchorAIView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
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

                    if !insights.isEmpty {
                        insightsCard
                    }

                    snapshotCard
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

    // MARK: — Insights (computed by AnchorFabricEngine)

    private var insightsCard: some View {
        AnchorCard(title: "Insights", icon: "sparkles") {
            VStack(alignment: .leading, spacing: 14) {
                ForEach(insights) { insight in
                    HStack(alignment: .top, spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(severityColor(insight.severity).opacity(0.15))
                                .frame(width: 36, height: 36)
                            Image(systemName: insight.icon)
                                .font(.caption)
                                .foregroundStyle(severityColor(insight.severity))
                        }
                        VStack(alignment: .leading, spacing: 3) {
                            HStack(spacing: 4) {
                                Text(insight.headline)
                                    .font(.subheadline).fontWeight(.semibold)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                Text(insight.trendArrow)
                                    .font(.caption).fontWeight(.bold)
                                    .foregroundStyle(trendColor(insight.trend))
                            }
                            Text(insight.detail)
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                    if insight.id != insights.last?.id {
                        Divider().background(AnchorPalette.chip)
                    }
                }
            }
        }
    }

    // MARK: — Weekly Snapshot

    private var snapshotCard: some View {
        AnchorCard(title: "Snapshot", icon: "chart.line.uptrend.xyaxis") {
            VStack(alignment: .leading, spacing: 8) {
                row("Net worth", financeStore.netWorthFormatted)
                row("Commitments done", "\(commitmentsStore.completedCount) / \(commitmentsStore.totalCount)")
                row("Completion", "\(Int(commitmentsStore.completionPercent * 100))%")
                row("Accounts tracked", "\(financeStore.accounts.count)")
                row("Recent transactions", "\(financeStore.transactions.count)")
            }
        }
    }

    // MARK: — Helpers

    private func severityColor(_ severity: AnchorInsight.Severity) -> Color {
        switch severity {
        case .positive:  return AnchorPalette.success
        case .attention: return AnchorPalette.warning
        case .neutral:   return AnchorPalette.chipActive
        }
    }

    private func trendColor(_ trend: AnchorInsight.Trend) -> Color {
        switch trend {
        case .up:     return AnchorPalette.success
        case .down:   return AnchorPalette.danger
        case .stable: return AnchorPalette.textSecondary
        }
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
    private let prompts = ["How much did I save?", "Risk this month", "Family spending", "Upcoming bills"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Header subtitle
                    HStack {
                        Text("\(commitmentsStore.activeCount) task\(commitmentsStore.activeCount == 1 ? "" : "s") remaining")
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textSecondary)
                        Spacer()
                    }
                    .padding(.horizontal, 4)

                    todayCard
                    moodCard
                    snapshotCard
                    promptsCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor AI")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: — TODAY card (progress bar style)

    private var todayCard: some View {
        AnchorCard(title: "Today", icon: "sun.max") {
            VStack(alignment: .leading, spacing: 10) {
                let done = commitmentsStore.completedCount
                let total = commitmentsStore.totalCount
                let pct = commitmentsStore.completionPercent
                let allDone = done == total && total > 0

                // Label row
                HStack {
                    Text(allDone ? "All done!" : "\(done) of \(total) done")
                        .foregroundStyle(allDone ? AnchorPalette.success : AnchorPalette.textPrimary)
                        .fontWeight(.semibold)
                    Spacer()
                    Text("\(Int(pct * 100))%")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.caption)
                }

                // Progress bar
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(AnchorPalette.chip)
                            .frame(height: 8)
                        Capsule()
                            .fill(allDone ? AnchorPalette.success : AnchorPalette.chipActive)
                            .frame(width: max(0, geo.size.width * pct), height: 8)
                            .animation(.easeInOut(duration: 0.5), value: pct)
                    }
                }
                .frame(height: 8)

                // Remaining tasks
                if commitmentsStore.activeCount > 0 {
                    HStack(spacing: 8) {
                        Image(systemName: "circle")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                        Text("\(commitmentsStore.activeCount) task\(commitmentsStore.activeCount == 1 ? "" : "s") remaining")
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textSecondary)
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
                            Task {
                                try? await moodService.saveMood(uid: uid, mood: m.label.lowercased())
                            }
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

    // MARK: — Weekly Snapshot

    private var snapshotCard: some View {
        AnchorCard(title: "Weekly Snapshot", icon: "chart.line.uptrend.xyaxis") {
            VStack(alignment: .leading, spacing: 8) {
                row("Net worth", financeStore.netWorthFormatted)
                row("Commitments done", "\(commitmentsStore.completedCount) / \(commitmentsStore.totalCount)")
                row("Completion", "\(Int(commitmentsStore.completionPercent * 100))%")
                row("Accounts tracked", "\(financeStore.accounts.count)")
                row("Transactions (recent)", "\(financeStore.transactions.count)")
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
                    Text("Selected: \(selectedPrompt)")
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
