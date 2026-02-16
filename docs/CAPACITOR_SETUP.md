# Capacitor Setup Guide

**Status**: ✅ Phase 1 Complete (Foundation)

Anchor OS is configured to build native iOS and Android apps using Capacitor. This guide covers setup, development, and deployment workflows.

## Quick Start

```bash
# Build web app first
npm run build:production

# Add iOS platform (requires macOS + Xcode)
npx cap add ios

# Add Android platform (requires Android Studio)
npx cap add android

# Sync web assets to native projects
npx cap sync

# Open in native IDE
npx cap open ios      # Xcode
npx cap open android  # Android Studio
```

## Prerequisites

### For Web Development
- Node.js 18+ (already installed)
- npm/yarn
- Current Anchor OS dependencies

### For iOS Development
- **macOS only**
- Xcode 15+ ([Download](https://developer.apple.com/xcode/))
- iOS 14+ deployment target
- Apple Developer account (for device testing/App Store)
- CocoaPods (`sudo gem install cocoapods`)

### For Android Development
- **Windows/Mac/Linux**
- Android Studio ([Download](https://developer.android.com/studio))
- Android SDK 33+ (API Level 33)
- Java 17+ (included with Android Studio)
- Google Play Developer account ($25 one-time fee)

## Project Structure

```
anchor-os/
├── capacitor.config.ts       # Capacitor configuration
├── ios/                      # iOS native project (after cap add ios)
│   ├── App/
│   │   ├── App/
│   │   │   ├── Info.plist   # iOS app configuration
│   │   │   └── capacitor.config.json
│   │   └── App.xcodeproj    # Xcode project
│   └── Podfile              # iOS dependencies
├── android/                  # Android native project (after cap add android)
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       └── res/     # Android resources
│   │   └── build.gradle     # App-level Gradle config
│   └── build.gradle         # Project-level Gradle config
└── src/
    ├── hooks/useCapacitor.ts    # React hook for native features
    ├── utils/platform.ts        # Platform detection
    └── styles/capacitor.css     # Native styles (safe areas)
```

## Development Workflow

### 1. Web Development (Primary)
```bash
npm run dev
# Develop as usual at http://localhost:5173
```

### 2. Test Native Features Locally
```bash
# Build web assets
npm run build:production

# Sync to native (if platforms added)
npx cap sync

# Test in simulator/emulator
npx cap run ios
npx cap run android
```

### 3. Live Reload (Advanced)
```bash
# Start dev server
npm run dev

# In capacitor.config.ts, temporarily set:
# server: { url: 'http://192.168.1.X:5173' }

npx cap sync
npx cap run ios  # Opens in simulator with live reload
```

## Platform-Specific Configuration

### iOS (Info.plist)

**Location**: `ios/App/App/Info.plist`

**Firebase Integration**:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

**Permissions** (add as needed):
```xml
<key>NSCameraUsageDescription</key>
<string>Anchor needs camera access to scan receipts</string>

<key>NSFaceIDUsageDescription</key>
<string>Use Face ID to securely access your account</string>
```

### Android (AndroidManifest.xml)

**Location**: `android/app/src/main/AndroidManifest.xml`

**Internet Permission** (already included):
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

**Firebase** (google-services.json):
```bash
# Download from Firebase Console
cp google-services.json android/app/
```

## Building for Production

### iOS

```bash
# 1. Build web assets
npm run build:production

# 2. Sync to iOS
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
#    - Select target device (e.g., Any iOS Device)
#    - Product > Archive
#    - Distribute App > App Store Connect
```

**Code Signing**:
- Requires Apple Developer account ($99/year)
- Set Bundle Identifier: `com.anchor.app`
- Configure signing certificate in Xcode

### Android

```bash
# 1. Build web assets
npm run build:production

# 2. Sync to Android
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. In Android Studio:
#    - Build > Generate Signed Bundle / APK
#    - Select "Android App Bundle"
#    - Create/use signing key
```

**Release Signing**:
```bash
# Generate keystore (one-time)
keytool -genkey -v -keystore anchor-release.keystore \
  -alias anchor-key -keyalg RSA -keysize 2048 -validity 10000

# Store in android/app/build.gradle
```

## Installed Plugins

| Plugin | Purpose | Docs |
|--------|---------|------|
| `@capacitor/app` | App lifecycle, deep links | [Docs](https://capacitorjs.com/docs/apis/app) |
| `@capacitor/haptics` | Vibration/haptic feedback | [Docs](https://capacitorjs.com/docs/apis/haptics) |
| `@capacitor/keyboard` | Keyboard control | [Docs](https://capacitorjs.com/docs/apis/keyboard) |
| `@capacitor/status-bar` | Status bar styling | [Docs](https://capacitorjs.com/docs/apis/status-bar) |
| `@capacitor/splash-screen` | Launch screen | [Docs](https://capacitorjs.com/docs/apis/splash-screen) |
| `@capacitor/network` | Network status | [Docs](https://capacitorjs.com/docs/apis/network) |

## Usage Examples

### Platform Detection
```typescript
import { getPlatform, isNative } from '@/utils/platform';

if (isNative()) {
  // Running as native app
  console.log('Platform:', getPlatform()); // 'ios' or 'android'
}
```

### Haptic Feedback
```typescript
import { useCapacitor } from '@/hooks/useCapacitor';

function MyComponent() {
  const { haptics } = useCapacitor();

  const handleSuccess = async () => {
    await haptics.notification('SUCCESS');
  };

  return <button onClick={handleSuccess}>Save</button>;
}
```

### Network Status
```typescript
import { useCapacitor } from '@/hooks/useCapacitor';

function NetworkBanner() {
  const { networkStatus } = useCapacitor();

  if (!networkStatus?.connected) {
    return <div>Offline mode</div>;
  }

  return null;
}
```

## Troubleshooting

### iOS Build Fails
```bash
# Clean Xcode build
rm -rf ios/App/Pods ios/App/build
cd ios/App && pod install
npx cap sync ios
```

### Android Build Fails
```bash
# Clean Gradle cache
cd android && ./gradlew clean
npx cap sync android
```

### Plugins Not Working
```bash
# Reinstall plugins
npm install
npx cap sync
```

### Firebase Not Connecting (Native)
- Verify `google-services.json` (Android) in `android/app/`
- Verify `GoogleService-Info.plist` (iOS) in `ios/App/App/`
- Check Firebase Console → Project Settings → Your apps

## Next Steps

### Phase 2: Enhanced Native Features (Future)
- Push notifications (native FCM)
- Biometric authentication (Face ID / Fingerprint)
- Secure storage (Keychain / Keystore)
- Share API (native share sheet)
- Camera access (receipt scanning)

### Phase 3: App Store Deployment
- TestFlight (iOS beta testing)
- Google Play Internal Testing
- App Store review preparation
- Play Store listing

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Design Guide](https://developer.android.com/design)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [Firebase Android Setup](https://firebase.google.com/docs/android/setup)

## Support

**Questions?** Check [AGENTS.md](/AGENTS.md) for project conventions and workflow.

**Issues?** The web app is the source of truth—test there first before debugging native issues.
