<script lang="ts">
	import InstallCommand from './InstallCommand.svelte';
	import Logo from '$lib/components/app/misc/Logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import appleIcon from '$lib/assets/apple-icon.svg?raw';
	import { deviceInfo } from '$lib/stores/device/index.svelte';

	const version = '0.32.0';
</script>

<section class="flex flex-col items-center gap-12 md:gap-14 py-16 md:py-24 text-balance">
	<Logo  showName/>

	<div class="flex flex-col items-center gap-6 text-center">
        <h1>AI that lives on your computer. Open-source, private &amp; always local.</h1>

        <p>Run frontier AI entirely on your machine. No API keys, no telemetry, no limits. Own your
		models and conversation data.</p>
	</div>


   	{#if deviceInfo.isMac}
    	<div class="flex flex-col items-center gap-6 -mb-8">
            <Button href="https://github.com/ggml-org/Llama-macOS/releases/download/{version}/Llama.dmg" size="lg">
          		<div class="mb-0.5">{@html appleIcon}</div>

                Download for Mac

                <span class="opacity-50 ml-2">v{version}</span>
           	</Button>

           	<span>or install from Terminal</span>
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
        @apply text-lg leading-relaxed max-w-xl;
        color: var(--muted-foreground);
    }
</style>
