<script lang="ts">
	import { Check, ChevronDown, Copy, FileText } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import Logo from '$lib/components/app/misc/Logo.svelte';

	interface Props {
		local: string;
	}

	let { local }: Props = $props();

	// The Llama app's local server; 8080 is its default port. Making the port
	// configurable/discoverable is a follow-up:
	// https://github.com/ggml-org/llama.pages/pull/30#discussion_r3551723116
	const LLAMA_WEBUI_URL = 'http://localhost:8080/';
	// The local webui can't fetch URLs, so the page content is inlined into
	// the ?q= prompt — capped well under cpp-httplib's request-line limit.
	const LLAMA_PROMPT_MAX_CHARS = 6000;

	// A prerendered static asset (see scripts/prepare-docs.js), not a route.
	const mdPath = $derived(`/docs/${local}.md` as Pathname);

	let open = $state(false);
	let copied = $state(false);
	let container = $state<HTMLElement>();
	let llamaHref = $state<string>();

	async function fetchMarkdown(): Promise<string> {
		const res = await fetch(mdPath);
		return res.text();
	}

	async function copyMarkdown() {
		await navigator.clipboard.writeText(await fetchMarkdown());
		copied = true;
		setTimeout(() => (copied = false), 2000);
		open = false;
	}

	async function toggleMenu() {
		open = !open;
		if (open) {
			const markdown = (await fetchMarkdown()).slice(0, LLAMA_PROMPT_MAX_CHARS);
			const prompt = `Answer questions about this documentation page:\n\n${markdown}`;
			llamaHref = `${LLAMA_WEBUI_URL}?q=${encodeURIComponent(prompt)}`;
		}
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
		onclick={toggleMenu}
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
				href={llamaHref ?? LLAMA_WEBUI_URL}
				target="_blank"
				rel="noopener"
				onclick={() => (open = false)}
				class="hover:bg-foreground/5 flex items-center gap-2 rounded px-2 py-1.5 transition-colors"
			>
				<span class="flex size-3.5 shrink-0 items-center justify-center">
					<Logo --logo-height="0.875rem" --logo-gap="0" />
				</span>
				Open in Llama
			</a>
		</div>
	{/if}
</div>
