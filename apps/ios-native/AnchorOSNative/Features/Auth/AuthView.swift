import SwiftUI

// MARK: - AuthView
// Orchestrates login, signup, MFA, and password reset modes.
// Matches PWA AuthView.tsx flow.

enum AuthMode { case login, signup, reset, mfa }

struct AuthView: View {
    @EnvironmentObject var appState: AppState
    @StateObject var rateLimiter = AuthRateLimiter()
    @State var mode: AuthMode = .login
    @State var email = ""
    @State var password = ""
    @State var displayName = ""
    @State var mfaCode = ""
    @FocusState var focused: Field?

    enum Field: Hashable { case name, email, password, mfaCode }

    var body: some View {
        ZStack {
            AnchorBackground().ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    authHeader
                    authCard
                }
            }
        }
        .authMountTransition(duration: 0.5) // Parity: PWA AuthView.tsx `animate-in fade-in zoom-in-95` over 500ms.
    }

    // MARK: - Header

    private var authHeader: some View {
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
    }

    // MARK: - Card

    private var authCard: some View {
        VStack(spacing: 20) {
            if mode != .mfa {
                modeToggle
            }

            switch mode {
            case .login:  loginFields
            case .signup: signupFields
            case .reset:  resetFields
            case .mfa:    mfaFields
            }

            if let msg = rateLimiter.lockoutMessage {
                Text(msg)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.danger)
            }

            submitButton

            statusRow

            if mode == .login || mode == .signup {
                SocialSignInButtons(
                    onAppleSignIn: { Task { await handleAppleSignIn() } },
                    onGoogleSignIn: { Task { await handleGoogleSignIn() } },
                    isLoading: appState.isBusy
                )
            }

            if mode == .login {
                Button("Forgot password?") { mode = .reset }
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.chipActive)
            }

            if mode == .reset {
                Button("Back to sign in") { mode = .login }
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.chipActive)
            }

            envPicker
        }
        .padding(24)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .padding(.horizontal, 20)
    }

    // MARK: - Mode Toggle

    private var modeToggle: some View {
        HStack(spacing: 0) {
            modeTab("Sign In", selected: mode == .login) { mode = .login }
            modeTab("Create Account", selected: mode == .signup) { mode = .signup }
        }
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Field Groups

    private var loginFields: some View {
        VStack(spacing: 12) {
            authField("Email address", text: $email, icon: "envelope", keyboard: .emailAddress)
                .focused($focused, equals: .email)
                .submitLabel(.next)
                .onSubmit { focused = .password }
            authField("Password", text: $password, icon: "lock", secure: true)
                .focused($focused, equals: .password)
                .submitLabel(.go)
                .onSubmit { Task { await submit() } }
        }
    }

    private var signupFields: some View {
        VStack(spacing: 12) {
            authField("Your name", text: $displayName, icon: "person")
                .focused($focused, equals: .name)
                .submitLabel(.next)
                .onSubmit { focused = .email }
            authField("Email address", text: $email, icon: "envelope", keyboard: .emailAddress)
                .focused($focused, equals: .email)
                .submitLabel(.next)
                .onSubmit { focused = .password }
            authField("Password (min 8 chars)", text: $password, icon: "lock", secure: true)
                .focused($focused, equals: .password)
                .submitLabel(.go)
                .onSubmit { Task { await submit() } }
            if mode == .signup && !password.isEmpty {
                PasswordStrengthMeter(password: password)
                    .slideFadeFromTop(offset: 4, duration: 0.2)
            }
        }
    }

    private var resetFields: some View {
        VStack(spacing: 12) {
            authField("Email address", text: $email, icon: "envelope", keyboard: .emailAddress)
                .focused($focused, equals: .email)
                .submitLabel(.go)
                .onSubmit { Task { await submit() } }
        }
    }

    private var mfaFields: some View {
        VStack(spacing: 12) {
            Text("Two-Factor Authentication")
                .font(AnchorTypography.h3)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Enter the 6-digit code from your authenticator app.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
            authField("6-digit code", text: $mfaCode, icon: "lock.shield", keyboard: .numberPad)
                .focused($focused, equals: .mfaCode)
        }
    }

    // MARK: - Submit (in AuthView+Helpers)
}

