<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { userPrefersMode, setMode } from 'mode-watcher';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';

	const stars = $derived(page.data.stars as number | null | undefined);

	const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' } as const;
	function cycleMode() {
		setMode(NEXT_MODE[userPrefersMode.current]);
	}
	const formatted = $derived(
		typeof stars === 'number'
			? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(stars)
			: null
	);
</script>

<header class="flex items-center justify-between py-6">
	<a href={resolve('/')} class="text-foreground text-base">llama.app</a>
	<div class="flex items-center gap-4">
		<a
			href="https://github.com/ggml-org/llama.cpp"
			target="_blank"
			rel="noreferrer"
			class="text-foreground inline-flex items-center gap-2 text-base"
		>
			<span class="decoration-foreground/30 underline underline-offset-4">GitHub</span>
			{#if formatted}
				<span
					class="bg-foreground/8 text-foreground/70 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
				>
					<span aria-hidden="true">★</span>
					{formatted}
				</span>
			{/if}
		</a>
		<button
			type="button"
			onclick={cycleMode}
			class="text-foreground/70 hover:text-foreground hover:bg-foreground/8 -m-1.5 inline-flex cursor-pointer items-center rounded-md p-1.5 transition-colors"
			aria-label="Theme: {userPrefersMode.current} (click to change)"
			title="Theme: {userPrefersMode.current}"
		>
			{#if userPrefersMode.current === 'light'}
				<Sun class="size-4" />
			{:else if userPrefersMode.current === 'dark'}
				<Moon class="size-4" />
			{:else}
				<Monitor class="size-4" />
			{/if}
		</button>
	</div>
</header>
