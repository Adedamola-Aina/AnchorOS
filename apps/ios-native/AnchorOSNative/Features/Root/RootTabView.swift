import SwiftUI

struct RootTabView: View {
    @EnvironmentObject private var appState: AppState

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
            }
            .tint(AnchorPalette.chipActive)
        } else {
            AuthView()
        }
    }
}

private struct SettingsView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        NavigationStack {
            Form {
                Section("Environment") {
                    Picker("Target", selection: Binding(
                        get: { appState.environment },
                        set: { appState.setEnvironment($0) }
                    )) {
                        ForEach(AppEnvironment.allCases, id: \.self) { environment in
                            Text(environment.rawValue.capitalized).tag(environment)
                        }
                    }
                }

                Section("Status") {
                    Text(appState.statusMessage)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section {
                    Button("Sign Out") {
                        appState.signOut()
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}
