// Extracts versioned docs from git tags into .docs-build/ and mirrors every
// version's raw markdown into static/docs/ so `/docs/{version}/{page}.md`
// URLs are served as plain static files. Runs via the predev/prebuild hooks.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS_SRC = 'src/docs/main';
const BUILD_DIR = path.join(ROOT, '.docs-build');
const STATIC_DIR = path.join(ROOT, 'static/docs');

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function tagExists(tag) {
	try {
		git('rev-parse', '--verify', '--quiet', `${tag}^{commit}`);
		return true;
	} catch {
		return false;
	}
}

const versions = parse(fs.readFileSync(path.join(ROOT, 'src/docs/_versions.yml'), 'utf8'));
if (!Array.isArray(versions) || versions.some((v) => typeof v !== 'string')) {
	throw new Error('src/docs/_versions.yml must be a YAML list of version strings');
}

fs.rmSync(BUILD_DIR, { recursive: true, force: true });
fs.rmSync(STATIC_DIR, { recursive: true, force: true });

// Extract each tagged version's docs from git history.
for (const version of versions) {
	if (version === 'main') continue;
	if (!tagExists(version)) {
		console.warn(`[extract-docs] warning: tag "${version}" not found, skipping`);
		continue;
	}
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
	console.log(`[extract-docs] extracted ${files.length} files for ${version}`);
}

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

for (const version of versions) {
	mirrorMarkdown(
		version === 'main' ? path.join(ROOT, DOCS_SRC) : path.join(BUILD_DIR, version),
		version
	);
}
console.log(
	`[extract-docs] mirrored raw markdown for ${versions.length} version(s) into static/docs`
);
