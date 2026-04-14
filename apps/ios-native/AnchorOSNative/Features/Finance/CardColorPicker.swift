import SwiftUI

// MARK: - CardColorPicker
// 18-color palette picker matching PWA CardColorPicker.tsx.
// Displays swatches in a horizontal grid; calls onChange on selection.

struct CardColorPicker: View {
    @Binding var selectedHex: String

    private let hexColors: [String] = [
        "#1E1E2E", "#2D3A4A", "#1A1A2E",
        "#3D52D5", "#1E40AF", "#0EA5E9",
        "#1A7F6E", "#059669", "#16A34A",
        "#8B1A4A", "#DC2626", "#BE185D",
        "#B45309", "#EA580C", "#D97706",
        "#6B21A8", "#7C3AED", "#9333EA"
    ]

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: 6)

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("CARD COLOR")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)

            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(hexColors, id: \.self) { hex in
                    colorSwatch(hex)
                }
            }
        }
    }

    private func colorSwatch(_ hex: String) -> some View {
        let isSelected = selectedHex.lowercased() == hex.lowercased()
        return Button {
            selectedHex = hex
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } label: {
            ZStack {
                Circle()
                    .fill(Color(hex: hex) ?? .clear)
                    .frame(width: 36, height: 36)
                if isSelected {
                    Circle()
                        .stroke(.white, lineWidth: 2.5)
                        .frame(width: 36, height: 36)
                    Image(systemName: "checkmark")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                }
            }
        }
        .buttonStyle(.plain)
    }
}
