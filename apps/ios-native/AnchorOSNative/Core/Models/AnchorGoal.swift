import Foundation

/// Maps artifacts/anchor-os/users/{uid}/goals/{goalId}.
/// Mirrors PWA `AnchorGoal` in src/types/index.ts.
struct AnchorGoal: Identifiable, Equatable {
    let id: String
    let title: String
    let targetAmountCents: Int
    let currentAmountCents: Int
    let currency: String
    let goalType: String            // "savings" | "debt_payoff" | "investment" | "emergency_fund" | "other"
    let accountId: String?
    let targetDate: String?         // ISO date string
    let createdAt: String
    let updatedAt: String
}
