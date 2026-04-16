import SwiftUI

/// First-launch onboarding flow — shown once after sign-up.
/// Persisted via UserDefaults "hasCompletedOnboarding".
/// Steps 2–3 live in OnboardingView+Steps.swift; step 4 in OnboardingSecurityStep.swift.
struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userProfileStore: UserProfileStore
    @EnvironmentObject var financeStore: FinanceStore
    @EnvironmentObject var commitmentsStore: CommitmentsStore

    @State var step: Int = 0

    // Step 1 — display name
    @State var nameInput: String = ""
    @State var nameSaving = false

    // Step 2 — first account
    @State var accountName: String = ""
    @State var accountType: String = "checking"
    @State var accountBalance: String = ""
    @State var accountSaving = false

    // Step 3 — savings goal
    @State var savingsGoal: String = ""
    @State var savingsGoalSaving = false

    // Step 4 — first task
    @State var taskTitle: String = ""
    @State var taskSaving = false

    private let totalSteps = 6

    var body: some View {
        ZStack {
            AnchorBackground().ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress bar
                HStack(spacing: 6) {
                    ForEach(0..<totalSteps, id: \.self) { i in
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
                    case 3: savingsGoalStep
                    case 4: taskStep
                    case 5: OnboardingSecurityStep { completeOnboarding() }
                    default: EmptyView()
                    }
                }
                .padding(.horizontal, 24)
                // Parity: PWA OnboardingView step change uses animate-in
                // fade-in slide-in-from-right-4 (x 16->0 + fade 300ms).
                .id(step)
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
                .animation(.easeInOut(duration: 0.3), value: step)

                Spacer()
            }
        }
        .fadeInOnAppear(duration: 0.4)
        .onChange(of: step) { _, _ in
            // Parity: PWA OnboardingProgress fires haptic.selection on step advance.
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
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
                Text("Your household finance and commitment platform.\nLet's get you set up in a few quick steps.")
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

    func saveSavingsGoal() async {
        savingsGoalSaving = true
        defer { savingsGoalSaving = false }
        let amount = Int((Double(savingsGoal) ?? 0) * 100)
        if amount > 0 {
            try? await financeStore.setSavingsGoal(monthlyCents: amount)
        }
        withAnimation { step = 4 }
    }

    // MARK: — Helpers

    func completeOnboarding() {
        UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
    }

    var backButton: some View {
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

    func stepHeader(number: String, title: String, subtitle: String) -> some View {
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
