import SwiftUI

// MARK: - SwipeableRow
// Wraps any content with swipe-left-to-reveal-actions.
// Matches PWA SwipeableRow.tsx interaction pattern.
// Usage: SwipeableRow(deleteAction: { ... }, editAction: { ... }) { content }

struct SwipeableRow<Content: View>: View {
    let deleteAction: (() -> Void)?
    let editAction: (() -> Void)?
    let content: () -> Content

    @State private var offset: CGFloat = 0
    @State private var isRevealed = false

    private let actionWidth: CGFloat = 72
    private var totalReveal: CGFloat {
        var total: CGFloat = 0
        if deleteAction != nil { total += actionWidth }
        if editAction != nil { total += actionWidth }
        return total
    }

    init(
        deleteAction: (() -> Void)? = nil,
        editAction: (() -> Void)? = nil,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.deleteAction = deleteAction
        self.editAction = editAction
        self.content = content
    }

    var body: some View {
        ZStack(alignment: .trailing) {
            // Action buttons revealed behind the row
            HStack(spacing: 0) {
                if let edit = editAction {
                    Button(action: {
                        closeWithFeedback()
                        edit()
                    }) {
                        Image(systemName: "pencil")
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(.white)
                            .frame(width: actionWidth, maxHeight: .infinity)
                            .background(AnchorPalette.chipActive)
                    }
                    .buttonStyle(.plain)
                }
                if let delete = deleteAction {
                    Button(action: {
                        closeWithFeedback()
                        delete()
                    }) {
                        Image(systemName: "trash")
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(.white)
                            .frame(width: actionWidth, maxHeight: .infinity)
                            .background(AnchorPalette.danger)
                    }
                    .buttonStyle(.plain)
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: 12))

            // Main content slides left
            content()
                .offset(x: offset)
                .gesture(
                    DragGesture(minimumDistance: 10)
                        .onChanged { value in
                            let translation = value.translation.width
                            if translation < 0 || isRevealed {
                                offset = isRevealed
                                    ? max(-totalReveal, min(0, -totalReveal + translation))
                                    : max(-totalReveal, min(0, translation))
                            }
                        }
                        .onEnded { value in
                            let threshold = totalReveal * 0.4
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                if isRevealed {
                                    // Already open: close if dragged right enough
                                    if value.translation.width > threshold {
                                        offset = 0
                                        isRevealed = false
                                    } else {
                                        offset = -totalReveal
                                    }
                                } else {
                                    // Closed: open if dragged left enough
                                    if -value.translation.width > threshold {
                                        offset = -totalReveal
                                        isRevealed = true
                                    } else {
                                        offset = 0
                                    }
                                }
                            }
                        }
                )
                .onTapGesture {
                    if isRevealed {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            offset = 0
                            isRevealed = false
                        }
                    }
                }
        }
    }

    private func closeWithFeedback() {
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
            offset = 0
            isRevealed = false
        }
    }
}
