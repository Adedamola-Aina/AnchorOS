import SwiftUI

/// Swipeable dashboard widget orchestrator.
///
/// Mirrors the PWA's dashboard widget composition while still using native
/// SwiftUI sections. Users can swipe between Overview, Focus, and Status.
struct DashboardSwipeSections: View {
    let netWorthFormatted: String
    let accounts: [AnchorAccount]
    let metrics: ProductivityCalculator.Metrics
    let todaysPriorities: [AnchorCommitment]
    let recentTransactions: [AnchorTransaction]
    let environment: String
    let healthStatus: String
    let alertsCount: Int
    let inProgressCount: Int

    @State private var page = 0

    private let titles = ["Overview", "Focus", "Status"]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(titles[page])
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)
                Spacer()
                Label("Swipe", systemImage: "hand.draw")
                    .font(.caption2)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }

            TabView(selection: $page) {
                wealthPage.tag(0)
                DashboardFocusSection(
                    metrics: metrics,
                    todaysPriorities: todaysPriorities
                )
                .tag(1)
                DashboardStatusSection(
                    recentTransactions: recentTransactions,
                    environment: environment,
                    healthStatus: healthStatus,
                    alertsCount: alertsCount,
                    inProgressCount: inProgressCount
                )
                .tag(2)
            }
            .frame(minHeight: 280, maxHeight: 360)
            .tabViewStyle(.page(indexDisplayMode: .automatic))
        }
    }

    private var wealthPage: some View {
        AnchorCard(title: "Net Worth", icon: "chart.pie.fill") {
            VStack(alignment: .leading, spacing: 8) {
                Text(netWorthFormatted)
                    .font(.title).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textPrimary)

                if accounts.isEmpty {
                    Text("Add an account to see your wealth breakdown.")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                } else {
                    HStack(spacing: 12) {
                        ForEach(Array(accounts.prefix(3).enumerated()), id: \.element.resolvedId) { idx, acc in
                            Circle()
                                .fill(acc.cardColor(at: idx))
                                .frame(width: 10, height: 10)
                            Text(acc.name)
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                }
            }
        }
    }
}
