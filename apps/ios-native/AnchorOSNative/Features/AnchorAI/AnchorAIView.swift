import SwiftUI

struct AnchorAIView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "Today's Brief", icon: "sparkles") {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("You're on track this week. Spending velocity is below your 30-day average.")
                                .foregroundStyle(AnchorPalette.textPrimary)
                            Text("Next: review recurring bills before Friday.")
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }

                    AnchorCard(title: "Quick Prompts", icon: "quote.bubble") {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack(spacing: 8) {
                                AnchorChip(label: "How much did I save?")
                                AnchorChip(label: "Risk this month")
                            }
                            HStack(spacing: 8) {
                                AnchorChip(label: "Family spending")
                                AnchorChip(label: "Upcoming bills")
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Anchor")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

