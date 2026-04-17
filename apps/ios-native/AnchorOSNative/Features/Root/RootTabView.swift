import SwiftUI
import UIKit

struct RootTabView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @StateObject private var tabScroll = TabScrollCoordinator()

    @State private var needsOnboarding: Bool = !UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")

    /// Re-tap-aware binding. Setting the same tab as currently-selected
    /// emits a scroll-to-top request instead of a tab change — parity
    /// with PWA BottomNavigation.
    private var tabBinding: Binding<Int> {
        Binding(
            get: { appState.selectedTab },
            set: { newValue in
                if newValue == appState.selectedTab {
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    tabScroll.requestScrollToTop(tab: newValue)
                } else {
                    appState.selectedTab = newValue
                }
            }
        )
    }

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

                    TabView(selection: tabBinding) {
                        DashboardView()
                            .tabItem {
                                Image(systemName: "house")
                                Text("Home")
                            }
                            .tag(0)

                        TasksView()
                            .tabItem {
                                Image(systemName: "checkmark.circle")
                                Text("Tasks")
                            }
                            .tag(1)

                        AnchorAIView()
                            .tabItem {
                                Image(systemName: "dot.radiowaves.left.and.right")
                                Text("Anchor")
                            }
                            .tag(2)

                        FinanceView()
                            .tabItem {
                                Image(systemName: "creditcard")
                                Text("Finance")
                            }
                            .tag(3)

                        SettingsView()
                            .tabItem {
                                Image(systemName: "gearshape")
                                Text("Settings")
                            }
                            .tag(4)
                    }
                    .toolbarBackground(AnchorPalette.card.opacity(0.96), for: .tabBar)
                    .toolbarBackground(.visible, for: .tabBar)
                    .onChange(of: appState.selectedTab) { _, _ in
                        // Parity: PWA BottomNavigation fires haptic.selection on tab change.
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    }
                }

                // Global toast overlay — sits above tab bar
                AnchorToastOverlay()
            }
            .tint(AnchorPalette.chipActive)
            .environmentObject(tabScroll)
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
