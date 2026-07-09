<script lang="ts">
	// Fully inline install actions, nothing expands: the primary button reports
	// the build to the page, which follows up per platform -- on a Mac the
	// button also fires the app deeplink and the page confirms with a toast
	// (with fallbacks for machines without the app); elsewhere the page opens
	// the CLI dialog.
	import { type Size, type Build, deeplink, displaySize, minMemForBuild } from '$lib/catalog';
	import VisionBadge from '$lib/components/app/catalog/VisionBadge.svelte';
	import { deviceInfo } from '$lib/stores/device/index.svelte';
	import { Terminal } from '@lucide/svelte';

	let {
		size,
		showQuantized = false,
		oninstall
	}: { size: Size; showQuantized?: boolean; oninstall: (b: Build, s: Size) => void } = $props();

	// One primary action per row, platform-dependent behind the same label
	// intent: on a Mac, fire the app deeplink (a no-op without the app -- the
	// toast's fallbacks cover that case); elsewhere the app can't exist, so
	// skip the deeplink and let the page open the CLI dialog instead. Either
	// way the page owns the follow-up via oninstall.
	function install(b: Build) {
		if (deviceInfo.isMac) location.href = deeplink(b);
		oninstall(b, size);
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
						class="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[11px] uppercase tabular-nums"
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

				<!-- One primary button, worded by platform: "Install" on a Mac (the
				     deeplink installs into the app), "Run…" elsewhere -- the site's
				     established verb for a build's CLI action, with the ellipsis
				     signalling (per the classic menu convention) that a dialog
				     follows rather than an immediate action. isMac is false during
				     SSR, so non-Mac visitors get the Run… wording from first paint. -->
				<button
					type="button"
					onclick={() => install(build)}
					class="flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-1.5 text-center text-white"
				>
					{#if deviceInfo.isMac}
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
					{:else}
						<!-- Terminal prompt icon: hints before the click that the CLI is
						     involved, matching the dialog's "run this in your terminal". -->
						<Terminal class="size-3.5" aria-hidden="true" />
						Run…
					{/if}
				</button>
			</div>
		</td>
	</tr>
{/each}
