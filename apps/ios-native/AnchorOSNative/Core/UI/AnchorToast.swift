import SwiftUI

enum ToastStyle {
    case success, error, info

    var icon: String {
        switch self {
        case .success: return "checkmark.circle.fill"
        case .error: return "xmark.circle.fill"
        case .info: return "info.circle.fill"
        }
    }

    var color: Color {
        switch self {
        case .success: return AnchorPalette.success
        case .error: return AnchorPalette.danger
        case .info: return AnchorPalette.chipActive
        }
    }
}

struct ToastMessage: Equatable {
    let id: UUID
    let message: String
    let style: ToastStyle

    init(message: String, style: ToastStyle = .success) {
        self.id = UUID()
        self.message = message
        self.style = style
    }

    static func == (lhs: ToastMessage, rhs: ToastMessage) -> Bool { lhs.id == rhs.id }
}

@MainActor
final class ToastStore: ObservableObject {
    static let shared = ToastStore()
    @Published var current: ToastMessage? = nil
    private var dismissTask: Task<Void, Never>?

    private init() {}

    func show(_ message: String, style: ToastStyle = .success) {
        dismissTask?.cancel()
        current = ToastMessage(message: message, style: style)
        dismissTask = Task {
            try? await Task.sleep(nanoseconds: 3_000_000_000)
            if !Task.isCancelled {
                await MainActor.run { current = nil }
            }
        }
    }

    func dismiss() {
        dismissTask?.cancel()
        current = nil
    }
}

struct AnchorToastOverlay: View {
    @ObservedObject var store = ToastStore.shared

    var body: some View {
        VStack {
            Spacer()
            if let toast = store.current {
                HStack(spacing: 10) {
                    Image(systemName: toast.style.icon)
                        .foregroundStyle(toast.style.color)
                        .font(.subheadline)
                    Text(toast.message)
                        .foregroundStyle(AnchorPalette.textPrimary)
                        .font(.subheadline)
                        .lineLimit(2)
                    Spacer()
                    Button { store.dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 16).padding(.vertical, 12)
                .background(AnchorPalette.card)
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .shadow(color: .black.opacity(0.4), radius: 12, y: 4)
                .padding(.horizontal, 16)
                .transition(.move(edge: .bottom).combined(with: .opacity))
                .id(toast.id)
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: store.current)
        .padding(.bottom, 90) // above tab bar
        .allowsHitTesting(store.current != nil)
    }
}
