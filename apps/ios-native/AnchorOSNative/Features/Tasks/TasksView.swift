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
            .task {
                try? await Task.sleep(for: .seconds(12))
                if commitmentsStore.isLoading { loadTimedOut = true }
            }
        }
    }

    // MARK: — Progress

    private var progressCard: some View {
        AnchorCard(title: "Progress", icon: "chart.bar") {
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .stroke(AnchorPalette.chip, lineWidth: 6)
                    Circle()
                        .trim(from: 0, to: commitmentsStore.completionPercent)
                        .stroke(AnchorPalette.chipActive, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                        .animation(.easeInOut, value: commitmentsStore.completionPercent)
                }
                .frame(width: 48, height: 48)

                VStack(alignment: .leading, spacing: 4) {
                    Text("\(commitmentsStore.completedCount) of \(commitmentsStore.totalCount) complete")
                        .foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
                    Text("\(commitmentsStore.activeCount) remaining")
                        .foregroundStyle(AnchorPalette.textSecondary).font(.footnote)
                }
                Spacer()
                Text("\(Int(commitmentsStore.completionPercent * 100))%")
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .font(.title3).fontWeight(.bold)
            }
        }
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
                        taskRow(task)
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
                            taskRow(task)
                        }
                    }
                }
                .padding(.top, 4)
            }
        }
    }

    // MARK: — Task Row

    private func taskRow(_ task: AnchorCommitment) -> some View {
        HStack(spacing: 12) {
            Button {
                Task { await commitmentsStore.toggleCompleted(taskId: task.resolvedId) }
            } label: {
                Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(task.completed ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title)
                    .foregroundStyle(task.completed ? AnchorPalette.textSecondary : AnchorPalette.textPrimary)
                    .fontWeight(.semibold)
                    .strikethrough(task.completed, color: AnchorPalette.textSecondary)

                HStack(spacing: 6) {
                    Text(task.typeLabel)
                        .font(.caption2).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(AnchorPalette.chip)
                        .clipShape(Capsule())

                    if let domain = task.domainLabel {
                        Text(domain)
                            .font(.caption2).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.chipActive)
                            .padding(.horizontal, 8).padding(.vertical, 3)
                            .background(AnchorPalette.chipActive.opacity(0.15))
                            .clipShape(Capsule())
                    }

                    if let streak = task.currentStreak, streak > 1 {
                        Label("\(streak)", systemImage: "flame.fill")
                            .font(.caption2).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.warning)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
            .onTapGesture { taskToEdit = task }
            Spacer(minLength: 0)
        }
        .contextMenu {
            Button {
                taskToEdit = task
            } label: {
                Label("Edit Task", systemImage: "pencil")
            }
            Button(role: .destructive) {
                Task { try? await commitmentsStore.deleteCommitment(taskId: task.resolvedId) }
            } label: {
                Label("Delete Task", systemImage: "trash")
            }
        }
    }
}
