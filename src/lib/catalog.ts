// Single source of truth. Imported here for the prerendered website, and served
// verbatim at /v1/catalog.json (see src/routes/v1/catalog.json/+server.ts) for
// the apps to fetch.
import data from './catalog.json';
import type { Build, Catalog, Family } from './types';

// Vocabulary (shared with the apps):
//   family — the named release line, e.g. "Gemma 3". Holds the shared metadata.
//   size   — a parameter tier within a family, e.g. "Gemma 3 4B".
//   build  — a downloadable quant of a size, e.g. that 4B at Q4.
// "brand" (e.g. "Gemma") and "publisher" (e.g. "Google") are attributes of a
// family, not levels of their own. The data nests these strictly:
// family → size → build.

export const catalog = data as Catalog;

// The catalog in display order: newest first. The website always lists
// families this way, so we sort once here; `catalog` itself keeps the
// authored order, since it's served verbatim as the API.
export const families: Family[] = [...catalog].sort((a, b) => b.released.localeCompare(a.released));

// URL-safe id for a family name, e.g. "Qwen 3.6" → "qwen-3-6". Lossy but stable,
// and unique across the catalog since family names are.
export function slugify(family: string): string {
	return family
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// The family for a given slug, or undefined if no family matches.
export function familyBySlug(slug: string): Family | undefined {
	return catalog.find((f) => slugify(f.name) === slug);
}

// Human-friendly release date for a family, e.g. "Mar 2026".
// Returns '' if the date is missing or unparseable.
export function releasedFor(f: Family): string {
	const r = f.released;

	if (!r) return '';

	const [y, m] = r.split('-').map(Number);

	if (!y || !m) return '';

	const month = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	][m - 1];

	return `${month} ${y}`;
}

// Format a download size (bytes) for display. A single unit (GB, decimal,
// matching what Hugging Face and Finder show) keeps the column comparable
// at a glance, so sub-GB sizes render as fractions (e.g. "0.24 GB").
export function displaySize(size: number | undefined): string {
	if (!size) return '—';

	const gb = size / 1e9;

	// Two decimals under 10 GB so small models still differ visibly;
	// one decimal above, where the extra digit is noise.
	return `${gb.toFixed(gb < 10 ? 2 : 1)} GB`;
}

// Memory tiers Macs ship with (GB), used to express minimum memory as a
// real configuration ("16 GB+") rather than a raw computed number. The tiers
// past 512 don't exist yet -- they extrapolate Apple's step pattern so that
// builds too big for any current Mac still show an honest requirement
// instead of silently omitting the line.
const MAC_MEM_TIERS = [8, 16, 24, 32, 48, 64, 96, 128, 192, 256, 512, 768, 1024];

// The smallest Mac memory tier (GB) that can run a build of the given download
// size, or null if the size is unknown or nothing fits even the largest tier.
// Mirrors the app's compatibility check (Model+Compatibility.swift):
// budget = RAM × 0.75 − 2 GB overhead, and a build fits when
// fileSize × 1.05 ≤ budget — so the website and the app never disagree.
export function minMemForBuild(b: Build): number | null {
	if (!b.sizeBytes) return null;

	const weightMb = (b.sizeBytes / 1_048_576) * 1.05;

	for (const tier of MAC_MEM_TIERS) {
		const budgetMb = tier * 1024 * 0.75 - 2048;

		if (weightMb <= budgetMb) return tier;
	}

	return null;
}

// The family's entry bar: the smallest tier that runs *any* of its builds
// (i.e. the smallest quant of the smallest size). A floor, not a guarantee
// for the whole family — the list page renders it as "from N GB".
export function minMemGB(f: Family): number | null {
	const tiers = f.sizes
		.flatMap((s) => s.builds)
		.map(minMemForBuild)
		.filter((n): n is number => n !== null);

	return tiers.length ? Math.min(...tiers) : null;
}

// URL scheme the install deeplinks target. Production points at the shipping
// app (`llama://`); switch to `llama-dev` when testing against a dev build.
const INSTALL_SCHEME = 'llama';

// Build the deeplink that Llama's `LlamabarnURL.parse` accepts.
// Shape (RFC 017): llama://install?repo={org}/{repo}[&quant={QUANT}]
export function deeplink(b: Build): string {
	const params = new URLSearchParams({ repo: b.repo });

	if (b.quant) params.set('quant', b.quant);

	return `${INSTALL_SCHEME}://install?${params.toString()}`;
}

// CLI equivalent of the install deeplink. llama.cpp resolves `-hf` specs of
// the form {org}/{repo}[:{QUANT}] against Hugging Face.
export function cliCommand(b: Build): string {
	return `llama serve -hf ${b.repo}${b.quant ? `:${b.quant}` : ''}`;
}
