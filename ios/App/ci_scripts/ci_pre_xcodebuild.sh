#!/bin/bash

# ci_pre_xcodebuild.sh
# Runs right before xcodebuild - ensure node_modules exists for SPM

echo "=== Pre-Xcodebuild Script ==="
echo "=== Verifying node_modules for SPM package resolution ==="

cd "$CI_PRIMARY_REPOSITORY_PATH" || exit 1

# Double-check node_modules exists
if [ ! -d "node_modules" ]; then
    echo "ERROR: node_modules not found! Running npm ci..."
    npm ci || npm install
    npx cap sync ios
fi

echo "=== node_modules/@capacitor contents ==="
ls -la node_modules/@capacitor/ || echo "Missing @capacitor"

echo "=== node_modules/@capgo contents ==="
ls -la node_modules/@capgo/ || echo "Missing @capgo"

echo "=== Pre-xcodebuild complete ==="
