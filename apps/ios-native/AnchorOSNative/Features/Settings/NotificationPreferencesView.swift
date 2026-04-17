import SwiftUI
import UserNotifications

/// Notification preferences sheet — parity with PWA
/// NotificationSettings + NotificationCategoryToggles + QuietHoursSettings.
///
/// Persistence: local @AppStorage only. The Firestore user profile schema
/// currently exposes only `notifications: Bool`, so category/quiet-hours
/// state is device-scoped until the backend schema grows.
///
/// Sub-cards (push/categories/quiet hours) live in
/// NotificationPreferencesView+Cards.swift to honor ARCH-001 (≤200 lines).
struct NotificationPreferencesView: View {
    @Environment(\.dismiss) private var dismiss

    @AppStorage("anchor_notify_finance")      var categoryFinance: Bool = true
    @AppStorage("anchor_notify_commitments")  var categoryCommitments: Bool = true
    @AppStorage("anchor_notify_family")       var categoryFamily: Bool = true
    @AppStorage("anchor_notify_frequency")    var frequency: String = "instant"
    @AppStorage("anchor_quiet_enabled")       var quietEnabled: Bool = false
    @AppStorage("anchor_quiet_start")         var quietStart: String = "22:00"
    @AppStorage("anchor_quiet_end")           var quietEnd: String = "07:00"

    @State var pushStatus: UNAuthorizationStatus = .notDetermined

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    pushCard
                    frequencyCard
                    categoriesCard
                    quietHoursCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .task { await refreshPushStatus() }
        }
    }

    private var frequencyCard: some View {
        AnchorCard(title: "Frequency", icon: "clock") {
            Picker("Frequency", selection: $frequency) {
                Text("Instant").tag("instant")
                Text("Daily").tag("daily")
                Text("Weekly").tag("weekly")
            }
            .pickerStyle(.segmented)
        }
    }
}
