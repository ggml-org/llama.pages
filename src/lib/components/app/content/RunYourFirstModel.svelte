<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import ModelsCatalogFamilyCard from '$lib/components/app/models-catalog/ModelsCatalogFamilyCard.svelte';
	import { ModelsCatalogService } from '$lib/services';

	// A teaser of the catalog on the homepage: the featured families, newest
	// first (`families` is already in that order), as a grid of tiles. The
	// full, browsable catalog lives at /models.
	const featured = ModelsCatalogService.families.filter((f) => f.featured);
</script>

<section class="py-24">
	<h2 class="mb-8 text-2xl font-semibold text-foreground">Run your first model</h2>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each featured as f (f.name)}
			<ModelsCatalogFamilyCard family={f} />
		{/each}
	</div>

	<div class="mt-6 flex justify-center">
		<a
			href={resolve('/models')}
			class="inline-flex items-center gap-1.5 text-sm text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
		>
			Browse all models
			<ArrowUpRight class="size-3.5" />
		</a>
	</div>
</section>
