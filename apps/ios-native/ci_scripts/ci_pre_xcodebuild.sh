#!/bin/sh
# Xcode Cloud — runs before every build.
# Decodes the Firebase GoogleService-Info.plist for the active build config.
#
# Setup required in Xcode Cloud workflow (one-time):
#   Workflow → Environment → Environment Variables → add:
#     FIREBASE_PLIST_DEV      = <base64 of GoogleService-Info-Development.plist>
#     FIREBASE_PLIST_STAGING  = <base64 of GoogleService-Info-Staging.plist>
#     FIREBASE_PLIST_PROD     = <base64 of GoogleService-Info-Production.plist>
#   Mark all three as Secret.
#
# To generate a base64 value locally:
#   base64 -i GoogleService-Info-Development.plist | pbcopy

set -e

RESOURCES="$CI_PRIMARY_REPOSITORY_PATH/apps/ios-native/AnchorOSNative/Resources"

decode_plist() {
  local VAR_NAME="$1"
  local DEST="$2"
  local VALUE

  # eval to read the variable named in $VAR_NAME
  eval VALUE="\$$VAR_NAME"

  if [ -z "$VALUE" ]; then
    echo "⚠️  $VAR_NAME not set — skipping $DEST"
    return
  fi

  echo "$VALUE" | base64 --decode > "$DEST"
  echo "✅ Wrote $DEST"
}

echo "▶ ci_pre_xcodebuild: injecting Firebase plists (config: $CI_XCODEBUILD_ACTION)"

decode_plist "FIREBASE_PLIST_DEV"     "$RESOURCES/GoogleService-Info-Development.plist"
decode_plist "FIREBASE_PLIST_STAGING" "$RESOURCES/GoogleService-Info-Staging.plist"
decode_plist "FIREBASE_PLIST_PROD"    "$RESOURCES/GoogleService-Info-Production.plist"

echo "✅ ci_pre_xcodebuild: Firebase plists ready"
