import Foundation
import FirebaseCore

enum FirebaseBootstrap {
    static func configure(environment: AppEnvironment) -> String {
        if FirebaseApp.app() != nil {
            return "Firebase configured (\(environment.rawValue))."
        }

        guard let path = Bundle.main.path(forResource: environment.firebasePlistName, ofType: "plist") else {
            return "Missing \(environment.firebasePlistName).plist in app bundle."
        }

        guard let options = FirebaseOptions(contentsOfFile: path) else {
            return "Invalid Firebase plist for \(environment.rawValue)."
        }

        FirebaseApp.configure(options: options)
        return "Firebase ready (\(environment.rawValue))."
    }
}
