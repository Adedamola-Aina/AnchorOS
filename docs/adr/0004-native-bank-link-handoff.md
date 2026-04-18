# ADR-0004 — Native Bank Link Uses Secure Web Handoff

- Status: Accepted (2026-04-18)
- Deciders: Owner, Tech Lead, Security, SRE
- Context: WS-9 of the Native Parity program (docs/NATIVE_PARITY_AUDIT.md §4.5)

## Context

The PWA embeds the Mono connect widget in-app. The native iOS app does not
ship the Mono iOS SDK. Options considered:

1. Adopt the Mono iOS SDK for in-app parity with the PWA.
2. Use the existing secure web handoff — `anchor-os.web.app/finance?native=ios`
   opens the system browser, the user completes Mono there, and the app
   receives a universal-link callback via `anchoros://finance?bank=connected`.
3. Build a custom in-app WebView bank link flow.

## Decision

We adopt Option 2 — secure web handoff — as the native bank-link pattern.

## Rationale

- Credentials never enter app memory; the secure provider UI is isolated
  in MobileSafari, which inherits iOS's saved-password + 2FA protections.
- No additional third-party SDK surface in the App Store review package.
- Single source of truth for bank link logic lives on the web, so Mono
  flow changes don't require a native app release.
- App Check tokens issued by `FirebaseAppCheck` still gate the callback
  writes to Firestore, keeping the post-link sync attested.

## Consequences

- Native UI must display a clear "You will be returned to Anchor OS"
  message before launching the handoff.
- Universal link + URL scheme must be configured so the callback lands
  back in the app — covered by `Info.plist` + Xcode project settings.
- If Mono ever deprecates their web widget, we revisit this ADR.
- Documented in docs/NATIVE_PARITY_AUDIT.md §4.5 so the scorecard reads
  `native:done-handoff` rather than "different".
