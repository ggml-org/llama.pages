<script lang="ts">
	import { ChevronDown, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { hasPage, versions } from '$lib/docs/content';
	import { searchState } from '$lib/docs/search.svelte';
	import SectionNav from './SectionNav.svelte';
	import type { TocItem } from '$lib/docs/types';

	interface Props {
		version: string;
		toctree: TocItem[];
		active: string;
		unversioned?: boolean;
	}

	let { version, toctree, active, unversioned = false }: Props = $props();

	function switchVersion(event: Event) {
		const target = (event.currentTarget as HTMLSelectElement).value;
		// Keep the current page when it exists in the target version, else its index.
		const local = hasPage(target, active) ? active : 'index';
		goto(resolve('/docs/[version]/[...page]', { version: target, page: local }));
	}
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

<div class="mt-3 flex items-center justify-between px-1">
	<span class="text-foreground/40 text-xs font-medium tracking-wide uppercase">Version</span>

	<span
		class="text-foreground/70 hover:bg-foreground/6 hover:text-foreground relative inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-xs transition-colors"
	>
		{version}
		<ChevronDown class="size-3 opacity-60" />
		<select
			value={version}
			onchange={switchVersion}
			aria-label="Documentation version"
			class="absolute inset-0 cursor-pointer opacity-0"
		>
			{#each versions as v (v)}
				<option value={v}>{v}</option>
			{/each}
		</select>
	</span>
</div>

<nav class="mt-3 flex flex-col gap-0.5" aria-label="Documentation">
	{#key `${version}/${active}`}
		{#each toctree as item (item.title)}
			<SectionNav {item} {version} {active} {unversioned} />
		{/each}
	{/key}
</nav>
