<script lang="ts">
	import { fade } from 'svelte/transition';
	import { type Size, deeplink, cliCommand, displaySize, minMemForBuild } from '$lib/catalog';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let { size, showQuantized = false }: { size: Size; showQuantized?: boolean } = $props();

	// Builds to display, one table row each. The top build (highest precision,
	// listed first in the catalog) is the size's canonical version and is always
	// shown without a quant label -- it's just "the model", matching the app's
	// convention where lower quants are strictly fallbacks. Smaller quantized
	// builds only appear when the page-level toggle asks for them.
	const shown = $derived(showQuantized ? size.builds : size.builds.slice(0, 1));

	// Install modal state: index into `shown` of the build whose modal is open,
	// or null when closed. The Install button opens a modal offering the app
	// deeplink and a CLI command, rather than firing the deeplink directly --
	// on machines without the app, a bare deeplink fails silently.
	let openIdx = $state<number | null>(null);
	let copied = $state(false);

	function onWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') openIdx = null;
	}

	async function copyCli(cmd: string) {
		await navigator.clipboard.writeText(cmd);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

{#each shown as build, i (build.repo + (build.quant ?? ''))}
	<tr class="border-border border-t {i > 0 ? 'border-dashed' : ''}">
		<!-- Row label: the full size name plus a vision badge, repeated on every
		     build row so each reads as a complete entry. Below it, the build's
		     memory requirement -- same formula the app uses, so the site never
		     promises something the app would reject. -->
		<td class="py-1.5 pr-3">
			<span class="inline-flex items-center gap-1.5 tabular-nums">
				{size.name}
				{#if size.vision}
					<VisionBadge />
				{/if}
				<!-- Quant chip, matching the app's model-list styling. Only shown
				     with quantized builds visible; in the default view the
				     canonical builds stay label-free. -->
				{#if showQuantized && build.quant}
					<span
						class="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[11px] tabular-nums uppercase"
					>
						{build.quant}
					</span>
				{/if}
			</span>
			{#if minMemForBuild(build)}
				<span class="text-muted-foreground/70 block text-[12px] tabular-nums">
					requires {minMemForBuild(build)} GB+
				</span>
			{/if}
		</td>

		<!-- Download size. -->
		<td class="py-1.5 pr-3">
			<span class="text-muted-foreground tabular-nums">{displaySize(build.sizeBytes)}</span>
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
					onclick={() => (openIdx = i)}
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

			{#if openIdx === i}
				<!-- Install modal: centered dialog with a backdrop; backdrop click or
				     Escape dismisses. -->
				<div
					transition:fade={{ duration: 120 }}
					class="fixed inset-0 z-50 flex items-center justify-center bg-black/15 p-4"
					onclick={(e) => {
						if (e.target === e.currentTarget) openIdx = null;
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
								onclick={() => copyCli(cliCommand(build))}
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
										<path
											d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"
										/>
									</svg>
								{/if}
							</button>
						</div>
					</div>
				</div>
			{/if}
		</td>
	</tr>
{/each}

<svelte:window onkeydown={onWindowKeydown} />
