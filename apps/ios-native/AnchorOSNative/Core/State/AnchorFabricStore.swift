import Foundation
import Combine

/// Reactive store that recomputes Anchor AI predictions/upcoming/proactive
/// questions from FinanceStore + CommitmentsStore + RecurringStore +
/// PatternsStore, and persists dismissed prediction IDs.
///
/// Parity: mirrors the consumer-facing contract of `FabricService` in
/// src/services/fabric/FabricService.ts.
@MainActor
final class AnchorFabricStore: ObservableObject {

    @Published private(set) var predictions: [AnchorPrediction] = []
    @Published private(set) var weeklyReport: AnchorWeeklyReport?
    @Published private(set) var upcoming: [AnchorUpcomingItem] = []
    @Published private(set) var proactiveQuestion: AnchorProactiveQuestion?

    /// NLP query surface (Phase 4e).
    @Published var queryText: String = ""
    @Published private(set) var queryResult: AnchorFabricQueryResult?
    @Published private(set) var isQuerying: Bool = false

    /// Conversation history for contextual follow-ups (Phase 4e-4).
    @Published private(set) var messages: [AnchorFabricMessage] = []
    private let maxMessages = 20

    /// Recurring transactions hydrated by `AnchorRecurringStore` (Phase 4f).
    private var recurringTransactions: [AnchorRecurringTransaction] = []

    /// Behavioral patterns hydrated by `AnchorPatternsStore` (Phase 4f).
    private var patterns: [AnchorUserPattern] = []

    /// Per-kind shownAt persistence for proactive questions. Mirrors the PWA
    /// `wasQuestionShownRecently(last, kind, now)` check — suppresses repeats
    /// of the same kind for 7 days after it was last shown/dismissed.
    private let questionShownKeyPrefix = "com.anchoros.fabric.questionShownAt."

    private var dismissedIds: Set<String> = []
    private let storageKey = "com.anchoros.fabric.dismissedPredictionIds"
    private var cancellables: Set<AnyCancellable> = []
    private weak var financeStore: FinanceStore?
    private weak var commitmentsStore: CommitmentsStore?
    private weak var recurringStore: AnchorRecurringStore?
    private weak var patternsStore: AnchorPatternsStore?

    init() {
        if let stored = UserDefaults.standard.array(forKey: storageKey) as? [String] {
            dismissedIds = Set(stored)
        }
    }

    func start(
        financeStore: FinanceStore,
        commitmentsStore: CommitmentsStore,
        recurringStore: AnchorRecurringStore? = nil,
        patternsStore: AnchorPatternsStore? = nil
    ) {
        self.financeStore = financeStore
        self.commitmentsStore = commitmentsStore
        self.recurringStore = recurringStore
        self.patternsStore = patternsStore
        recurringTransactions = recurringStore?.recurring ?? []
        patterns = patternsStore?.patterns ?? []
        recompute()
        observe(financeStore) {}
        observe(commitmentsStore) {}
        if let r = recurringStore {
            observe(r) { [weak self] in self?.recurringTransactions = r.recurring }
        }
        if let p = patternsStore {
            observe(p) { [weak self] in self?.patterns = p.patterns }
        }
    }

    private func observe<T: ObservableObject>(_ store: T, update: @escaping () -> Void) {
        store.objectWillChange
            .sink { [weak self] _ in
                Task { @MainActor in
                    update()
                    self?.recompute()
                }
            }
            .store(in: &cancellables)
    }

    func dismiss(_ predictionId: String) {
        dismissedIds.insert(predictionId)
        UserDefaults.standard.set(Array(dismissedIds), forKey: storageKey)
        predictions.removeAll { $0.id == predictionId }
    }

    func clearDismissed() {
        dismissedIds.removeAll()
        UserDefaults.standard.removeObject(forKey: storageKey)
        recompute()
    }

    /// Suppress the current question (and any repeat of its kind for 7d).
    func dismissQuestion() {
        guard let q = proactiveQuestion else { return }
        let key = questionShownKeyPrefix + q.kind.rawValue
        UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: key)
        proactiveQuestion = nil
    }

    /// Run an NLP query against currently-loaded finance + commitment state.
    /// Short-circuits on empty input. Parity: equivalent to the
    /// `handleSubmit` path in FabricPage that calls
    /// `parseIntent → runFabricQuery`.
    func submitQuery(_ raw: String) {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        guard let f = financeStore, let c = commitmentsStore else { return }
        isQuerying = true
        let intent = AnchorIntentParser.parse(trimmed, history: messages)
        let input = AnchorQueryEngine.Input(
            intent: intent,
            transactions: f.transactions,
            commitments: c.commitments,
            accounts: f.accounts,
            recurring: recurringTransactions,
            upcoming: upcoming,
            weeklyReport: weeklyReport,
            now: Date()
        )
        let result = AnchorQueryEngine.run(input)
        queryResult = result
        appendMessage(.init(role: .user, content: trimmed, timestamp: Date()))
        appendMessage(.init(role: .assistant, content: result.summary, timestamp: Date()))
        isQuerying = false
    }

    private func appendMessage(_ m: AnchorFabricMessage) {
        messages.append(m)
        if messages.count > maxMessages {
            messages.removeFirst(messages.count - maxMessages)
        }
    }

    /// Prefill the input and immediately submit — used by PromptChips.
    func runPrompt(_ prompt: String) {
        queryText = prompt
        submitQuery(prompt)
    }

    func clearQuery() {
        queryText = ""
        queryResult = nil
        messages.removeAll()
    }

    private func wasQuestionShownRecently(_ kind: AnchorProactiveQuestion.Kind, now: Date) -> Bool {
        let ts = UserDefaults.standard.double(forKey: questionShownKeyPrefix + kind.rawValue)
        return ts > 0 && (now.timeIntervalSince1970 - ts) < 7 * 24 * 3600
    }

    private func recompute() {
        guard let f = financeStore, let c = commitmentsStore else {
            predictions = []
            weeklyReport = nil
            upcoming = []
            proactiveQuestion = nil
            return
        }
        let now = Date()
        let input = AnchorPredictionsEngine.Input(
            transactions: f.transactions,
            commitments: c.commitments,
            goals: [],          // TODO: wire native GoalsStore
            patterns: patterns,
            now: now
        )
        let fresh = AnchorPredictionsEngine.build(input)
        predictions = fresh.filter { !dismissedIds.contains($0.id) }

        weeklyReport = AnchorWeeklyReportEngine.build(
            transactions: f.transactions,
            commitments: c.commitments,
            now: now
        )
        upcoming = AnchorDailyBriefingEngine.upcoming(
            recurring: recurringTransactions,
            now: now
        )

        proactiveQuestion = AnchorProactiveQuestionEngine.build(
            .init(
                patterns: patterns,
                transactions: f.transactions,
                commitments: c.commitments,
                accounts: f.accounts,
                now: now
            ),
            wasShownRecently: { [weak self] kind in
                self?.wasQuestionShownRecently(kind, now: now) ?? false
            }
        )
    }
}
