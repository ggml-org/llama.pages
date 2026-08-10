// Node of a `_toctree.yml` file (Hugging Face doc-builder compatible shape).
export interface TocItem {
	title: string;
	/** Page id relative to the version root, without extension (link target). */
	local?: string;
	sections?: TocItem[];
	/** Force the default collapse state of this section. */
	isExpanded?: boolean;
	new?: boolean;
}

export interface FlatTocEntry {
	title: string;
	local: string;
}
