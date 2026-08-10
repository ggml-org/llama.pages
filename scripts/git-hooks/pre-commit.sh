#!/usr/bin/env bash
#
# Pre-commit hook for llama.pages
# Formats the staged files, re-stages them, then runs svelte check.
#
# Unstaged working-tree changes are left completely untouched — nothing is
# stashed. Stashing here is dangerous: with staged new files or deletions it
# can lift staged changes into a stash that is never restored, silently
# removing them from the working tree (see `git stash push --keep-index`).

# Only run when there are staged changes
if ! git diff --cached --name-only | grep -q .; then
	exit 0
fi

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Check that node_modules exists
if [ ! -d "node_modules" ]; then
	echo "❌ node_modules not found. Run 'npm ci' first."
	exit 1
fi

echo "Running pre-commit checks for llama.pages..."

# Staged files still on disk (added/modified/renamed — skip deletions).
staged_names=$(git diff --cached --name-only --diff-filter=ACMR)

ext_code='.(ts|mts|cts|js|mjs|cjs|svelte)$'
ext_text='.(ts|mts|cts|js|mjs|cjs|svelte|md|mdx|svx|css|scss|json|yaml|yml)$'

# --- Format staged code/text files, then re-stage them -------------------
if [ -n "$staged_names" ]; then
	text_files=()
	while IFS= read -r f; do text_files+=("$f"); done < <(printf '%s\n' "$staged_names" | grep -E "$ext_text" || true)
	if [ "${#text_files[@]}" -gt 0 ]; then
		if ! npx prettier --write "${text_files[@]}"; then
			echo "❌ Prettier failed"
			exit 1
		fi
		git add -- "${text_files[@]}"
	fi

	code_files=()
	while IFS= read -r f; do code_files+=("$f"); done < <(printf '%s\n' "$staged_names" | grep -E "$ext_code" || true)
	if [ "${#code_files[@]}" -gt 0 ]; then
		if ! npx eslint --fix "${code_files[@]}"; then
			echo "❌ ESLint failed"
			exit 1
		fi
		git add -- "${code_files[@]}"
	fi
fi

# --- Svelte check ---------------------------------------------------------
if ! npm run check; then
	echo "❌ Svelte check failed"
	exit 1
fi

echo "✅ Pre-commit checks passed"
exit 0
