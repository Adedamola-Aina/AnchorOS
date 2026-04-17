import SwiftUI

/// Commitments screen with live Firestore data + toggle-complete interactions.
/// Data source: CommitmentsStore (uid-scoped via SecureDb)
struct TasksView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @State private var selectedFilter: String = "All"
    @State private var completedExpanded: Bool = false
    @State private var showAddCommitment = false
    @State private var taskToEdit: AnchorCommitment?
    @State private var loadTimedOut = false

    private let filters = ["All", "Daily", "Weekly", "Monthly", "Todo"]

    private var activeFiltered: [AnchorCommitment] {
        let base = selectedFilter == "All" ? commitmentsStore.commitments : commitmentsStore.commitments.filter {
            $0.type.lowercased() == selectedFilter.lowercased()
        }
        return base.filter { !$0.completed }
    }

    private var completedFiltered: [AnchorCommitment] {
        let base = selectedFilter == "All" ? commitmentsStore.commitments : commitmentsStore.commitments.filter {
            $0.type.lowercased() == selectedFilter.lowercased()
        }
        return base.filter { $0.completed }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    Color.clear.frame(height: 0).id(ScrollToTopAnchor.id)
                    // Filter chips — single row, state-bound
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(filters, id: \.self) { f in
                                Button {
                                    selectedFilter = f
                                } label: {
                                    Text(f.uppercased())
                                        .font(.caption).fontWeight(.bold)
                                        .foregroundStyle(selectedFilter == f ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                        .padding(.horizontal, 16).padding(.vertical, 8)
                                        .background(selectedFilter == f ? AnchorPalette.chipActive : AnchorPalette.chip)
                                        .clipShape(Capsule())
                                }
                                .buttonStyle(.plain)
                                .anchorPressable()
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    progressCard

                    // Active tasks section
                    if commitmentsStore.isLoading {
                        ProgressView().tint(.white).frame(maxWidth: .infinity)
                    } else if loadTimedOut && commitmentsStore.commitments.isEmpty {
                        AnchorErrorBanner()
                    } else {
                        activeSectionCard
                        if !completedFiltered.isEmpty {
                            completedSectionCard
                        }
                    }
                }
                .padding(16)
            }
            .scrollsToTopOnTabRetap(tab: 1)
            .background(AnchorBackground())
            .navigationTitle("Tasks")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showAddCommitment = true
                    } label: {
                        Image(systemName: "plus")
                            .font(.body.weight(.semibold))
                            .foregroundStyle(AnchorPalette.textPrimary)
                    }
                }
            }
            .sheet(isPresented: $showAddCommitment) {
                AddCommitmentSheet()
                    .environmentObject(commitmentsStore)
            }
            .sheet(item: $taskToEdit) { task in
                EditCommitmentSheet(commitment: task)
                    .environmentObject(commitmentsStore)
            }
            .refreshable { await commitmentsStore.refresh() }
            .task {
                try? await Task.sleep(for: .seconds(12))
                if commitmentsStore.isLoading { loadTimedOut = true }
            }
        }
    }

    // MARK: — Progress

    private var progressCard: some View {
        TasksProgressCard(
            completed: commitmentsStore.completedCount,
            total: commitmentsStore.totalCount,
            active: commitmentsStore.activeCount,
            percent: commitmentsStore.completionPercent
        )
    }

    // MARK: — Active Tasks

    private var activeSectionCard: some View {
        AnchorCard(title: "Active Tasks", icon: "square.and.pencil") {
            if activeFiltered.isEmpty {
                Text(selectedFilter == "All" ? "All done! 🎉" : "No active \(selectedFilter.lowercased()) tasks.")
                    .foregroundStyle(AnchorPalette.textSecondary).font(.subheadline)
            } else {
                VStack(alignment: .leading, spacing: 14) {
                    ForEach(activeFiltered) { task in
                        SwipeableRow(
                            deleteAction: {
                                Task { try? await commitmentsStore.deleteCommitment(taskId: task.resolvedId) }
                            },
                            editAction: { taskToEdit = task }
                        ) {
                            taskRow(task)
                        }
                    }
                }
            }
        }
    }

    // MARK: — Completed Tasks (collapsible)

    private var completedSectionCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            Button {
                withAnimation(.easeInOut(duration: 0.25)) {
                    completedExpanded.toggle()
                }
            } label: {
                HStack {
                    Text("COMPLETED (\(completedFiltered.count))")
                        .font(.caption).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.textSecondary)
                    Spacer()
                    Image(systemName: completedExpanded ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                .padding(.horizontal, 16).padding(.vertical, 12)
                .background(AnchorPalette.chip.opacity(0.6))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .buttonStyle(.plain)

            if completedExpanded {
                AnchorCard(title: "", icon: "checkmark.circle.fill") {
                    VStack(alignment: .leading, spacing: 14) {
                        ForEach(completedFiltered) { task in
                            SwipeableRow(
                                deleteAction: {
                                    Task { try? await commitmentsStore.deleteCommitment(taskId: task.resolvedId) }
                                },
                                editAction: { taskToEdit = task }
                            ) {
                                taskRow(task)
                            }
                        }
                    }
                }
                .padding(.top, 4)
            }
        }
    }

    // MARK: — Task Row (extracted to TaskRowView)

    private func taskRow(_ task: AnchorCommitment) -> some View {
        TaskRowView(
            task: task,
            onToggle: { Task { await commitmentsStore.toggleCompleted(taskId: task.resolvedId) } },
            onTap: { taskToEdit = task }
        )
    }
}
