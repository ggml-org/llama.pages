<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { hasPage, versions } from '$lib/docs/content';
	import SectionNav from './SectionNav.svelte';
	import type { TocItem } from '$lib/docs/types';

	interface Props {
		version: string;
		toctree: TocItem[];
		active: string;
	}

	let { version, toctree, active }: Props = $props();

	function switchVersion(event: Event) {
		const target = (event.currentTarget as HTMLSelectElement).value;
		// Keep the current page when it exists in the target version, else its index.
		const local = hasPage(target, active) ? active : 'index';
		goto(resolve('/docs/[version]/[...page]', { version: target, page: local }));
	}
</script>

<select
	value={version}
	onchange={switchVersion}
	aria-label="Documentation version"
	class="border-input bg-background w-full cursor-pointer rounded-md border px-2 py-1.5 text-sm"
>
	{#each versions as v (v)}
		<option value={v}>{v}</option>
	{/each}
</select>

<nav class="mt-4 flex flex-col gap-0.5" aria-label="Documentation">
	{#key `${version}/${active}`}
		{#each toctree as item (item.title)}
			<SectionNav {item} {version} {active} />
		{/each}
	{/key}
</nav>
