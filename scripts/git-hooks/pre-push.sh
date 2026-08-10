#!/usr/bin/env bash
#
# Pre-push hook for llama.pages
# Runs: lint + test.
#
# Nothing is stashed: `prettier --check`, `eslint` and the test suite are
# read-only over tracked files, so unstaged working-tree changes are never
# moved or lost (stashing risks exactly that).

needs_check=false

# Read refs from stdin: local_ref local_sha remote_ref remote_sha
while read -r local_ref local_sha remote_ref remote_sha; do
	# New branch or force-push — always check
	if [ "$local_sha" = "0000000000000000000000000000000000000000" ] || \
	   [ "$remote_sha" = "0000000000000000000000000000000000000000" ]; then
		needs_check=true
		continue
	fi

	# Check for any changed files between remote and local
	if git diff --name-only "$remote_sha...$local_sha" | grep -q .; then
		needs_check=true
	fi
done

if [ "$needs_check" = false ]; then
	exit 0
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Check that node_modules exists
if [ ! -d "node_modules" ]; then
	echo "❌ node_modules not found. Run 'npm ci' first."
	exit 1
fi

set -euo pipefail

echo "Running pre-push checks for llama.pages..."

# Lint
if ! npm run lint; then
	echo "❌ Lint failed"
	exit 1
fi

# Test
if ! npm test; then
	echo "❌ Tests failed"
	exit 1
fi

echo "✅ Pre-push checks passed"
exit 0
