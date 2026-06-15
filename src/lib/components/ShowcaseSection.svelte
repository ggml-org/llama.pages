<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		content: Snippet;
		position?: 'left' | 'right';
	}

	let { title, description, content, position = 'right' }: Props = $props();
</script>

<section class="grid grid-cols-1 items-center gap-12 py-12 md:grid-cols-2">
	{#if position === 'left'}
    	<div class="md:order-0 order-1">
           	{@render content()}
    	</div>

		<div class="flex flex-col gap-6">
			<h2 class="text-foreground text-2xl font-semibold">{title}</h2>

			<p class="text-foreground/70 text-base leading-relaxed">{description}</p>
		</div>
	{:else}
		<div class="flex flex-col gap-6">
			<h2 class="text-foreground text-2xl font-semibold">{title}</h2>

			<p class="text-foreground/70 text-base leading-relaxed">{description}</p>
		</div>

		<div>
           	{@render content()}
		</div>
	{/if}
</section>
