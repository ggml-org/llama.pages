<script lang="ts">
	import { familyGroups } from '$lib/catalog';
	import { logoFor, tintFor } from '$lib/logos';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	// All families in one flat list, newest first. The publisher is already
	// legible from each row's name and icon, so we don't group by publisher.
	const allFamilies = $derived(familyGroups().sort((a, b) => b.sortKey.localeCompare(a.sortKey)));
</script>

<svelte:head>
	<title>Models — llama.app</title>
	<meta name="description" content="Curated open models you can run locally with llama.cpp." />
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-6 pt-8 pb-24 md:px-12">
	<div class="flex flex-col">
		{#each allFamilies as g, i (g.family)}
			<!-- Flush rows: no background, no rounding, no side padding -- just
			     hairline separators spanning the full content width. -->
			<a
				href="/models/{g.slug}"
				class="group flex items-start gap-3.5 py-3.5 {i > 0 ? 'border-border/60 border-t' : ''}"
			>
				<span
					aria-hidden="true"
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {tintFor(
						g.brand
					)} [&>svg]:h-4.5 [&>svg]:w-4.5"
				>
					{@html logoFor(g.brand)}
				</span>
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-baseline gap-x-2.5">
						<h3 class="flex items-baseline gap-1.5 text-[16px] font-medium">
							{g.family}
							{#if g.sizes.some((s) => s.vision)}
								<VisionBadge class="self-center" />
							{/if}
						</h3>
						<span class="text-muted-foreground/70 text-[12px] tabular-nums">{g.released}</span>
					</div>
					<p class="text-muted-foreground mt-0.5 line-clamp-1 text-[14px]">{g.description}</p>
				</div>
				<!-- Sizes as quiet text on the right edge, aligned with the title. -->
				<span
					class="text-muted-foreground/70 mt-1 hidden shrink-0 text-[12px] tabular-nums sm:inline"
				>
					{g.sizes.map((s) => s.params ?? s.name).join(' · ')}
				</span>
			</a>
		{/each}
	</div>

	<!-- The catalog is curated, not exhaustive -- point people at the full GGUF
	     ecosystem for anything we don't list. -->
	<p class="border-border/60 mt-0 border-t pt-6 text-center text-[14px]">
		<a
			href="https://huggingface.co/models?library=gguf"
			target="_blank"
			rel="noopener"
			class="text-muted-foreground hover:text-foreground hover:underline"
		>
			Discover more models on Hugging Face ↗
		</a>
	</p>
</main>
