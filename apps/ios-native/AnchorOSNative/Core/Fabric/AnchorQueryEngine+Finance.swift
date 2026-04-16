import Foundation

/// Finance branches of AnchorQueryEngine: spending, savings rate, net worth.
extension AnchorQueryEngine {

    static func spending(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let (start, end) = dateRange(for: i.intent.entities.timePeriod ?? .thisMonth, now: i.now)
        let expenses = i.transactions.filter {
            $0.type == "expense" && !$0.isSoftDeleted &&
            AnchorDateRange.inRange($0.date, start: start, end: end)
        }
        let total = expenses.reduce(0) { $0 + $1.amountCents }
        let label = periodLabel(i.intent.entities.timePeriod ?? .thisMonth)

        let summary = expenses.isEmpty
            ? "No expenses found for \(label)."
            : "You spent \(AnchorFabricEngine.formatCents(total, currency)) \(label) across \(expenses.count) transaction\(expenses.count == 1 ? "" : "s")."

        var byCategory: [String: Int] = [:]
        for e in expenses { byCategory[e.category ?? "Uncategorized", default: 0] += e.amountCents }
        let top = byCategory.max { $0.value < $1.value }
        let detail = top.map { "Top category: \($0.key) at \(AnchorFabricEngine.formatCents($0.value, currency))." }

        return .init(
            summary: summary, detail: detail,
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }

    static func savingsRate(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let (start, end) = dateRange(for: .thisMonth, now: i.now)
        let income = i.transactions
            .filter { $0.type == "income" && !$0.isSoftDeleted && AnchorDateRange.inRange($0.date, start: start, end: end) }
            .reduce(0) { $0 + $1.amountCents }
        if income == 0 {
            return .init(
                summary: "No income recorded this month yet",
                actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
            )
        }
        let expenses = i.transactions
            .filter { $0.type == "expense" && !$0.isSoftDeleted && AnchorDateRange.inRange($0.date, start: start, end: end) }
            .reduce(0) { $0 + $1.amountCents }
        let rate = Int(round(Double(income - expenses) / Double(income) * 100))
        let detail: String
        if rate >= 20 { detail = "Solid — you're above the 20% savings benchmark" }
        else if rate >= 10 { detail = "Decent — aim for 20% to build a meaningful buffer" }
        else if rate >= 0 { detail = "You're saving something, but below the 20% benchmark" }
        else { detail = "Expenses exceed income this month by \(AnchorFabricEngine.formatCents(abs(income - expenses), currency))" }

        return .init(
            summary: "You're saving \(rate)% of your income this month",
            detail: detail,
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }

    static func netWorth(_ i: Input) -> AnchorFabricQueryResult {
        let active = i.accounts.filter { !$0.isArchived }
        let nw = NetWorthCalculator.calculate(accounts: active)
        let symbol = nw.total.currency == "USD" ? "$" : "₦"
        let formatted = symbol + String(format: "%.0f", nw.total.amount)
        var detail: String?
        if nw.ngnCents != 0 && nw.usdCents != 0 {
            detail = "₦ \(AnchorFabricEngine.formatCents(nw.ngnCents, "NGN")) + $ \(AnchorFabricEngine.formatCents(nw.usdCents, "USD"))"
        }
        return .init(
            summary: "Your net worth is \(formatted) across \(active.count) account\(active.count == 1 ? "" : "s").",
            detail: detail,
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }
}
