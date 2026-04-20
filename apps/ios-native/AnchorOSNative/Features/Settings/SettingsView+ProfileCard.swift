import SwiftUI

extension SettingsView {
    // MARK: — Profile

    var profileCard: some View {
        AnchorCard(title: "Profile", icon: "person.circle") {
            VStack(alignment: .leading, spacing: 10) {
                // Avatar row — PWA ProfileSettings Avatar parity (initials-based, no upload).
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(AnchorPalette.chipActive.opacity(0.18))
                            .frame(width: 56, height: 56)
                        Text(avatarInitials)
                            .font(.title3).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.chipActive)
                    }
                    .accessibilityLabel("Avatar for \(userProfileStore.displayName)")

                    VStack(alignment: .leading, spacing: 2) {
                        Text(userProfileStore.displayName)
                            .font(.headline)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text(userProfileStore.email.isEmpty ? "No email" : userProfileStore.email)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                }
                .padding(.bottom, 4)

                // Editable display name row
                HStack {
                    Text("Display Name")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.subheadline)
                    Spacer()
                    if editingName {
                        TextField("Name", text: $nameInput)
                            .multilineTextAlignment(.trailing)
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .submitLabel(.done)
                            .onSubmit {
                                Task {
                                    try? await userProfileStore.updateDisplayName(nameInput)
                                    editingName = false
                                    ToastStore.shared.show("Name updated", style: .success)
                                }
                            }
                        Button("Save") {
                            Task {
                                try? await userProfileStore.updateDisplayName(nameInput)
                                editingName = false
                                ToastStore.shared.show("Name updated", style: .success)
                            }
                        }
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(AnchorPalette.chipActive)
                    } else {
                        Button {
                            nameInput = userProfileStore.displayName
                            editingName = true
                        } label: {
                            HStack(spacing: 4) {
                                Text(userProfileStore.displayName)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                    .font(.subheadline)
                                Image(systemName: "pencil")
                                    .font(.caption)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                row("Email", userProfileStore.email.isEmpty ? "—" : userProfileStore.email)
                row("Sign-in Method", "Email & Password")
                // Currency picker
                HStack {
                    Text("Currency")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.subheadline)
                    Spacer()
                    Menu {
                        ForEach(currencies, id: \.self) { c in
                            Button {
                                Task {
                                    try? await userProfileStore.updateCurrency(c)
                                    ToastStore.shared.show("Currency updated to \(c)", style: .success)
                                }
                            } label: {
                                HStack {
                                    Text(c)
                                    if c == userProfileStore.currency {
                                        Spacer()
                                        Image(systemName: "checkmark")
                                    }
                                }
                            }
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Text(userProfileStore.currency)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .fontWeight(.semibold)
                                .font(.subheadline)
                            Image(systemName: "chevron.up.chevron.down")
                                .font(.caption2)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                }
                row("MFA", userProfileStore.mfaEnabled ? "Enabled" : "Disabled")
            }
        }
    }

    // MARK: — Family Nav

    var familyNavCard: some View {
        NavigationLink(destination: FamilyView()
            .environmentObject(familyStore)
            .environmentObject(userProfileStore)
            .environmentObject(financeStore)
        ) {
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(AnchorPalette.chipActive.opacity(0.15))
                        .frame(width: 40, height: 40)
                    Image(systemName: "person.2.fill")
                        .font(.subheadline)
                        .foregroundStyle(AnchorPalette.chipActive)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text("Family Mode")
                        .fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(familyStore.hasConnection
                         ? "Connected with \(familyStore.partnerName)"
                         : "Invite a family member")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }

                Spacer()

                if familyStore.hasConnection {
                    HStack(spacing: 4) {
                        Circle().fill(AnchorPalette.success).frame(width: 8, height: 8)
                        Text("Active")
                            .font(.caption2).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.success)
                    }
                }

                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .padding(16)
            .background(AnchorPalette.chip.opacity(0.5))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }

    // MARK: — Helpers

    var avatarInitials: String {
        let name = userProfileStore.displayName.trimmingCharacters(in: .whitespaces)
        if name.isEmpty { return "?" }
        let parts = name.split(separator: " ")
        if parts.count >= 2, let f = parts.first?.first, let l = parts.last?.first {
            return "\(f)\(l)".uppercased()
        }
        return String(name.prefix(2)).uppercased()
    }

    func row(_ key: String, _ value: String) -> some View {
        HStack {
            Text(key).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
