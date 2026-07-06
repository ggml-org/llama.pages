<script lang="ts">
	import { releasedFor } from '$lib/catalog';
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
	<!-- Header, model-card style: a bordered brand logo tile on the left,
	     top-aligned; beside it a metadata line (publisher · release date)
	     above the title, with the one-line summary under it. The longer
	     prose lives in the "About" column below. -->
	<header class="flex items-start gap-5">
		<span
			aria-hidden="true"
			class="border-border/60 flex size-24 shrink-0 items-center justify-center rounded-xl border [&>svg]:h-11 [&>svg]:w-11"
		>
			{@html logoFor(family.brand)}
		</span>

		<div class="min-w-0 py-0.5">
			<!-- Metadata line: just the release date -- the publisher would be
			     redundant, since every family's summary below opens by naming it.
			     (The license is in the data too, but not surfaced here yet.) -->
			{#if releasedFor(family)}
				<p class="text-muted-foreground text-[13px] tabular-nums">{releasedFor(family)}</p>
			{/if}
			<h1 class="mt-1 text-[26px] font-semibold tracking-tight">{family.name}</h1>
			<p class="text-muted-foreground mt-1 max-w-xl text-[15px]">{family.description}</p>
		</div>
	</header>

	<!-- The per-size download table, with the smaller-builds toggle tucked
	     under it. The header's one-line summary is all the prose the page
	     carries -- the longer `details` text mostly restates it, so it isn't
	     rendered here. -->
	<section class="mt-10">
		<table class="w-full text-left">
			<tbody>
				{#each family.sizes as s (s.name)}
					<SizeRow size={s} {showQuantized} />
				{/each}
			</tbody>
		</table>

		<!-- Smaller-builds toggle, shown only when the family actually has
		     smaller builds to reveal. This is also the one place the site
		     explains what quantization is -- the rows themselves keep it to
		     the quant chips. -->
		{#if hasQuantized}
			<label
				class="text-muted-foreground border-border mt-0 flex cursor-pointer items-baseline gap-2 border-t pt-3 text-[13px]"
			>
				<input type="checkbox" bind:checked={showQuantized} class="accent-sky-500" />
				<span>
					Show smaller builds — quantized further to run in less memory, at a small cost in
					quality.
				</span>
			</label>
		{/if}
	</section>
</main>
