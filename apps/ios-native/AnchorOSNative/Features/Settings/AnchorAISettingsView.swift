import SwiftUI

/// Parity with src/features/settings/components/AnchorAISettings.tsx +
/// AnchorAIKnowledgePanel.tsx — a single sheet hosting fabric preferences
/// and the learned-patterns inspection panel.
///
/// Scope: UI surface + AppStorage-persisted flags. Backend roundtrip for
/// `settings.enabled`/`settings.dailyBriefing` is device-scoped until the
/// profile schema grows a fabric-prefs map.
struct AnchorAISettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var patternsStore: AnchorPatternsStore

    @AppStorage("anchor_ai_enabled")          private var fabricEnabled: Bool = true
    @AppStorage("anchor_ai_daily_briefing")   private var dailyBriefing: Bool = true
    @AppStorage("anchor_ai_proactive")        private var proactiveQuestions: Bool = true

    @State private var showKnowledge: Bool = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    prefsCard
                    knowledgeCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor AI")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var prefsCard: some View {
        AnchorCard(title: "Fabric Preferences", icon: "sparkles") {
            VStack(spacing: 14) {
                row(title: "Enable Anchor AI",
                    subtitle: "Your personal intelligence assistant",
                    isOn: $fabricEnabled)
                Divider().background(AnchorPalette.cardBorder)
                row(title: "Daily Briefing",
                    subtitle: "Morning summary of upcoming commitments and bills",
                    isOn: $dailyBriefing)
                Divider().background(AnchorPalette.cardBorder)
                row(title: "Proactive Questions",
                    subtitle: "Occasional nudges based on your patterns",
                    isOn: $proactiveQuestions)
            }
        }
    }

    private func row(title: String, subtitle: String, isOn: Binding<Bool>) -> some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            Spacer()
            Toggle("", isOn: isOn)
                .labelsHidden()
                .tint(AnchorPalette.chipActive)
        }
    }

    private var knowledgeCard: some View {
        AnchorCard(title: "Knowledge", icon: "brain.head.profile") {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Learned Patterns")
                            .font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("\(patternsStore.patterns.count) patterns")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                    Button(showKnowledge ? "Hide" : "Show") {
                        withAnimation(.easeInOut(duration: 0.25)) {
                            showKnowledge.toggle()
                        }
                    }
                    .buttonStyle(.bordered)
                    .tint(AnchorPalette.chipActive)
                }

                if showKnowledge {
                    if patternsStore.patterns.isEmpty {
                        Text("No patterns learned yet. Keep using Anchor — insights will appear here.")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                            .padding(.vertical, 8)
                    } else {
                        VStack(spacing: 0) {
                            ForEach(Array(patternsStore.patterns.enumerated()), id: \.element.id) { (idx, p) in
                                if idx > 0 {
                                    Divider().background(AnchorPalette.cardBorder)
                                }
                                patternRow(p)
                            }
                        }
                        .createSlideIn()
                    }
                }
            }
        }
    }

    private func patternRow(_ p: AnchorUserPattern) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "circle.hexagonpath.fill")
                .font(.caption)
                .foregroundStyle(AnchorPalette.chipActive)
                .padding(.top, 2)
            VStack(alignment: .leading, spacing: 2) {
                Text("\(p.triggerKind.rawValue.replacingOccurrences(of: "_", with: " ").capitalized) → \(p.actionKind.rawValue.replacingOccurrences(of: "_", with: " ").capitalized)")
                    .font(.caption).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text("Confidence \(Int(round(p.confidence * 100)))% • Seen \(p.frequency)×")
                    .font(.caption2)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            Spacer()
        }
        .padding(.vertical, 6)
    }
}
