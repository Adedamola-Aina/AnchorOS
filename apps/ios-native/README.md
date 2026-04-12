# Anchor OS Native iOS (SwiftUI)

This directory is the native iOS starter app for Anchor OS.

It is intentionally separate from the current Capacitor app in `/ios`.

## Stack

- Swift 5.10+
- SwiftUI
- XcodeGen project generation

## Quick Start

1. Install XcodeGen:
   - `brew install xcodegen`
2. Generate project:
   - `cd apps/ios-native`
   - `xcodegen generate`
3. Open:
   - `open AnchorOSNative.xcodeproj`
4. Run in Xcode:
   - Select `AnchorOSNative` scheme
   - Choose simulator/device
   - Run

## Environment

`AppEnvironment` controls API base URL:

- `development`: `https://anchor-os-dev-1c6ec.web.app`
- `staging`: `https://anchor-os-staging.web.app`
- `production`: `https://anchor-os.web.app`

Firebase config files expected in the app bundle:

- `GoogleService-Info-Development.plist`
- `GoogleService-Info-Staging.plist`
- `GoogleService-Info-Production.plist`

In Xcode, add these files to the `AnchorOSNative` target under
`AnchorOSNative/Resources/`.

## Notes

- This is scaffold-only for Sprint 1.
- Auth and dashboard are starter screens wired through a typed API client.
- Capacitor app remains active and unchanged.
