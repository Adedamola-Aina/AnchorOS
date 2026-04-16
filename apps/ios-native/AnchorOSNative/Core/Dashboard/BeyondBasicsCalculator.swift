import Foundation

/// Pure "Beyond the Basics" checklist calculator.
/// Mirrors src/features/dashboard/hooks/useBeyondBasics.ts.
///
/// Parity contract — 6 items, IDs must match PWA BEYOND_BASICS_ITEMS order:
///   exploreFinance, recurringCommitment, reviewDashboard,
///   customizeSettings, verifyEmail, enableMfa
///
/// Each signal is deliberately a boolean passed in by the caller, not queried
/// from a store, so the calculator stays pure and unit-testable.
enum BeyondBasicsCalculator {

    enum ItemId: String, CaseIterable {
        case exploreFinance = "explore_finance"
        case recurringCommitment = "recurring_commitment"
        case reviewDashboard = "review_dashboard"
        case customizeSettings = "customize_settings"
        case verifyEmail = "verify_email"
        case enableMfa = "enable_mfa"

        /// Order matches PWA BEYOND_BASICS_ITEMS.
        static let ordered: [ItemId] = [
            .exploreFinance, .recurringCommitment, .reviewDashboard,
            .customizeSettings, .verifyEmail, .enableMfa
        ]

        var label: String {
            switch self {
            case .exploreFinance:      return "Explore Finance"
            case .recurringCommitment: return "Set a Recurring Commitment"
            case .reviewDashboard:     return "Review Your Dashboard"
            case .customizeSettings:   return "Customize Settings"
            case .verifyEmail:         return "Verify Your Email"
            case .enableMfa:           return "Enable Two-Factor Auth"
            }
        }

        var description: String {
            switch self {
            case .exploreFinance:      return "Add a transaction to your account"
            case .recurringCommitment: return "Try a weekly or monthly commitment"
            case .reviewDashboard:     return "Visit the Dashboard with data to see your life at a glance"
            case .customizeSettings:   return "Make Anchor OS yours — theme, notifications"
            case .verifyEmail:         return "Confirm your email address to secure account ownership"
            case .enableMfa:           return "Add an extra layer of protection with 2FA"
            }
        }

        var icon: String {
            switch self {
            case .exploreFinance:      return "banknote"
            case .recurringCommitment: return "arrow.clockwise"
            case .reviewDashboard:     return "square.grid.2x2"
            case .customizeSettings:   return "paintpalette"
            case .verifyEmail:         return "envelope.badge"
            case .enableMfa:           return "lock.shield"
            }
        }
    }

    struct Item: Identifiable, Equatable {
        let id: ItemId
        let completed: Bool
        var label: String { id.label }
        var description: String { id.description }
        var icon: String { id.icon }
    }

    struct Result: Equatable {
        let items: [Item]
        let completedCount: Int
        let totalCount: Int
        let allComplete: Bool
        let progress: Double
    }

    /// All signals are pre-computed booleans. Callers are responsible for
    /// sourcing them from the appropriate stores.
    static func calculate(
        accounts: [AnchorAccount],
        transactions: [AnchorTransaction],
        commitments: [AnchorCommitment],
        themeCustomized: Bool,
        notificationsSet: Bool,
        emailVerified: Bool,
        mfaEnabled: Bool
    ) -> Result {
        let hasTransaction = !transactions.isEmpty
        let hasRecurring = commitments.contains { $0.type == "weekly" || $0.type == "monthly" }
        let hasDashboardData = !commitments.isEmpty
        let hasCustomized = themeCustomized || notificationsSet

        let items: [Item] = ItemId.ordered.map { id in
            let done: Bool
            switch id {
            case .exploreFinance:      done = hasTransaction
            case .recurringCommitment: done = hasRecurring
            case .reviewDashboard:     done = hasDashboardData
            case .customizeSettings:   done = hasCustomized
            case .verifyEmail:         done = emailVerified
            case .enableMfa:           done = mfaEnabled
            }
            return Item(id: id, completed: done)
        }

        let completed = items.filter(\.completed).count
        let total = items.count
        return Result(
            items: items,
            completedCount: completed,
            totalCount: total,
            allComplete: completed == total,
            progress: total > 0 ? Double(completed) / Double(total) : 0
        )
    }
}
