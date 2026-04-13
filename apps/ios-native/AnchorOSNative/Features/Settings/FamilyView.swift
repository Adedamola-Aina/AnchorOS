import SwiftUI

/// Family Mode screen — mirrors FamilySettingsV2 in the PWA.
/// Shows: no-connection invite / accept states, and active connection management.
struct FamilyView: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @EnvironmentObject private var financeStore: FinanceStore

    // Invite flow
    @State private var recipientEmail = ""
    @State private var isSendingInvite = false

    // Accept flow
    @State private var inviteToken = ""
    @State private var isAccepting = false
    @State private var showAcceptForm = false

    // Disconnect
    @State private var showDisconnectAlert = false
    @State private var isDisconnecting = false

    // Share toggle
    @State private var sharingAccountId: String? = nil

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    if familyStore.isLoading {
                        ProgressView().tint(.white).frame(maxWidth: .infinity).padding(.top, 40)
                    } else if familyStore.hasConnection {
                        activeConnectionView
                    } else if familyStore.inviteSent {
                        inviteSentView
                    } else if showAcceptForm {
                        acceptFormView
                    } else {
                        noConnectionView
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Family")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    // MARK: — No Connection State

    private var noConnectionView: some View {
        VStack(spacing: 16) {
            AnchorCard(title: "Family Mode", icon: "person.2.fill") {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Connect with a spouse or partner to share selected accounts and track finances together.")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.subheadline)

                    Divider().overlay(AnchorPalette.chip)

                    // Invite section
                    VStack(alignment: .leading, spacing: 10) {
                        Text("INVITE A FAMILY MEMBER")
                            .font(.caption).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.textSecondary)

                        TextField("Their email address", text: $recipientEmail)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .padding(12)
                            .background(AnchorPalette.chip)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .foregroundStyle(AnchorPalette.textPrimary)

                        Button {
                            Task { await sendInvite() }
                        } label: {
                            HStack {
                                Spacer()
                                if isSendingInvite {
                                    ProgressView().tint(.white)
                                } else {
                                    Label("Send Invitation", systemImage: "envelope.fill")
                                        .fontWeight(.semibold)
                                }
                                Spacer()
                            }
                            .padding(.vertical, 14)
                            .background(recipientEmail.isEmpty ? AnchorPalette.chip : AnchorPalette.chipActive)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .foregroundStyle(recipientEmail.isEmpty ? AnchorPalette.textSecondary : .white)
                        }
                        .disabled(recipientEmail.isEmpty || isSendingInvite)
                        .buttonStyle(.plain)
                    }
                }
            }

            // Accept invite option
            Button {
                showAcceptForm = true
            } label: {
                HStack {
                    Image(systemName: "key.fill")
                        .foregroundStyle(AnchorPalette.chipActive)
                    Text("I have an invitation code")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.subheadline)
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                .padding(16)
                .background(AnchorPalette.chip.opacity(0.5))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: — Invite Sent State

    private var inviteSentView: some View {
        AnchorCard(title: "Invitation Sent", icon: "checkmark.circle.fill") {
            VStack(spacing: 12) {
                Image(systemName: "envelope.badge.fill")
                    .font(.system(size: 44))
                    .foregroundStyle(AnchorPalette.success)

                Text("Invitation sent to \(recipientEmail)")
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .fontWeight(.semibold)
                    .multilineTextAlignment(.center)

                Text("They'll receive a 6-digit code by email. Once they accept, your connection will activate automatically.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.subheadline)
                    .multilineTextAlignment(.center)
            }
            .padding(.vertical, 8)
        }
    }

    // MARK: — Accept Form State

    private var acceptFormView: some View {
        AnchorCard(title: "Accept Invitation", icon: "key.fill") {
            VStack(alignment: .leading, spacing: 12) {
                Text("Enter the 6-digit code from your invitation email.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.subheadline)

                TextField("6-digit code", text: $inviteToken)
                    .keyboardType(.numberPad)
                    .padding(12)
                    .background(AnchorPalette.chip)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .foregroundStyle(AnchorPalette.textPrimary)

                Button {
                    Task { await acceptInvite() }
                } label: {
                    HStack {
                        Spacer()
                        if isAccepting {
                            ProgressView().tint(.white)
                        } else {
                            Label("Accept & Connect", systemImage: "person.2.fill")
                                .fontWeight(.semibold)
                        }
                        Spacer()
                    }
                    .padding(.vertical, 14)
                    .background(inviteToken.count < 6 ? AnchorPalette.chip : AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .foregroundStyle(inviteToken.count < 6 ? AnchorPalette.textSecondary : .white)
                }
                .disabled(inviteToken.count < 6 || isAccepting)
                .buttonStyle(.plain)

                Button("Go back") { showAcceptForm = false }
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .frame(maxWidth: .infinity)
            }
        }
    }

    // MARK: — Active Connection State

    private var activeConnectionView: some View {
        VStack(spacing: 16) {
            // Connection status card
            AnchorCard(title: "Family Connection", icon: "person.2.fill") {
                VStack(spacing: 16) {
                    HStack(spacing: 16) {
                        ZStack {
                            Circle()
                                .fill(AnchorPalette.chipActive.opacity(0.15))
                                .frame(width: 56, height: 56)
                            Image(systemName: "person.2.fill")
                                .font(.title2)
                                .foregroundStyle(AnchorPalette.chipActive)
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Connected with")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                            Text(familyStore.partnerName)
                                .fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.textPrimary)
                            Text(familyStore.isOwner ? "You manage this connection" : "You are a member")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                        Spacer()

                        // Active indicator
                        HStack(spacing: 4) {
                            Circle().fill(AnchorPalette.success).frame(width: 8, height: 8)
                            Text("Active")
                                .font(.caption2).fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.success)
                        }
                    }

                    Divider().overlay(AnchorPalette.chip)

                    Button(role: .destructive) {
                        showDisconnectAlert = true
                    } label: {
                        HStack {
                            Spacer()
                            Label(
                                familyStore.isOwner ? "Remove Family Member" : "Leave Family Connection",
                                systemImage: "person.2.slash"
                            )
                            .fontWeight(.semibold)
                            Spacer()
                        }
                        .padding(.vertical, 12)
                        .background(AnchorPalette.danger.opacity(0.12))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .foregroundStyle(AnchorPalette.danger)
                    }
                    .buttonStyle(.plain)
                }
            }
            .alert(
                familyStore.isOwner ? "Remove Family Member?" : "Leave Family Connection?",
                isPresented: $showDisconnectAlert
            ) {
                Button(familyStore.isOwner ? "Remove" : "Leave", role: .destructive) {
                    Task { await disconnect() }
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This will revoke access to all shared accounts. This cannot be undone.")
            }

            // Account sharing card (owner only)
            if familyStore.isOwner && !financeStore.accounts.isEmpty {
                accountSharingCard
            }
        }
    }

    private var accountSharingCard: some View {
        AnchorCard(title: "Share Accounts", icon: "arrow.triangle.2.circlepath") {
            VStack(alignment: .leading, spacing: 4) {
                Text("Long-press an account to toggle sharing with \(familyStore.partnerName).")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.bottom, 8)

                ForEach(financeStore.accounts) { account in
                    let isShared = account.scope == "family"
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(account.name)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .fontWeight(.semibold)
                                .font(.subheadline)
                            Text(account.formattedBalance)
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .font(.caption)
                        }
                        Spacer()
                        Toggle("", isOn: Binding(
                            get: { isShared },
                            set: { newVal in
                                sharingAccountId = account.resolvedId
                                Task {
                                    do {
                                        try await familyStore.shareAccount(accountId: account.resolvedId, share: newVal)
                                        ToastStore.shared.show(
                                            newVal ? "Shared with \(familyStore.partnerName)" : "Sharing removed",
                                            style: .success
                                        )
                                    } catch {
                                        ToastStore.shared.show("Failed to update sharing", style: .error)
                                    }
                                    sharingAccountId = nil
                                }
                            }
                        ))
                        .tint(AnchorPalette.chipActive)
                        .disabled(sharingAccountId == account.resolvedId)
                    }
                    .padding(.vertical, 6)

                    if account.id != financeStore.accounts.last?.id {
                        Divider().overlay(AnchorPalette.chip)
                    }
                }
            }
        }
    }

    // MARK: — Actions

    private func sendInvite() async {
        guard !recipientEmail.isEmpty else { return }
        isSendingInvite = true
        do {
            try await familyStore.createInvitation(
                ownerName: userProfileStore.displayName,
                recipientEmail: recipientEmail
            )
            ToastStore.shared.show("Invitation sent!", style: .success)
        } catch {
            ToastStore.shared.show("Failed to send invitation", style: .error)
        }
        isSendingInvite = false
    }

    private func acceptInvite() async {
        isAccepting = true
        do {
            try await familyStore.acceptInvitation(token: inviteToken)
            ToastStore.shared.show("Connected! Welcome to Family Mode 🎉", style: .success)
            showAcceptForm = false
        } catch {
            ToastStore.shared.show("Invalid or expired code", style: .error)
        }
        isAccepting = false
    }

    private func disconnect() async {
        isDisconnecting = true
        do {
            try await familyStore.disconnect()
            ToastStore.shared.show("Family connection removed", style: .info)
        } catch {
            ToastStore.shared.show("Failed to disconnect", style: .error)
        }
        isDisconnecting = false
    }
}
