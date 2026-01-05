#!/bin/bash

# ci_post_clone.sh
# Xcode Cloud runs this script after cloning the repository
# It installs Node.js dependencies and builds the web assets

set -e  # Exit on any error

echo "=== YearVow Xcode Cloud Post-Clone Script ==="
echo "=== Script location: $(pwd) ==="
echo "=== CI_PRIMARY_REPOSITORY_PATH: $CI_PRIMARY_REPOSITORY_PATH ==="

# Navigate to the root of the repository
cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "=== Now in: $(pwd) ==="
echo "=== Directory contents: ==="
ls -la

echo "=== Installing Node.js via Homebrew ==="
brew install node@22 || true
brew link --overwrite node@22 || true

# Add node to PATH in case link didn't work
export PATH="/usr/local/opt/node@22/bin:$PATH"
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

echo "=== Node.js version ==="
node --version
npm --version

echo "=== Installing npm dependencies ==="
npm ci

echo "=== Building Next.js app ==="
npm run build

echo "=== Syncing Capacitor ==="
npx cap sync ios

echo "=== Verifying node_modules exists ==="
ls -la node_modules/@capacitor/ || echo "No @capacitor packages found"

echo "=== Post-clone script complete ==="
