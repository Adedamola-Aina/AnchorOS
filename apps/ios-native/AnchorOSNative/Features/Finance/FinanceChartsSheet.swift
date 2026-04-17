import SwiftUI

/// Sheet surfacing finance-level charts (Asset Distribution + Cash Flow).
/// Parity with PWA dashboard AssetDistributionChart + CashFlowChart rendering.
struct FinanceChartsSheet: View {
    @Environment(\.dismiss) private var dismiss

    let accounts: [AnchorAccount]
    let transactions: [AnchorTransaction]
    let currency: String

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AssetDistributionChart(accounts: accounts)
                    CashFlowChart(transactions: transactions, currency: currency)
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Charts")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
