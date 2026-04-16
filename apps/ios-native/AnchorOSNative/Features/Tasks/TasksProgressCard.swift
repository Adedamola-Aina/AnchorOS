import SwiftUI

/// Circular progress + count summary extracted from TasksView (ARCH-001).
/// Consumes pre-computed metrics from CommitmentsStore.
struct TasksProgressCard: View {
    let completed: Int
    let total: Int
    let active: Int
    let percent: Double

    var body: some View {
        AnchorCard(title: "Progress", icon: "chart.bar") {
            HStack(spacing: 16) {
                ZStack {
                    Circle().stroke(AnchorPalette.chip, lineWidth: 6)
                    Circle()
                        .trim(from: 0, to: percent)
                        .stroke(AnchorPalette.chipActive, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                        .animation(.easeInOut, value: percent)
                }
                .frame(width: 48, height: 48)

                VStack(alignment: .leading, spacing: 4) {
                    Text("\(completed) of \(total) complete")
                        .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
                    Text("\(active) remaining")
                        .foregroundStyle(AnchorPalette.textSecondary).font(.footnote)
                }
                Spacer()
                Text("\(Int(percent * 100))%")
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .font(.title3).fontWeight(.bold)
            }
        }
    }
}
