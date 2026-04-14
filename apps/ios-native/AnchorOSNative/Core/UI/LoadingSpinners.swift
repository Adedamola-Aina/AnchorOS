import SwiftUI

// MARK: - Nautical Loading Spinners
// 4 variants from PWA AnchorLoadingSpinner.tsx:
// Sonar Ping, Anchor Drop, Compass Rose, Tide Wave.
// Split from LoadingBoundary.swift for ARCH-001 (≤ 200 lines).

enum SpinnerSize {
    case sm, md, lg
    var points: CGFloat {
        switch self {
        case .sm: return 40
        case .md: return 56
        case .lg: return 72
        }
    }
}

struct LoadingSpinnerView: View {
    let size: SpinnerSize
    var message: String?

    @State private var variant = Int.random(in: 0...3)

    var body: some View {
        VStack(spacing: 12) {
            Group {
                switch variant {
                case 0:  SonarPingView(s: size.points)
                case 1:  AnchorDropView(s: size.points)
                case 2:  CompassRoseView(s: size.points)
                default: TideWaveView(s: size.points)
                }
            }
            .frame(width: size.points, height: size.points)

            if let message {
                Text(message)
                    .font(AnchorTypography.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .pulseSlow()
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(message ?? "Loading")
    }
}

// MARK: - Spinner Variants

private struct SonarPingView: View {
    let s: CGFloat
    @State private var ring1 = false
    @State private var ring2 = false
    @State private var ring3 = false

    var body: some View {
        ZStack {
            Circle()
                .fill(AnchorPalette.primary)
                .frame(width: s * 0.25, height: s * 0.25)

            sonarRing.opacity(ring1 ? 0 : 0.6)
                .scaleEffect(ring1 ? 3.6 : 1)
            sonarRing.opacity(ring2 ? 0 : 0.6)
                .scaleEffect(ring2 ? 3.6 : 1)
            sonarRing.opacity(ring3 ? 0 : 0.6)
                .scaleEffect(ring3 ? 3.6 : 1)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 2).repeatForever(autoreverses: false)) { ring1 = true }
            withAnimation(.easeOut(duration: 2).repeatForever(autoreverses: false).delay(0.6)) { ring2 = true }
            withAnimation(.easeOut(duration: 2).repeatForever(autoreverses: false).delay(1.2)) { ring3 = true }
        }
    }

    private var sonarRing: some View {
        Circle()
            .stroke(AnchorPalette.primary, lineWidth: 1.5)
            .frame(width: s * 0.25, height: s * 0.25)
    }
}

private struct AnchorDropView: View {
    let s: CGFloat

    var body: some View {
        Image(systemName: "anchor")
            .font(.system(size: s * 0.5, weight: .light))
            .foregroundStyle(AnchorPalette.primary)
            .anchorBob()
    }
}

private struct CompassRoseView: View {
    let s: CGFloat

    var body: some View {
        Image(systemName: "safari")
            .font(.system(size: s * 0.5, weight: .light))
            .foregroundStyle(AnchorPalette.primary)
            .compassSpin()
    }
}

private struct TideWaveView: View {
    let s: CGFloat
    @State private var animate = false

    var body: some View {
        HStack(spacing: s * 0.1) {
            ForEach(0..<3, id: \.self) { i in
                RoundedRectangle(cornerRadius: s * 0.06)
                    .fill(AnchorPalette.primary.opacity(1 - Double(i) * 0.2))
                    .frame(width: s * 0.12, height: s * 0.3)
                    .scaleEffect(y: animate ? 1.8 : 1.0)
                    .opacity(animate ? 1.0 : 0.4)
                    .animation(
                        .easeInOut(duration: 0.6)
                            .repeatForever(autoreverses: true)
                            .delay(Double(i) * 0.15),
                        value: animate
                    )
            }
        }
        .onAppear { animate = true }
    }
}
