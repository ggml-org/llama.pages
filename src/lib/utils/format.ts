const GIGABYTE = 1e9;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format a byte count for display. Single GB unit (decimal, matching Hugging
 * Face/Finder) keeps column values comparable at a glance. `''` when unknown.
 */
export function formatGigabytes(size: number | undefined): string {
	if (!size) return '—';

	const gb = size / GIGABYTE;

	return `${gb.toFixed(gb < 10 ? 2 : 1)} GB`;
}

/** Human-friendly release date, e.g. "Mar 2026". `''` if missing/unparseable. */
export function formatMonthYear(iso: string | undefined): string {
	if (!iso) return '';

	const [year, month] = iso.split('-').map(Number);

	if (!year || !month) return '';

	return `${MONTHS[month - 1]} ${year}`;
}
