import SwiftUI

/// Extracted from DashboardView to satisfy ARCH-001.
/// Renders the lower two cards: Recent Activity (PWA RecentActivityWidget
/// parity) and System Status (native-only debug surface).
struct DashboardStatusSection: View {
    let recentTransactions: [AnchorTransaction]
    let environment: String
    let healthStatus: String
    let alertsCount: Int
    let inProgressCount: Int

    var body: some View {
        VStack(spacing: 16) {
            recentActivityCard
            statusCard
        }
    }

    private var recentActivityCard: some View {
        AnchorCard(title: "Recent Activity", icon: "clock.arrow.circlepath") {
            if recentTransactions.isEmpty {
                Text("No recent transactions.")
                    .foregroundStyle(AnchorPalette.textSecondary).font(.subheadline)
            } else {
                VStack(spacing: 8) {
                    ForEach(recentTransactions.prefix(5)) { tx in
                        activityRow(tx)
                    }
                }
            }
        }
    }

    private func activityRow(_ tx: AnchorTransaction) -> some View {
        let iconName: String
        let color: Color
        switch tx.type {
        case "income":   iconName = "arrow.down.circle.fill"; color = AnchorPalette.success
        case "transfer": iconName = "arrow.left.arrow.right.circle.fill"; color = AnchorPalette.textSecondary
        default:         iconName = "arrow.up.circle.fill"; color = AnchorPalette.danger
        }
        return HStack {
            Image(systemName: iconName).foregroundStyle(color)
            Text(tx.title)
                .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.medium)
            Spacer()
            Text(tx.formattedAmount)
                .foregroundStyle(color).fontWeight(.semibold)
        }
        .font(.subheadline)
    }

    private var statusCard: some View {
        AnchorCard(title: "System Status", icon: "wave.3.right.circle") {
            VStack(alignment: .leading, spacing: 8) {
                statusRow("Backend Health", value: healthStatus)
                statusRow("Environment", value: environment.capitalized)
                statusRow("Alerts", value: "\(alertsCount)")
                statusRow("In Progress", value: "\(inProgressCount)")
            }
        }
    }

    private func statusRow(_ label: String, value: String) -> some View {
        HStack {
            Text(label).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
