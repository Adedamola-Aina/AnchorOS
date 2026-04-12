import SwiftUI

struct AuthView: View {
    @EnvironmentObject private var appState: AppState
    @State private var email: String = ""
    @State private var password: String = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("Anchor OS")
                .font(.largeTitle)
                .fontWeight(.bold)
            Text("Native iOS Starter")
                .foregroundStyle(.secondary)

            Picker("Environment", selection: Binding(
                get: { appState.environment },
                set: { appState.setEnvironment($0) }
            )) {
                ForEach(AppEnvironment.allCases, id: \.self) { environment in
                    Text(environment.rawValue.capitalized).tag(environment)
                }
            }
            .pickerStyle(.segmented)

            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .textFieldStyle(.roundedBorder)

            SecureField("Password", text: $password)
                .textFieldStyle(.roundedBorder)

            Button {
                Task {
                    await appState.signIn(email: email, password: password)
                }
            } label: {
                if appState.isBusy {
                    ProgressView()
                } else {
                    Text("Sign In")
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(appState.isBusy)
            .frame(maxWidth: .infinity)
            .padding(.top, 8)

            Text(appState.statusMessage)
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(24)
    }
}
