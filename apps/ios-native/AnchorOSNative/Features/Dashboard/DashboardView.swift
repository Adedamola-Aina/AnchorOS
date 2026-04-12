import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @State private var healthStatusText: String = "Checking..."

    var body: some View {
        NavigationStack {
            List {
                Section("Environment") {
                    Text(appState.environment.rawValue.capitalized)
                }

                Section("Backend Health") {
                    Text(healthStatusText)
                }
            }
            .navigationTitle("Dashboard")
            .task {
                await loadHealth()
            }
        }
    }

    private func loadHealth() async {
        do {
            let health = try await APIClient.shared.fetchHealth(baseURL: appState.environment.baseURL)
            healthStatusText = health.ok ? "Healthy" : "Unhealthy"
        } catch {
            healthStatusText = "Unavailable"
        }
    }
}
