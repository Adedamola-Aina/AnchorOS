import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @State private var selectedTheme: String = "Auto"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    dashboardHeader
                    sectionChips
                    profileCard
                    appearanceCard
                    statusCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor OS")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await projectStateStore.refresh(for: appState.environment)
            }
            .onChange(of: appState.environment) { _, _ in
                Task {
                    await projectStateStore.refresh(for: appState.environment, force: true)
                }
            }
        }
    }

    private var sectionChips: some View {
        AnchorSectionTabs(labels: ["Profile", "Theme", "Security", "Alerts", "AI", "Family"])
    }

    private var dashboardHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(appState.environment.rawValue.uppercased() + " ENVIRONMENT")
                .font(.caption)
                .fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)

            Text("Welcome back")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textPrimary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var profileCard: some View {
        AnchorCard(title: "Profile", icon: "person.crop.circle") {
            VStack(alignment: .leading, spacing: 10) {
                Text("Alex Owner")
                    .font(.headline)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text("test-owner")
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                Text("EMAIL & PASSWORD")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(AnchorPalette.chip)
                    .clipShape(Capsule())
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
        }
    }

    private var appearanceCard: some View {
        AnchorCard(title: "Appearance", icon: "paintbrush") {
            VStack(alignment: .leading, spacing: 14) {
                Text("VISUAL THEME")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)
                HStack(spacing: 8) {
                    themeButton("Light")
                    themeButton("Auto")
                    themeButton("Dark")
                }
            }
        }
    }

    private var statusCard: some View {
        AnchorCard(title: "System Status", icon: "wave.3.right.circle") {
            VStack(alignment: .leading, spacing: 8) {
                statusRow("Backend Health", value: projectStateStore.healthStatus)
                statusRow("Auth", value: appState.isAuthenticated ? "Signed in" : "Signed out")
                statusRow("Environment", value: appState.environment.rawValue.capitalized)
                statusRow("Alerts", value: "\(projectStateStore.snapshot?.alertsCount ?? 0)")
                statusRow("Critical Alerts", value: "\(projectStateStore.snapshot?.criticalAlerts ?? 0)")
                statusRow("Completed This Week", value: "\(projectStateStore.snapshot?.completedThisWeek ?? 0)")
                statusRow("In Progress", value: "\(projectStateStore.snapshot?.inProgressCount ?? 0)")
                statusRow("Fn Coverage", value: functionCoverageText)
                Text(appState.statusMessage)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.top, 4)
            }
        }
    }

    private func statusRow(_ label: String, value: String) -> some View {
        HStack {
            Text(label)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .foregroundStyle(AnchorPalette.textPrimary)
                .fontWeight(.semibold)
        }
        .font(.subheadline)
    }

    private func themeButton(_ label: String) -> some View {
        Button {
            selectedTheme = label
        } label: {
            Text(label.uppercased())
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundStyle(selectedTheme == label ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(selectedTheme == label ? AnchorPalette.chipActive : AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    private var functionCoverageText: String {
        if let pct = projectStateStore.snapshot?.functionCoveragePct {
            return String(format: "%.2f%%", pct)
        }
        return projectStateStore.snapshot == nil ? "Unavailable" : "N/A"
    }
}
