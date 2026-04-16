import SwiftUI

/// Step 1 of AddCommitmentSheet — frequency selector.
/// Extracted to satisfy ARCH-001.
struct AddCommitmentFrequencyStep: View {
    @Binding var type: String
    let onAdvance: () -> Void
    let onCancel: () -> Void

    private let types: [(id: String, label: String, icon: String, desc: String)] = [
        ("daily",   "Daily",   "arrow.clockwise",        "Repeats every day"),
        ("weekly",  "Weekly",  "calendar.badge.clock",   "Repeats each week"),
        ("monthly", "Monthly", "calendar",               "Repeats each month"),
        ("todo",    "One-Off", "checkmark.square",       "Do it once"),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                Text("How often?")
                    .font(.title3).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .padding(.top, 8)

                ForEach(types, id: \.id) { t in
                    Button {
                        type = t.id
                        onAdvance()
                    } label: {
                        HStack(spacing: 14) {
                            Image(systemName: t.icon)
                                .font(.title3)
                                .foregroundStyle(AnchorPalette.chipActive)
                                .frame(width: 32)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(t.label)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                    .fontWeight(.semibold)
                                Text(t.desc)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                                    .font(.caption)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                        .padding(16)
                        .background(AnchorPalette.card)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(20)
        }
        .background(AnchorBackground())
        .navigationTitle("New Commitment")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel", action: onCancel)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
        }
    }
}
