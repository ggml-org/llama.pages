// Builds point at their own repo because quants sometimes live in different
// orgs (e.g. Q4 under mistralai, Q8 mirrored under ggml-org).
export type Build = {
	quant?: string;
	// Kept for compatibility: shipped app versions decode `size` as a string from the catalog.
	size?: string;
	sizeBytes?: number;
	repo: string;
};

export type Size = {
	name: string;
	params?: string;
	vision?: boolean;
	// Like Family.maxMemGb, but per size. Absent means the family's cap (if any) applies.
	maxMemGb?: number;
	builds: Build[];
};

export type Family = {
	name: string;
	// Brand behind the family (e.g. "Gemma"), used for the logo.
	brand: string;
	// One-line summary for the catalog cards.
	description: string;
	// Longer prose, kept for consumers; the website renders only `description`.
	details?: string;
	// Approximate release month as "YYYY-MM", not meant to be precise.
	released: string;
	// Families whose sizes ship under different licenses list both (e.g. "Apache 2.0 / Modified MIT").
	license: string;
	// Exposed for consumers to highlight; the website doesn't surface it. Absent means false.
	featured?: boolean;
	// Marks a low-memory pick (e.g. Gemma 3 for 8 GB Macs): consumers should not
	// suggest this family on machines with more RAM than this. Absent means no cap.
	maxMemGb?: number;
	sizes: Size[];
};

// Just the list of families — no top-level wrapper; per-consumer extras live in the consumer.
export type Catalog = Family[];
