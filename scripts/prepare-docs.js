// Prepares docs assets before vite runs (chained into `npm run dev`/`build`):
//   - mirrors src/docs/*.md into static/docs/ so /docs/{page}.md URLs are
//     served as plain static files
//   - builds the section-level search index consumed by the ⌘K search modal
import fs from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS_SRC = path.join(ROOT, 'src/docs');
const STATIC_DIR = path.join(ROOT, 'static/docs');

fs.rmSync(STATIC_DIR, { recursive: true, force: true });

const mdFiles = fs
	.readdirSync(DOCS_SRC, { recursive: true })
	.filter((entry) => entry.endsWith('.md'));

for (const entry of mdFiles) {
	const dest = path.join(STATIC_DIR, entry);
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(path.join(DOCS_SRC, entry), dest);
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
	const local = entry.replace(/\.md$/, '');
	const slugger = new GithubSlugger();
	let title = local;
	let heading = '';
	let anchor = '';
	let inFence = false;
	let buffer = [];
	const flush = () => {
		const text = plainText(buffer.join(' '));
		if (text || heading) {
			sections.push({ id: sections.length, local, title, heading, anchor, text });
		}
		buffer = [];
	};
	for (const line of fs.readFileSync(path.join(DOCS_SRC, entry), 'utf8').split('\n')) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			continue;
		}
		const match = !inFence && line.match(/^(#{1,6})\s+(.*)$/);
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
