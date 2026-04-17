import SwiftUI

// MARK: - PressScaleStyle
/// Native parity for PWA `active:scale-[0.98]` on tap.
/// Applies a 0.98× scale while the button is pressed, restored on release.
/// Honors Reduce Motion.
struct PressScaleStyle: ButtonStyle {
    var scale: CGFloat = 0.98
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed && !reduceMotion ? scale : 1.0)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

// MARK: - AuthMountTransition
/// PWA `animate-in fade-in zoom-in-95` → opacity 0→1 + scale 0.95→1 on appear.
struct AuthMountTransition: ViewModifier {
    var duration: Double = 0.5
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var shown = false

    func body(content: Content) -> some View {
        content
            .opacity(shown ? 1 : 0)
            .scaleEffect(shown ? 1.0 : 0.95)
            .onAppear {
                if reduceMotion { shown = true; return }
                withAnimation(.easeOut(duration: duration)) { shown = true }
            }
    }
}

// MARK: - SlideFadeFromTop
/// PWA `animate-in fade-in slide-in-from-top-{1,2}` → y (-offset→0) + opacity 0→1.
struct SlideFadeFromTop: ViewModifier {
    var offset: CGFloat = 8
    var duration: Double = 0.3
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var shown = false

    func body(content: Content) -> some View {
        content
            .opacity(shown ? 1 : 0)
            .offset(y: shown ? 0 : -offset)
            .onAppear {
                if reduceMotion { shown = true; return }
                withAnimation(.easeOut(duration: duration)) { shown = true }
            }
    }
}

// MARK: - FadeInOnAppear
/// PWA `animate-in fade-in` → plain opacity 0→1 on mount.
struct FadeInOnAppear: ViewModifier {
    var duration: Double = 0.3
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var shown = false

    func body(content: Content) -> some View {
        content
            .opacity(shown ? 1 : 0)
            .onAppear {
                if reduceMotion { shown = true; return }
                withAnimation(.easeOut(duration: duration)) { shown = true }
            }
    }
}

extension View {
    /// 44px-safe press feedback — matches PWA `active:scale-[0.98]`.
    func pressScale(_ scale: CGFloat = 0.98) -> some View {
        buttonStyle(PressScaleStyle(scale: scale))
    }

    /// Composable press-scale — applies PressScaleStyle without replacing
    /// a `buttonStyle(.plain)` child. Use when the button already opts
    /// out of system styling (most `AnchorCard` / `AnchorChip` primary
    /// buttons do). Matches PWA `active:scale-[0.98]`.
    func anchorPressable(_ scale: CGFloat = 0.98) -> some View {
        modifier(AnchorPressableModifier(scale: scale))
    }

    /// Auth mount — opacity+scale from 95% to 100%.
    func authMountTransition(duration: Double = 0.5) -> some View {
        modifier(AuthMountTransition(duration: duration))
    }

    /// Slide-in from top with fade — matches PWA `animate-in fade-in slide-in-from-top-*`.
    func slideFadeFromTop(offset: CGFloat = 8, duration: Double = 0.3) -> some View {
        modifier(SlideFadeFromTop(offset: offset, duration: duration))
    }

    /// Plain opacity 0→1 on mount — matches PWA `animate-in fade-in`.
    func fadeInOnAppear(duration: Double = 0.3) -> some View {
        modifier(FadeInOnAppear(duration: duration))
    }
}

// MARK: - AnchorPressableModifier
/// Press-scale feedback that composes alongside `buttonStyle(.plain)`.
/// Uses a simultaneous gesture so it does not swallow the button's tap,
/// and honors Reduce Motion. Matches PWA `active:scale-[0.98]`.
struct AnchorPressableModifier: ViewModifier {
    var scale: CGFloat = 0.98
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var isPressed: Bool = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(isPressed && !reduceMotion ? scale : 1.0)
            .animation(.easeOut(duration: 0.12), value: isPressed)
            .simultaneousGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in if !isPressed { isPressed = true } }
                    .onEnded { _ in isPressed = false }
            )
    }
}
