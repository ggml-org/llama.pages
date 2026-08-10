#!/usr/bin/env bash
#
# Pre-commit hook for llama.pages
# Runs: format + svelte check
# Stashes unstaged changes temporarily and restores them after.

# Only run when there are staged changes
if ! git diff --cached --name-only | grep -q .; then
    exit 0
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Check that node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Run 'npm ci' first."
    exit 1
fi

# Stash unstaged changes so they don't interfere with the checks
stash_name="pi-pages-precommit"
git stash push --keep-index -u -m "$stash_name" 2>/dev/null || true

echo "Running pre-commit checks for llama.pages..."

# Format the working tree, then re-stage anything that changed
npm run format
format_ok=$?
if [ $format_ok -eq 0 ]; then
    git add --update
fi

# Svelte check on the clean tree
npm run check
check_ok=$?

# Restore stashed changes
if git stash list | grep -q "$stash_name"; then
    git stash pop 2>/dev/null || true
fi

if [ $format_ok -ne 0 ]; then
    echo "❌ Format failed"
    exit 1
fi
if [ $check_ok -ne 0 ]; then
    echo "❌ Svelte check failed"
    exit 1
fi

echo "✅ Pre-commit checks passed"
exit 0
