// Markdown parsing constants for the docs build and search index. Kept as a
// .js module so the plain-Node scripts/prepare-docs.js can import them
// directly (the TS barrel isn't importable outside the app build).
export const NEWLINE = '\n';
export const MARKDOWN_EXT_RE = /\.md$/;
export const HEADING_RE = /^(#{1,6})\s+(.*)$/;
export const FENCE_RE = /^\s*```/;
