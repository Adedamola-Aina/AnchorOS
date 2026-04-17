import SwiftUI

/// Parity with src/features/settings/components/PendingInviteCard.tsx.
/// iOS receives invites via universal links into FamilyStore.acceptInvitation,
/// but users also need a manual-paste fallback when the link path fails
/// (Mail/Messages app quirks). This card provides that fallback.
struct PendingInviteCard: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @State private var token: String = ""
    @State private var isBusy: Bool = false
    @State private var error: String? = nil

    var body: some View {
        AnchorCard(title: "Have an Invite Code?", icon: "envelope.badge") {
            VStack(alignment: .leading, spacing: 12) {
                Text("Paste the code from your partner's invite link to connect finances.")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)

                TextField("Invite code", text: $token)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .padding(12)
                    .background(AnchorPalette.chip.opacity(0.5))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                    )

                if let err = error {
                    Text(err)
                        .font(.caption).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.danger)
                }

                Button { Task { await accept() } } label: {
                    HStack {
                        if isBusy { ProgressView().tint(.white) }
                        Text(isBusy ? "Connecting…" : "Connect")
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(token.isEmpty ? AnchorPalette.chipActive.opacity(0.4) : AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
                .disabled(token.isEmpty || isBusy)
            }
        }
    }

    private func accept() async {
        isBusy = true
        error = nil
        defer { isBusy = false }
        do {
            try await familyStore.acceptInvitation(token: token.trimmingCharacters(in: .whitespaces))
            ToastStore.shared.show("Connected", style: .success)
            token = ""
        } catch {
            self.error = "Couldn't connect. Check the code and try again."
        }
    }
}
import SwiftUI

/// Parity with src/features/settings/components/PendingInviteCard.tsx.
/// Surfaces the inbound family invite so the user can accept/decline.
struct PendingInviteCard: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @State private var isBusy: Bool = false

    var body: some View {
        if let invite = familyStore.pendingInvite {
            AnchorCard(title: "Family Invite", icon: "envelope.badge") {
                VStack(alignment: .leading, spacing: 12) {
                    Text("\(invite.inviterName) has invited you to share finances in Anchor.")
                        .font(.subheadline)
                        .foregroundStyle(AnchorPalette.textPrimary)

                    Text("You'll see each other's accounts and totals; individual transactions remain private unless you opt in.")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)

                    HStack(spacing: 10) {
                        Button {
                            Task { await accept(invite) }
                        } label: {
                            Text("Accept")
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(AnchorPalette.chipActive)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        .buttonStyle(.plain)
                        .disabled(isBusy)

                        Button {
                            Task { await decline(invite) }
                        } label: {
                            Text("Decline")
                                .fontWeight(.semibold)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(AnchorPalette.chip.opacity(0.7))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        .buttonStyle(.plain)
                        .disabled(isBusy)
                    }
                }
            }
            .createSlideIn()
        }
    }

    private func accept(_ invite: FamilyStore.PendingInvite) async {
        isBusy = true
        defer { isBusy = false }
        await familyStore.acceptInvite(invite)
        ToastStore.shared.show("Invite accepted", style: .success)
    }

    private func decline(_ invite: FamilyStore.PendingInvite) async {
        isBusy = true
        defer { isBusy = false }
        await familyStore.declineInvite(invite)
        ToastStore.shared.show("Invite declined", style: .info)
    }
}
