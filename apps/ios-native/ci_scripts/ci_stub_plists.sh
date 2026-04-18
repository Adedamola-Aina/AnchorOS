#!/usr/bin/env bash
# WS-4 — creates placeholder GoogleService-Info plists for CI when the real
# ones aren't checked in. Lets the native CI build/test suite run in PRs
# without requiring secret-sync. Production builds use Xcode Cloud with real
# plists mounted as secure files.
set -e

cd "$(dirname "$0")/.."

mkdir -p AnchorOSNative/Resources

for ENV in Development Staging Production; do
  PLIST="AnchorOSNative/Resources/GoogleService-Info-${ENV}.plist"
  if [ ! -f "$PLIST" ]; then
    /usr/libexec/PlistBuddy -c "Clear dict" \
      -c "Add :API_KEY string CI-STUB" \
      -c "Add :GCM_SENDER_ID string 000000000000" \
      -c "Add :BUNDLE_ID string com.anchoros.native" \
      -c "Add :PROJECT_ID string anchor-os-ci" \
      -c "Add :GOOGLE_APP_ID string 1:000000000000:ios:0000000000000000" \
      "$PLIST" 2>/dev/null || {
        # Fallback for non-macOS CI (lint-only)
        printf '%s\n' \
          '<?xml version="1.0" encoding="UTF-8"?>' \
          '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' \
          '<plist version="1.0"><dict>' \
          '<key>API_KEY</key><string>CI-STUB</string>' \
          '<key>BUNDLE_ID</key><string>com.anchoros.native</string>' \
          '<key>GCM_SENDER_ID</key><string>000000000000</string>' \
          '<key>PROJECT_ID</key><string>anchor-os-ci</string>' \
          '<key>GOOGLE_APP_ID</key><string>1:000000000000:ios:0000000000000000</string>' \
          '</dict></plist>' > "$PLIST"
      }
    echo "Stubbed $PLIST"
  fi
done
