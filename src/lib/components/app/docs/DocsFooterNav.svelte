<script lang="ts">
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { FlatTocEntry } from '$lib/docs/types';

	interface Props {
		prev?: FlatTocEntry;
		next?: FlatTocEntry;
	}

	let { prev, next }: Props = $props();
</script>

{#if prev || next}
	<nav class="mt-12 flex items-center justify-between gap-4 border-t pt-6" aria-label="Pagination">
		{#if prev}
			<a
				href={resolve('/docs/[...page]', { page: prev.local })}
				class="text-foreground/70 hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
			>
				<ArrowLeft class="size-4" />
				{prev.title}
			</a>
		{:else}
			<span></span>
		{/if}

		{#if next}
			<a
				href={resolve('/docs/[...page]', { page: next.local })}
				class="text-foreground/70 hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
			>
				{next.title}
				<ArrowRight class="size-4" />
			</a>
		{/if}
	</nav>
{/if}
