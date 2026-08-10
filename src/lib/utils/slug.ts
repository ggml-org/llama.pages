const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const EDGE_DASHES_RE = /^-+|-+$/g;

/** URL-safe id for a name, e.g. "Qwen 3.6" → "qwen-3-6". Stable and lossy. */
export function slugify(value: string): string {
	return value.toLowerCase().replace(NON_ALPHANUMERIC_RE, '-').replace(EDGE_DASHES_RE, '');
}
