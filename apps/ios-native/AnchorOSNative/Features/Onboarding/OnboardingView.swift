import SwiftUI

/// First-launch onboarding flow — shown once after sign-up.
/// Persisted via UserDefaults "hasCompletedOnboarding".
struct OnboardingView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore

    @State private var step: Int = 0

    // Step 1 — display name
    @State private var nameInput: String = ""
    @State private var nameSaving = false

    // Step 2 — first account
    @State private var accountName: String = ""
    @State private var accountType: String = "checking"
    @State private var accountBalance: String = ""
    @State private var accountSaving = false

    // Step 3 — first task
    @State private var taskTitle: String = ""
    @State private var taskSaving = false

    var body: some View {
        ZStack {
            AnchorBackground().ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress bar
                HStack(spacing: 6) {
                    ForEach(0..<4) { i in
                        Capsule()
                            .fill(i <= step ? AnchorPalette.chipActive : AnchorPalette.chip)
                            .frame(height: 4)
                            .animation(.easeInOut, value: step)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 20)

                Spacer()

                Group {
                    switch step {
                    case 0: welcomeStep
                    case 1: nameStep
                    case 2: accountStep
                    case 3: taskStep
                    default: EmptyView()
                    }
                }
                .padding(.horizontal, 24)

                Spacer()
            }
        }
    }

    // MARK: — Step 0: Welcome

    private var welcomeStep: some View {
        VStack(spacing: 24) {
            Image(systemName: "anchor.circle.fill")
                .font(.system(size: 72))
                .foregroundStyle(AnchorPalette.chipActive)

            VStack(spacing: 8) {
                Text("Welcome to Anchor OS")
                    .font(.title2).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .multilineTextAlignment(.center)
                Text("Your household finance and commitment platform.\nLet's get you set up in 3 quick steps.")
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }

            Button {
                withAnimation { step = 1 }
            } label: {
                Text("Let's go")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: — Step 1: Display Name

    private var nameStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(number: "01", title: "What should we call you?", subtitle: "This appears on your dashboard and family connection.")

            AnchorFormField(placeholder: "Your name", text: $nameInput)

            HStack(spacing: 12) {
                backButton
                Button {
                    guard !nameInput.trimmingCharacters(in: .whitespaces).isEmpty else {
                        withAnimation { step = 2 }
                        return
                    }
                    Task { await saveName() }
                } label: {
                    Group {
                        if nameSaving { ProgressView().tint(.white).scaleEffect(0.8) }
                        else { Text("Continue").fontWeight(.semibold).foregroundStyle(.white) }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
                .disabled(nameSaving)
            }
        }
    }

    private func saveName() async {
        nameSaving = true
        defer { nameSaving = false }
        let trimmed = nameInput.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty {
            try? await userProfileStore.updateDisplayName(trimmed)
        }
        withAnimation { step = 2 }
    }

    // MARK: — Step 2: First Account

    private var accountStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(number: "02", title: "Add your first account", subtitle: "Track balances across checking, savings, or investment accounts.")

            VStack(spacing: 12) {
                AnchorFormField(placeholder: "Account name (e.g. Main Checking)", text: $accountName)
                AnchorFormField(placeholder: "Opening balance (e.g. 50000)", text: $accountBalance, keyboardType: .decimalPad)

                VStack(alignment: .leading, spacing: 8) {
                    Text("ACCOUNT TYPE")
                        .font(.caption).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.textSecondary)
                    HStack(spacing: 8) {
                        ForEach(["checking", "savings", "investment"], id: \.self) { t in
                            Button {
                                accountType = t
                            } label: {
                                Text(t.capitalized)
                                    .font(.caption).fontWeight(.semibold)
                                    .foregroundStyle(accountType == t ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 9)
                                    .background(accountType == t ? AnchorPalette.chipActive : AnchorPalette.chip)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }

            HStack(spacing: 12) {
                backButton
                Button {
                    Task { await saveAccount() }
                } label: {
                    Group {
                        if accountSaving { ProgressView().tint(.white).scaleEffect(0.8) }
                        else { Text("Continue").fontWeight(.semibold).foregroundStyle(.white) }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
                .disabled(accountSaving)
            }
        }
    }

    private func saveAccount() async {
        accountSaving = true
        defer { accountSaving = false }
        let name = accountName.trimmingCharacters(in: .whitespaces)
        let cents = Int((Double(accountBalance) ?? 0) * 100)
        if !name.isEmpty {
            try? await financeStore.addAccount(name: name, type: accountType, currency: userProfileStore.currency, balanceCents: cents)
        }
        withAnimation { step = 3 }
    }

    // MARK: — Step 3: First Commitment

    private var taskStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(number: "03", title: "Add your first commitment", subtitle: "A daily habit, weekly goal, or one-off task. You can always add more later.")

            AnchorFormField(placeholder: "e.g. Morning Prayer, Read 30 mins", text: $taskTitle)

            HStack(spacing: 12) {
                backButton
                Button {
                    Task { await saveTask() }
                } label: {
                    Group {
                        if taskSaving { ProgressView().tint(.white).scaleEffect(0.8) }
                        else { Text("Finish setup").fontWeight(.semibold).foregroundStyle(.white) }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
                .disabled(taskSaving)
            }
        }
    }

    private func saveTask() async {
        taskSaving = true
        defer { taskSaving = false }
        let trimmed = taskTitle.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty {
            try? await commitmentsStore.addCommitment(title: trimmed, type: "daily", domain: "Personal Development", timeOfDay: "morning", notes: nil)
        }
        completeOnboarding()
    }

    // MARK: — Helpers

    private func completeOnboarding() {
        UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
    }

    private var backButton: some View {
        Button {
            withAnimation { step = max(0, step - 1) }
        } label: {
            Image(systemName: "chevron.left")
                .font(.body.weight(.semibold))
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 52, height: 52)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
    }

    private func stepHeader(number: String, title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("STEP \(number)")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.chipActive)
            Text(title)
                .font(.title3).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
                .lineSpacing(3)
        }
    }
}
