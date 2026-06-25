<script lang="ts">
	import { familyGroups } from '$lib/catalog';
	import FamilyCard from '$lib/components/app/catalog/FamilyCard.svelte';

	// All families, newest first. The publisher is already legible from each
	// card's name and icon, so we present one flat, recency-ordered grid rather
	// than fragmenting the catalog into per-publisher sections.
	const allFamilies = $derived(familyGroups().sort((a, b) => b.sortKey.localeCompare(a.sortKey)));
</script>

<svelte:head>
	<title>Models — llama.app</title>
	<meta name="description" content="Curated open models you can run locally with llama.cpp." />
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-6 pt-8 pb-24 md:px-12">
	<!-- One flat grid of every family, newest first. -->
	<div class="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each allFamilies as g (g.family)}
			<FamilyCard
				href="/models/{g.slug}"
				family={g.family}
				brand={g.brand}
				description={g.description}
				released={g.released}
				featured={g.featured}
				sizes={g.sizes}
			/>
		{/each}
	</div>
</main>
