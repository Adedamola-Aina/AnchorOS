#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IOS_NATIVE_DIR="$ROOT_DIR/apps/ios-native"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "ios-native sync is only supported on macOS."
  exit 1
fi

if [[ ! -f "$ROOT_DIR/package.json" ]]; then
  echo "Run this command from repository root."
  exit 1
fi

if [[ ! -f "$IOS_NATIVE_DIR/project.yml" ]]; then
  echo "Missing apps/ios-native/project.yml"
  exit 1
fi

if ! command -v xcodegen >/dev/null 2>&1; then
  echo "xcodegen is required. Install with: brew install xcodegen"
  exit 1
fi

echo "Generating AnchorOSNative.xcodeproj..."
rm -rf "$IOS_NATIVE_DIR/AnchorOSNative.xcodeproj"
(
  cd "$IOS_NATIVE_DIR"
  xcodegen generate
)

echo "Resolving Swift package dependencies..."
xcodebuild -resolvePackageDependencies \
  -project "$IOS_NATIVE_DIR/AnchorOSNative.xcodeproj" \
  -scheme AnchorOSNative >/dev/null

echo "iOS native project is ready."
