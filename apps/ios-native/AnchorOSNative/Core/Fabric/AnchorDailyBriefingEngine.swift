import Foundation

/// Upcoming item surfaced by the Daily Briefing engine.
/// Parity: src/types/fabricBriefing.ts UpcomingItem.
struct AnchorUpcomingItem: Identifiable, Equatable {
    let id: String
    let type: Kind
    let title: String
    let dueDate: String          // ISO
    let amountCents: Int?
    let currency: String?
    let category: String?
    let isToday: Bool
    let isTomorrow: Bool
    let daysUntil: Int

    enum Kind: String, Equatable { case bill, commitment }
}

/// Pure calculator — parity port of `getUpcomingItems` from
/// src/services/fabric/DailyBriefingEngine.ts.
///
/// Returns active recurring transactions whose nextRunAt falls inside the
/// [today, today+windowDays] window. Sorted ascending by daysUntil.
enum AnchorDailyBriefingEngine {

    static func upcoming(
        recurring: [AnchorRecurringTransaction],
        now: Date,
        windowDays: Int = 7
    ) -> [AnchorUpcomingItem] {
        let cal = Calendar(identifier: .gregorian)
        let todayMidnight = cal.startOfDay(for: now)
        guard let cutoff = cal.date(byAdding: .day, value: windowDays, to: todayMidnight) else {
            return []
        }

        var items: [AnchorUpcomingItem] = []
        for r in recurring where r.isActive {
            guard let due = AnchorDateRange.parse(r.nextRunAt) else { continue }
            if due > cutoff { continue }

            let dueMidnight = cal.startOfDay(for: due)
            let daysUntil = cal.dateComponents([.day], from: todayMidnight, to: dueMidnight).day ?? 0
            if daysUntil < 0 { continue }

            items.append(AnchorUpcomingItem(
                id: r.resolvedId,
                type: .bill,
                title: r.title,
                dueDate: r.nextRunAt,
                amountCents: r.amountCents,
                currency: r.currency,
                category: r.category,
                isToday: daysUntil == 0,
                isTomorrow: daysUntil == 1,
                daysUntil: daysUntil
            ))
        }
        return items.sorted { $0.daysUntil < $1.daysUntil }
    }
}
