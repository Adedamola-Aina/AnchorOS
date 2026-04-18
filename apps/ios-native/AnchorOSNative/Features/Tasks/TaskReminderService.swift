import Foundation
import UserNotifications

/// Local reminder scheduling for commitments.
/// Gives the native app parity with the PWA reminder-time feature using the
/// OS notification center.
enum TaskReminderService {
    static func schedule(title: String, taskId: String, time: Date) async {
        let center = UNUserNotificationCenter.current()
        _ = try? await center.requestAuthorization(options: [.alert, .sound, .badge])

        let comps = Calendar.current.dateComponents([.hour, .minute], from: time)
        let content = UNMutableNotificationContent()
        content.title = "Commitment Reminder"
        content.body = title
        content.sound = .default
        content.badge = 1

        let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
        let request = UNNotificationRequest(identifier: "commitment-\(taskId)", content: content, trigger: trigger)
        try? await center.add(request)
    }

    static func cancel(taskId: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["commitment-\(taskId)"])
    }
}
