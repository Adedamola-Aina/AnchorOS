import SwiftUI

enum CardArtworkStyle: String, CaseIterable, Identifiable {
    case stripes
    case dots
    case crosshatch = "crosshatch"
    case lines

    var id: String { rawValue }

    var label: String {
        switch self {
        case .stripes: return "Stripes"
        case .dots: return "Dots"
        case .crosshatch: return "Cross-hatch"
        case .lines: return "Lines"
        }
    }

    var icon: String {
        switch self {
        case .stripes: return "square.split.diagonal"
        case .dots: return "circle.grid.3x3.fill"
        case .crosshatch: return "grid"
        case .lines: return "line.3.horizontal"
        }
    }
}

struct CardArtworkPicker: View {
    @Binding var selectedArtwork: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("CARD ARTWORK")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)

            HStack(spacing: 8) {
                ForEach(CardArtworkStyle.allCases) { style in
                    Button {
                        selectedArtwork = style.rawValue
                        AnchorHaptics.selection()
                    } label: {
                        VStack(spacing: 6) {
                            Image(systemName: style.icon)
                                .font(.subheadline.weight(.bold))
                            Text(style.label)
                                .font(.caption2)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(selectedArtwork == style.rawValue ? AnchorPalette.chipActive : AnchorPalette.chip)
                        .foregroundStyle(selectedArtwork == style.rawValue ? .white : AnchorPalette.textPrimary)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

struct CardArtworkOverlay: View {
    let style: String

    var body: some View {
        GeometryReader { geo in
            ZStack {
                switch CardArtworkStyle(rawValue: style) ?? .stripes {
                case .stripes:
                    ForEach(0..<8, id: \.self) { index in
                        Rectangle()
                            .fill(.white.opacity(0.08))
                            .frame(width: 10, height: geo.size.height * 1.5)
                            .rotationEffect(.degrees(28))
                            .offset(x: CGFloat(index * 26) - 30)
                    }
                case .dots:
                    VStack(spacing: 12) {
                        ForEach(0..<4, id: \.self) { _ in
                            HStack(spacing: 12) {
                                ForEach(0..<6, id: \.self) { _ in
                                    Circle()
                                        .fill(.white.opacity(0.10))
                                        .frame(width: 6, height: 6)
                                }
                            }
                        }
                    }
                case .crosshatch:
                    VStack(spacing: 12) {
                        ForEach(0..<5, id: \.self) { _ in
                            Rectangle().fill(.white.opacity(0.07)).frame(height: 1)
                        }
                    }
                    .padding(.horizontal, 10)
                    HStack(spacing: 18) {
                        ForEach(0..<6, id: \.self) { _ in
                            Rectangle().fill(.white.opacity(0.07)).frame(width: 1)
                        }
                    }
                case .lines:
                    VStack(spacing: 10) {
                        ForEach(0..<5, id: \.self) { _ in
                            Capsule()
                                .fill(.white.opacity(0.10))
                                .frame(height: 4)
                        }
                    }
                    .padding(.horizontal, 12)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .allowsHitTesting(false)
    }
}
