<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { families } from '$lib/catalog';
	import FamilyCard from '$lib/components/app/catalog/FamilyCard.svelte';

	// A teaser of the catalog on the homepage: the featured families, newest
	// first (`families` is already in that order). The full, browsable catalog
	// lives at /models.
	const featured = families.filter((f) => f.featured);
</script>

<section class="py-24">
	<h2 class="text-foreground mb-8 text-2xl font-semibold">Run your first model</h2>

	<div class="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each featured as f (f.name)}
			<FamilyCard family={f} />
		{/each}
	</div>

	<div class="mt-6 flex justify-center">
		<a
			href="/models"
			class="text-foreground/70 hover:text-foreground inline-flex items-center gap-1.5 text-sm underline underline-offset-4 transition-colors"
		>
			Browse all models
			<ArrowUpRight class="size-3.5" />
		</a>
	</div>
</section>
