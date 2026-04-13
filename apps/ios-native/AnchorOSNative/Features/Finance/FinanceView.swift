import SwiftUI

struct FinanceView: View {
    @EnvironmentObject private var appState: AppState
    @State private var snapshot: DashboardSnapshot?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "Net Position", icon: "chart.pie") {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Migration in progress")
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .fontWeight(.semibold)
                            Text("Native account and transaction reads will be wired next.")
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .font(.footnote)
                        }
                    }

                    AnchorCard(title: "Operational Signals", icon: "waveform.path.ecg") {
                        VStack(alignment: .leading, spacing: 8) {
                            signalRow("Alerts", value: "\(snapshot?.alertsCount ?? 0)")
                            signalRow("Critical", value: "\(snapshot?.criticalAlerts ?? 0)")
                            signalRow("In Progress", value: "\(snapshot?.inProgressCount ?? 0)")
                            signalRow("Completed", value: "\(snapshot?.completedThisWeek ?? 0)")
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Finance")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await loadSnapshot()
            }
            .onChange(of: appState.environment) { _, _ in
                Task { await loadSnapshot() }
            }
        }
    }

    private func signalRow(_ name: String, value: String) -> some View {
        HStack {
            Text(name)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .foregroundStyle(AnchorPalette.textPrimary)
                .fontWeight(.semibold)
        }
    }

    private func loadSnapshot() async {
        snapshot = try? await APIClient.shared.fetchDashboardSnapshot(baseURL: appState.environment.baseURL)
    }
}

