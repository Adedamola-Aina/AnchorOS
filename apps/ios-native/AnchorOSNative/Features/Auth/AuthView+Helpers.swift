import SwiftUI

// MARK: - AuthView+Helpers
// Extracted form validation, submit logic, and shared field builders
// to keep AuthView.swift under 200 lines (ARCH-001).

extension AuthView {

    // MARK: - Submit Button

    var submitButton: some View {
        Button {
            Task { await submit() }
        } label: {
            HStack {
                Spacer()
                if appState.isBusy {
                    ProgressView().tint(.white)
                } else {
                    Text(submitLabel).fontWeight(.semibold)
                }
                Spacer()
            }
            .padding(.vertical, 16)
            .background(formIsValid ? AnchorPalette.chipActive : AnchorPalette.chip)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .foregroundStyle(formIsValid ? .white : AnchorPalette.textSecondary)
        }
        .disabled(!formIsValid || appState.isBusy || rateLimiter.isLocked)
        .buttonStyle(PressScaleStyle())
    }

    private var submitLabel: String {
        switch mode {
        case .login:  return "Sign In"
        case .signup: return "Create Account"
        case .reset:  return "Send Reset Link"
        case .mfa:    return "Verify"
        }
    }

    // MARK: - Validation

    var formIsValid: Bool {
        switch mode {
        case .login:
            return isValidEmail && password.count >= 6
        case .signup:
            return isValidEmail && password.count >= 8
        case .reset:
            return isValidEmail
        case .mfa:
            return mfaCode.count >= 6
        }
    }

    private var isValidEmail: Bool {
        email.contains("@") && email.contains(".")
    }

    // MARK: - Submit

    func submit() async {
        focused = nil
        guard !rateLimiter.isLocked else { return }

        switch mode {
        case .login:
            await appState.signIn(email: email, password: password)
            if appState.isAuthenticated {
                rateLimiter.recordSuccess()
            } else {
                _ = rateLimiter.recordFailure()
            }
        case .signup:
            await appState.signUp(email: email, password: password, displayName: displayName)
            if appState.isAuthenticated {
                rateLimiter.recordSuccess()
            } else {
                _ = rateLimiter.recordFailure()
            }
        case .reset:
            await appState.sendPasswordReset(email: email)
        case .mfa:
            await appState.verifyMFA(code: mfaCode)
        }
    }

    // MARK: - Social Auth

    func handleAppleSignIn() async {
        await appState.signInWithApple()
    }

    func handleGoogleSignIn() async {
        await appState.signInWithGoogle()
    }

    // MARK: - Status Row

    var statusRow: some View {
        Group {
            if !appState.statusMessage.isEmpty && appState.statusMessage != "Native iOS starter." {
                Text(appState.statusMessage)
                    .font(.footnote)
                    .foregroundStyle(
                        appState.statusMessage.contains("failed")
                            ? AnchorPalette.danger
                            : AnchorPalette.textSecondary
                    )
                    .multilineTextAlignment(.center)
                    // Parity: PWA AuthView.tsx error message `animate-in fade-in slide-in-from-top-2` over 300ms.
                    .transition(.asymmetric(
                        insertion: .move(edge: .top).combined(with: .opacity),
                        removal: .opacity
                    ))
            }
        }
        .animation(.easeOut(duration: 0.3), value: appState.statusMessage)
    }

    // MARK: - Environment Picker

    var envPicker: some View {
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

    // MARK: - Reusable Components

    func modeTab(_ label: String, selected: Bool, action: @escaping () -> Void) -> some View {
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
    func authField(
        _ placeholder: String,
        text: Binding<String>,
        icon: String,
        keyboard: UIKeyboardType = .default,
        secure: Bool = false
    ) -> some View {
        // Parity: PWA group-focus-within text-blue-500 — icon color tweens to
        // chipActive while the field owns focus. We key focus by placeholder
        // match against the focused Field, keeping this helper reusable.
        let isFocused: Bool = {
            switch focused {
            case .name:    return placeholder == "Your name"
            case .email:   return placeholder == "Email address"
            case .password: return placeholder.hasPrefix("Password")
            case .mfaCode: return placeholder.contains("code")
            case .none:    return false
            }
        }()
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.subheadline)
                .foregroundStyle(isFocused ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                .animation(.easeOut(duration: 0.2), value: isFocused)
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
