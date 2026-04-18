import SwiftUI

// MARK: - EmptyStateView
// Generic empty state matching PWA EmptyState.tsx.
// Provides icon, title, message, optional CTA.

enum EmptyStatePreset {
    case noData
    case noTasks
    case noTransactions
    case noNotifications
    case noFamily
    case noEvents
    case noSearchResults

    var icon: String {
        switch self {
        case .noData:          return "tray"
        case .noTasks:         return "target"
        case .noTransactions:  return "creditcard"
        case .noNotifications: return "bell"
        case .noFamily:        return "person.2"
        case .noEvents:        return "calendar"
        case .noSearchResults: return "magnifyingglass"
        }
    }

    var title: String {
        switch self {
        case .noData:          return "No data yet"
        case .noTasks:         return "No commitments"
        case .noTransactions:  return "No transactions"
        case .noNotifications: return "All caught up"
        case .noFamily:        return "No family connection"
        case .noEvents:        return "No events"
        case .noSearchResults: return "No results found"
        }
    }

    var message: String {
        switch self {
        case .noData:          return "There's nothing here right now. Add some data to get started."
        case .noTasks:         return "You haven't created any commitments yet. Add your first one to start tracking."
        case .noTransactions:  return "No transactions recorded for this account yet."
        case .noNotifications: return "You have no new notifications."
        case .noFamily:        return "Connect with a family member to share finances and commitments."
        case .noEvents:        return "No events scheduled for this period."
        case .noSearchResults: return "Try adjusting your search or filters."
        }
    }

    var accentColor: Color {
        switch self {
        case .noData:          return AnchorPalette.textSecondary
        case .noTasks:         return AnchorPalette.warning
        case .noTransactions:  return AnchorPalette.success
        case .noNotifications: return AnchorPalette.primary
        case .noFamily:        return AnchorPalette.task
        case .noEvents:        return AnchorPalette.primary
        case .noSearchResults: return AnchorPalette.textSecondary
        }
    }
}

struct EmptyStateView: View {
    var preset: EmptyStatePreset?
    var icon: String?
    var title: String?
    var message: String?
    var actionLabel: String?
    var onAction: (() -> Void)?

    private var resolvedIcon: String {
        icon ?? preset?.icon ?? "tray"
    }

    private var resolvedTitle: String {
        title ?? preset?.title ?? "Nothing here"
    }

    private var resolvedMessage: String {
        message ?? preset?.message ?? ""
    }

    private var resolvedAccent: Color {
        preset?.accentColor ?? AnchorPalette.textSecondary
    }

    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(AnchorPalette.chip.opacity(0.5))
                    .frame(width: 72, height: 72)
                    .ringGlow(color: resolvedAccent)
                    .sonarPulse()

                Image(systemName: resolvedIcon)
                    .font(.system(size: 28, weight: .medium))
                    .foregroundStyle(resolvedAccent)
                    .anchorBob()
            }
            .padding(.bottom, 20)

            // Title
            Text(resolvedTitle)
                .font(AnchorTypography.h3)
                .foregroundStyle(AnchorPalette.textPrimary)
                .padding(.bottom, 8)

            // Message
            if !resolvedMessage.isEmpty {
                Text(resolvedMessage)
                    .font(AnchorTypography.small)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 280)
                    .padding(.bottom, 24)
            }

            // CTA
            if let label = actionLabel, let action = onAction {
                Button(action: action) {
                    Text(label)
                        .font(AnchorTypography.small)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(AnchorPalette.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                }
            }

            Spacer()
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 16)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(resolvedTitle)
    }
}
