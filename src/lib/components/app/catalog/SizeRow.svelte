<script lang="ts">
	import { type Size, deeplink } from '$lib/catalog';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let { size }: { size: Size } = $props();

	// Which quant build is currently selected. Defaults to the first build
	// listed for the size (highest-precision first in the catalog).
	let selected = $state(0);
	const build = $derived(size.builds[selected]);
</script>

<tr class="border-border border-t">
	<!-- Row label: the params suffix (the size name minus its family prefix),
	     plus a vision badge when applicable. -->
	<td class="py-1.5 pr-3">
		<span class="inline-flex items-center gap-1.5 tabular-nums">
			{size.params ?? size.name}
			{#if size.vision}
				<VisionBadge />
			{/if}
		</span>
	</td>

	<!-- Quant: a picker when the size ships more than one build, else text. -->
	<td class="py-1.5 pr-3">
		{#if size.builds.length > 1}
			<div class="flex flex-wrap gap-1.5">
				{#each size.builds as b, i}
					<button
						type="button"
						aria-pressed={selected === i}
						onclick={() => (selected = i)}
						class="cursor-pointer rounded-md border px-2 py-0.5 text-[12px] tabular-nums {selected === i
							? 'border-sky-500 bg-sky-50 text-sky-900'
							: 'border-border text-muted-foreground'}"
					>
						{b.quant ?? 'auto'}
					</button>
				{/each}
			</div>
		{:else}
			<span class="tabular-nums">{build.quant ?? 'auto'}</span>
		{/if}
	</td>

	<td class="py-1.5 pr-3 tabular-nums">{build.size ?? '—'}</td>

	<td class="py-1.5">
		<div class="flex justify-end gap-2">
			<a
				href="https://huggingface.co/{build.repo}"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Open on Hugging Face"
				title="Open on Hugging Face"
				class="bg-muted text-foreground flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5"
			>
				<span aria-hidden="true">🤗</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					class="h-3 w-3"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 11l6-6" />
					<path d="M6 5h5v5" />
				</svg>
			</a>
			<a
				href={deeplink(build)}
				class="flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-1.5 text-center text-white"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					class="h-3.5 w-3.5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 2v8" />
					<path d="M4.5 7L8 10.5 11.5 7" />
					<path d="M3 13.5h10" />
				</svg>
				Install
			</a>
		</div>
	</td>
</tr>
