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
	// Download size in bytes, as reported by the Hugging Face tree API
	// (the sum of the build's GGUF files for split models).
	size?: number;
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

// The catalog in display order: newest first. The website always lists
// families this way, so we sort once here; `catalog` itself keeps the
// authored order, since it's served verbatim as the API.
export const families: Family[] = [...catalog].sort((a, b) =>
	b.released.localeCompare(a.released)
);

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
	return (f.details ?? f.description)
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
