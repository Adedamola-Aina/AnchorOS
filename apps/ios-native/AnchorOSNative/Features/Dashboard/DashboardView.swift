import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @State private var healthStatusText: String = "Checking..."
    @State private var selectedTheme: String = "Auto"
    @State private var alertCount: Int = 0
    @State private var criticalAlertCount: Int = 0
    @State private var completedThisWeek: Int = 0
    @State private var inProgressCount: Int = 0
    @State private var functionCoverageText: String = "N/A"

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
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Anchor OS")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await loadHealth()
                await loadProjectState()
            }
            .onChange(of: appState.environment) { _, _ in
                Task {
                    await loadHealth()
                    await loadProjectState()
                }
            }
        }
    }

    private var sectionChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                chip("Profile")
                chip("Theme")
                chip("Security")
                chip("Alerts")
                chip("AI")
                chip("Family")
            }
        }
    }

    private func chip(_ label: String) -> some View {
        Text(label)
            .font(.subheadline)
            .foregroundStyle(AnchorPalette.textSecondary)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(AnchorPalette.chip)
            .clipShape(Capsule())
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
                statusRow("Backend Health", value: healthStatusText)
                statusRow("Auth", value: appState.isAuthenticated ? "Signed in" : "Signed out")
                statusRow("Environment", value: appState.environment.rawValue.capitalized)
                statusRow("Alerts", value: "\(alertCount)")
                statusRow("Critical Alerts", value: "\(criticalAlertCount)")
                statusRow("Completed This Week", value: "\(completedThisWeek)")
                statusRow("In Progress", value: "\(inProgressCount)")
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

    private func loadHealth() async {
        do {
            let health = try await APIClient.shared.fetchHealth(baseURL: appState.environment.baseURL)
            healthStatusText = health.ok ? "Healthy" : "Unhealthy"
        } catch {
            healthStatusText = "Unavailable"
        }
    }

    private func loadProjectState() async {
        do {
            let snapshot = try await APIClient.shared.fetchDashboardSnapshot(baseURL: appState.environment.baseURL)
            alertCount = snapshot.alertsCount
            criticalAlertCount = snapshot.criticalAlerts
            completedThisWeek = snapshot.completedThisWeek
            inProgressCount = snapshot.inProgressCount
            if let pct = snapshot.functionCoveragePct {
                functionCoverageText = String(format: "%.2f%%", pct)
            } else {
                functionCoverageText = "N/A"
            }
        } catch {
            alertCount = 0
            criticalAlertCount = 0
            completedThisWeek = 0
            inProgressCount = 0
            functionCoverageText = "Unavailable"
        }
    }
}

private struct AnchorCard<Content: View>: View {
    let title: String
    let icon: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text(title)
                    .font(.headline)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }
            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.card)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}
