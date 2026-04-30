<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const stars = $derived(page.data.stars as number | null | undefined);
	const formatted = $derived(
		typeof stars === 'number'
			? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(stars)
			: null
	);
</script>

<header class="flex items-center justify-between py-6">
	<a href={resolve('/')} class="text-foreground text-base">llama.app</a>
	<a
		href="https://github.com/ggml-org/llama.cpp"
		target="_blank"
		rel="noreferrer"
		class="text-foreground inline-flex items-center gap-2 text-base"
	>
		<span class="decoration-foreground/30 underline underline-offset-4">GitHub</span>
		{#if formatted}
			<span
				class="bg-foreground/8 text-foreground/70 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
			>
				<span aria-hidden="true">★</span>
				{formatted}
			</span>
		{/if}
	</a>
</header>
