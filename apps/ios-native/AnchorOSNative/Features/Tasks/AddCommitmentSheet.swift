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

    private let types: [(id: String, label: String, icon: String, desc: String)] = [
        ("daily", "Daily", "arrow.clockwise", "Repeats every day"),
        ("weekly", "Weekly", "calendar.badge.clock", "Repeats each week"),
        ("monthly", "Monthly", "calendar", "Repeats each month"),
        ("todo", "One-Off", "checkmark.square", "Do it once"),
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
                frequencyStep
            } else {
                detailsStep
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    // MARK: — Step 1: Frequency

    private var frequencyStep: some View {
        ScrollView {
            VStack(spacing: 12) {
                Text("How often?")
                    .font(.title3).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .padding(.top, 8)

                ForEach(types, id: \.id) { t in
                    Button {
                        type = t.id
                        withAnimation { step = 2 }
                    } label: {
                        HStack(spacing: 14) {
                            Image(systemName: t.icon)
                                .font(.title3)
                                .foregroundStyle(AnchorPalette.chipActive)
                                .frame(width: 32)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(t.label)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                    .fontWeight(.semibold)
                                Text(t.desc)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                                    .font(.caption)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                        .padding(16)
                        .background(AnchorPalette.card)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(20)
        }
        .background(AnchorBackground())
        .navigationTitle("New Commitment")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") { dismiss() }.foregroundStyle(AnchorPalette.textSecondary)
            }
        }
    }

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
        .navigationTitle("\(types.first(where: { $0.id == type })?.label ?? "") Commitment")
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
