<script lang="ts">
	import ShowcaseSection from './ShowcaseSection.svelte';
	import HardwareReels from './HardwareReels.svelte';
	import InstallationCommands from './InstallationCommands.svelte';
</script>

<div class="space-y-12 py-12 md:py-24">
	<ShowcaseSection
		title="Pair it with a local coding agent."
		description="Run `llama serve`, then launch Pi. It auto-discovers your local model. No config, no API keys. Files stay on your machine, requests never leave it."
		position="right"
	>
		{#snippet content()}
			<InstallationCommands />
		{/snippet}
	</ShowcaseSection>

	<ShowcaseSection
		title="Optimized for any hardware."
		description="From your laptop to a cluster, llama.cpp runs on whatever you have. Same binary, same models, same hand-tuned kernels for every GPU and CPU."
		position="left"
	>
		{#snippet content()}
			<HardwareReels />
		{/snippet}
	</ShowcaseSection>
</div>
