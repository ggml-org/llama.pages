<script lang="ts">
	import { families, releasedFor, slugify } from '$lib/catalog';
	import { logoFor } from '$lib/logos';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';
</script>

<svelte:head>
	<title>Models — llama.app</title>
	<meta name="description" content="Curated open models you can run locally with llama.cpp." />
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-6 pt-8 pb-24 md:px-12">
	<!-- Header, mirroring the model detail pages: headline / byline / standfirst.
	     The byline carries the one catalog-level fact not visible in the list
	     itself: how fresh the curation is (the newest family's release month).
	     The standfirst states what the catalog is (a curated shortlist,
	     everything runs in the app) so the list below reads as a
	     recommendation, not an attempt at completeness. -->
	<header class="mb-10">
		<h1 class="text-[30px] font-semibold tracking-tight">Models</h1>
		<p class="text-muted-foreground mt-2.5 text-[13px] tabular-nums">
			Updated {releasedFor(families[0])}
		</p>
		<!-- The standfirst doubles as the escape hatch: the catalog is curated,
		     not exhaustive, so the same sentence points at the full GGUF
		     ecosystem for anything we don't list. -->
		<p class="text-muted-foreground mt-3 max-w-2xl text-[15px]">
			A curated selection of open models — every one runs in llama.app. Find thousands more
			GGUF models on
			<!-- whitespace-nowrap so the link never breaks across lines ("Hugging /
			     Face ↗" reads badly and strands the arrow). -->
			<a
				href="https://huggingface.co/models?library=gguf"
				target="_blank"
				rel="noopener"
				class="hover:text-foreground underline underline-offset-4 whitespace-nowrap"
			>
				Hugging Face ↗
			</a>
		</p>
	</header>

	<!-- All families in one flat list, newest first. The publisher is already
	     legible from each row's name and icon, so we don't group by publisher.
	     Flush full-width rows separated by subtle hairlines. -->
	<div class="flex flex-col">
		{#each families as f, i (f.name)}
			{#if i > 0}
				<div aria-hidden="true" class="border-border/40 border-t"></div>
			{/if}
			<a href="/models/{slugify(f.name)}" class="group flex items-start gap-3.5 py-3.5">
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-baseline gap-x-2.5">
						<h3 class="flex items-baseline gap-2 text-[16px] font-medium">
							<!-- Brand mark inline with the name, sized to the text. -->
							<span
								aria-hidden="true"
								class="flex self-center [&>svg]:h-4.5 [&>svg]:w-4.5"
							>
								{@html logoFor(f.brand)}
							</span>
							{f.name}
							{#if f.sizes.some((s) => s.vision)}
								<VisionBadge class="self-center" />
							{/if}
						</h3>
						<span class="text-muted-foreground/70 ml-auto text-[13px] tabular-nums">
						{releasedFor(f)}
					</span>
					</div>
					<p class="text-muted-foreground mt-0.5 line-clamp-1 text-[15px]">{f.description}</p>
					<!-- Footer line: the family's sizes. Memory requirements live on
					     the detail page. -->
					<p class="text-muted-foreground/70 mt-1.5 text-[13px] tabular-nums">
						{f.sizes.map((s) => s.params ?? s.name).join(' · ')}
					</p>
				</div>
			</a>
		{/each}
	</div>

</main>
