<script lang="ts">
	// Fully inline install actions, nothing expands: the Install button fires
	// the app deeplink and hands the build to the page's install dialog, which
	// carries the fallbacks (app download, CLI command) for machines without
	// the app.
	import { type Size, type Build, deeplink, displaySize, minMemForBuild } from '$lib/catalog';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';

	let {
		size,
		showQuantized = false,
		oninstall
	}: { size: Size; showQuantized?: boolean; oninstall: (b: Build) => void } = $props();

	// Fire the deeplink (a no-op without the app -- the dialog covers that
	// case) and open the dialog with this build's fallbacks.
	function install(b: Build) {
		location.href = deeplink(b);
		oninstall(b);
	}

	// Builds to display, one table row each. The top build (highest precision,
	// listed first in the catalog) is the size's canonical version and is always
	// shown, matching the app's convention where lower quants are strictly
	// fallbacks. The smaller, more heavily quantized builds only appear when the
	// page-level toggle asks for them.
	const shown = $derived(showQuantized ? size.builds : size.builds.slice(0, 1));
</script>

{#each shown as build, i (build.repo + (build.quant ?? ''))}
	<tr class="border-border/40 border-t {i > 0 ? 'border-dashed' : ''}">
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
				<span class="text-muted-foreground/70 block text-[13px] tabular-nums">
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

				<button
					type="button"
					onclick={() => install(build)}
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
		</td>
	</tr>
{/each}
