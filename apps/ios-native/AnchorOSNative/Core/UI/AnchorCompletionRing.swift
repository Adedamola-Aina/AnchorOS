import SwiftUI

// MARK: - AnchorCompletionRing
// SwiftUI port of src/features/dashboard/components/CompletionRing.tsx.
// Displays in the Dashboard navigation bar's trailing area.
// Rose-red progressive arc + subtle 3s glow pulse; disappears when all done.
//
// Parity mapping:
//   • completed/total           → same props
//   • size (default 44pt)       → matches 44px PWA default + HIG touch target
//   • stroke rose-500           → AnchorPalette.danger (rose/red tone used across OS)
//   • track slate-200/700       → AnchorPalette.chip
//   • 3s ring-glow              → .scaleEffect + opacity pulse, gated by Reduce Motion
//   • 700ms arc progress tween  → withAnimation(.easeInOut(0.7))
//   • "ring disappears when all done" → returns EmptyView() once completed >= total
struct AnchorCompletionRing: View {
    let completed: Int
    let total: Int
    let action: () -> Void
    var size: CGFloat = 44

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var pulse = false

    private var progress: Double {
        guard total > 0 else { return 0 }
        return min(1, max(0, Double(completed) / Double(total)))
    }

    private var allDone: Bool { total > 0 && completed >= total }

    var body: some View {
        if allDone {
            EmptyView()
        } else {
            Button(action: action) {
                ZStack {
                    Circle()
                        .stroke(AnchorPalette.chip, lineWidth: 3)
                        .frame(width: size - 6, height: size - 6)

                    Circle()
                        .trim(from: 0, to: CGFloat(progress))
                        .stroke(
                            AnchorPalette.danger,
                            style: StrokeStyle(lineWidth: 3.5, lineCap: .round)
                        )
                        .frame(width: size - 6, height: size - 6)
                        .rotationEffect(.degrees(-90))
                        .animation(.easeInOut(duration: 0.7), value: progress)

                    Text("\(completed)/\(total)")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(AnchorPalette.danger)
                }
                .frame(width: size, height: size)
                .scaleEffect(pulse && !reduceMotion ? 1.06 : 1.0)
                .opacity(pulse && !reduceMotion ? 0.92 : 1.0)
                .animation(
                    reduceMotion
                        ? nil
                        : .easeInOut(duration: 1.5).repeatForever(autoreverses: true),
                    value: pulse
                )
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Onboarding progress: \(completed) of \(total) complete")
            .onAppear {
                if !reduceMotion { pulse = true }
            }
        }
    }
}
