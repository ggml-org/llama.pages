// Extracts versioned docs into .docs-build/ and mirrors raw markdown into
// static/docs/ so `/docs/{version}/{page}.md` URLs are served as plain
// static files. Runs as part of `npm run dev` / `npm run build`.
//
// The version list is dynamic — no registry file:
//   - every `vX.Y.Z` git tag is a frozen version, extracted from
//     `<tag>:src/docs/main`
//   - v{APP_VERSION} (src/lib/constants/site.ts) is the living version,
//     served from the working tree until its tag exists (then the tag wins)
// The computed list (newest first) is written to .docs-build/_versions.json
// for the app to import.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS_SRC = 'src/docs/main';
const BUILD_DIR = path.join(ROOT, '.docs-build');
const STATIC_DIR = path.join(ROOT, 'static/docs');

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function semverDesc(a, b) {
	const pa = a.slice(1).split('.').map(Number);
	const pb = b.slice(1).split('.').map(Number);
	return pb[0] - pa[0] || pb[1] - pa[1] || pb[2] - pa[2];
}

const appVersion = fs
	.readFileSync(path.join(ROOT, 'src/lib/constants/site.ts'), 'utf8')
	.match(/APP_VERSION\s*=\s*'([^']+)'/)?.[1];
if (!appVersion) {
	throw new Error('could not read APP_VERSION from src/lib/constants/site.ts');
}
const living = `v${appVersion}`;

const tags = git('tag', '--list', 'v*')
	.split('\n')
	.filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag));

const versions = [...new Set([living, ...tags])].sort(semverDesc);

fs.rmSync(BUILD_DIR, { recursive: true, force: true });
fs.rmSync(STATIC_DIR, { recursive: true, force: true });

for (const version of versions) {
	if (tags.includes(version)) {
		const files = git('ls-tree', '-r', '--name-only', version, '--', DOCS_SRC)
			.split('\n')
			.filter(Boolean);
		if (files.length === 0) {
			console.warn(`[extract-docs] warning: tag "${version}" has no files under ${DOCS_SRC}`);
			continue;
		}
		for (const file of files) {
			const dest = path.join(BUILD_DIR, version, path.relative(DOCS_SRC, file));
			fs.mkdirSync(path.dirname(dest), { recursive: true });
			fs.writeFileSync(dest, git('show', `${version}:${file}`));
		}
		console.log(`[extract-docs] ${version}: extracted ${files.length} files from tag`);
	} else {
		// The living version: not yet tagged, served from the working tree.
		fs.cpSync(path.join(ROOT, DOCS_SRC), path.join(BUILD_DIR, version), { recursive: true });
		console.log(`[extract-docs] ${version}: no tag yet, using working tree ${DOCS_SRC}`);
	}
}

const built = versions.filter((version) => fs.existsSync(path.join(BUILD_DIR, version)));
fs.writeFileSync(path.join(BUILD_DIR, '_versions.json'), JSON.stringify(built));

// Mirror raw markdown into static/ for /docs/{version}/{page}.md URLs.
function mirrorMarkdown(srcDir, version) {
	if (!fs.existsSync(srcDir)) return;
	for (const entry of fs.readdirSync(srcDir, { recursive: true })) {
		if (!entry.endsWith('.md')) continue;
		const dest = path.join(STATIC_DIR, version, entry);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.copyFileSync(path.join(srcDir, entry), dest);
	}
}

for (const version of built) {
	mirrorMarkdown(path.join(BUILD_DIR, version), version);
}
// The default version (served at unversioned /docs/{page} URLs) is also
// mirrored at the static/docs root so /docs/{page}.md works.
if (built[0]) {
	mirrorMarkdown(path.join(BUILD_DIR, built[0]), '.');
}

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
 * Section-level search index of the default version, consumed by the ⌘K
 * search modal (MiniSearch). Anchors replicate rehype-slug: one slugger per
 * page, fed every heading in document order so duplicate suffixes match.
 */
function buildSearchIndex(dir) {
	const sections = [];
	for (const entry of fs.readdirSync(dir, { recursive: true })) {
		if (!entry.endsWith('.md')) continue;
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
		for (const line of fs.readFileSync(path.join(dir, entry), 'utf8').split('\n')) {
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
	return sections;
}

if (built[0]) {
	const index = buildSearchIndex(path.join(BUILD_DIR, built[0]));
	fs.writeFileSync(path.join(STATIC_DIR, 'search-index.json'), JSON.stringify(index));
	console.log(`[extract-docs] search index: ${index.length} sections from ${built[0]}`);
}
console.log(`[extract-docs] versions (newest first): ${built.join(', ')}`);
