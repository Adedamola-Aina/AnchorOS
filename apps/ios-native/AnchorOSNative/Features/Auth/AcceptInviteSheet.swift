import SwiftUI

/// Pre-auth invite acceptance landing.
/// Mirrors the PWA `/accept-invite` route. Lets a brand-new user (or an
/// existing one signing back in on a fresh device) capture their family
/// invite code BEFORE authenticating. The token is persisted to
/// @AppStorage and consumed by FamilyStore.start() on first sign-in.
struct AcceptInviteSheet: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("anchor_pending_invite_token") private var pendingToken: String = ""
    @State private var code: String = ""
    @State private var email: String = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    header
                    AnchorCard(title: "Enter Your Invite Code", icon: "key.fill") {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Paste the 6-digit code from your invitation email. We'll automatically connect your accounts after you sign in.")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)

                            TextField("Your email (so we can find your invite)", text: $email)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .padding(12)
                                .background(AnchorPalette.chip)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .foregroundStyle(AnchorPalette.textPrimary)

                            TextField("6-digit code", text: $code)
                                .keyboardType(.numberPad)
                                .padding(12)
                                .background(AnchorPalette.chip)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .foregroundStyle(AnchorPalette.textPrimary)

                            Button {
                                save()
                            } label: {
                                HStack {
                                    Spacer()
                                    Label("Save & Continue to Sign In", systemImage: "arrow.right.circle.fill")
                                        .fontWeight(.semibold)
                                    Spacer()
                                }
                                .padding(.vertical, 12)
                                .background(code.count < 6 ? AnchorPalette.chip : AnchorPalette.chipActive)
                                .foregroundStyle(code.count < 6 ? AnchorPalette.textSecondary : .white)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                            .buttonStyle(.plain)
                            .disabled(code.count < 6)
                        }
                    }

                    Text("After you sign in (or create an account), we'll automatically activate your family connection. The code will be cleared once accepted.")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 8)
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Accept Invite")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private var header: some View {
        VStack(spacing: 8) {
            Image(systemName: "person.2.badge.key.fill")
                .font(.system(size: 44))
                .foregroundStyle(AnchorPalette.chipActive)
            Text("You've been invited")
                .font(.title2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Welcome to Anchor OS Family Mode")
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .padding(.top, 8)
    }

    private func save() {
        pendingToken = code.trimmingCharacters(in: .whitespaces)
        ToastStore.shared.show("Code saved — sign in to activate", style: .success)
        dismiss()
    }
}
