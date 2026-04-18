import UIKit
import UserNotifications
import FirebaseCore
import FirebaseAppCheck
import FirebaseCrashlytics
import FirebaseMessaging

extension Notification.Name {
    static let anchorDidReceivePushToken = Notification.Name("anchorDidReceivePushToken")
}

/// WS-2 — installs the App Attest provider before `FirebaseApp.configure()` so
/// Firestore + Functions + Auth requests carry a valid App Check token. Debug
/// builds fall back to the Debug provider so Xcode Cloud + simulator builds keep
/// working without real attestation.
final class AnchorAppCheckProviderFactory: NSObject, AppCheckProviderFactory {
    func createProvider(with app: FirebaseApp) -> AppCheckProvider? {
        #if DEBUG
        return AppCheckDebugProvider(app: app)
        #else
        if #available(iOS 14.0, *) {
            return AppAttestProvider(app: app)
        }
        return DeviceCheckProvider(app: app)
        #endif
    }
}

final class AnchorAppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        // App Check must be installed BEFORE FirebaseApp.configure() — after
        // that point Firebase has already chosen a provider and won't swap.
        AppCheck.setAppCheckProviderFactory(AnchorAppCheckProviderFactory())

        UNUserNotificationCenter.current().delegate = self
        Messaging.messaging().delegate = self

        // Crashlytics auto-initializes once FirebaseCore is configured in
        // AnchorOSNativeApp.init(). Record the launch so we can validate that
        // crash pipelines are live in TestFlight.
        Crashlytics.crashlytics().setCustomValue("native", forKey: "surface")
        AnchorTelemetry.shared.logEvent("app_launch", params: ["surface": "native"])
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
        let token = deviceToken.map { String(format: "%02x", $0) }.joined()
        NotificationCenter.default.post(
            name: .anchorDidReceivePushToken,
            object: nil,
            userInfo: ["token": token, "source": "apns"]
        )
    }

    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let fcmToken, !fcmToken.isEmpty else { return }
        NotificationCenter.default.post(
            name: .anchorDidReceivePushToken,
            object: nil,
            userInfo: ["token": fcmToken, "source": "fcm"]
        )
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound, .badge])
    }
}
