#!/usr/bin/env bash
#
# Install git hooks for llama.pages
# Copies hook scripts into the repo's .git/hooks directory and removes any
# stale installed hook whose source script has been dropped.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
HOOKS_DIR="$REPO_ROOT/$(cd "$REPO_ROOT" && git rev-parse --git-path hooks)"

# Verify package.json exists
if [ ! -f "$REPO_ROOT/package.json" ]; then
    echo "❌ package.json not found in $REPO_ROOT"
    exit 1
fi

hooks=(pre-commit pre-push)

echo "Installing git hooks for llama.pages..."

for hook in "${hooks[@]}"; do
    src="$SCRIPT_DIR/${hook}.sh"
    dst="$HOOKS_DIR/$hook"

    # Remove stale installed hooks whose source has been dropped.
    if [ ! -f "$src" ]; then
        if [ -f "$dst" ]; then
            rm -f "$dst"
            echo "  🗑  removed stale $hook (no source script)"
        fi
        continue
    fi

    if cp "$src" "$dst" && chmod +x "$dst"; then
        echo "  ✅ $hook"
    else
        echo "  ❌ Failed to install $hook"
        exit 1
    fi
done

echo ""
echo "Pre-commit:  format staged files + svelte check"
echo "Pre-push:    lint (tests run in CI)"
echo ""
echo "Hooks never stash, so unstaged working-tree changes are untouched."
echo "Skip with:  git commit --no-verify / git push --no-verify"
