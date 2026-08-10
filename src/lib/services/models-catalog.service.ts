import data from '../models-catalog.json';
import type { Build, Family, ModelsCatalog } from '$lib/types';

// Vocabulary (shared with the apps):
//   family — the named release line, e.g. "Gemma 3". Holds the shared metadata.
//   size   — a parameter tier within a family, e.g. "Gemma 3 4B".
//   build  — a downloadable quant of a size, e.g. that 4B at Q4.
// "brand" and "publisher" are attributes of a family, not levels of their own.
// The data nests strictly: family → size → build.

/**
 * Stateless loader & query layer over the static model catalog. The JSON is
 * the single source of truth: imported here for the prerendered website and
 * served verbatim at /v1/catalog.json (see src/routes/v1/catalog.json/+server.ts)
 * for the apps to fetch.
 */
export class ModelsCatalogService {
	/** Authored (API) order — served verbatim as the catalog JSON. */
	static readonly data = data as ModelsCatalog;

	/** Catalog in display order: newest first. */
	static readonly families = [...ModelsCatalogService.data].sort((a, b) =>
		b.released.localeCompare(a.released)
	);

	/**
	 * URL-safe id for a family name, e.g. "Qwen 3.6" → "qwen-3-6". Lossy but
	 * stable, and unique since family names are.
	 */
	static slugify(family: string): string {
		return family
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	/** The family for a given slug, or undefined if no family matches. */
	static familyBySlug(slug: string): Family | undefined {
		return ModelsCatalogService.data.find((f) => ModelsCatalogService.slugify(f.name) === slug);
	}

	/** Human-friendly release date, e.g. "Mar 2026". '' if missing/unparseable. */
	static releasedFor(f: Family): string {
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

	/**
	 * Format a download size (bytes) for display. Single GB unit (decimal,
	 * matching Hugging Face/Finder) keeps the column comparable at a glance.
	 */
	static displaySize(size: number | undefined): string {
		if (!size) return '—';

		const gb = size / 1e9;

		return `${gb.toFixed(gb < 10 ? 2 : 1)} GB`;
	}

	// Memory tiers Macs ship with (GB). Tiers past 512 extrapolate Apple's
	// step pattern so builds too big for any current Mac still show an honest
	// requirement instead of silently omitting the line.
	private static readonly MAC_MEM_TIERS = [
		8, 16, 24, 32, 48, 64, 96, 128, 192, 256, 512, 768, 1024
	];

	/**
	 * Smallest Mac memory tier (GB) that can run a build, or null if unknown
	 * or nothing fits even the largest tier. Mirrors the app's compatibility
	 * check (Model+Compatibility.swift): budget = RAM × 0.75 − 2 GB overhead,
	 * fits when fileSize × 1.05 ≤ budget.
	 */
	static minMemForBuild(b: Build): number | null {
		if (!b.sizeBytes) return null;

		const weightMb = (b.sizeBytes / 1_048_576) * 1.05;

		for (const tier of ModelsCatalogService.MAC_MEM_TIERS) {
			const budgetMb = tier * 1024 * 0.75 - 2048;

			if (weightMb <= budgetMb) return tier;
		}

		return null;
	}

	/**
	 * The family's entry bar: smallest tier that runs *any* of its builds.
	 * A floor, not a guarantee — the list page renders it as "from N GB".
	 */
	static minMemGB(f: Family): number | null {
		const tiers = f.sizes
			.flatMap((s) => s.builds)
			.map(ModelsCatalogService.minMemForBuild)
			.filter((n): n is number => n !== null);

		return tiers.length ? Math.min(...tiers) : null;
	}

	// URL scheme the install deeplinks target. Production points at the
	// shipping app (`llama://`); switch to `llama-dev` when testing dev builds.
	private static readonly INSTALL_SCHEME = 'llama';

	/**
	 * Deeplink that Llama's `LlamabarnURL.parse` accepts.
	 * Shape (RFC 017): llama://install?repo={org}/{repo}[&quant={QUANT}]
	 */
	static deeplink(b: Build): string {
		const params = new URLSearchParams({ repo: b.repo });

		if (b.quant) params.set('quant', b.quant);

		return `${ModelsCatalogService.INSTALL_SCHEME}://install?${params.toString()}`;
	}

	/** CLI equivalent of the deeplink; llama.cpp resolves `-hf {org}/{repo}[:{QUANT}]`. */
	static cliCommand(b: Build): string {
		return `llama serve -hf ${b.repo}${b.quant ? `:${b.quant}` : ''}`;
	}
}
