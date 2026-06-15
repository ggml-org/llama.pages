<script lang="ts">
	import { resolve } from '$app/paths';
	import logoSvg from '$lib/assets/icon-light.svg?raw';
</script>

<a class="logo flex items-center gap-3 text-foreground" href={resolve('/')}>
	<span class="mark text-foreground">{@html logoSvg}</span>

	<span class="font-mono font-medium">llama.app</span>
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
