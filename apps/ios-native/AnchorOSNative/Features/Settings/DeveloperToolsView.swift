import SwiftUI

/// Parity with src/features/settings/components/DeveloperTools.tsx —
/// debug/inspect surface for the current app install. Gated by a hidden
/// long-press gesture on the About row so end-users don't stumble into it.
struct DeveloperToolsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var patternsStore: AnchorPatternsStore
    @EnvironmentObject private var recurringStore: AnchorRecurringStore

    @AppStorage("anchor_theme_mode")       private var themeMode: String = "system"
    @AppStorage("anchor_font_size")        private var fontSize: String = "Default"
    @AppStorage("anchor_ai_enabled")       private var fabricEnabled: Bool = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    envCard
                    statsCard
                    flagsCard
                    actionsCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Developer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var envCard: some View {
        AnchorCard(title: "Environment", icon: "hammer") {
            VStack(alignment: .leading, spacing: 8) {
                kv("Env", appState.environment.rawValue)
                kv("UID", appState.currentUID?.prefix(12).map(String.init).map { String($0) }.joined() ?? "—")
                kv("Bundle", Bundle.main.bundleIdentifier ?? "—")
                kv("Version", Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "—")
                kv("Build", Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "—")
            }
        }
    }

    private var statsCard: some View {
        AnchorCard(title: "Store Counts", icon: "chart.bar") {
            VStack(alignment: .leading, spacing: 8) {
                kv("Accounts", "\(financeStore.accounts.count)")
                kv("Transactions", "\(financeStore.transactions.count)")
                kv("Commitments", "\(commitmentsStore.commitments.count)")
                kv("Recurring", "\(recurringStore.recurring.count)")
                kv("Patterns", "\(patternsStore.patterns.count)")
            }
        }
    }

    private var flagsCard: some View {
        AnchorCard(title: "Flags & Settings", icon: "flag") {
            VStack(alignment: .leading, spacing: 8) {
                kv("Theme", themeMode)
                kv("Font Size", fontSize)
                kv("Fabric", fabricEnabled ? "enabled" : "disabled")
            }
        }
    }

    private var actionsCard: some View {
        AnchorCard(title: "Actions", icon: "wrench.and.screwdriver") {
            VStack(spacing: 10) {
                Button { copyDiagnostics() } label: {
                    HStack {
                        Image(systemName: "doc.on.doc")
                        Text("Copy Diagnostics to Clipboard").fontWeight(.semibold)
                    }
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .frame(maxWidth: .infinity).padding(.vertical, 10)
                    .background(AnchorPalette.chip.opacity(0.7))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)

                Button { Task { await financeStore.refresh() } } label: {
                    HStack {
                        Image(systemName: "arrow.clockwise")
                        Text("Refresh Finance Data").fontWeight(.semibold)
                    }
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .frame(maxWidth: .infinity).padding(.vertical, 10)
                    .background(AnchorPalette.chip.opacity(0.7))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func copyDiagnostics() {
        let diag = """
        env: \(appState.environment.rawValue)
        uid: \(appState.currentUID ?? "nil")
        accounts: \(financeStore.accounts.count)
        transactions: \(financeStore.transactions.count)
        commitments: \(commitmentsStore.commitments.count)
        recurring: \(recurringStore.recurring.count)
        patterns: \(patternsStore.patterns.count)
        theme: \(themeMode)
        font: \(fontSize)
        fabric: \(fabricEnabled)
        """
        UIPasteboard.general.string = diag
        ToastStore.shared.show("Diagnostics copied", style: .success)
    }

    private func kv(_ k: String, _ v: String) -> some View {
        HStack {
            Text(k.uppercased())
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(v)
                .font(.caption.monospaced())
                .foregroundStyle(AnchorPalette.textPrimary)
                .lineLimit(1)
        }
    }
}
