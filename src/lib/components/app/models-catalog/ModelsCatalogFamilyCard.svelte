<script lang="ts">
	// One family as a homepage grid tile: brand mark, name, vision badge and a
	// two-line description. No size pills here -- on the tile's tinted
	// background the muted chips lose contrast, and the teaser's job is to
	// invite a click, not carry specs; sizes live on the index and detail
	// pages.
	import ModelsCatalogVisionBadge from './ModelsCatalogVisionBadge.svelte';
	import { resolve } from '$app/paths';
	import { logoFor } from '$lib/assets/logos';
	import { ModelsCatalogService } from '$lib/services';
	import type { Family } from '$lib/types';

	let { family }: { family: Family } = $props();
</script>

<!-- The whole tile is a link to the family's detail page. As a real <a href>
     it supports cmd/middle-click to open in a new tab, "copy link", etc. -->
<a
	href={resolve(`/models/${ModelsCatalogService.slugify(family.name)}`)}
	class="flex h-full flex-col rounded-2xl border border-foreground/6 bg-foreground/2 p-5 transition-colors hover:border-foreground/12"
>
	<!-- Brand mark on its own row at the top, so the name and description
	     below share the same left edge -- no inline icon pushing the title
	     over. -->
	<span aria-hidden="true" class="mb-3 flex items-center [&>svg]:h-5 [&>svg]:w-5">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html logoFor(family.brand)}
	</span>

	<h3 class="flex min-w-0 items-center gap-1.5 text-[16px] font-medium">
		<span class="truncate">{family.name}</span>
		{#if family.sizes.some((s) => s.vision)}
			<ModelsCatalogVisionBadge />
		{/if}
	</h3>

	<p class="mt-1 line-clamp-2 text-[14px] text-muted-foreground">{family.description}</p>
</a>
