<script lang="ts">
	import { families, minMemGB, releasedFor, slugify } from '$lib/catalog';
	import { logoFor, tintFor } from '$lib/logos';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';
</script>

<svelte:head>
	<title>Models — llama.app</title>
	<meta name="description" content="Curated open models you can run locally with llama.cpp." />
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-6 pt-8 pb-24 md:px-12">
	<!-- Page intro: states what the catalog is (a curated shortlist, everything
	     runs in the app) so the list below reads as a recommendation, not an
	     attempt at completeness. No h1 -- the breadcrumb in the site header
	     already names the page, so a title here would just repeat it. -->
	<p class="text-muted-foreground mb-10 max-w-2xl text-[15px]">
		A curated selection of open models — every one runs in llama.app.
	</p>

	<!-- All families in one flat list, newest first. The publisher is already
	     legible from each row's name and icon, so we don't group by publisher.
	     Flush rows: no background, no rounding, no side padding -- just hairline
	     separators spanning the full content width. -->
	<div class="divide-border/60 flex flex-col divide-y">
		{#each families as f (f.name)}
			<a href="/models/{slugify(f.name)}" class="group flex items-start gap-3.5 py-3.5">
				<span
					aria-hidden="true"
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {tintFor(
						f.brand
					)} [&>svg]:h-4.5 [&>svg]:w-4.5"
				>
					{@html logoFor(f.brand)}
				</span>
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-baseline gap-x-2.5">
						<h3 class="flex items-baseline gap-1.5 text-[16px] font-medium">
							{f.name}
							{#if f.sizes.some((s) => s.vision)}
								<VisionBadge class="self-center" />
							{/if}
						</h3>
						<span class="text-muted-foreground/70 text-[12px] tabular-nums">{releasedFor(f)}</span>
					</div>
					<p class="text-muted-foreground mt-0.5 line-clamp-1 text-[14px]">{f.description}</p>
				</div>
				<!-- Right edge, aligned with the title: sizes on the first line, and
				     below them the family's memory entry bar. "from N GB" reads as a
				     floor — the smallest build runs there, larger sizes need more;
				     exact per-build requirements live on the detail page. -->
				<span class="mt-1 hidden shrink-0 flex-col items-end text-[12px] sm:flex">
					<span class="text-muted-foreground/70 tabular-nums">
						{f.sizes.map((s) => s.params ?? s.name).join(' · ')}
					</span>
					{#if minMemGB(f)}
						<span class="text-muted-foreground/50 mt-0.5 tabular-nums">
							from {minMemGB(f)} GB
						</span>
					{/if}
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
