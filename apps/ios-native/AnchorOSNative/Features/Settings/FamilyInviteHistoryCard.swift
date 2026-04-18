import SwiftUI

/// Recent invite history for Family Mode.
/// Shows the latest sent invitations and their status badges.
struct FamilyInviteHistoryCard: View {
    @EnvironmentObject private var familyStore: FamilyStore

    var body: some View {
        if !familyStore.inviteHistory.isEmpty {
            AnchorCard(title: "Invite History", icon: "clock.arrow.circlepath") {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(familyStore.inviteHistory) { invite in
                        HStack(alignment: .top, spacing: 10) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(invite.inviteeEmail)
                                    .font(.subheadline).fontWeight(.semibold)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                if let createdAt = invite.createdAt, !createdAt.isEmpty {
                                    Text(createdAt.prefix(10))
                                        .font(.caption)
                                        .foregroundStyle(AnchorPalette.textSecondary)
                                }
                            }
                            Spacer()
                            Text(statusLabel(invite.status))
                                .font(.caption2)
                                .fontWeight(.bold)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(statusColor(invite.status).opacity(0.15))
                                .foregroundStyle(statusColor(invite.status))
                                .clipShape(Capsule())
                        }
                        if invite.id != familyStore.inviteHistory.last?.id {
                            Divider().overlay(AnchorPalette.chip)
                        }
                    }
                }
            }
        }
    }

    private func statusLabel(_ status: String) -> String {
        status.replacingOccurrences(of: "_", with: " ").uppercased()
    }

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "accepted": return AnchorPalette.success
        case "awaiting_confirmation": return AnchorPalette.chipActive
        case "rejected", "expired": return AnchorPalette.danger
        default: return AnchorPalette.textSecondary
        }
    }
}
