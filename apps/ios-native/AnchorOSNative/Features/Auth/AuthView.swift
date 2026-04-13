import SwiftUI

struct AuthView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isSignUp = false
    @State private var email = ""
    @State private var password = ""
    @State private var displayName = ""
    @FocusState private var focused: Field?

    private enum Field: Hashable { case name, email, password }

    var body: some View {
        ZStack {
            AnchorBackground().ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    // Logo / header
                    VStack(spacing: 10) {
                        Image(systemName: "anchor")
                            .font(.system(size: 52, weight: .bold))
                            .foregroundStyle(AnchorPalette.chipActive)
                        Text("Anchor OS")
                            .font(.largeTitle).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("Household finance, simplified.")
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    .padding(.top, 64)
                    .padding(.bottom, 40)

                    // Card
                    VStack(spacing: 20) {
                        // Mode toggle
                        HStack(spacing: 0) {
                            modeTab("Sign In", selected: !isSignUp) { isSignUp = false }
                            modeTab("Create Account", selected: isSignUp) { isSignUp = true }
                        }
                        .background(AnchorPalette.chip)
                        .clipShape(RoundedRectangle(cornerRadius: 12))

                        // Fields
                        VStack(spacing: 12) {
                            if isSignUp {
                                authField("Your name", text: $displayName, icon: "person")
                                    .focused($focused, equals: .name)
                                    .submitLabel(.next)
                                    .onSubmit { focused = .email }
                            }

                            authField("Email address", text: $email, icon: "envelope", keyboard: .emailAddress)
                                .focused($focused, equals: .email)
                                .submitLabel(.next)
                                .onSubmit { focused = .password }

                            authField("Password", text: $password, icon: "lock", secure: true)
                                .focused($focused, equals: .password)
                                .submitLabel(.go)
                                .onSubmit { Task { await submit() } }
                        }

                        // Submit button
                        Button {
                            Task { await submit() }
                        } label: {
                            HStack {
                                Spacer()
                                if appState.isBusy {
                                    ProgressView().tint(.white)
                                } else {
                                    Text(isSignUp ? "Create Account" : "Sign In")
                                        .fontWeight(.semibold)
                                }
                                Spacer()
                            }
                            .padding(.vertical, 16)
                            .background(formIsValid ? AnchorPalette.chipActive : AnchorPalette.chip)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .foregroundStyle(formIsValid ? .white : AnchorPalette.textSecondary)
                        }
                        .disabled(!formIsValid || appState.isBusy)
                        .buttonStyle(.plain)

                        if !appState.statusMessage.isEmpty && appState.statusMessage != "Native iOS starter." {
                            Text(appState.statusMessage)
                                .font(.footnote)
                                .foregroundStyle(appState.statusMessage.contains("failed") ? AnchorPalette.danger : AnchorPalette.textSecondary)
                                .multilineTextAlignment(.center)
                        }

                        // Environment picker (dev/staging/prod)
                        Picker("Environment", selection: Binding(
                            get: { appState.environment },
                            set: { appState.setEnvironment($0) }
                        )) {
                            ForEach(AppEnvironment.allCases, id: \.self) { env in
                                Text(env.rawValue.capitalized).tag(env)
                            }
                        }
                        .pickerStyle(.segmented)
                    }
                    .padding(24)
                    .background(AnchorPalette.card)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .padding(.horizontal, 20)
                }
            }
        }
    }

    // MARK: — Helpers

    private var formIsValid: Bool {
        let emailOk = email.contains("@") && email.contains(".")
        let passwordOk = password.count >= 6
        return emailOk && passwordOk
    }

    private func submit() async {
        focused = nil
        if isSignUp {
            await appState.signUp(email: email, password: password, displayName: displayName)
        } else {
            await appState.signIn(email: email, password: password)
        }
    }

    private func modeTab(_ label: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(selected ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(selected ? AnchorPalette.chipActive.opacity(0.2) : Color.clear)
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func authField(
        _ placeholder: String,
        text: Binding<String>,
        icon: String,
        keyboard: UIKeyboardType = .default,
        secure: Bool = false
    ) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 20)

            if secure {
                SecureField(placeholder, text: text)
                    .foregroundStyle(AnchorPalette.textPrimary)
            } else {
                TextField(placeholder, text: text)
                    .keyboardType(keyboard)
                    .autocapitalization(.none)
                    .autocorrectionDisabled()
                    .foregroundStyle(AnchorPalette.textPrimary)
            }
        }
        .padding(14)
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

