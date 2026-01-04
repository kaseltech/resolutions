#!/bin/bash

# ci_post_clone.sh
# Xcode Cloud runs this script after cloning the repository
# It installs Node.js dependencies and builds the web assets

set -e  # Exit on any error

echo "=== YearVow Xcode Cloud Post-Clone Script ==="

# Navigate to the root of the repository
cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "=== Installing Node.js via Homebrew ==="
brew install node

echo "=== Node.js version ==="
node --version
npm --version

echo "=== Installing npm dependencies ==="
npm ci

echo "=== Building Next.js app ==="
npm run build

echo "=== Syncing Capacitor ==="
npx cap sync ios

echo "=== Post-clone script complete ==="
