import SwiftUI

// MARK: - AuthEventHistoryView
// Shows recent login events fetched from Cloud Function.
// Matches PWA AuthEventHistory + AuthSessionList (AUTH-003).

struct AuthEventHistoryView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var events: [[String: Any]] = []
    @State private var isLoading = true
    @State private var errorMessage: String?
    @State private var reportingId: String?
    @State private var revokingId: String?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    if isLoading {
                        ProgressView()
                            .tint(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.top, 40)
                    } else if let error = errorMessage {
                        errorCard(error)
                    } else if events.isEmpty {
                        emptyState
                    } else {
                        infoRow("Showing your recent sign-in activity. Tap \"Not me\" to flag unrecognised logins.")
                        ForEach(Array(events.enumerated()), id: \.offset) { _, event in
                            eventCard(event)
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Login History")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .task { await loadEvents() }
        }
    }

    // MARK: — Event Card

    private func eventCard(_ event: [String: Any]) -> some View {
        let eventId = event["id"] as? String ?? ""
        let method = event["method"] as? String ?? "unknown"
        let timestamp = event["timestamp"] as? String ?? ""
        let device = (event["deviceInfo"] as? [String: Any])?["model"] as? String ?? "Unknown Device"
        let os = (event["deviceInfo"] as? [String: Any])?["os"] as? String ?? ""
        let isCurrent = event["isCurrent"] as? Bool ?? false

        return VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: methodIcon(method))
                    .foregroundStyle(AnchorPalette.chipActive)
                VStack(alignment: .leading, spacing: 2) {
                    Text(methodLabel(method))
                        .fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(formatTimestamp(timestamp))
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                Spacer()
                if isCurrent {
                    Text("CURRENT")
                        .font(.caption2).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.success)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(AnchorPalette.success.opacity(0.15))
                        .clipShape(Capsule())
                }
            }

            HStack(spacing: 6) {
                Image(systemName: "iphone")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                Text("\(device) · \(os)")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }

            if !isCurrent && !eventId.isEmpty {
                HStack(spacing: 8) {
                    Button {
                        Task { await reportEvent(eventId) }
                    } label: {
                        Text(reportingId == eventId ? "Reporting…" : "Not me")
                            .font(.caption).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.danger)
                            .padding(.horizontal, 12).padding(.vertical, 6)
                            .background(AnchorPalette.danger.opacity(0.12))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .disabled(reportingId == eventId)

                    Button {
                        Task { await revokeEvent(eventId) }
                    } label: {
                        Text(revokingId == eventId ? "Revoking…" : "Revoke session")
                            .font(.caption).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.warning)
                            .padding(.horizontal, 12).padding(.vertical, 6)
                            .background(AnchorPalette.warning.opacity(0.12))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .disabled(revokingId == eventId)
                }
            }
        }
        .padding(14)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
    }

    // MARK: — Actions

    private func loadEvents() async {
        isLoading = true
        do {
            events = try await AuthEventService.getAuthEvents()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    private func reportEvent(_ eventId: String) async {
        reportingId = eventId
        defer { reportingId = nil }
        do {
            try await AuthEventService.reportUnrecognised(eventId: eventId)
            ToastStore.shared.show("Login reported. We'll review it.", style: .info)
        } catch {
            ToastStore.shared.show("Failed to report login.", style: .error)
        }
    }

    private func revokeEvent(_ eventId: String) async {
        revokingId = eventId
        defer { revokingId = nil }
        do {
            try await AuthEventService.revokeSession(eventId: eventId)
            ToastStore.shared.show("Session revoked.", style: .success)
            await loadEvents()
        } catch {
            ToastStore.shared.show("Failed to revoke session.", style: .error)
        }
    }

    // MARK: — Helpers

    private func methodIcon(_ method: String) -> String {
        switch method {
        case "google": return "g.circle.fill"
        case "apple": return "apple.logo"
        case "totp": return "lock.shield"
        default: return "envelope.fill"
        }
    }

    private func methodLabel(_ method: String) -> String {
        switch method {
        case "google": return "Google Sign-In"
        case "apple": return "Apple Sign-In"
        case "totp": return "MFA Verification"
        default: return "Email & Password"
        }
    }

    private func formatTimestamp(_ timestamp: String) -> String {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = iso.date(from: timestamp) ?? ISO8601DateFormatter().date(from: timestamp) {
            let rel = RelativeDateTimeFormatter()
            rel.unitsStyle = .full
            return rel.localizedString(for: date, relativeTo: Date())
        }
        return timestamp
    }

    // MARK: — Subviews

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "clock.badge.checkmark")
                .font(.system(size: 40))
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("No login history yet.")
                .font(AnchorTypography.body)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 60)
    }

    private func errorCard(_ message: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "exclamationmark.triangle")
                .foregroundStyle(AnchorPalette.warning)
            Text(message)
                .font(.footnote)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.warning.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func infoRow(_ text: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "info.circle")
                .foregroundStyle(AnchorPalette.chipActive)
            Text(text)
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.chipActive.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
