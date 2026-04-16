import Foundation
import Combine

/// Reactive store that recomputes Anchor AI predictions from FinanceStore +
/// CommitmentsStore and persists dismissed prediction IDs.
///
/// Parity: mirrors the consumer-facing contract of `FabricService` in
/// src/services/fabric/FabricService.ts — get predictions, dismiss by id,
/// dismissed ids survive across sessions.
///
/// Goals & patterns are not yet loaded natively, so we pass empty arrays
/// for those. When stores land, wire them here — no other changes needed.
@MainActor
final class AnchorFabricStore: ObservableObject {

    @Published private(set) var predictions: [AnchorPrediction] = []
    @Published private(set) var weeklyReport: AnchorWeeklyReport?
    @Published private(set) var upcoming: [AnchorUpcomingItem] = []

    /// Recurring transactions feeding the upcoming feed. Native doesn't
    /// yet have a RecurringStore — this stays empty until one lands.
    private var recurringTransactions: [AnchorRecurringTransaction] = []

    private var dismissedIds: Set<String> = []
    private let storageKey = "com.anchoros.fabric.dismissedPredictionIds"
    private var cancellables: Set<AnyCancellable> = []
    private weak var financeStore: FinanceStore?
    private weak var commitmentsStore: CommitmentsStore?

    init() {
        if let stored = UserDefaults.standard.array(forKey: storageKey) as? [String] {
            dismissedIds = Set(stored)
        }
    }

    func start(financeStore: FinanceStore, commitmentsStore: CommitmentsStore) {
        self.financeStore = financeStore
        self.commitmentsStore = commitmentsStore
        recompute()
        financeStore.objectWillChange
            .sink { [weak self] _ in
                Task { @MainActor in self?.recompute() }
            }
            .store(in: &cancellables)
        commitmentsStore.objectWillChange
            .sink { [weak self] _ in
                Task { @MainActor in self?.recompute() }
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

    private func recompute() {
        guard let f = financeStore, let c = commitmentsStore else {
            predictions = []
            weeklyReport = nil
            upcoming = []
            return
        }
        let now = Date()
        let input = AnchorPredictionsEngine.Input(
            transactions: f.transactions,
            commitments: c.commitments,
            goals: [],          // TODO: wire native GoalsStore
            patterns: [],       // TODO: wire native PatternsStore
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
    }
}
