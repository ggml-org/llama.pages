// Prepares docs assets before vite runs (chained into `npm run dev`/`build`):
//   - mirrors src/docs/*.md into static/docs/ so /docs/{page}.md URLs are
//     served as plain static files
//   - builds the section-level search index consumed by the ⌘K search modal
// The mirrored files are a build-time expansion of the source docs: the shared
// {{DEFAULT_PORT}} token (single source of truth in lib/constants/llama-server.js)
// is replaced here so the raw served .md carries the real port, just like the
// mdsvex preprocess does for the rendered HTML.
import { DEFAULT_PORT } from '../src/lib/constants/llama-server.constants.js';
import {
	FENCE_RE,
	HEADING_RE,
	MARKDOWN_EXT_RE,
	NEWLINE
} from '../src/lib/constants/markdown.constants.js';
import GithubSlugger from 'github-slugger';
import fs from 'node:fs';
import path from 'node:path';

const expandTokens = (markdown) => markdown.replaceAll('{{DEFAULT_PORT}}', String(DEFAULT_PORT));
const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS_SRC = path.join(ROOT, 'src/docs');
const STATIC_DIR = path.join(ROOT, 'static/docs');

fs.rmSync(STATIC_DIR, { force: true, recursive: true });

const mdFiles = fs
	.readdirSync(DOCS_SRC, { recursive: true })
	.filter((entry) => MARKDOWN_EXT_RE.test(entry));

for (const entry of mdFiles) {
	const dest = path.join(STATIC_DIR, entry);

	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.writeFileSync(dest, expandTokens(fs.readFileSync(path.join(DOCS_SRC, entry), 'utf8')));
}
console.log(`[prepare-docs] mirrored ${mdFiles.length} markdown files into static/docs`);

/** Markdown inline syntax → plain text. */
function plainText(markdown) {
	return markdown
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[`*_>|]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Section-level search index, consumed by the ⌘K search modal (MiniSearch).
 * Anchors replicate rehype-slug: one slugger per page, fed every heading in
 * document order so duplicate suffixes match.
 */
const sections = [];

for (const entry of mdFiles) {
	const local = entry.replace(MARKDOWN_EXT_RE, '');
	const slugger = new GithubSlugger();

	let title = local;
	let heading = '';
	let anchor = '';
	let inFence = false;
	let buffer = [];

	const flush = () => {
		const text = plainText(buffer.join(' '));

		if (text || heading) {
			sections.push({ anchor, heading, id: sections.length, local, text, title });
		}

		buffer = [];
	};

	for (const line of expandTokens(fs.readFileSync(path.join(DOCS_SRC, entry), 'utf8')).split(
		NEWLINE
	)) {
		if (FENCE_RE.test(line)) {
			inFence = !inFence;

			continue;
		}

		const match = !inFence && line.match(HEADING_RE);

		if (match) {
			const level = match[1].length;
			const text = plainText(match[2]);
			const slug = slugger.slug(text);

			if (level === 1) {
				title = text;
			} else if (level <= 3) {
				flush();
				heading = text;
				anchor = slug;
			} else {
				buffer.push(text);
			}

			continue;
		}

		buffer.push(line);
	}
	flush();
}

fs.writeFileSync(path.join(STATIC_DIR, 'search-index.json'), JSON.stringify(sections));
console.log(`[prepare-docs] search index: ${sections.length} sections`);
