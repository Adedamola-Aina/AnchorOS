import SwiftUI

/// Add Commitment — bottom sheet form matching PWA TaskForm fields.
/// Writes through CommitmentsStore → CommitmentService → SecureDb.
struct AddCommitmentSheet: View {
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @Environment(\.dismiss) private var dismiss

    // Step 1: frequency
    @State private var step: Int = 1
    @State private var type: String = "daily"

    // Step 2: details
    @State private var title: String = ""
    @State private var domain: String = "Personal Development"
    @State private var timeOfDay: String = "morning"
    @State private var notes: String = ""
    @State private var priority: String = "medium"
    @State private var isSaving = false

    private let priorities: [(id: String, label: String)] = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical")
    ]

    private let typeLabels: [String: String] = [
        "daily": "Daily", "weekly": "Weekly", "monthly": "Monthly", "todo": "One-Off"
    ]

    private let domains = [
        "Personal Development", "Health", "Fitness", "Work",
        "Bible", "Financial", "Family", "Learning"
    ]

    private let timesOfDay = ["morning", "afternoon", "evening", "anytime"]

    private var canSubmit: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            if step == 1 {
                AddCommitmentFrequencyStep(
                    type: $type,
                    onAdvance: { withAnimation { step = 2 } },
                    onCancel: { dismiss() }
                )
            } else {
                detailsStep
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    // MARK: — Step 1 rendered by AddCommitmentFrequencyStep (extracted for ARCH-001).

    // MARK: — Step 2: Details

    private var detailsStep: some View {
        ScrollView {
            VStack(spacing: 20) {
                formSection("Name") {
                    AnchorFormField(placeholder: "e.g. Morning Prayer, Gym, Read 30 mins", text: $title)
                }

                formSection("Domain") {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(domains, id: \.self) { d in
                                Button {
                                    domain = d
                                } label: {
                                    Text(d)
                                        .font(.caption).fontWeight(.semibold)
                                        .foregroundStyle(domain == d ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                        .padding(.horizontal, 12).padding(.vertical, 7)
                                        .background(domain == d ? AnchorPalette.chipActive : AnchorPalette.chip)
                                        .clipShape(Capsule())
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }

                if type == "daily" {
                    formSection("Time of Day") {
                        HStack(spacing: 8) {
                            ForEach(timesOfDay, id: \.self) { t in
                                Button {
                                    timeOfDay = t
                                } label: {
                                    Text(t.capitalized)
                                        .font(.caption).fontWeight(.semibold)
                                        .foregroundStyle(timeOfDay == t ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 9)
                                        .background(timeOfDay == t ? AnchorPalette.chipActive : AnchorPalette.chip)
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }

                formSection("Notes (optional)") {
                    TextField("Any context or reminders...", text: $notes, axis: .vertical)
                        .lineLimit(3, reservesSpace: true)
                        .foregroundStyle(AnchorPalette.textPrimary)
                        .padding(14)
                        .background(AnchorPalette.chip.opacity(0.6))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                }

                formSection("Priority") {
                    HStack(spacing: 8) {
                        ForEach(priorities, id: \.id) { p in
                            Button { priority = p.id } label: {
                                Text(p.label)
                                    .font(.caption).fontWeight(.semibold)
                                    .foregroundStyle(priority == p.id ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 9)
                                    .background(priority == p.id ? AnchorPalette.chipActive : AnchorPalette.chip)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
            .padding(20)
        }
        .background(AnchorBackground())
        .navigationTitle("\(typeLabels[type] ?? "") Commitment")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button {
                    withAnimation { step = 1 }
                } label: {
                    Image(systemName: "chevron.left")
                    Text("Back")
                }
                .foregroundStyle(AnchorPalette.textSecondary)
            }
            ToolbarItem(placement: .confirmationAction) {
                Button {
                    Task { await submit() }
                } label: {
                    if isSaving {
                        ProgressView().tint(.white).scaleEffect(0.8)
                    } else {
                        Text("Add")
                            .fontWeight(.semibold)
                            .foregroundStyle(canSubmit ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                    }
                }
                .disabled(!canSubmit || isSaving)
            }
        }
    }

    private func formSection<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label.uppercased())
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            content()
        }
    }

    private func submit() async {
        guard canSubmit, !isSaving else { return }
        isSaving = true
        defer { isSaving = false }
        do {
            try await commitmentsStore.addCommitment(
                title: title.trimmingCharacters(in: .whitespaces),
                type: type,
                domain: domain,
                timeOfDay: type == "daily" ? timeOfDay : nil,
                notes: notes.isEmpty ? nil : notes,
                priority: priority
            )
            ToastStore.shared.show("Commitment added", style: .success)
            dismiss()
        } catch {
            ToastStore.shared.show("Failed to save commitment", style: .error)
        }
    }
}
