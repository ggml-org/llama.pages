<script lang="ts">
	// Fully inline install actions, nothing expands: the Install button is the
	// app deeplink itself, and the CLI button beside it copies the pull command
	// -- the fallback for machines without the app, where a bare deeplink fails
	// silently.
	import { type Size, deeplink, cliCommand, displaySize, minMemForBuild } from '$lib/catalog';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let { size, showQuantized = false }: { size: Size; showQuantized?: boolean } = $props();

	// Builds to display, one table row each. The top build (highest precision,
	// listed first in the catalog) is the size's canonical version and is always
	// shown, matching the app's convention where lower quants are strictly
	// fallbacks. The smaller, more heavily quantized builds only appear when the
	// page-level toggle asks for them.
	const shown = $derived(showQuantized ? size.builds : size.builds.slice(0, 1));

	// Index of the row whose CLI command was just copied, for the transient
	// check-mark feedback; null when none.
	let copiedIdx = $state<number | null>(null);

	async function copyCli(cmd: string, i: number) {
		await navigator.clipboard.writeText(cmd);
		copiedIdx = i;
		setTimeout(() => (copiedIdx = null), 1500);
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
				{#if build.quant}
					<span
						class="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[11px] tabular-nums uppercase"
					>
						{build.quant}
					</span>
				{/if}
				{#if size.vision}
					<VisionBadge />
				{/if}
			</span>
			{#if minMemForBuild(build)}
				<span class="text-muted-foreground/70 block text-[12px] tabular-nums">
					requires {minMemForBuild(build)} GB+ memory
				</span>
			{/if}
		</td>

		<!-- Download size, right-aligned so magnitudes line up for comparison. -->
		<td class="py-1.5 pr-3 text-right">
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

				<!-- Copy the CLI command. The native title tooltip shows the full
				     command, so hovering reveals what will land on the clipboard. -->
				<button
					type="button"
					aria-label="Copy CLI command"
					title={cliCommand(build)}
					onclick={() => copyCli(cliCommand(build), i)}
					class="bg-muted text-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5"
				>
					{#if copiedIdx === i}
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
						<!-- Terminal prompt icon: reads as "CLI" at a glance. -->
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
							<path d="M3 4.5L6.5 8 3 11.5" />
							<path d="M8.5 11.5H13" />
						</svg>
					{/if}
					CLI
				</button>

				<!-- Direct deeplink: on machines without the app this fails
				     silently, which the CLI button covers as the fallback. -->
				<a
					href={deeplink(build)}
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
					Install in Llama
				</a>
			</div>
		</td>
	</tr>
{/each}
