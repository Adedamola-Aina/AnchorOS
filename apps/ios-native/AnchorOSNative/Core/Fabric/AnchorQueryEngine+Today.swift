import Foundation

/// Today / upcoming branches of AnchorQueryEngine.
extension AnchorQueryEngine {

    static func today(_ i: Input) -> AnchorFabricQueryResult {
        let total = i.commitments.count
        let completed = i.commitments.filter(\.completed).count
        let pending = total - completed

        let summary: String
        if total == 0 {
            summary = "No scheduled tasks today — a good day to rest or tackle something new."
        } else if pending == 0 {
            summary = "All \(total) tasks done for today — great work!"
        } else {
            summary = "You have \(pending) task\(pending == 1 ? "" : "s") remaining today (\(completed)/\(total) done)."
        }

        let todayBills = i.upcoming.filter(\.isToday)
        let detail: String? = todayBills.isEmpty
            ? nil
            : "Due today: \(todayBills.map(\.title).joined(separator: ", "))."

        return .init(
            summary: summary, detail: detail,
            actions: [.init(label: "Open Commitments", kind: .navigate(page: "commitments"))]
        )
    }

    static func upcoming(_ i: Input) -> AnchorFabricQueryResult {
        if i.upcoming.isEmpty {
            return .init(
                summary: "No upcoming bills or payments in the next 7 days.",
                actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
            )
        }
        let currency = primaryCurrency(i.transactions)
        let lines = i.upcoming.prefix(5).map { u -> String in
            let when: String
            if u.isToday { when = "today" }
            else if u.isTomorrow { when = "tomorrow" }
            else { when = "in \(u.daysUntil) days" }
            let amt = u.amountCents.map { " — \(AnchorFabricEngine.formatCents($0, currency))" } ?? ""
            return "\(u.title) (\(when)\(amt))"
        }
        return .init(
            summary: "\(i.upcoming.count) upcoming payment\(i.upcoming.count == 1 ? "" : "s") in the next 7 days.",
            detail: lines.joined(separator: "\n"),
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }
}
