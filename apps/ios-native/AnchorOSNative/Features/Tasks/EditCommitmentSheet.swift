import SwiftUI

/// Edit Commitment — pre-filled sheet mirroring AddCommitmentSheet.
/// Writes through CommitmentsStore → CommitmentService → SecureDb.
struct EditCommitmentSheet: View {
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var familyStore: FamilyStore
    @Environment(\.dismiss) private var dismiss

    let commitment: AnchorCommitment

    @State private var type: String
    @State private var title: String
    @State private var domain: String
    @State private var timeOfDay: String
    @State private var notes: String
    @State private var priority: String
    @State private var scope: String
    @State private var remindersEnabled: Bool
    @State private var reminderTime: Date
    @State private var isSaving = false

    init(commitment: AnchorCommitment) {
        self.commitment = commitment
        _type = State(initialValue: commitment.type)
        _title = State(initialValue: commitment.title)
        _domain = State(initialValue: commitment.domain ?? "Personal Development")
        _timeOfDay = State(initialValue: commitment.timeOfDay ?? "morning")
        _notes = State(initialValue: commitment.notes ?? "")
        _priority = State(initialValue: commitment.priority ?? "medium")
        _scope = State(initialValue: commitment.scope ?? "personal")
        _remindersEnabled = State(initialValue: commitment.reminderTime != nil)
        let parsedTime = DateFormatter.shortTime.date(from: commitment.reminderTime ?? "08:00") ?? (Calendar.current.date(from: DateComponents(hour: 8, minute: 0)) ?? Date())
        _reminderTime = State(initialValue: parsedTime)
    }

    private let types: [(id: String, label: String, icon: String)] = [
        ("daily", "Daily", "arrow.clockwise"),
        ("weekly", "Weekly", "calendar.badge.clock"),
        ("monthly", "Monthly", "calendar"),
        ("todo", "One-Off", "checkmark.square"),
    ]

    private let domains = [
        "Personal Development", "Health", "Fitness", "Work",
        "Bible", "Financial", "Family", "Learning"
    ]

    private let timesOfDay = ["morning", "afternoon", "evening", "anytime"]

    private let priorities: [(id: String, label: String)] = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical")
    ]

    private var canSubmit: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    formSection("Name") {
                        AnchorFormField(placeholder: "e.g. Morning Prayer, Gym, Read 30 mins", text: $title)
                    }

                    formSection("Frequency") {
                        HStack(spacing: 8) {
                            ForEach(types, id: \.id) { t in
                                Button {
                                    type = t.id
                                } label: {
                                    HStack(spacing: 4) {
                                        Image(systemName: t.icon).font(.caption2)
                                        Text(t.label).font(.caption).fontWeight(.semibold)
                                    }
                                    .foregroundStyle(type == t.id ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 9)
                                    .background(type == t.id ? AnchorPalette.chipActive : AnchorPalette.chip)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                                .buttonStyle(.plain)
                            }
                        }
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

                    if familyStore.hasConnection {
                        formSection("Share With") {
                            HStack(spacing: 8) {
                                shareScopeButton("personal", label: "Personal")
                                shareScopeButton("family", label: "Family")
                            }
                        }
                    }

                    formSection("Reminder") {
                        Toggle("Daily reminder", isOn: $remindersEnabled)
                            .tint(AnchorPalette.chipActive)
                        if remindersEnabled {
                            DatePicker("Time", selection: $reminderTime, displayedComponents: [.hourAndMinute])
                                .tint(AnchorPalette.chipActive)
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
            .navigationTitle("Edit Commitment")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task { await submit() }
                    } label: {
                        if isSaving {
                            ProgressView().tint(.white).scaleEffect(0.8)
                        } else {
                            Text("Save")
                                .fontWeight(.semibold)
                                .foregroundStyle(canSubmit ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                        }
                    }
                    .disabled(!canSubmit || isSaving)
                }
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    private func formSection<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label.uppercased())
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            content()
        }
    }

    private func shareScopeButton(_ value: String, label: String) -> some View {
        Button {
            scope = value
        } label: {
            Text(label)
                .font(.caption).fontWeight(.semibold)
                .foregroundStyle(scope == value ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 9)
                .background(scope == value ? AnchorPalette.chipActive : AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
    }

    private func submit() async {
        guard canSubmit, !isSaving else { return }
        isSaving = true
        defer { isSaving = false }
        do {
            let trimmedTitle = title.trimmingCharacters(in: .whitespaces)
            let reminderValue = remindersEnabled ? DateFormatter.shortTime.string(from: reminderTime) : nil
            try await commitmentsStore.updateCommitment(
                taskId: commitment.resolvedId,
                title: trimmedTitle,
                type: type,
                domain: domain,
                timeOfDay: type == "daily" ? timeOfDay : nil,
                notes: notes.isEmpty ? nil : notes,
                priority: priority,
                scope: scope,
                reminderTime: reminderValue
            )
            if remindersEnabled {
                await TaskReminderService.schedule(title: trimmedTitle, taskId: commitment.resolvedId, time: reminderTime)
            } else {
                TaskReminderService.cancel(taskId: commitment.resolvedId)
            }
            ToastStore.shared.show("Commitment updated", style: .success)
            dismiss()
        } catch {
            ToastStore.shared.show("Failed to update commitment", style: .error)
        }
    }
}
