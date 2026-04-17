import SwiftUI

/// Parity with src/features/finance/NotificationBanner.tsx — a top-of-page
/// inline banner surface driven by `ToastStore.shared.banner`. Distinct from
/// the existing transient toast overlay: notification banners persist until
/// explicitly dismissed and render inline, matching PWA placement above the
/// totals bar.
struct NotificationBanner: View {
    @ObservedObject var store: ToastStore = .shared

    var body: some View {
        if let banner = store.banner {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: icon(for: banner.style))
                    .foregroundStyle(color(for: banner.style))
                VStack(alignment: .leading, spacing: 2) {
                    Text(banner.message)
                        .font(.subheadline).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    if let detail = banner.detail {
                        Text(detail)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                }
                Spacer()
                Button {
                    store.dismissBanner()
                } label: {
                    Image(systemName: "xmark")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                .accessibilityLabel("Dismiss banner")
            }
            .padding(14)
            .background(color(for: banner.style).opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(color(for: banner.style).opacity(0.35), lineWidth: 1)
            )
            .createSlideIn()
            .transition(.move(edge: .top).combined(with: .opacity))
        }
    }

    private func icon(for style: ToastStyle) -> String {
        switch style {
        case .success: return "checkmark.circle.fill"
        case .error:   return "exclamationmark.triangle.fill"
        case .info:    return "info.circle.fill"
        }
    }

    private func color(for style: ToastStyle) -> Color {
        switch style {
        case .success: return AnchorPalette.success
        case .error:   return AnchorPalette.danger
        case .info:    return AnchorPalette.chipActive
        }
    }
}
