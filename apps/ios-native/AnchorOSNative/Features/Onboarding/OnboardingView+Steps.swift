import SwiftUI

// MARK: - Onboarding Steps 2–4 (Account + Savings Goal + Commitment)
// Split from OnboardingView.swift for ARCH-001 (≤ 200 lines).

extension OnboardingView {

    // MARK: — Step 2: First Account

    var accountStep: some View {
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
                        ForEach(["checking", "savings", "salary", "investment"], id: \.self) { t in
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

    func saveAccount() async {
        accountSaving = true
        defer { accountSaving = false }
        let name = accountName.trimmingCharacters(in: .whitespaces)
        let cents = Int((Double(accountBalance) ?? 0) * 100)
        if !name.isEmpty {
            try? await financeStore.addAccount(name: name, type: accountType, currency: userProfileStore.currency, balanceCents: cents)
        }
        withAnimation { step = 3 }
    }

    // MARK: — Step 3: Savings Goal

    var savingsGoalStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(number: "03", title: "Set a savings goal", subtitle: "What are you saving towards? This helps Anchor track your progress.")

            AnchorFormField(placeholder: "Monthly savings target (e.g. 50000)", text: $savingsGoal, keyboardType: .decimalPad)

            HStack(spacing: 12) {
                backButton
                Button {
                    Task { await saveSavingsGoal() }
                } label: {
                    Group {
                        if savingsGoalSaving { ProgressView().tint(.white).scaleEffect(0.8) }
                        else { Text(savingsGoal.isEmpty ? "Skip" : "Continue").fontWeight(.semibold).foregroundStyle(.white) }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
                .disabled(savingsGoalSaving)
            }
        }
    }

    // saveSavingsGoal() lives in OnboardingView.swift (needs direct @EnvironmentObject access)

    // MARK: — Step 4: First Commitment

    var taskStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(number: "04", title: "Add your first commitment", subtitle: "A daily habit, weekly goal, or one-off task. You can always add more later.")

            AnchorFormField(placeholder: "e.g. Morning Prayer, Read 30 mins", text: $taskTitle)

            HStack(spacing: 12) {
                backButton
                Button {
                    Task { await saveTask() }
                } label: {
                    Group {
                        if taskSaving { ProgressView().tint(.white).scaleEffect(0.8) }
                        else { Text("Continue").fontWeight(.semibold).foregroundStyle(.white) }
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

    func saveTask() async {
        taskSaving = true
        defer { taskSaving = false }
        let trimmed = taskTitle.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty {
            try? await commitmentsStore.addCommitment(title: trimmed, type: "daily", domain: "Personal Development", timeOfDay: "morning", notes: nil)
        }
        withAnimation { step = 5 }
    }
}
