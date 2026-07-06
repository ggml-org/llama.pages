<script lang="ts">
	import { detailsFor, publisherFor, releasedFor } from '$lib/catalog';
	import { logoFor } from '$lib/logos';
	import SizeRow from '$lib/components/app/catalog/SizeRow.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const family = $derived(data.family);

	// Whether to also show each size's smaller quantized builds. Off by default:
	// every size leads with its canonical (highest-precision) build, and lower
	// quants are opt-in -- mirroring the app, where they're strictly fallbacks.
	let showQuantized = $state(false);
	const hasQuantized = $derived(family.sizes.some((s) => s.builds.length > 1));
</script>

<svelte:head>
	<title>{family.name} — llama.app</title>
	<meta name="description" content={family.description} />
</svelte:head>

<!-- Same outer container as the rest of the site so the pages share margins and
     left edge. The per-size download table spans the full width, followed by
     the family prose. -->
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
			class="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-muted text-muted-foreground [&>svg]:h-9 [&>svg]:w-9"
		>
			{@html logoFor(family.brand)}
		</span>

		<!-- Identity card, same height as the tile. -->
		<div
			class="border-foreground/6 bg-foreground/2 flex flex-1 flex-col justify-center rounded-2xl border px-4"
		>
			<h1 class="text-[26px] font-semibold tracking-tight">{family.name}</h1>
			<!-- Metadata line: publisher, then release date, separated by a dot. -->
			<p class="text-muted-foreground text-[13px]">
				{publisherFor(family.brand)}
				{#if releasedFor(family)}
					<span class="mx-0.5">·</span>
					<span class="tabular-nums">{releasedFor(family)}</span>
				{/if}
			</p>
		</div>
	</header>

	<!-- The download table is the primary content: it spans the full width, with
	     the family description below it. -->
	<section class="mt-10">
		<table class="w-full text-left">
			<tbody>
				{#each family.sizes as s (s.name)}
					<SizeRow size={s} {showQuantized} />
				{/each}
			</tbody>
		</table>

		<!-- Quantized-builds toggle, shown only when the family actually has
		     smaller builds to reveal. This is also the one place the site
		     explains what quantization is -- the rows themselves stay jargon-free. -->
		{#if hasQuantized}
			<label
				class="text-muted-foreground border-border mt-0 flex cursor-pointer items-baseline gap-2 border-t pt-3 text-[13px]"
			>
				<input type="checkbox" bind:checked={showQuantized} class="accent-sky-500" />
				<span>
					Show quantized builds — smaller downloads that trade a little quality to run in less
					memory.
				</span>
			</label>
		{/if}
	</section>

	<!-- The longer family description, one <p> per authored paragraph. Capped in
	     width for comfortable line length. -->
	<section class="mt-10">
		<div class="text-muted-foreground max-w-2xl space-y-3 text-[15px] leading-relaxed">
			{#each detailsFor(family) as para}
				<p>{para}</p>
			{/each}
		</div>
	</section>
</main>
