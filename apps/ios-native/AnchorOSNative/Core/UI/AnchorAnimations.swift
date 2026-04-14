import SwiftUI

// MARK: - AnchorAnimations
// Branded animation keyframes matching PWA index.css @keyframes.
// CSS-only style animations for battery efficiency (ARCH-002).

// MARK: - Pulse Slow (opacity 1 → 0.7 → 1, 3s)

struct PulseSlowModifier: ViewModifier {
    @State private var animating = false

    func body(content: Content) -> some View {
        content
            .opacity(animating ? 0.7 : 1.0)
            .animation(
                .easeInOut(duration: 1.5).repeatForever(autoreverses: true),
                value: animating
            )
            .onAppear { animating = true }
    }
}

// MARK: - Anchor Bob (translateY 0 → -6 → 0, 2s)

struct AnchorBobModifier: ViewModifier {
    @State private var animating = false

    func body(content: Content) -> some View {
        content
            .offset(y: animating ? -6 : 0)
            .animation(
                .easeInOut(duration: 1.0).repeatForever(autoreverses: true),
                value: animating
            )
            .onAppear { animating = true }
    }
}

// MARK: - Ring Glow (box-shadow glow, 3s)

struct RingGlowModifier: ViewModifier {
    let color: Color
    @State private var animating = false

    func body(content: Content) -> some View {
        content
            .shadow(
                color: color.opacity(animating ? 0.35 : 0),
                radius: animating ? 8 : 0
            )
            .animation(
                .easeInOut(duration: 1.5).repeatForever(autoreverses: true),
                value: animating
            )
            .onAppear { animating = true }
    }
}

// MARK: - Compass Spin (360° rotation, linear)

struct CompassSpinModifier: ViewModifier {
    @State private var angle: Double = 0

    func body(content: Content) -> some View {
        content
            .rotationEffect(.degrees(angle))
            .onAppear {
                withAnimation(.linear(duration: 2).repeatForever(autoreverses: false)) {
                    angle = 360
                }
            }
    }
}

// MARK: - Spin Slow (360° rotation, 3s linear)

struct SpinSlowModifier: ViewModifier {
    @State private var angle: Double = 0

    func body(content: Content) -> some View {
        content
            .rotationEffect(.degrees(angle))
            .onAppear {
                withAnimation(.linear(duration: 3).repeatForever(autoreverses: false)) {
                    angle = 360
                }
            }
    }
}

// MARK: - Pulse Fast (opacity + scale, 0.8s)

struct PulseFastModifier: ViewModifier {
    @State private var animating = false

    func body(content: Content) -> some View {
        content
            .opacity(animating ? 0.5 : 1.0)
            .scaleEffect(animating ? 0.8 : 1.0)
            .animation(
                .easeInOut(duration: 0.4).repeatForever(autoreverses: true),
                value: animating
            )
            .onAppear { animating = true }
    }
}

// MARK: - View Extensions

extension View {

    /// Slow pulse: opacity 1 → 0.7 → 1 (matches PWA animate-pulse-slow)
    func pulseSlow() -> some View {
        modifier(PulseSlowModifier())
    }

    /// Gentle bob: translateY 0 → -6 → 0 (matches PWA animate-anchor-bob)
    func anchorBob() -> some View {
        modifier(AnchorBobModifier())
    }

    /// Glow ring: shadow pulse (matches PWA animate-ring-glow)
    func ringGlow(color: Color = AnchorPalette.danger) -> some View {
        modifier(RingGlowModifier(color: color))
    }

    /// Compass rotation: 360° in 2s (matches PWA animate-compass-spin)
    func compassSpin() -> some View {
        modifier(CompassSpinModifier())
    }

    /// Slow rotation: 360° in 3s (matches PWA animate-spin-slow)
    func spinSlow() -> some View {
        modifier(SpinSlowModifier())
    }

    /// Fast pulse: opacity + scale oscillation (matches PWA animate-pulse-fast)
    func pulseFast() -> some View {
        modifier(PulseFastModifier())
    }
}
