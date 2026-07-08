<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';

	interface Props {
		getText: () => string;
	}

	let { getText }: Props = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(getText());
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	type="button"
	onclick={copy}
	aria-label="Copy code"
	title="Copy code"
	class="border-border bg-background/80 text-foreground/60 hover:text-foreground absolute top-2 right-2 inline-flex cursor-pointer items-center rounded-md border p-1.5 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
>
	{#if copied}
		<Check class="size-3.5 text-green-500" />
	{:else}
		<Copy class="size-3.5" />
	{/if}
</button>
