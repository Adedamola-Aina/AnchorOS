import Foundation

@MainActor
final class ProjectStateStore: ObservableObject {
    @Published private(set) var healthStatus: String = "Checking..."
    @Published private(set) var snapshot: DashboardSnapshot?
    @Published private(set) var isLoading: Bool = false
    @Published private(set) var lastEnvironment: AppEnvironment?

    func refresh(for environment: AppEnvironment, force: Bool = false) async {
        if !force, lastEnvironment == environment, snapshot != nil {
            return
        }

        isLoading = true
        defer { isLoading = false }

        do {
            async let health = APIClient.shared.fetchHealth(baseURL: environment.baseURL)
            async let dashboard = APIClient.shared.fetchDashboardSnapshot(baseURL: environment.baseURL)

            let healthResponse = try await health
            let dashboardSnapshot = try await dashboard

            healthStatus = healthResponse.ok ? "Healthy" : "Unhealthy"
            snapshot = dashboardSnapshot
            lastEnvironment = environment
        } catch {
            healthStatus = "Unavailable"
            snapshot = nil
            lastEnvironment = environment
        }
    }
}
