// Cuts a docs release. Run AFTER bumping APP_VERSION (src/lib/constants/
// site.ts) and committing:
//   1. tags the previous release (newest _versions.yml entry) at HEAD,
//      freezing its docs — until now it was served from the working tree
//   2. pushes the tag (skip with --no-push)
//   3. prepends the new v{APP_VERSION} to src/docs/_versions.yml
// Then commit the _versions.yml change and push master to deploy.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const VERSIONS_PATH = path.join(ROOT, 'src/docs/_versions.yml');
const push = !process.argv.includes('--no-push');

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function fail(message) {
	console.error(`[docs:release] ${message}`);
	process.exit(1);
}

if (git('status', '--porcelain').trim() !== '') {
	fail('working tree is dirty — commit your changes (including the APP_VERSION bump) first');
}

const appVersion = fs
	.readFileSync(path.join(ROOT, 'src/lib/constants/site.ts'), 'utf8')
	.match(/APP_VERSION\s*=\s*'([^']+)'/)?.[1];
if (!appVersion) fail('could not read APP_VERSION from src/lib/constants/site.ts');
const next = `v${appVersion}`;

const versionsYml = fs.readFileSync(VERSIONS_PATH, 'utf8');
const versions = parse(versionsYml);
if (!Array.isArray(versions) || versions.length === 0) {
	fail('src/docs/_versions.yml must be a non-empty YAML list (newest first)');
}

if (versions[0] === next) {
	console.log(
		`[docs:release] ${next} is already the current release — nothing to do.\n` +
			`Bump APP_VERSION in src/lib/constants/site.ts when the next app version ships, then re-run.`
	);
	process.exit(0);
}

// Freeze the outgoing release: its docs were served from the working tree
// until now, so tag HEAD to pin them.
const previous = versions[0];
const tagExists = (() => {
	try {
		git('rev-parse', '--verify', '--quiet', `${previous}^{commit}`);
		return true;
	} catch {
		return false;
	}
})();

if (tagExists) {
	console.log(`[docs:release] tag ${previous} already exists, leaving it as is`);
} else {
	git('tag', previous);
	console.log(`[docs:release] tagged ${previous} at HEAD`);
}

if (push) {
	try {
		git('push', 'origin', `refs/tags/${previous}`);
		console.log(`[docs:release] pushed tag ${previous} to origin`);
	} catch {
		console.warn(
			`[docs:release] warning: could not push tag — push it manually: git push origin ${previous}`
		);
	}
} else {
	console.log(`[docs:release] --no-push: remember to run  git push origin ${previous}`);
}

// Prepend the new version above the first list entry, preserving comments.
const updated = versionsYml.replace(/^- /m, `- ${next}\n- `);
fs.writeFileSync(VERSIONS_PATH, updated);
console.log(`[docs:release] added ${next} to src/docs/_versions.yml`);

console.log(
	`\n[docs:release] done. Now commit and push to deploy:\n` +
		`  git add src/docs/_versions.yml && git commit -m "docs: release ${next}" && git push`
);
