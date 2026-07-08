<script lang="ts">
	import { Check, ChevronDown, Copy, ExternalLink, FileText } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { SITE_URL } from '$lib/constants/site';

	interface Props {
		version: string;
		local: string;
	}

	let { version, local }: Props = $props();

	// A prerendered static asset (see scripts/extract-docs.js), not a route.
	const mdPath = $derived(`/docs/${version}/${local}.md` as Pathname);
	const mdUrl = $derived(`${SITE_URL}${mdPath}`);
	const llmPrompt = $derived(encodeURIComponent(`Read ${mdUrl} so I can ask questions about it.`));

	let open = $state(false);
	let copied = $state(false);
	let container = $state<HTMLElement>();

	async function copyMarkdown() {
		const res = await fetch(mdPath);
		await navigator.clipboard.writeText(await res.text());
		copied = true;
		setTimeout(() => (copied = false), 2000);
		open = false;
	}

	function onWindowClick(event: MouseEvent) {
		if (open && container && !container.contains(event.target as Node)) {
			open = false;
		}
	}
</script>

<svelte:window onclick={onWindowClick} />

<div bind:this={container} class="relative inline-flex text-sm">
	<button
		type="button"
		onclick={copyMarkdown}
		class="border-border hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-1.5 rounded-l-md border px-2.5 py-1.5 transition-colors"
	>
		{#if copied}
			<Check class="size-3.5 text-green-500" />
		{:else}
			<Copy class="size-3.5" />
		{/if}
		Copy page
	</button>

	<button
		type="button"
		onclick={() => (open = !open)}
		aria-label="More page actions"
		aria-expanded={open}
		class="border-border hover:bg-foreground/5 inline-flex cursor-pointer items-center rounded-r-md border border-l-0 px-1.5 py-1.5 transition-colors"
	>
		<ChevronDown class="size-3.5 transition-transform {open ? 'rotate-180' : ''}" />
	</button>

	{#if open}
		<div
			class="border-border bg-background absolute top-full right-0 z-50 mt-1 flex w-56 flex-col rounded-md border p-1 shadow-md"
		>
			<button
				type="button"
				onclick={copyMarkdown}
				class="hover:bg-foreground/5 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left transition-colors"
			>
				<Copy class="size-3.5 shrink-0" />
				Copy page as Markdown
			</button>

			<a
				href={resolve(mdPath)}
				target="_blank"
				rel="noopener"
				onclick={() => (open = false)}
				class="hover:bg-foreground/5 flex items-center gap-2 rounded px-2 py-1.5 transition-colors"
			>
				<FileText class="size-3.5 shrink-0" />
				View as Markdown
			</a>

			<a
				href="https://claude.ai/new?q={llmPrompt}"
				target="_blank"
				rel="noopener"
				onclick={() => (open = false)}
				class="hover:bg-foreground/5 flex items-center gap-2 rounded px-2 py-1.5 transition-colors"
			>
				<ExternalLink class="size-3.5 shrink-0" />
				Open in Claude
			</a>

			<a
				href="https://chatgpt.com/?q={llmPrompt}"
				target="_blank"
				rel="noopener"
				onclick={() => (open = false)}
				class="hover:bg-foreground/5 flex items-center gap-2 rounded px-2 py-1.5 transition-colors"
			>
				<ExternalLink class="size-3.5 shrink-0" />
				Open in ChatGPT
			</a>
		</div>
	{/if}
</div>
