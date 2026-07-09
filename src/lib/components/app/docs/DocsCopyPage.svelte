<script lang="ts">
	import { Check, ChevronDown, Copy, FileText, Pencil } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import Logo from '$lib/components/app/misc/Logo.svelte';
	import {
		DEFAULT_LLAMA_SERVER_URL,
		getLlamaServerUrl,
		llamaServerLabel,
		parseLlamaServerInput,
		probeLlamaServer,
		saveLlamaServerUrl
	} from '$lib/docs/llama-app';

	interface Props {
		local: string;
	}

	let { local }: Props = $props();

	// The local webui can't fetch URLs, so the page content is inlined into
	// the ?q= prompt — capped well under cpp-httplib's request-line limit.
	const LLAMA_PROMPT_MAX_CHARS = 6000;

	// A prerendered static asset (see scripts/prepare-docs.js), not a route.
	const mdPath = $derived(`/docs/${local}.md` as Pathname);

	let open = $state(false);
	let copied = $state(false);
	let container = $state<HTMLElement>();
	let markdown = $state('');
	let llamaBase = $state(DEFAULT_LLAMA_SERVER_URL);
	// Advisory only (see $lib/docs/llama-app): 'up' shows a green dot,
	// 'unknown' an orange one — navigation is never blocked.
	let llamaStatus = $state<'unknown' | 'up'>('unknown');

	const llamaHref = $derived.by(() => {
		const prompt = `Answer questions about this documentation page:\n\n${markdown}`;
		return `${llamaBase}/?q=${encodeURIComponent(prompt)}`;
	});

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

	async function probe() {
		llamaStatus = 'unknown';
		if (await probeLlamaServer(llamaBase)) llamaStatus = 'up';
	}

	async function toggleMenu() {
		open = !open;
		if (!open) return;
		llamaBase = getLlamaServerUrl();
		probe();
		markdown = (await fetchMarkdown()).slice(0, LLAMA_PROMPT_MAX_CHARS);
	}

	async function editLlamaServer() {
		const input = window.prompt(
			'Enter the port of your local Llama app, or the full URL of a llama-server\n' +
				'(e.g. 8080 or https://llama.example.com):',
			llamaBase === DEFAULT_LLAMA_SERVER_URL ? '8080' : llamaBase
		);
		if (input === null) return;
		const base = parseLlamaServerInput(input);
		if (!base) {
			window.alert(`"${input}" is not a valid port or URL.`);
			return;
		}
		saveLlamaServerUrl(base);
		llamaBase = base;
		await probe();
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

			<div class="hover:bg-foreground/5 flex items-center rounded transition-colors">
				<a
					href={llamaHref}
					target="_blank"
					rel="noopener"
					onclick={() => (open = false)}
					class="flex min-w-0 grow items-center gap-2 px-2 py-1.5"
				>
					<span class="flex size-3.5 shrink-0 items-center justify-center">
						<Logo --logo-height="0.875rem" --logo-gap="0" />
					</span>
					Open in Llama
					<span class="text-foreground/40 ml-auto truncate text-xs">
						{llamaServerLabel(llamaBase)}
					</span>
					<span
						class="size-1.5 shrink-0 rounded-full {llamaStatus === 'up'
							? 'bg-green-500'
							: 'bg-orange-400'}"
						title={llamaStatus === 'up'
							? `Llama server detected at ${llamaBase}`
							: `Couldn't verify a Llama server at ${llamaBase} — it may still be running (some browsers block local checks)`}
					></span>
				</a>

				<button
					type="button"
					onclick={editLlamaServer}
					aria-label="Set Llama server port or URL"
					title="Set Llama server port or URL"
					class="text-foreground/40 hover:text-foreground cursor-pointer py-1.5 pr-2 pl-1 transition-colors"
				>
					<Pencil class="size-3" />
				</button>
			</div>
		</div>
	{/if}
</div>
