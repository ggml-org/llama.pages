<script lang="ts">
	import InstallCommand from './InstallCommand.svelte';
	import appleIcon from '$lib/assets/apple-icon.svg?raw';
	import { Logo } from '$lib/components/app';
	import { Button } from '$lib/components/ui/button';
	import { MACOS_DOWNLOAD_URL } from '$lib/constants';
	import { deviceInfo } from '$lib/stores/device/index.svelte';
</script>

<section class="flex flex-col items-center gap-12 py-16 text-balance md:gap-14 md:py-24">
	<Logo showName />

	<div class="flex flex-col items-center gap-6 text-center">
		<h1>AI that lives on your computer. Open-source, private &amp; always local.</h1>

		<p>
			Run frontier AI entirely on your machine. No API keys, no telemetry, no limits. Own your
			models and conversation data.
		</p>
	</div>

	{#if deviceInfo.isMac}
		<div class="-mb-8 flex flex-col items-center gap-6">
			<!-- Tags the click as the "Download" goal; source separates it from
			     the other download link in InstallDialog -->
			<Button
				href={MACOS_DOWNLOAD_URL}
				size="lg"
				class="plausible-event-name=Download plausible-event-source=hero"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="mb-0.5">{@html appleIcon}</div>

				Download for Mac
			</Button>

			<span>or install the CLI</span>
		</div>
	{/if}

	<InstallCommand />
</section>

<style lang="postcss">
	@reference "tailwindcss";

	section {
		--logo-height: 2.75rem;
		--logo-font-size: 2rem;
		--logo-gap: 1.5rem;

		@media (min-width: 600px) {
			--logo-height: 3.125rem;
			--logo-font-size: 2.25rem;
			--logo-gap: 1.5rem;
		}
	}

	section :global(.hero-mark svg) {
		@apply h-16 w-auto;
		fill: currentColor;
	}

	section :global(h1) {
		@apply text-3xl leading-tight font-semibold sm:text-4xl;
	}

	section :global(p) {
		@apply max-w-xl text-lg leading-relaxed;
		color: var(--muted-foreground);
	}
</style>
