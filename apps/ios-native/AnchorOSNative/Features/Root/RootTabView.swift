import SwiftUI

struct RootTabView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var userProfileStore: UserProfileStore

    var body: some View {
        if appState.isAuthenticated {
            VStack(spacing: 0) {
                EnvironmentBanner(environment: appState.environment)

                TabView {
                    DashboardView()
                        .tabItem {
                            Image(systemName: "house")
                            Text("Home")
                        }

                    TasksView()
                        .tabItem {
                            Image(systemName: "checkmark.circle")
                            Text("Tasks")
                        }

                    AnchorAIView()
                        .tabItem {
                            Image(systemName: "dot.radiowaves.left.and.right")
                            Text("Anchor")
                        }

                    FinanceView()
                        .tabItem {
                            Image(systemName: "creditcard")
                            Text("Finance")
                        }

                    SettingsView()
                        .tabItem {
                            Image(systemName: "gearshape")
                            Text("Settings")
                        }
                }
                .toolbarBackground(AnchorPalette.card.opacity(0.96), for: .tabBar)
                .toolbarBackground(.visible, for: .tabBar)
            }
            .tint(AnchorPalette.chipActive)
            .task {
                await projectStateStore.refresh(for: appState.environment)
            }
            .onChange(of: appState.environment) { _, _ in
                Task {
                    await projectStateStore.refresh(for: appState.environment, force: true)
                }
            }
        } else {
            AuthView()
        }
    }
}
