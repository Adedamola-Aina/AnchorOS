import SwiftUI

/// Parity with src/features/settings/components/AwaitingConfirmationCard.tsx.
///
/// Shows the owner any invitations the invitee has accepted but the owner
/// hasn't confirmed yet. Owner taps Confirm to finalise the family connection
/// (creates the AnchorFamilyConnection doc) or Decline to reject.
struct AwaitingConfirmationCard: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @State private var busyId: String? = nil

    var body: some View {
        if !familyStore.awaitingConfirmations.isEmpty {
            VStack(spacing: 12) {
                ForEach(familyStore.awaitingConfirmations) { invite in
                    inviteCard(invite)
                }
            }
            .createSlideIn()
        }
    }

    @ViewBuilder
    private func inviteCard(_ invite: AnchorFamilyInvitation) -> some View {
        AnchorCard(title: "Confirm Family Connection", icon: "person.fill.checkmark") {
            VStack(alignment: .leading, spacing: 12) {
                Text("\(invite.inviteeEmail) has accepted your invitation. Confirm to activate the connection.")
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textPrimary)

                Text("Once confirmed, you'll be able to share specific accounts with them. Their transactions remain private unless they opt to share.")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)

                HStack(spacing: 10) {
                    Button {
                        Task { await act(invite, confirmed: true) }
                    } label: {
                        HStack {
                            if busyId == invite.resolvedId { ProgressView().tint(.white) }
                            Text("Confirm")
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(AnchorPalette.chipActive)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                    .buttonStyle(.plain)
                    .disabled(busyId != nil)

                    Button {
                        Task { await act(invite, confirmed: false) }
                    } label: {
                        Text("Decline")
                            .fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.danger)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(AnchorPalette.danger.opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                    .buttonStyle(.plain)
                    .disabled(busyId != nil)
                }
            }
        }
    }

    private func act(_ invite: AnchorFamilyInvitation, confirmed: Bool) async {
        busyId = invite.resolvedId
        defer { busyId = nil }
        do {
            try await familyStore.confirmConnection(inviteId: invite.resolvedId, confirmed: confirmed)
            ToastStore.shared.show(
                confirmed ? "Family connection activated 🎉" : "Invitation declined",
                style: confirmed ? .success : .info
            )
        } catch {
            ToastStore.shared.show("Couldn't update invitation. Try again.", style: .error)
        }
    }
}
