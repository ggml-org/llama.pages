<script lang="ts">
	import type { Snippet } from 'svelte';
	import './ShowcaseSection.css';

	let { mediaContent, children }: { mediaContent: Snippet; children: Snippet } = $props();
</script>

<section class="showcase-section grid grid-cols-1 items-center gap-16 py-12 md:grid-cols-2">
	<div class="flex flex-col">
		{@render children?.()}
	</div>

	<div>
		{@render mediaContent()}
	</div>
</section>
