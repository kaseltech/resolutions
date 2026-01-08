#!/bin/bash

# ci_post_clone.sh
# Xcode Cloud runs this script after cloning the repository
# It installs Node.js dependencies and builds the web assets

echo "=== YearVow Xcode Cloud Post-Clone Script ==="
echo "=== Script location: $(pwd) ==="
echo "=== CI_PRIMARY_REPOSITORY_PATH: $CI_PRIMARY_REPOSITORY_PATH ==="

# Navigate to the root of the repository
cd "$CI_PRIMARY_REPOSITORY_PATH" || exit 1

echo "=== Now in: $(pwd) ==="
echo "=== Directory contents: ==="
ls -la

echo "=== Installing Node.js via Homebrew ==="
# Use HOMEBREW_NO_AUTO_UPDATE to speed up
export HOMEBREW_NO_AUTO_UPDATE=1

# Try to install node, don't fail if already installed
brew install node || echo "Node may already be installed"

echo "=== Node.js version ==="
which node || echo "Node not in PATH"
node --version || echo "Node version check failed"
npm --version || echo "NPM version check failed"

echo "=== Installing npm dependencies ==="
npm ci || npm install

echo "=== Checking node_modules ==="
ls -la node_modules/ | head -20

echo "=== Building Next.js app ==="
npm run build

echo "=== Syncing Capacitor ==="
npx cap sync ios

echo "=== Verifying Capacitor packages ==="
ls -la node_modules/@capacitor/ || echo "No @capacitor packages"
ls -la node_modules/@capgo/ || echo "No @capgo packages"

echo "=== Checking ios/App/Pods ==="
ls -la ios/App/Pods 2>/dev/null || echo "No Pods directory (expected with SPM)"

echo "=== Post-clone script complete ==="
