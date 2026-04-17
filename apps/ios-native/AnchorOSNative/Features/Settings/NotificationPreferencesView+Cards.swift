import SwiftUI
import UserNotifications

// MARK: - NotificationPreferencesView sub-card extensions

extension NotificationPreferencesView {

    // MARK: Push

    var pushCard: some View {
        AnchorCard(title: "Push Notifications", icon: "bell.badge") {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("System Permission")
                        .font(.subheadline).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    HStack(spacing: 6) {
                        Circle().fill(pushStatusColor).frame(width: 8, height: 8)
                        Text(pushStatusLabel)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                }
                Spacer()
                pushActionButton
            }
        }
    }

    @ViewBuilder
    private var pushActionButton: some View {
        if pushStatus == .notDetermined {
            Button("Enable") { Task { await requestPermission() } }
                .buttonStyle(.borderedProminent)
                .tint(AnchorPalette.chipActive)
        } else {
            Button("Open Settings") {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }
            .buttonStyle(.bordered)
            .tint(AnchorPalette.chipActive)
        }
    }

    var pushStatusColor: Color {
        switch pushStatus {
        case .authorized, .provisional, .ephemeral: return AnchorPalette.success
        case .denied: return AnchorPalette.danger
        default: return AnchorPalette.textSecondary
        }
    }

    var pushStatusLabel: String {
        switch pushStatus {
        case .authorized: return "Authorized"
        case .provisional: return "Provisional"
        case .ephemeral: return "Ephemeral"
        case .denied: return "Blocked in Settings"
        case .notDetermined: return "Not requested yet"
        @unknown default: return "Unknown"
        }
    }

    func refreshPushStatus() async {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        pushStatus = settings.authorizationStatus
    }

    func requestPermission() async {
        _ = try? await UNUserNotificationCenter.current()
            .requestAuthorization(options: [.alert, .badge, .sound])
        await refreshPushStatus()
    }

    // MARK: Categories

    var categoriesCard: some View {
        AnchorCard(title: "Categories", icon: "square.grid.2x2") {
            VStack(alignment: .leading, spacing: 14) {
                categoryRow(icon: "creditcard.fill", label: "Finance",
                            desc: "Transactions, budgets, and account alerts",
                            value: $categoryFinance)
                Divider().background(AnchorPalette.cardBorder)
                categoryRow(icon: "checkmark.square.fill", label: "Commitments",
                            desc: "Task reminders and streak updates",
                            value: $categoryCommitments)
                Divider().background(AnchorPalette.cardBorder)
                categoryRow(icon: "person.2.fill", label: "Family",
                            desc: "Invitations and shared activity",
                            value: $categoryFamily)
            }
        }
    }

    private func categoryRow(icon: String, label: String, desc: String, value: Binding<Bool>) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(AnchorPalette.chipActive)
                .frame(width: 24)
            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text(desc)
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            Spacer()
            Toggle("", isOn: value).labelsHidden().tint(AnchorPalette.chipActive)
        }
    }

    // MARK: Quiet Hours

    var quietHoursCard: some View {
        AnchorCard(title: "Quiet Hours", icon: "moon.fill") {
            VStack(alignment: .leading, spacing: 12) {
                Toggle(isOn: $quietEnabled) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Enable Quiet Hours")
                            .font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("Suppress push during set hours")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                }
                .tint(AnchorPalette.chipActive)

                if quietEnabled {
                    HStack(spacing: 12) {
                        quietField(title: "From", value: $quietStart)
                        Image(systemName: "arrow.right")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                        quietField(title: "Until", value: $quietEnd)
                    }
                    .createSlideIn()
                }
            }
        }
    }

    private func quietField(title: String, value: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            TextField("HH:mm", text: value)
                .keyboardType(.numbersAndPunctuation)
                .font(.subheadline.monospacedDigit())
                .foregroundStyle(AnchorPalette.textPrimary)
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
                .background(AnchorPalette.chip.opacity(0.5))
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
    }
}
