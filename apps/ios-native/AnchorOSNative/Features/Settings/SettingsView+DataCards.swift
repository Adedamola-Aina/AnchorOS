import SwiftUI

extension SettingsView {
    // MARK: — Alerts

    var alertsCard: some View {
        AnchorCard(title: "Alerts", icon: "bell") {
            Button { showNotificationPrefs = true } label: {
                HStack(spacing: 12) {
                    Image(systemName: "bell.badge.fill")
                        .foregroundStyle(AnchorPalette.chipActive)
                        .frame(width: 24)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Notification Preferences")
                            .font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("Push, categories, quiet hours")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: — Anchor AI

    var aiCard: some View {
        AnchorCard(title: "Anchor AI", icon: "sparkles") {
            Button { showAnchorAI = true } label: {
                HStack(spacing: 12) {
                    Image(systemName: "brain.head.profile")
                        .foregroundStyle(AnchorPalette.chipActive)
                        .frame(width: 24)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Fabric Preferences & Knowledge")
                            .font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("Tune briefings, proactive nudges, and inspect learned patterns")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: — Data Management

    var dataManagementCard: some View {
        AnchorCard(title: "Data", icon: "square.and.arrow.up") {
            VStack(alignment: .leading, spacing: 4) {
                securityNavRow(
                    icon: "square.and.arrow.up",
                    label: "Export Data",
                    subtitle: "Download a JSON snapshot of your accounts, transactions, and commitments"
                ) {
                    Task { await exportData() }
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "icloud.and.arrow.down",
                    label: "Import from Clipboard",
                    subtitle: "Restore a JSON backup you previously exported"
                ) {
                    showImportSheet = true
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "hammer.fill",
                    label: "Developer Tools",
                    subtitle: "Environment, store counts, diagnostics"
                ) { showDeveloperTools = true }
            }
        }
    }

    func exportData() async {
        let snapshot = AnchorDataTransferSnapshot(
            exportedAt: ISO8601DateFormatter().string(from: Date()),
            user: .init(
                displayName: userProfileStore.displayName,
                email: userProfileStore.email,
                currency: userProfileStore.currency
            ),
            accounts: financeStore.accounts.map {
                .init(
                    name: $0.name,
                    type: $0.type,
                    currency: $0.currency,
                    balanceCents: $0.balanceCents,
                    color: $0.color
                )
            },
            transactions: financeStore.transactions.map {
                .init(
                    title: $0.title,
                    amountCents: $0.amountCents,
                    type: $0.type,
                    category: $0.category,
                    accountName: $0.accountName,
                    currency: $0.currency,
                    date: $0.date,
                    narration: $0.narration
                )
            },
            commitments: commitmentsStore.commitments.map {
                .init(
                    title: $0.title,
                    type: $0.type,
                    domain: $0.domain ?? "General",
                    timeOfDay: $0.timeOfDay,
                    notes: $0.notes,
                    priority: $0.priority,
                    scope: $0.scope
                )
            }
        )
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let data = try? encoder.encode(snapshot),
              let json = String(data: data, encoding: .utf8) else {
            ToastStore.shared.show("Export failed", style: .error)
            return
        }
        UIPasteboard.general.string = json
        ToastStore.shared.show("Full backup copied to clipboard", style: .success)
    }

    // MARK: — Support

    var supportCard: some View {
        AnchorCard(title: "Support", icon: "questionmark.circle") {
            VStack(alignment: .leading, spacing: 4) {
                securityNavRow(
                    icon: "envelope.fill",
                    label: "Contact Support",
                    subtitle: "Email the Anchor team"
                ) {
                    if let url = URL(string: "mailto:support@anchor-os.app") {
                        UIApplication.shared.open(url)
                    }
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "doc.text.fill",
                    label: "Privacy Policy",
                    subtitle: "How we handle your data"
                ) {
                    if let url = URL(string: "https://anchor-os.app/privacy") {
                        UIApplication.shared.open(url)
                    }
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "info.circle.fill",
                    label: "About Anchor",
                    subtitle: "Version \(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "—")"
                ) {
                    ToastStore.shared.show("Anchor OS Native", style: .info)
                }
            }
        }
    }
}
