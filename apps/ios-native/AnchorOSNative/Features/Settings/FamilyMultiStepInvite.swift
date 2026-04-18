import SwiftUI

/// Multi-step Family Mode invite flow.
/// Mirrors PWA InviteFamilyForm steps: email → review → sent.
///
/// Replaces the single-step inline invite in FamilyView. Keeps the same
/// FamilyStore.createInvitation call but walks the user through staged
/// confirmation so they understand what's about to be shared.
struct FamilyMultiStepInvite: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var userProfileStore: UserProfileStore

    enum Step { case email, review, sending }
    @State private var step: Step = .email
    @State private var recipientEmail: String = ""
    @State private var personalNote: String = ""
    @State private var error: String? = nil

    var body: some View {
        AnchorCard(title: "Invite a Family Member", icon: "person.crop.circle.badge.plus") {
            VStack(alignment: .leading, spacing: 14) {
                stepIndicator

                switch step {
                case .email:    emailStep
                case .review:   reviewStep
                case .sending:  sendingStep
                }

                if let error {
                    Text(error)
                        .font(.caption).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.danger)
                }
            }
        }
    }

    private var stepIndicator: some View {
        HStack(spacing: 6) {
            indicatorDot(active: true)
            Rectangle().fill(step != .email ? AnchorPalette.chipActive : AnchorPalette.chip)
                .frame(height: 2).frame(maxWidth: 24)
            indicatorDot(active: step != .email)
            Rectangle().fill(step == .sending ? AnchorPalette.chipActive : AnchorPalette.chip)
                .frame(height: 2).frame(maxWidth: 24)
            indicatorDot(active: step == .sending)
            Spacer()
            Text(stepLabel)
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
    }

    private func indicatorDot(active: Bool) -> some View {
        Circle()
            .fill(active ? AnchorPalette.chipActive : AnchorPalette.chip)
            .frame(width: 8, height: 8)
    }

    private var stepLabel: String {
        switch step {
        case .email:   return "STEP 1 OF 3"
        case .review:  return "STEP 2 OF 3"
        case .sending: return "STEP 3 OF 3"
        }
    }

    // MARK: — Step 1

    @ViewBuilder
    private var emailStep: some View {
        Text("Enter their email address. They'll receive a 6-digit code to accept.")
            .font(.caption)
            .foregroundStyle(AnchorPalette.textSecondary)

        TextField("Their email address", text: $recipientEmail)
            .keyboardType(.emailAddress)
            .autocapitalization(.none)
            .padding(12)
            .background(AnchorPalette.chip)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .foregroundStyle(AnchorPalette.textPrimary)

        TextField("Add a personal note (optional)", text: $personalNote)
            .padding(12)
            .background(AnchorPalette.chip.opacity(0.6))
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .foregroundStyle(AnchorPalette.textPrimary)
            .font(.caption)

        primaryButton(label: "Continue", enabled: !recipientEmail.isEmpty) {
            error = nil
            step = .review
        }
    }

    // MARK: — Step 2

    @ViewBuilder
    private var reviewStep: some View {
        Text("Review your invitation")
            .font(.subheadline).fontWeight(.semibold)
            .foregroundStyle(AnchorPalette.textPrimary)

        VStack(alignment: .leading, spacing: 6) {
            reviewRow(label: "Recipient", value: recipientEmail)
            reviewRow(label: "From",      value: userProfileStore.displayName)
            if !personalNote.isEmpty {
                reviewRow(label: "Note", value: personalNote)
            }
        }
        .padding(12)
        .background(AnchorPalette.chip.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 10))

        Text("By sending, your partner will see your name and email. They'll be able to confirm before any accounts are shared.")
            .font(.caption)
            .foregroundStyle(AnchorPalette.textSecondary)

        HStack(spacing: 10) {
            secondaryButton(label: "Back") { step = .email }
            primaryButton(label: "Send Invitation", enabled: true) {
                Task { await send() }
            }
        }
    }

    // MARK: — Step 3

    @ViewBuilder
    private var sendingStep: some View {
        VStack(spacing: 12) {
            Image(systemName: "envelope.badge.fill")
                .font(.system(size: 44))
                .foregroundStyle(AnchorPalette.success)
            Text("Invitation sent to \(recipientEmail)")
                .foregroundStyle(AnchorPalette.textPrimary)
                .fontWeight(.semibold)
                .multilineTextAlignment(.center)
            Text("They'll receive a 6-digit code by email. Once they accept and you confirm, your connection activates.")
                .foregroundStyle(AnchorPalette.textSecondary)
                .font(.subheadline)
                .multilineTextAlignment(.center)
        }
        .padding(.vertical, 8)
    }

    // MARK: — Helpers

    private func reviewRow(label: String, value: String) -> some View {
        HStack(alignment: .top) {
            Text(label.uppercased())
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 80, alignment: .leading)
            Text(value)
                .font(.caption).fontWeight(.semibold)
                .foregroundStyle(AnchorPalette.textPrimary)
            Spacer()
        }
    }

    private func primaryButton(label: String, enabled: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack { Spacer(); Text(label).fontWeight(.semibold); Spacer() }
                .padding(.vertical, 12)
                .background(enabled ? AnchorPalette.chipActive : AnchorPalette.chip)
                .foregroundStyle(enabled ? .white : AnchorPalette.textSecondary)
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
    }

    private func secondaryButton(label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack { Spacer(); Text(label).fontWeight(.semibold); Spacer() }
                .padding(.vertical, 12)
                .background(AnchorPalette.chip.opacity(0.7))
                .foregroundStyle(AnchorPalette.textPrimary)
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    private func send() async {
        do {
            try await familyStore.createInvitation(
                ownerName: userProfileStore.displayName,
                recipientEmail: recipientEmail
            )
            withAnimation { step = .sending }
            ToastStore.shared.show("Invitation sent!", style: .success)
        } catch {
            self.error = "Failed to send invitation. Try again."
        }
    }
}
