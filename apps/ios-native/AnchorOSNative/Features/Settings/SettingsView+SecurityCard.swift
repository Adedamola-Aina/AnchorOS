import SwiftUI

extension SettingsView {
    // MARK: — Security

    var securityCard: some View {
        AnchorCard(title: "Security", icon: "lock.shield") {
            VStack(alignment: .leading, spacing: 4) {
                securityNavRow(
                    icon: "key.fill",
                    label: "Change Password",
                    subtitle: "Update your account password"
                ) { showPasswordChange = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "envelope.badge.shield.half.filled",
                    label: "Change Email",
                    subtitle: userProfileStore.email.isEmpty ? "Not set" : userProfileStore.email
                ) { showEmailChange = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "lock.shield.fill",
                    label: "Two-Factor Authentication",
                    subtitle: userProfileStore.mfaEnabled ? "Enabled" : "Not enrolled"
                ) { showMFAEnrollment = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "key.2.on.ring.fill",
                    label: "Recovery Codes",
                    subtitle: "View or regenerate backup codes"
                ) { showRecoveryCodes = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "faceid",
                    label: "Passkeys",
                    subtitle: "Manage your passkey devices"
                ) { showPasskeyManager = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "lock.circle.fill",
                    label: "Biometric Lock",
                    subtitle: biometricLock.isEnabled
                        ? "\(biometricLock.biometryLabel) enabled"
                        : "Require Face ID / Touch ID on open"
                ) { showBiometricLock = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "clock.arrow.circlepath",
                    label: "Login History",
                    subtitle: "View recent sign-in activity"
                ) { showAuthHistory = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "laptopcomputer.and.iphone",
                    label: "Active Sessions",
                    subtitle: "Manage and revoke signed-in devices"
                ) { showAuthSessions = true }
            }
        }
        .sheet(isPresented: $showPasswordChange) {
            PasswordChangeView().environmentObject(appState)
        }
        .sheet(isPresented: $showEmailChange) {
            EmailChangeView().environmentObject(appState)
        }
        .sheet(isPresented: $showMFAEnrollment) {
            MFAEnrollmentView().environmentObject(appState)
        }
        .sheet(isPresented: $showRecoveryCodes) {
            RecoveryCodesSettingsView()
        }
        .sheet(isPresented: $showPasskeyManager) {
            PasskeyManagerView()
        }
        .sheet(isPresented: $showBiometricLock) {
            BiometricLockSheet()
                .environmentObject(biometricLock)
        }
        .sheet(isPresented: $showAuthHistory) {
            AuthEventHistoryView()
        }
        .sheet(isPresented: $showAuthSessions) {
            AuthSessionListView().environmentObject(appState)
        }
        .sheet(isPresented: $showNotificationPrefs) {
            NotificationPreferencesView()
        }
        .sheet(isPresented: $showAnchorAI) {
            AnchorAISettingsView()
        }
        .sheet(isPresented: $showDeveloperTools) {
            DeveloperToolsView()
                .environmentObject(appState)
                .environmentObject(financeStore)
        }
        .sheet(isPresented: $showImportSheet) {
            DataImportSheet()
                .environmentObject(userProfileStore)
                .environmentObject(financeStore)
                .environmentObject(commitmentsStore)
        }
    }

    func securityNavRow(icon: String, label: String, subtitle: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.chipActive)
                    .frame(width: 24)
                VStack(alignment: .leading, spacing: 2) {
                    Text(label)
                        .font(.subheadline).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .padding(.vertical, 10)
        }
        .buttonStyle(.plain)
    }
}
