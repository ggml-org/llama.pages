<script lang="ts">
	import { fade } from 'svelte/transition';
	import { type Size, deeplink, cliCommand, displaySize } from '$lib/catalog';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let { size }: { size: Size } = $props();

	// Which quant build is currently selected. Defaults to the first build
	// listed for the size (highest-precision first in the catalog).
	let selected = $state(0);
	const build = $derived(size.builds[selected]);

	// Install modal state. The Install button opens a modal offering the
	// app deeplink and a CLI command, rather than firing the deeplink
	// directly -- on machines without the app, a bare deeplink fails silently.
	let open = $state(false);
	let copied = $state(false);

	function onWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	async function copyCli() {
		await navigator.clipboard.writeText(cliCommand(build));
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<tr class="border-border border-t">
	<!-- Row label: the full size name, plus a vision badge when applicable. -->
	<td class="py-1.5 pr-3">
		<span class="inline-flex items-center gap-1.5 tabular-nums">
			{size.name}
			{#if size.vision}
				<VisionBadge />
			{/if}
		</span>
	</td>

	<!-- Builds: a picker when the size ships more than one, else text. Each
	     chip carries its own download size, so the quant-vs-size tradeoff is
	     visible before picking. -->
	<td class="py-1.5 pr-3">
		{#if size.builds.length > 1}
			<div class="flex flex-wrap gap-1.5">
				{#each size.builds as b, i}
					<button
						type="button"
						aria-pressed={selected === i}
						onclick={() => (selected = i)}
						class="cursor-pointer rounded-md border px-2 py-0.5 text-[12px] tabular-nums {selected === i
							? 'border-sky-500 bg-sky-50 text-sky-900'
							: 'border-border text-muted-foreground'}"
					>
						{b.quant ?? 'auto'}
						<span class={selected === i ? 'text-sky-900/60' : 'text-muted-foreground/70'}>
							· {displaySize(b.sizeBytes)}
						</span>
					</button>
				{/each}
			</div>
		{:else}
			<span class="tabular-nums">
				{build.quant ?? 'auto'}
				<span class="text-muted-foreground">· {displaySize(build.sizeBytes)}</span>
			</span>
		{/if}
	</td>

	<td class="py-1.5">
		<div class="flex justify-end gap-2">
			<a
				href="https://huggingface.co/{build.repo}"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Open on Hugging Face"
				title="Open on Hugging Face"
				class="bg-muted text-foreground flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5"
			>
				<span aria-hidden="true">🤗</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					class="h-3 w-3"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 11l6-6" />
					<path d="M6 5h5v5" />
				</svg>
			</a>
			<button
				type="button"
				onclick={() => (open = true)}
				class="flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-1.5 text-center text-white"
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					class="h-3.5 w-3.5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M8 2v8" />
					<path d="M4.5 7L8 10.5 11.5 7" />
					<path d="M3 13.5h10" />
				</svg>
				Install
			</button>
		</div>

		{#if open}
			<!-- Install modal: centered dialog with a backdrop; backdrop click or
			     Escape dismisses. -->
			<div
				transition:fade={{ duration: 120 }}
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/15 p-4"
				onclick={(e) => {
					if (e.target === e.currentTarget) open = false;
				}}
				role="presentation"
			>
				<div
					class="bg-background w-fit min-w-80 max-w-full rounded-xl p-5 shadow-xl"
					role="dialog"
					aria-modal="true"
					aria-label="Install {size.name}"
				>
					<p class="mb-4 font-semibold">
						{size.name}
						<span class="text-muted-foreground font-normal tabular-nums">
							{#if build.quant}· {build.quant}{/if}
							{#if build.sizeBytes}· {displaySize(build.sizeBytes)}{/if}
						</span>
					</p>

					<p class="text-muted-foreground mb-1.5 text-[13px]">Download this model in the app:</p>
					<a
						href={deeplink(build)}
						class="mb-4 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-white"
					>
						Install in Llama
					</a>

					<p class="text-muted-foreground mb-1.5 text-[13px]">Or use the CLI:</p>
					<div class="flex items-center gap-1.5">
						<code
							class="border-border block min-w-0 flex-1 overflow-x-auto rounded-lg border px-2.5 py-2 text-[12px] whitespace-nowrap"
						>
							{cliCommand(build)}
						</code>
						<button
							type="button"
							aria-label="Copy command"
							title="Copy command"
							onclick={copyCli}
							class="border-border flex cursor-pointer items-center rounded-lg border px-2.5 py-2"
						>
							{#if copied}
								<svg
									aria-hidden="true"
									viewBox="0 0 16 16"
									class="h-3.5 w-3.5"
									fill="none"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M3 8.5L6.5 12 13 4.5" />
								</svg>
							{:else}
								<svg
									aria-hidden="true"
									viewBox="0 0 16 16"
									class="h-3.5 w-3.5"
									fill="none"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
									<path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>
		{/if}
	</td>
</tr>

<svelte:window onkeydown={onWindowKeydown} />
