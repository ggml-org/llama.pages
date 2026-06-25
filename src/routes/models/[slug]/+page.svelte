<script lang="ts">
	import { logoFor, tintFor } from '$lib/logos';
	import SizeRow from '$lib/components/app/catalog/SizeRow.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const group = $derived(data.group);

	// Logo tile tint, matching the cards on the index.
	const tile = $derived(tintFor(group.brand));
</script>

<svelte:head>
	<title>{group.family} — llama.app</title>
	<meta name="description" content={group.description} />
</svelte:head>

<!-- Same outer container as the rest of the site so the pages share margins and
     left edge. Unlike the catalog grid, the detail page splits into two columns
     on wide screens: the family prose on the left, the per-size download table
     on the right. They stack on narrow screens. -->
<main class="mx-auto w-full max-w-5xl px-6 pt-8 pb-24 md:px-12">
	<!-- Header: a compact brand logo tile beside a bordered identity card with
	     just the title and a metadata line (publisher · release date). The full
	     description lives in the "About" column below, so it isn't repeated here. -->
	<header class="flex gap-4">
		<!-- Brand logo tile: a fixed square whose side equals the card's fixed
		     height (h-20), so the two line up exactly without relying on flexbox to
		     derive a square width from a stretched height (which it won't here). -->
		<span
			aria-hidden="true"
			class="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-black/5 {tile} [&>svg]:h-9 [&>svg]:w-9"
		>
			{@html logoFor(group.brand)}
		</span>

		<!-- Identity card, same height as the tile. -->
		<div
			class="border-border bg-card flex flex-1 flex-col justify-center rounded-2xl border px-4"
		>
			<h1 class="text-[26px] font-semibold tracking-tight">{group.family}</h1>
			<!-- Metadata line: publisher, then release date, separated by a dot. -->
			<p class="text-muted-foreground text-[13px]">
				{group.publisher}
				{#if group.released}
					<span class="mx-0.5">·</span>
					<span class="tabular-nums">{group.released}</span>
				{/if}
			</p>
		</div>
	</header>

	<!-- The download table is the primary content, so it takes the wider left
	     column (~60%); the longer prose sits on the right (~40%). Stacks on
	     narrow screens. -->
	<div class="mt-10 grid items-start gap-x-12 gap-y-10 lg:grid-cols-[1.5fr_1fr]">
		<!-- Left: per-size download table. -->
		<section>
			<table class="w-full text-left">
				<tbody>
					<!-- RAM budget is gone in this layout, so pass 0 (everything fits). -->
					{#each group.sizes as s (s.name)}
						<SizeRow size={s} ramGB={0} />
					{/each}
				</tbody>
			</table>
		</section>

		<!-- Right: the longer family description, one <p> per authored paragraph. -->
		<section>
			<div class="text-muted-foreground space-y-3 text-[15px] leading-relaxed">
				{#each group.details as para}
					<p>{para}</p>
				{/each}
			</div>
		</section>
	</div>
</main>
