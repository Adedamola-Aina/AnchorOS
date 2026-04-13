import SwiftUI

struct RootTabView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var userProfileStore: UserProfileStore

    @State private var needsOnboarding: Bool = !UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")

    var body: some View {
        if appState.isAuthenticated && needsOnboarding {
            OnboardingView()
                .environmentObject(appState)
                .environmentObject(userProfileStore)
                .environmentObject(financeStore)
                .environmentObject(commitmentsStore)
                .onChange(of: UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")) { _, completed in
                    if completed { needsOnboarding = false }
                }
                .onReceive(NotificationCenter.default.publisher(for: UserDefaults.didChangeNotification)) { _ in
                    if UserDefaults.standard.bool(forKey: "hasCompletedOnboarding") {
                        needsOnboarding = false
                    }
                }
        } else if appState.isAuthenticated {
            ZStack(alignment: .bottom) {
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

                // Global toast overlay — sits above tab bar
                AnchorToastOverlay()
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
