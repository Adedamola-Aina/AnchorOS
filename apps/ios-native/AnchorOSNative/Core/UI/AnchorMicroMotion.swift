import SwiftUI

/// Native port of src/animations/microInteractions.ts (`microMotion`).
///
/// Parity: these are the four named variants framer-motion uses on key
/// financial state changes. Matching them on iOS keeps muscle-memory
/// consistent between PWA and native.
///
/// All animations respect `@Environment(\.accessibilityReduceMotion)` —
/// when the user has Reduce Motion enabled, each modifier short-circuits
/// to a no-op. Matches the PWA behavior of honoring `prefers-reduced-motion`.
enum AnchorMicroMotion {

    // MARK: - Net Worth Rise
    /// PWA: opacity [0, 0.22, 0] over 1.1s ease-out.
    /// Single-shot shimmer when net worth transitions to a positive total.
    struct NetWorthRise: ViewModifier {
        let trigger: Bool
        @Environment(\.accessibilityReduceMotion) private var reduceMotion
        @State private var opacity: Double = 0

        func body(content: Content) -> some View {
            content
                .opacity(opacity)
                .onChange(of: trigger) { _, active in
                    guard !reduceMotion, active else { return }
                    opacity = 0
                    withAnimation(.easeOut(duration: 0.55)) { opacity = 0.22 }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.55) {
                        withAnimation(.easeOut(duration: 0.55)) { opacity = 0 }
                    }
                }
        }
    }

    // MARK: - Save Pulse
    /// PWA: scale [1, 1.02, 1] loop during saving; [1, 1.08, 1] once on done.
    enum SaveState { case idle, saving, done }

    struct SavePulse: ViewModifier {
        let state: SaveState
        @Environment(\.accessibilityReduceMotion) private var reduceMotion
        @State private var scale: CGFloat = 1.0

        func body(content: Content) -> some View {
            content
                .scaleEffect(scale)
                .onChange(of: state) { _, new in
                    guard !reduceMotion else { scale = 1.0; return }
                    switch new {
                    case .idle:
                        scale = 1.0
                    case .saving:
                        withAnimation(.easeInOut(duration: 0.45).repeatForever(autoreverses: true)) {
                            scale = 1.02
                        }
                    case .done:
                        withAnimation(.easeOut(duration: 0.16)) { scale = 1.08 }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.16) {
                            withAnimation(.easeOut(duration: 0.16)) { scale = 1.0 }
                        }
                    }
                }
        }
    }

    // MARK: - Completion Pop
    /// PWA: scale [1, 1.18, 1] over 0.35s ease-out — task checkbox pop.
    struct CompletionPop: ViewModifier {
        let trigger: Bool
        @Environment(\.accessibilityReduceMotion) private var reduceMotion
        @State private var scale: CGFloat = 1.0

        func body(content: Content) -> some View {
            content
                .scaleEffect(scale)
                .onChange(of: trigger) { _, active in
                    guard !reduceMotion, active else { return }
                    withAnimation(.easeOut(duration: 0.175)) { scale = 1.18 }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.175) {
                        withAnimation(.easeOut(duration: 0.175)) { scale = 1.0 }
                    }
                }
        }
    }

    // MARK: - Create Slide In
    /// PWA: opacity 0→1, y 10→0 over 0.26s ease-out — row insertion.
    struct CreateSlideIn: ViewModifier {
        @Environment(\.accessibilityReduceMotion) private var reduceMotion
        @State private var shown = false

        func body(content: Content) -> some View {
            content
                .opacity(shown ? 1 : 0)
                .offset(y: shown ? 0 : 10)
                .onAppear {
                    if reduceMotion { shown = true; return }
                    withAnimation(.easeOut(duration: 0.26)) { shown = true }
                }
        }
    }
}

// MARK: - View Sugar

extension View {
    /// Brief gradient-opacity shimmer when net worth becomes positive.
    func netWorthRise(trigger: Bool) -> some View {
        modifier(AnchorMicroMotion.NetWorthRise(trigger: trigger))
    }

    /// Pulse during save; single 1.08× pop when done.
    func savePulse(state: AnchorMicroMotion.SaveState) -> some View {
        modifier(AnchorMicroMotion.SavePulse(state: state))
    }

    /// One-shot 1.18× scale pop — matches PWA task completion feedback.
    func completionPop(trigger: Bool) -> some View {
        modifier(AnchorMicroMotion.CompletionPop(trigger: trigger))
    }

    /// Entry slide-in — matches PWA row/card insert.
    func createSlideIn() -> some View {
        modifier(AnchorMicroMotion.CreateSlideIn())
    }
}
