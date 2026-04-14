#!/bin/sh
# Xcode Cloud — runs once after the repo is cloned.
# Installs XcodeGen and generates the .xcodeproj from project.yml.
# Xcode Cloud agents run macOS; Homebrew is pre-installed.

set -e

echo "▶ ci_post_clone: installing XcodeGen"
brew install xcodegen

echo "▶ ci_post_clone: generating Xcode project"
cd "$CI_PRIMARY_REPOSITORY_PATH/apps/ios-native"
xcodegen generate

echo "✅ ci_post_clone: AnchorOSNative.xcodeproj ready"
