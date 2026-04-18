import SwiftUI

/// Simple monthly review surface for Fabric parity.
struct MonthlyReviewSheet: View {
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "Monthly Review", icon: "calendar.badge.clock") {
                        VStack(alignment: .leading, spacing: 10) {
                            reviewRow("Net Worth", financeStore.netWorthFormatted)
                            reviewRow("Transactions", "\(financeStore.transactions.count)")
                            reviewRow("Completed Tasks", "\(commitmentsStore.completedCount)")
                            reviewRow("Active Tasks", "\(commitmentsStore.activeCount)")
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Monthly Review")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } } }
        }
    }

    private func reviewRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).fontWeight(.semibold).foregroundStyle(AnchorPalette.textPrimary)
        }
    }
}
