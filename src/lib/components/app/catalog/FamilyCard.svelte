<script lang="ts">
	import { type Family, releasedFor, slugify } from '$lib/catalog';
	import { logoFor } from '$lib/logos';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let { family }: { family: Family } = $props();

	const released = $derived(releasedFor(family));

	// Whether any size in this family is vision-capable. Drives the eye next to
	// the family title.
	const hasVision = $derived(family.sizes.some((s) => s.vision));
</script>

<!-- The whole card is a link to the family's detail page. As a real <a href> it
     supports cmd/middle-click to open in a new tab, "copy link", etc. -->
<a
	href="/models/{slugify(family.name)}"
	class="border-foreground/6 bg-foreground/2 hover:border-foreground/12 flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition-colors"
>
	<div class="flex items-start gap-3">
		<!-- Brand logo on a neutral square tile. -->
		<span
			aria-hidden="true"
			class="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5"
		>
			{@html logoFor(family.brand)}
		</span>
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-baseline gap-x-2.5">
				<h3 class="flex items-baseline gap-1.5 text-[17px] font-medium">
					{family.name}
					{#if hasVision}
						<!-- Eye = the family includes vision-capable sizes. Sits beside the
						     title so the trait reads at the family level, not per pill. -->
						<VisionBadge class="self-center" />
					{/if}
				</h3>
				{#if released}
					<span class="text-muted-foreground/70 text-[12px] tabular-nums">{released}</span>
				{/if}
			</div>
			<p class="text-muted-foreground mt-0.5 line-clamp-2 text-[14px]">{family.description}</p>
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
		{#each family.sizes as s (s.name)}
			<span class="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[12px]">
				{s.params ?? s.name}
			</span>
		{/each}
	</span>
</a>
