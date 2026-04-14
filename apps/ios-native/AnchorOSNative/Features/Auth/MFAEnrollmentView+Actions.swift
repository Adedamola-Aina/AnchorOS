import SwiftUI
import CoreImage.CIFilterBuiltins

// MARK: - MFAEnrollmentView Actions + Helpers
// Split from MFAEnrollmentView.swift for ARCH-001 (≤ 200 lines).

extension MFAEnrollmentView {

    // MARK: - Actions

    func startEnrollment() async {
        isLoading = true; defer { isLoading = false }
        do {
            let result = try await AuthService.shared.enrollTOTP()
            totpSecret = result.secret
            qrURL = result.qrURL
            step = .scan
        } catch {
            self.error = error.localizedDescription
        }
    }

    func finalize() async {
        guard let secret = totpSecret else {
            error = "Enrollment not started. Go back and try again."
            return
        }
        isLoading = true; defer { isLoading = false }
        error = nil
        do {
            try await AuthService.shared.finalizeTOTPEnrollment(secret: secret, code: code)
            // Generate & save recovery codes
            let generated = RecoveryCodeService.generate()
            recoveryCodes = generated.plainCodes
            // Store hashed codes via Cloud Function (fire-and-forget)
            Task {
                try? await saveRecoveryCodes(generated.hashedCodes)
            }
            step = .recoveryCodes
        } catch {
            self.error = "Invalid code. Please try again."
        }
    }

    // MARK: - Recovery Code Storage

    private func saveRecoveryCodes(_ hashedCodes: [String]) async throws {
        guard let uid = AuthService.shared.currentUserID() else { return }
        // Store in Firestore: users/{uid}/security/mfaRecovery
        // Using secureDb pattern via Cloud Function
        let functions = FirebaseFunctions.Functions.functions()
        _ = try await functions.httpsCallable("saveMfaRecoveryCodes").call([
            "hashedCodes": hashedCodes,
            "codesRemaining": RecoveryCodeService.codeCount
        ])
    }

    // MARK: - QR Code Generation

    var qrCodeImage: some View {
        Group {
            if let image = generateQRCode(from: qrURL) {
                Image(uiImage: image)
                    .interpolation(.none)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 200, height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                RoundedRectangle(cornerRadius: 12)
                    .fill(AnchorPalette.chip)
                    .frame(width: 200, height: 200)
                    .overlay {
                        Image(systemName: "qrcode")
                            .font(.system(size: 80))
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
            }
        }
    }

    private func generateQRCode(from string: String) -> UIImage? {
        let context = CIContext()
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(string.utf8)
        filter.correctionLevel = "M"
        guard let output = filter.outputImage else { return nil }
        let scaled = output.transformed(by: CGAffineTransform(scaleX: 10, y: 10))
        guard let cgImage = context.createCGImage(scaled, from: scaled.extent) else { return nil }
        return UIImage(cgImage: cgImage)
    }

    // MARK: - Action Button Builder

    func actionButton(
        _ title: String,
        loading: Bool,
        disabled: Bool = false,
        action: @escaping () async -> Void
    ) -> some View {
        Button {
            Task { await action() }
        } label: {
            HStack {
                Spacer()
                if loading { ProgressView().tint(.white) }
                else { Text(title).fontWeight(.semibold) }
                Spacer()
            }
            .padding(.vertical, 16)
            .background(disabled ? AnchorPalette.chip : AnchorPalette.chipActive)
            .foregroundStyle(disabled ? AnchorPalette.textSecondary : .white)
            .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
        .disabled(disabled || loading)
    }
}
