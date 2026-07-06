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
	     above the title, with the one-line summary under it. -->
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

	<section class="mt-10">
		<!-- Section header line: a heading on the left anchors the row, with the
		     quantization toggle as the right-aligned control. The toggle's full
		     explanation lives in the info icon's tooltip -- the one place the
		     site explains what quantization is. -->
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-[17px] font-semibold tracking-tight">Models</h2>
			{#if hasQuantized}
				<div class="flex items-center gap-1.5">
					<label
						class="text-muted-foreground flex cursor-pointer items-baseline gap-2 text-[13px]"
					>
						<input type="checkbox" bind:checked={showQuantized} class="accent-sky-500" />
						<span>Show smaller quantizations</span>
					</label>
					<!-- Info icon carrying the quantization explainer. A native title
					     tooltip on hover; explicit rather than hiding the hint on the
					     label itself, so it's discoverable. -->
					<span
						class="text-muted-foreground/70 cursor-help"
						title="Quantized further to run in less memory, at a small cost in quality."
					>
						<svg
							aria-label="What are smaller quantizations?"
							role="img"
							viewBox="0 0 16 16"
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						>
							<circle cx="8" cy="8" r="6.5" />
							<path d="M6.3 6.2a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.5-.7 1v.3" />
							<circle cx="8" cy="11.3" r="0.1" stroke-width="1.6" />
						</svg>
					</span>
				</div>
			{/if}
		</div>

		<table class="w-full text-left">
			<tbody>
				{#each family.sizes as s (s.name)}
					<SizeRow size={s} {showQuantized} />
				{/each}
			</tbody>
		</table>
	</section>
</main>
