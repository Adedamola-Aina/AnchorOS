import SwiftUI

/// Persistent Family Mode banner.
///
/// Mirrors the intent of the PWA FamilyNotificationBanner by surfacing the
/// most important shared-state change inline: awaiting confirmations, number
/// of shared accounts, or shared commitments. It stays visible until the
/// underlying state changes.
struct FamilyNotificationBanner: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore

    var body: some View {
        if let banner = bannerContent {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: banner.icon)
                    .foregroundStyle(AnchorPalette.chipActive)
                VStack(alignment: .leading, spacing: 2) {
                    Text(banner.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(banner.detail)
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                Spacer()
            }
            .padding(14)
            .background(AnchorPalette.chipActive.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(AnchorPalette.chipActive.opacity(0.35), lineWidth: 1)
            )
            .createSlideIn()
        }
    }

    private var bannerContent: (icon: String, title: String, detail: String)? {
        if !familyStore.awaitingConfirmations.isEmpty {
            let count = familyStore.awaitingConfirmations.count
            return (
                "person.fill.checkmark",
                count == 1 ? "1 family invite needs confirmation" : "\(count) family invites need confirmation",
                "Open the card below to confirm or decline the accepted invitation."
            )
        }

        let familyTasks = commitmentsStore.commitments.filter { $0.isFamilyShared }
        if !familyTasks.isEmpty {
            return (
                "checklist",
                "\(familyTasks.count) shared commitments active",
                "These tasks are visible to your household and help keep everyone aligned."
            )
        }

        let sharedAccounts = financeStore.sharedAccounts.count
        if sharedAccounts > 0 {
            return (
                "building.columns.fill",
                "\(sharedAccounts) shared account\(sharedAccounts == 1 ? "" : "s") active",
                "Adjust permissions any time below."
            )
        }

        guard familyStore.hasConnection else { return nil }
        return (
            "person.2.fill",
            "Family Mode is active",
            "Share an account or a commitment to start collaborating with \(familyStore.partnerName)."
        )
    }
}
