import Foundation

/// Extended query branches (Phase 4e-3) and record-transaction NLP
/// (Phase 4e-2). Parity ports of:
///   - src/services/fabric/query/financeQueries.ts (income, record)
///   - src/services/fabric/query/accountQueries.ts (accounts, recurring)
///   - src/services/fabric/query/momentumQueries.ts
///   - src/services/fabric/query/scenarioQueries.ts
extension AnchorQueryEngine {

    // MARK: — record_expense / record_income (Phase 4e-2)

    static func recordTransaction(_ i: Input,
                                  type: AnchorFabricQueryResult.ActionKind.TransactionKind)
    -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let amount = i.intent.entities.amount
        let category = i.intent.entities.category
        let label = type == .expense ? "expense" : "income"

        let summary: String
        if let a = amount {
            let cents = Int((a * 100).rounded())
            summary = "Ready to log an \(label) of \(AnchorFabricEngine.formatCents(cents, currency))" +
                      (category.map { " in \($0)" } ?? "") + "."
        } else {
            summary = "Opening transaction form."
        }
        return .init(
            summary: summary,
            actions: [
                .init(label: "Add Transaction",
                      kind: .openAddTransaction(type: type, amount: amount, category: category))
            ]
        )
    }

    // MARK: — query_income (Phase 4e-3)

    static func income(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let (start, end) = dateRange(for: i.intent.entities.timePeriod ?? .thisMonth, now: i.now)
        let incomes = i.transactions.filter {
            $0.type == "income" && !$0.isSoftDeleted &&
            AnchorDateRange.inRange($0.date, start: start, end: end)
        }
        let total = incomes.reduce(0) { $0 + $1.amountCents }
        let label = periodLabel(i.intent.entities.timePeriod ?? .thisMonth)
        let summary = incomes.isEmpty
            ? "No income recorded for \(label)."
            : "You earned \(AnchorFabricEngine.formatCents(total, currency)) \(label) across \(incomes.count) income transaction\(incomes.count == 1 ? "" : "s")."
        return .init(
            summary: summary,
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }

    // MARK: — query_accounts

    static func accountsSummary(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let active = i.accounts.filter { !$0.isArchived }
        if active.isEmpty {
            return .init(
                summary: "No accounts found. Add an account in Finance to get started.",
                actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
            )
        }
        let total = active.reduce(0) { $0 + $1.balanceCents }
        let top = active.max { $0.balanceCents < $1.balanceCents }
        return .init(
            summary: "You have \(active.count) account\(active.count == 1 ? "" : "s") with a combined balance of \(AnchorFabricEngine.formatCents(total, currency)).",
            detail: top.map { "Highest balance: \($0.name) at \(AnchorFabricEngine.formatCents($0.balanceCents, currency))." },
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }

    // MARK: — query_recurring

    static func recurringSummary(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let active = i.recurring.filter { $0.status == "active" }
        if active.isEmpty {
            return .init(
                summary: "No active recurring transactions found.",
                actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
            )
        }
        let monthly = active.filter { $0.frequency == "monthly" }.reduce(0) { $0 + $1.amountCents }
        let next = active.sorted {
            (AnchorDateRange.parse($0.nextRunAt) ?? .distantFuture) <
            (AnchorDateRange.parse($1.nextRunAt) ?? .distantFuture)
        }.first

        var summary = "You have \(active.count) active recurring transaction\(active.count == 1 ? "" : "s")"
        if monthly > 0 {
            summary += ", totalling \(AnchorFabricEngine.formatCents(monthly, currency))/month"
        }
        summary += "."

        let df = DateFormatter(); df.dateStyle = .medium
        let detail = next.map { n in
            let dateStr = AnchorDateRange.parse(n.nextRunAt).map(df.string(from:)) ?? n.nextRunAt
            return "Next due: \(n.title) on \(dateStr)."
        }
        return .init(summary: summary, detail: detail,
                     actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))])
    }

    // MARK: — query_momentum

    static func momentum(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let (thisStart, thisEnd) = weekRange(i.now)
        let cal = Calendar(identifier: .gregorian)
        let lastEnd = thisStart
        let lastStart = cal.date(byAdding: .day, value: -7, to: thisStart) ?? thisStart

        func sum(_ type: String, _ s: Date, _ e: Date) -> Int {
            i.transactions
                .filter { $0.type == type && !$0.isSoftDeleted &&
                          AnchorDateRange.inRange($0.date, start: s, end: e) }
                .reduce(0) { $0 + $1.amountCents }
        }

        let thisSpend = sum("expense", thisStart, thisEnd)
        let lastSpend = sum("expense", lastStart, lastEnd)
        let thisIncome = sum("income", thisStart, thisEnd)
        let net = thisIncome - thisSpend
        let expensePct = lastSpend == 0
            ? (thisSpend > 0 ? 100.0 : 0.0)
            : Double(thisSpend - lastSpend) / Double(lastSpend) * 100.0
        let spendingDir = expensePct >= 0 ? "up" : "down"
        let cashFlowDir = net >= 0 ? "positive" : "negative"

        return .init(
            summary: "This week vs last week: spending \(spendingDir) \(Int(round(abs(expensePct))))%, net cash flow \(cashFlowDir).",
            detail: "This week net cash flow is \(AnchorFabricEngine.formatCents(net, currency)).",
            actions: [.init(label: "Open Dashboard", kind: .navigate(page: "dashboard"))]
        )
    }

    // MARK: — query_scenario

    static func scenario(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let category = i.intent.entities.category
        let pct: Double = {
            if let a = i.intent.entities.amount, a <= 100 { return a }
            return 20
        }()
        let months = 3

        // 3-month baseline expense average (in cents).
        let cal = Calendar(identifier: .gregorian)
        let start = cal.date(byAdding: .month, value: -3, to: i.now) ?? i.now
        let recent = i.transactions.filter {
            $0.type == "expense" && !$0.isSoftDeleted &&
            AnchorDateRange.inRange($0.date, start: start, end: i.now)
        }
        let total = recent.reduce(0) { $0 + $1.amountCents }
        let monthlyBaseline = Int(Double(total) / 3.0)

        let catShare: Int
        if let c = category {
            catShare = recent.filter { ($0.category ?? "").lowercased().contains(c.lowercased()) }
                .reduce(0) { $0 + $1.amountCents } / 3
        } else {
            catShare = monthlyBaseline
        }
        let monthlySavings = Int(Double(catShare) * pct / 100.0)
        let totalSavings = monthlySavings * months

        let catLabel = category ?? "overall spending"
        return .init(
            summary: "If you cut \(catLabel) by \(Int(pct))%, you'd save ~\(AnchorFabricEngine.formatCents(totalSavings, currency)) over \(months) months.",
            detail: "Baseline: \(AnchorFabricEngine.formatCents(monthlyBaseline, currency))/mo expenses. Projected monthly savings: \(AnchorFabricEngine.formatCents(monthlySavings, currency)).",
            actions: [.init(label: "View spending", kind: .navigate(page: "finance"))]
        )
    }
}
