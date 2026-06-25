// Single source of truth. Imported here for the prerendered website, and served
// verbatim at /v1/catalog.json (see src/routes/v1/catalog.json/+server.ts) for
// the apps to fetch.
import data from './catalog.json';

// Vocabulary (shared with the apps):
//   family — the named release line, e.g. "Gemma 3". Holds the shared metadata.
//   size   — a parameter tier within a family, e.g. "Gemma 3 4B".
//   build  — a downloadable quant of a size, e.g. that 4B at Q4.
// "brand" (e.g. "Gemma") and "publisher" (e.g. "Google") are attributes of a
// family, not levels of their own. The data nests these strictly:
// family → size → build.

// A downloadable quant of a size: the same weights at a given quantization.
// Each build points at its own repo, since quants sometimes live in different
// orgs (e.g. Q4 under mistralai, Q8 mirrored under ggml-org).
export type Build = {
	quant?: string;
	size?: string;
	repo: string;
};

export type Size = {
	name: string;
	params?: string;
	vision?: boolean;
	builds: Build[];
};

export type Family = {
	name: string;
	// Brand behind the family (e.g. "Gemma"), used for the logo.
	brand: string;
	// One-line summary, shown on the catalog cards where space is tight.
	description: string;
	// Longer prose for the family page, where there's room for a couple of
	// paragraphs. Paragraphs are separated by a blank line ("\n\n"). Optional;
	// the family page falls back to `description` when it's missing.
	details?: string;
	// Approximate release month as "YYYY-MM". Not meant to be precise.
	released: string;
	// Whether this family is featured. Exposed in the published catalog API for
	// consumers to highlight; the website doesn't surface it. Absent means false.
	featured?: boolean;
	sizes: Size[];
};

// The catalog is just the list of families — no top-level wrapper. Anything a
// single consumer needs around it (e.g. the website's page title) lives in that
// consumer, not in the shared data.
export type Catalog = Family[];

export const catalog = data as Catalog;

// A family with its derived/display fields resolved once. This is the unit the
// UI works in: the grid shows one card per group, and the detail route renders
// one group.
export type FamilyGroup = {
	family: string;
	brand: string;
	publisher: string; // org that publishes the family, e.g. "Google" for Gemma
	description: string; // one-line summary, for cards
	details: string[]; // longer prose split into paragraphs, for the family page
	released: string; // human-friendly, e.g. "Mar 2026"
	sortKey: string; // raw "YYYY-MM" for ordering
	slug: string; // URL-safe id, e.g. "gemma-4"
	featured: boolean; // whether the family is featured
	sizes: Size[];
};

// URL-safe id for a family name, e.g. "Qwen 3.6" → "qwen-3-6". Lossy but stable,
// and unique across the catalog since family names are.
export function slugify(family: string): string {
	return family
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Resolve a family's derived/display fields once, for the UI to consume.
export function resolveFamily(f: Family): FamilyGroup {
	return {
		family: f.name,
		brand: f.brand,
		publisher: publisherFor(f.brand),
		description: f.description,
		details: detailsFor(f),
		released: releasedFor(f),
		sortKey: f.released,
		slug: slugify(f.name),
		featured: f.featured ?? false,
		sizes: f.sizes
	};
}

// Every family as a resolved group, in catalog order.
export function familyGroups(): FamilyGroup[] {
	return catalog.map(resolveFamily);
}

// The family group for a given slug, or undefined if no family matches.
export function familyGroupBySlug(slug: string): FamilyGroup | undefined {
	const f = catalog.find((f) => slugify(f.name) === slug);
	return f && resolveFamily(f);
}

// The org that publishes a brand. `brand` is the logo-grouping key (e.g.
// "Gemma"), which isn't always the publisher's name, so we map it explicitly.
// Falls back to the brand itself for orgs whose brand and name coincide.
export function publisherFor(brand: string): string {
	const publishers: Record<string, string> = {
		Gemma: 'Google',
		Qwen: 'Alibaba',
		Mistral: 'Mistral AI',
		GLM: 'Zhipu AI',
		OpenAI: 'OpenAI'
	};
	return publishers[brand] ?? brand;
}

// The longer family prose, split into paragraphs for the family page. Falls
// back to the one-line summary when no `details` is authored, so the page
// always has something to show.
export function detailsFor(f: Family): string[] {
	const text = f.details ?? f.description ?? '';
	return text
		.split('\n\n')
		.map((p) => p.trim())
		.filter(Boolean);
}

// Human-friendly release date for a family, e.g. "Mar 2026".
// Returns '' if the date is missing or unparseable.
export function releasedFor(f: Family): string {
	const r = f.released;
	if (!r) return '';
	const [y, m] = r.split('-').map(Number);
	if (!y || !m) return '';
	const month = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	][m - 1];
	return `${month} ${y}`;
}

// Parse strings like "2.5 GB", "806 MB", "18 GB" into gigabytes.
// Returns null if the input is missing or unparseable.
export function sizeGB(s: string | undefined): number | null {
	if (!s) return null;
	const m = s.trim().match(/^([\d.]+)\s*(GB|MB|G|M)$/i);
	if (!m) return null;
	const n = parseFloat(m[1]);
	const unit = m[2].toUpperCase();
	return unit.startsWith('M') ? n / 1024 : n;
}

// Whether a build is likely to run on a machine with `ramGB` of RAM.
// Heuristic: file size should fit within ~70% of total RAM, leaving headroom
// for OS, KV cache, and context. Unknown size → assume it fits (don't hide).
export function fitsInRam(b: Build, ramGB: number): boolean {
	const s = sizeGB(b.size);
	if (s == null) return true;
	return s <= ramGB * 0.7;
}

// A size is shown when any of its builds fits in the available RAM.
export function sizeFitsInRam(s: Size, ramGB: number): boolean {
	return s.builds.some((b) => fitsInRam(b, ramGB));
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
