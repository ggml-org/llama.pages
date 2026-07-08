// Freezes the current docs version: tags v{APP_VERSION} at HEAD and pushes
// the tag (skip with --no-push). Until now that version was served from the
// working tree; from here the tag wins and master edits no longer change
// /docs — bump APP_VERSION in src/lib/constants/site.ts to start the next
// version. The version list itself is dynamic (see scripts/extract-docs.js).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const push = !process.argv.includes('--no-push');

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function fail(message) {
	console.error(`[docs:release] ${message}`);
	process.exit(1);
}

if (git('status', '--porcelain').trim() !== '') {
	fail('working tree is dirty — commit your changes first so the tag pins the right content');
}

const appVersion = fs
	.readFileSync(path.join(ROOT, 'src/lib/constants/site.ts'), 'utf8')
	.match(/APP_VERSION\s*=\s*'([^']+)'/)?.[1];
if (!appVersion) fail('could not read APP_VERSION from src/lib/constants/site.ts');
const tag = `v${appVersion}`;

const tagExists = (() => {
	try {
		git('rev-parse', '--verify', '--quiet', `${tag}^{commit}`);
		return true;
	} catch {
		return false;
	}
})();

if (tagExists) {
	console.log(
		`[docs:release] ${tag} is already frozen — nothing to do.\n` +
			`Bump APP_VERSION in src/lib/constants/site.ts to start the next version.`
	);
	process.exit(0);
}

git('tag', tag);
console.log(`[docs:release] tagged ${tag} at HEAD — its docs are now frozen`);

if (push) {
	try {
		git('push', 'origin', `refs/tags/${tag}`);
		console.log(`[docs:release] pushed tag ${tag} to origin`);
	} catch {
		console.warn(
			`[docs:release] warning: could not push tag — push it manually: git push origin ${tag}`
		);
	}
} else {
	console.log(`[docs:release] --no-push: remember to run  git push origin ${tag}`);
}

console.log(
	`\n[docs:release] done. Bump APP_VERSION in src/lib/constants/site.ts to start the next ` +
		`version — until then, master edits no longer change /docs.`
);
