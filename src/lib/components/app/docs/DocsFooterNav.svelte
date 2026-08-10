<script lang="ts">
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { FlatTocEntry } from '$lib/types';

	interface Props {
		prev?: FlatTocEntry;
		next?: FlatTocEntry;
	}

	let { next, prev }: Props = $props();
</script>

{#if prev || next}
	<nav class="mt-12 flex items-center justify-between gap-4 border-t pt-6" aria-label="Pagination">
		{#if prev}
			<a
				href={resolve('/docs/[...page]', { page: prev.local })}
				class="inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
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
				class="inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
			>
				{next.title}
				<ArrowRight class="size-4" />
			</a>
		{/if}
	</nav>
{/if}
