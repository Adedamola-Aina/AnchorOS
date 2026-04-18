import SwiftUI

/// WS-7 — native surface for the `feedback` callable previously missing.
/// Mirrors src/features/settings/ContactModal.tsx.
struct FeedbackSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var message = ""
    @State private var category = "general"
    @State private var contact = ""
    @State private var isSending = false
    @State private var errorMessage: String?

    private let categories = ["general", "bug", "feature", "security"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Category") {
                    Picker("Category", selection: $category) {
                        ForEach(categories, id: \.self) { c in
                            Text(c.capitalized).tag(c)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                Section("Message") {
                    TextEditor(text: $message)
                        .frame(minHeight: 120)
                        .accessibilityLabel("Feedback message")
                }
                Section("Contact (optional)") {
                    TextField("Email or phone", text: $contact)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                }
                if let errorMessage {
                    Section {
                        Text(errorMessage).foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Send Feedback")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task { await send() }
                    } label: {
                        if isSending { ProgressView() } else { Text("Send") }
                    }
                    .disabled(isSending || message.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }

    private func send() async {
        isSending = true
        defer { isSending = false }
        do {
            try await AnchorCallables.shared.sendFeedback(
                message: message,
                category: category,
                contact: contact.isEmpty ? nil : contact
            )
            AnchorHaptics.success()
            ToastStore.shared.show("Feedback sent. Thank you.", style: .success)
            dismiss()
        } catch {
            AnchorHaptics.error()
            errorMessage = error.localizedDescription
        }
    }
}
