import Foundation

extension DateFormatter {
    static let shortTime: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f
    }()
}
