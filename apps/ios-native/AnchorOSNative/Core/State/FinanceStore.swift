import Foundation
import FirebaseFirestore

/// Live finance state: accounts + transactions with computed net worth.
/// Started and stopped by AnchorOSNativeApp based on auth state.
@MainActor
final class FinanceStore: ObservableObject {
    @Published private(set) var accounts: [AnchorAccount] = []
    @Published private(set) var transactions: [AnchorTransaction] = []
    @Published private(set) var isLoading = true

    private var uid: String?
    private let accountService = AccountService()
    private let transactionService = TransactionService()
    private var accountsListener: ListenerRegistration?
    private var transactionsListener: ListenerRegistration?

    // MARK: — Computed

    /// Structured net worth (per-currency) — mirrors PWA calculateNetWorth.
    var netWorth: NetWorthCalculator.Result {
        NetWorthCalculator.calculate(accounts: accounts)
    }

    /// Cents of the dominant currency only. Do NOT use this to sum across
    /// currencies — that was the regression Phase 2 fixed. For per-currency
    /// totals use `netWorth.ngnCents` / `netWorth.usdCents`.
    var netWorthCents: Int {
        let nw = netWorth
        return nw.total.currency == "NGN" ? nw.ngnCents : nw.usdCents
    }

    var netWorthFormatted: String {
        let nw = netWorth
        let symbol = nw.total.currency == "USD" ? "$" : "₦"
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return "\(symbol)\(formatter.string(from: NSNumber(value: nw.total.amount)) ?? "0.00")"
    }

    var recentTransactions: [AnchorTransaction] {
        Array(transactions.prefix(5))
    }

    // MARK: — Family Mode

    /// Accounts the user has shared with their family member (or vice-versa).
    /// Used by FamilyView and family net-worth calculations.
    var sharedAccounts: [AnchorAccount] {
        accounts.filter { ($0.scope ?? "personal") == "family" }
    }

    /// Family-mode net worth: sums every account regardless of scope. The
    /// PWA composes this from `subscribeToSharedAccounts` + the user's own
    /// accounts; on iOS the subscription already merges shared-with-me into
    /// `accounts`, so a straight calculator call produces the same total.
    /// Returns nil when there is no Family connection (caller decides display).
    var familyNetWorthFormatted: String { netWorthFormatted }

    // MARK: — Lifecycle

    func start(uid: String) {
        self.uid = uid
        isLoading = true
        accountsListener = accountService.listen(uid: uid) { [weak self] accounts in
            Task { @MainActor in
                self?.accounts = accounts
                self?.isLoading = false
            }
        }
        transactionsListener = transactionService.listen(uid: uid) { [weak self] txs in
            Task { @MainActor in
                self?.transactions = txs
            }
        }
    }

    func stop() {
        accountsListener?.remove()
        transactionsListener?.remove()
        accountsListener = nil
        transactionsListener = nil
        uid = nil
        accounts = []
        transactions = []
        isLoading = true
    }

    // MARK: — Write: Accounts

    func addAccount(name: String, type: String, currency: String, balanceCents: Int, color: String = "#3D52D5") async throws {
        guard let uid else { return }
        try await accountService.addAccount(uid: uid, name: name, type: type, currency: currency, balanceCents: balanceCents, color: color)
    }

    func deleteAccount(accountId: String) async throws {
        guard let uid else { return }
        try await accountService.deleteAccount(uid: uid, accountId: accountId)
    }

    // MARK: — Write: Transactions

    func addTransaction(
        title: String,
        amountCents: Int,
        type: String,
        category: String?,
        accountId: String,
        currency: String,
        date: String? = nil,
        isRecurring: Bool = false,
        recurringFrequency: String? = nil,
        narration: String? = nil
    ) async throws {
        guard let uid else { return }
        let accountName = accounts.first(where: { $0.resolvedId == accountId })?.name
        try await transactionService.addTransaction(
            uid: uid, title: title, amountCents: amountCents, type: type,
            category: category, accountId: accountId, accountName: accountName, currency: currency,
            date: date, isRecurring: isRecurring, recurringFrequency: recurringFrequency,
            narration: narration
        )
    }

    func deleteTransaction(transactionId: String) async throws {
        guard let uid else { return }
        try await transactionService.deleteTransaction(uid: uid, transactionId: transactionId)
    }

    func updateAccount(accountId: String, name: String, type: String, currency: String, balanceCents: Int, color: String = "#3D52D5") async throws {
        guard let uid else { return }
        try await accountService.updateAccount(uid: uid, accountId: accountId, name: name, type: type, currency: currency, balanceCents: balanceCents, color: color)
    }

    func updateTransaction(
        transactionId: String,
        title: String,
        amountCents: Int,
        type: String,
        category: String?,
        date: String? = nil,
        narration: String? = nil
    ) async throws {
        guard let uid else { return }
        try await transactionService.updateTransaction(
            uid: uid, transactionId: transactionId, title: title,
            amountCents: amountCents, type: type, category: category,
            date: date, narration: narration
        )
    }

    // MARK: — Savings Goal

    /// Phase 2: routed through SecureDb so audit fields + uid validation
    /// apply. Previous implementation bypassed the gateway and wrote to
    /// `users/{uid}` (wrong root) instead of `artifacts/anchor-os/users/{uid}`.
    func setSavingsGoal(monthlyCents: Int) async throws {
        guard let uid else { return }
        try await SecureDb.shared.setDocument(
            uid: uid,
            path: [],
            data: ["savingsGoalMonthlyCents": monthlyCents],
            merge: true
        )
    }

    // MARK: — Refresh (pull-to-refresh)

    func refresh() async {
        guard let uid else { return }
        isLoading = true
        stop()
        start(uid: uid)
    }
}
