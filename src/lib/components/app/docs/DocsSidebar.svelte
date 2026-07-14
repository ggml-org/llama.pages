<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { searchState } from '$lib/docs/search.svelte';
	import SectionNav from './SectionNav.svelte';
	import type { TocItem } from '$lib/docs/types';

	interface Props {
		toctree: TocItem[];
		active: string;
	}

	let { toctree, active }: Props = $props();
</script>

<button
	type="button"
	onclick={() => (searchState.open = true)}
	class="bg-foreground/4 text-foreground/45 hover:bg-foreground/7 hover:text-foreground/70 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors"
>
	<Search class="size-3.5 shrink-0" />
	Search docs
	<kbd
		class="bg-foreground/6 text-foreground/40 ml-auto rounded px-1.5 py-0.5 font-mono text-[10px]"
	>
		⌘K
	</kbd>
</button>

<nav class="mt-4 flex flex-col gap-0.5" aria-label="Documentation">
	{#key active}
		{#each toctree as item (item.title)}
			<SectionNav {item} {active} />
		{/each}
	{/key}
</nav>
