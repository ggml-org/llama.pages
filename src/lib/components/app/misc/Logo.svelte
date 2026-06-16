<script lang="ts">
	import { resolve } from '$app/paths';
	import logoSvg from '$lib/assets/icon-light.svg?raw';
</script>

<a class="logo text-foreground flex items-center gap-3" href={resolve('/')}>
	<span class="mark text-foreground">{@html logoSvg}</span>

	<span class="font-mono font-medium">llama<span class="text-accent">.cpp</span></span>
</a>

<style>
	.logo {
		.mark :global(svg) {
			height: 1.375rem !important;
			width: auto;

			:global(path) {
				fill: currentColor;
			}
		}
	}
</style>
