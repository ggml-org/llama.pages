<script lang="ts">
	import { page } from '$app/state';
	import { userPrefersMode, setMode } from 'mode-watcher';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Logo from '$lib/components/Logo.svelte';
	import GitHubLink from '$lib/components/GitHubLink.svelte';

	const stars = $derived(page.data.stars as number | null | undefined);

	const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' } as const;
	function cycleMode() {
		setMode(NEXT_MODE[userPrefersMode.current]);
	}
</script>

<header class="flex items-center justify-between py-6">
	<Logo />

	<div class="flex items-center gap-4">
		<GitHubLink {stars} />

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
