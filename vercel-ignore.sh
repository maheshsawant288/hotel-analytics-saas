#!/bin/bash

echo "Checking branch: $VERCEL_GIT_COMMIT_REF"

# Check if the branch is main or staging
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" ]]; then
  echo "✅ - Branch is allowed. Proceeding with build."
  exit 1 # Exit code 1 tells Vercel to PROCEED with the build
else
  echo "🛑 - Branch is ignored. Cancelling build."
  exit 0 # Exit code 0 tells Vercel to SKIP the build
fi
