import SwiftUI

/// Beyond Basics — 6-item checklist mirroring PWA BEYOND_BASICS_ITEMS.
/// Renders BeyondBasicsCalculator.Result; consumer is responsible for
/// computing the signals from the appropriate stores.
struct BeyondBasicsCard: View {
    let result: BeyondBasicsCalculator.Result

    @AppStorage("beyondBasicsDismissed") private var dismissed = false

    var body: some View {
        if dismissed { EmptyView() } else {
            AnchorCard(title: "Getting Started", icon: "sparkles") {
                VStack(spacing: 12) {
                    progressBar
                    ForEach(result.items) { item in
                        stepRow(item)
                    }
                    if result.allComplete {
                        Button("Dismiss") { dismissed = true }
                            .font(.footnote).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.chipActive)
                            .frame(maxWidth: .infinity, alignment: .trailing)
                            .padding(.top, 4)
                    }
                }
            }
        }
    }

    private var progressBar: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("\(result.completedCount) of \(result.totalCount) complete")
                    .font(.caption).foregroundStyle(AnchorPalette.textSecondary)
                Spacer()
                Text("\(Int(result.progress * 100))%")
                    .font(.caption).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(AnchorPalette.chip).frame(height: 6)
                    Capsule()
                        .fill(AnchorPalette.chipActive)
                        .frame(width: geo.size.width * result.progress, height: 6)
                        .animation(.spring(duration: 0.4), value: result.completedCount)
                }
            }
            .frame(height: 6)
        }
    }

    private func stepRow(_ item: BeyondBasicsCalculator.Item) -> some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(item.completed ? AnchorPalette.success.opacity(0.15) : AnchorPalette.chip)
                    .frame(width: 36, height: 36)
                Image(systemName: item.completed ? "checkmark" : item.icon)
                    .font(.caption).fontWeight(.semibold)
                    .foregroundStyle(item.completed ? AnchorPalette.success : AnchorPalette.textSecondary)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(item.label)
                    .font(.subheadline)
                    .foregroundStyle(item.completed ? AnchorPalette.textSecondary : AnchorPalette.textPrimary)
                    .strikethrough(item.completed, color: AnchorPalette.textSecondary)
                Text(item.description)
                    .font(.caption2)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .lineLimit(1)
            }
            Spacer()
        }
    }
}
import SwiftUI

/// Beyond Basics — post-onboarding checklist matching PWA "Getting Started" card.
/// Shows until all steps are complete, then dismisses (stored in UserDefaults).
struct BeyondBasicsCard: View {
    let hasAccount: Bool
    let hasTransaction: Bool
    let hasCommitment: Bool
    let mfaEnabled: Bool

    @AppStorage("beyondBasicsDismissed") private var dismissed = false

    private var steps: [(label: String, icon: String, done: Bool)] {
        [
            ("Add your first account",      "building.columns",   hasAccount),
            ("Record your first transaction","arrow.up.arrow.down",hasTransaction),
            ("Create a commitment",          "checkmark.circle",   hasCommitment),
            ("Enable two-factor auth",       "lock.shield",        mfaEnabled),
        ]
    }

    private var completedCount: Int { steps.filter(\.done).count }
    private var allDone: Bool { completedCount == steps.count }

    var body: some View {
        if dismissed { EmptyView() } else {
            AnchorCard(title: "Getting Started", icon: "sparkles") {
                VStack(spacing: 12) {
                    progressBar
                    ForEach(steps, id: \.label) { step in
                        stepRow(step)
                    }
                    if allDone {
                        Button("Dismiss") { dismissed = true }
                            .font(.footnote).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.chipActive)
                            .frame(maxWidth: .infinity, alignment: .trailing)
                            .padding(.top, 4)
                    }
                }
            }
        }
    }

    private var progressBar: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("\(completedCount) of \(steps.count) complete")
                    .font(.caption).foregroundStyle(AnchorPalette.textSecondary)
                Spacer()
                Text("\(Int(Double(completedCount) / Double(steps.count) * 100))%")
                    .font(.caption).fontWeight(.semibold).foregroundStyle(AnchorPalette.textPrimary)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(AnchorPalette.chip).frame(height: 6)
                    Capsule()
                        .fill(AnchorPalette.chipActive)
                        .frame(width: geo.size.width * (Double(completedCount) / Double(steps.count)), height: 6)
                        .animation(.spring(duration: 0.4), value: completedCount)
                }
            }
            .frame(height: 6)
        }
    }

    private func stepRow(_ step: (label: String, icon: String, done: Bool)) -> some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(step.done ? AnchorPalette.success.opacity(0.15) : AnchorPalette.chip)
                    .frame(width: 36, height: 36)
                Image(systemName: step.done ? "checkmark" : step.icon)
                    .font(.caption).fontWeight(.semibold)
                    .foregroundStyle(step.done ? AnchorPalette.success : AnchorPalette.textSecondary)
            }
            Text(step.label)
                .font(.subheadline)
                .foregroundStyle(step.done ? AnchorPalette.textSecondary : AnchorPalette.textPrimary)
                .strikethrough(step.done, color: AnchorPalette.textSecondary)
            Spacer()
        }
    }
}
