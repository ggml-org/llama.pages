<script lang="ts">
	let { stars }: { stars: number | null | undefined } = $props();

	const formatted = $derived(
		typeof stars === 'number'
			? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(stars)
			: null
	);
</script>

<a
	href="https://github.com/ggml-org/llama.cpp"
	target="_blank"
	rel="noreferrer"
	class="inline-flex items-center gap-2 text-[15px] text-foreground"
>
	<span class="underline decoration-foreground/30 underline-offset-4">GitHub</span>

	{#if formatted}
		<span
			class="inline-flex items-center gap-1 rounded-md bg-foreground/8 px-1.5 py-0.5 text-xs text-foreground/70"
		>
			<span aria-hidden="true">★</span>
			{formatted}
		</span>
	{/if}
</a>
