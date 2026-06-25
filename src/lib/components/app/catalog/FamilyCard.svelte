<script lang="ts">
	import { type Size } from '$lib/catalog';
	import { logoFor, tintFor } from '$lib/logos';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let {
		href,
		family,
		brand,
		description,
		released,
		featured = false,
		sizes
	}: {
		// The family detail page this card links to.
		href: string;
		family: string;
		brand: string;
		description: string;
		released: string;
		// Whether to show the subtle "featured" star beside the family title.
		featured?: boolean;
		sizes: Size[];
	} = $props();

	const tint = $derived(tintFor(brand));

	// Whether any size in this family is vision-capable. Drives the eye next to
	// the family title.
	const hasVision = $derived(sizes.some((s) => s.vision));
</script>

<!-- The whole card is a link to the family's detail page. As a real <a href> it
     supports cmd/middle-click to open in a new tab, "copy link", etc. -->
<a
	{href}
	class="border-border bg-card hover:border-foreground/20 flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition-colors"
>
	<div class="flex items-start gap-3">
		<!-- Brand logo on a tinted square tile. -->
		<span
			aria-hidden="true"
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {tint} [&>svg]:h-5 [&>svg]:w-5"
		>
			{@html logoFor(brand)}
		</span>
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-baseline gap-x-2.5">
				<h3 class="flex items-baseline gap-1.5 text-[17px] font-medium">
					{family}
					{#if hasVision}
						<!-- Eye = the family includes vision-capable sizes. Sits beside the
						     title so the trait reads at the family level, not per pill. -->
						<VisionBadge class="self-center" />
					{/if}
					{#if featured}
						<!-- Star = featured family. Subtle filled mark beside the title. -->
						<svg
							aria-label="featured"
							role="img"
							viewBox="0 0 16 16"
							class="text-muted-foreground/70 h-3.5 w-3.5 self-center"
							fill="currentColor"
						>
							<path
								d="M8 1.5l1.8 3.9 4.2.5-3.1 2.9.8 4.2L8 11.3 4.3 13l.8-4.2L2 5.9l4.2-.5L8 1.5z"
							/>
						</svg>
					{/if}
				</h3>
				{#if released}
					<span class="text-muted-foreground/70 text-[12px] tabular-nums">{released}</span>
				{/if}
			</div>
			<p class="text-muted-foreground mt-0.5 line-clamp-2 text-[14px]">{description}</p>
		</div>
		<!-- Chevron hint that the card opens something. -->
		<svg
			aria-hidden="true"
			viewBox="0 0 16 16"
			class="text-muted-foreground/70 mt-1 h-4 w-4 shrink-0"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M6 4l4 4-4 4" />
		</svg>
	</div>

	<!-- Size pills: a preview of the sizes inside the family. Kept to a single
	     row that clips any overflow, so a family with many sizes never makes its
	     card taller than its neighbors and throws off the grid. -->
	<span class="flex items-center gap-1.5 overflow-hidden pl-13 tabular-nums [&>span]:shrink-0">
		{#each sizes as s (s.name)}
			<span class="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[12px]">
				{s.params ?? s.name}
			</span>
		{/each}
	</span>
</a>
